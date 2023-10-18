import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from 'moment-timezone';
import {publish} from "utils/event";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupMinisitePackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['service_code', 'start_date', 'week_quantity'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }
    _onSave(data){
        this.setState({object_error: {},loading: true, name_focus: ""});

        let sales_order = this.props.sales_order;
        let object = Object.assign({}, data);
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field, loading: false, object_error: check.fields});
            return;
        }
        let error = {};
        let ordered_on = moment(moment.unix(sales_order.ordered_on).format("YYYY-MM-DD")).unix();
        if (parseInt(object.job_quantity) <= 0){
            error['job_quantity'] = ":attr_name không hợp lệ.";
        }
        if (moment(moment.unix(object.start_date).format("YYYY-MM-DD")).unix() < ordered_on){
            error['start_date'] = ":attr_name phải lớn hơn ngày ghi nhận phiếu.";

        }
        if (object.effect_code){
            if (moment(moment.unix(object.effect_start_date).format("YYYY-MM-DD")).unix() < ordered_on){
                error['effect_start_date'] = ":attr_name phải lớn hơn ngày ghi nhận phiếu.";
            }
            if (object.effect_start_date < object.start_date){
                error['effect_start_date'] = ":attr_name phải lớn hơn thời gian hiệu lực của gói phí.";
            }
        }
        if (!(Object.entries(error).length === 0)){
            this.setState({object_error: error, loading: false});
            return;
        }
        this.props.uiAction.showLoading();
        object.sales_order_id = this.props.sales_order.id;
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_MINISITE_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_MINISITE_EDIT, object);
        }
        this.setState({loading: false});
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
            sales_order_id: this.props.sales_order.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL, args);
    }
    componentWillMount(){
        let {object} = this.props;
        if (object){
            this.getDetail(object.id);
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_MINISITE_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_MINISITE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('MinisitePackage');
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_MINISITE_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_MINISITE_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_MINISITE_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('MinisitePackage');
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_MINISITE_EDIT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.service_code = response.data.service_code;
                object.start_date = response.data.start_date;
                object.week_quantity = response.data.week_quantity;
                object.day_quantity = response.data.day_quantity;
                this.setState({object: object});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
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
        let {object, object_error, object_required, name_focus} = this.state;
        let channel_code = this.props.branch.currentBranch.channel_code;
        let box_code_list = this.props.sys.service.items.filter(c =>
            c.channel_code === channel_code &&
            c.service_type === Constant.SERVICE_TYPE_FILTER_MINISITE
        );

        let end_date = utils.calcDate(object.start_date, object.week_quantity, object.day_quantity, "DD/MM/YYYY");

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Minisite</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="service_code" label="Gói dịch vụ" data={box_code_list} required={object_required.includes('service_code')}
                                         key_value="code" key_title="name"
                                         error={object_error.service_code} value={object.service_code} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" required={object_required.includes('start_date')} minDate={moment()}
                                                    error={object_error.start_date} value={object.start_date} nameFocus={name_focus}
                                                    onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="week_quantity" label="TG DV (tuần)" isNumber required={object_required.includes('week_quantity')}
                                            error={object_error.week_quantity} value={object.week_quantity} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                    {end_date && (
                                        <div className="end-date"><span>ngày kết thúc: {end_date}</span></div>
                                    )}
                                </div>
                                {/*<div className="col-sm-4 col-xs-12 mb10">*/}
                                    {/*<Input2 type="text" name="day_quantity" label="TG DV (ngày)" isNumber required={object_required.includes('day_quantity')}*/}
                                            {/*error={object_error.day_quantity} value={object.day_quantity} nameFocus={name_focus}*/}
                                            {/*onChange={this.onChange}*/}
                                    {/*/>*/}
                                {/*</div>*/}
                            </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupMinisitePackage);
