import React,{Component} from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {publish} from "utils/event";

class PopupFreemiumRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['job_id', 'start_date', 'end_date'],
            object_error: {},
            object_effect: {},
            object_effect_required: [],
            object_effect_error: {},
            name_focus: "",
            listJob:[],
            sales_order_items: {}
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getListJob = this._getListJob.bind(this);
        this.getSalesOrderItem = this._getSalesOrderItem.bind(this);
    }
    _onSave(event){

        event.preventDefault();
        const {sales_order_items} = this.state;

        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        let object_effect = Object.assign({}, this.state.object_effect);
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        object.sales_order_id = this.props.sales_order.id;
        object.sales_order_items_id = this.props.sales_order_item.id;
        if (object_effect?.effect_code) {
            object.effects_info = {};
            object.effects_info[object_effect.effect_code] = object_effect;
        }

        // xác nhận ràng buộc TG đăng ký
        let confirm = true;
        if(Number(sales_order_items?.sales_order_expired_at) > 0 &&
            Number(sales_order_items?.sales_order_expired_at) <= Number(object?.end_date)) {
            confirm = window.confirm(Constant.MSG_NOTIFY_SALE_ORDER);
        }
        if(!confirm) {
            this.props.uiAction.deletePopup();
            this.props.uiAction.hideLoading();
            return;
        }
       this.setState({loading: true});
        if (!object.id){
            if(this.props.isFreemium){
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_FREEMIUM_CREATE, object);
            }
            else{
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_JOB_BASIC_CREATE, object);
            }
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_JOB_BASIC_EDIT, object);
        }
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});
    }
    _getDetail(id){
        let args = {
            id: id,
            sales_order_id: this.props.sales_order.id,
            sales_order_items_id: this.props.sales_order_item.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_REGIS_JOB_PACKAGE_ITEMS_DETAIL, args);
    }
    _getListJob(){
        let args = {
            employer_id: this.props.sales_order.employer_id,
            job_status: Constant.STATUS_ACTIVED,
            premium_type: Constant.JOB_PREMIUM_NORMAL,
            'resume_apply_expired[from]': moment().add(2, 'days').unix(),
            execute: true
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_JOB, args);
    }
    _getSalesOrderItem(){
        let args = {
            id: this.props.sales_order_item.id,
            sales_order_id: this.props.sales_order.id,
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL, args);
    }
    componentWillMount(){
        let {object} = this.props;
        if (object){
            this.getDetail(object.id);
        }
        this.getSalesOrderItem();
        this.getListJob();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_JOB]){
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_JOB];
            if (response.code === Constant.CODE_SUCCESS) {
                let listJob = [];
                response.data.forEach((item)=>{
                    listJob.push({
                        value: item.id,
                        title: item.id + " - " + item.title
                    })
                });
                this.setState({listJob: listJob});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_JOB);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({sales_order_items: response.data});
                if (!this.props.object) {
                    let curr = moment(moment().format("YYYY-MM-DD")).unix();
                    let object = {};
                    // object.start_date = response.data.start_date < curr ? curr : response.data.start_date;
                    object.start_date = curr;
                    object.end_date = moment.unix(object.start_date).add(parseInt(response.data.total_day_quantity) - 1, 'days').unix();
                    this.setState({object: object});
                    if (response.data.items){
                        let object_effect = {};
                        object_effect.effect_code = response.data.items.service_code;
                        // object_effect.start_date = response.data.items.start_date < curr ? curr : response.data.items.start_date;
                        object_effect.start_date = curr;
                        object_effect.end_date = moment.unix(curr).add(parseInt(response.data.items.total_day_quantity) - 1, 'days').unix();
                        this.setState({object_effect: object_effect});
                    }
                }
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_REGIS_JOB_PACKAGE_ITEMS_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_REGIS_JOB_PACKAGE_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.job_id = response.data.job_id;
                object.start_date = response.data.start_date;
                object.end_date = response.data.end_date;
                this.setState({object: object});
                if (response.data.effects_info) {
                    const [firstEffect] = response.data?.effects_info || [];
                    if(firstEffect){
                        let object_effect = {};
                        object_effect.effect_code = firstEffect?.effect_code;
                        object_effect.start_date = firstEffect?.start_date;
                        object_effect.end_date = firstEffect?.end_date;
                        this.setState({object_effect: object_effect});
                    }
                }
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_REGIS_JOB_PACKAGE_ITEMS_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_JOB_BASIC_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_JOB_BASIC_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_JOB_BASIC_PACKAGE);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_JOB_BASIC_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_FREEMIUM_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_FREEMIUM_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_FREEMIUM_PACKAGE);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_FREEMIUM_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_JOB_BASIC_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_JOB_BASIC_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_JOB_BASIC_PACKAGE);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_JOB_BASIC_EDIT);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        let {object, object_error, object_required, name_focus, listJob, object_effect} = this.state;
        let day_quantity = utils.convertNumberToWeekDay(moment.unix(object.end_date).diff(moment.unix(object.start_date), 'day') + 1);
        let day_effect_quantity = utils.convertNumberToWeekDay(moment.unix(object_effect.end_date).diff(moment.unix(object_effect.start_date), 'day') + 1);
        let effect_list = this.props.sys.effect.items;

        return (
            <form onSubmit={this.onSave}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>{this.props.isFreemium ? "Tin Freemium" : "Tin cơ bản"}</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="job_id" label="Tin tuyển dụng" data={listJob} required={object_required.includes('job_id')}
                                         error={object_error.job_id} value={object.job_id} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" readOnly required={object_required.includes('start_date')}
                                                    value={object?.start_date} nameFocus={name_focus}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="end_date" label="Ngày kết thúc" readOnly required={object_required.includes('end_date')}
                                                    value={object?.end_date} nameFocus={name_focus}
                                    />
                                    {day_quantity && (
                                        <div className="end-date"><span>{day_quantity}</span></div>
                                    )}
                                </div>
                            </div>
                            {object_effect?.effect_code && (
                                <React.Fragment>
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">Gói làm mới</div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="effect_code" label="Gói làm mới" data={effect_list} readOnly key_value="code" key_title="name" value={object_effect?.effect_code}/>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <DateTimePicker name="start_date" label="Ngày bắt đầu" readOnly value={object_effect.start_date}/>
                                        </div>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <DateTimePicker name="end_date" label="Ngày kết thúc" readOnly value={object_effect.end_date}/>
                                            {day_effect_quantity && (
                                                <div className="end-date"><span>{day_effect_quantity}</span></div>
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupFreemiumRegistration);
