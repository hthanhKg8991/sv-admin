import React,{Component} from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from 'moment-timezone';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupMinisitePackageRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['object_type', 'start_date', 'end_date'],
            object_error: {},
            name_focus: "",
            sales_order_items: {}
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeEffect = this._onChangeEffect.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.getSalesOrderItem = this._getSalesOrderItem.bind(this);
    }
    _onSave(data, required){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        this.setState({loading: true});
        object.sales_order_id = this.props.sales_order.id;
        object.sales_order_items_id = this.props.sales_order_item.id;
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_MINISITE_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_MINISITE_EDIT, object);
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
    _onChangeEffect(value, name){
        let object_effect = Object.assign({},this.state.object_effect);
        if (value){
            object_effect[name] = value;
        }else{
            delete object_effect[name];
        }
        this.setState({object_effect: object_effect});
    }
    _getDetail(id){
        let args = {
            id: id,
            sales_order_id: this.props.sales_order.id,
            sales_order_items_id: this.props.sales_order_item.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_REGIS_MINISITE_DETAIL, args);
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
    }
    componentWillReceiveProps(newProps) {
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
                }
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_REGIS_MINISITE_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_REGIS_MINISITE_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.start_date = response.data.start_date;
                object.end_date = response.data.end_date;
                object.object_type = response.data.object_type;
                this.setState({object: object});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_REGIS_MINISITE_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_MINISITE_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_MINISITE_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('MinisitePackageRegistration', {sales_order_items_id: this.props.sales_order_item.id});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideSmartMessageBox();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_MINISITE_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_MINISITE_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_MINISITE_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('MinisitePackageRegistration', {sales_order_items_id: this.props.sales_order_item.id});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideSmartMessageBox();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_MINISITE_EDIT);
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
        let day_quantity = utils.convertNumberToWeekDay(moment.unix(object.end_date).diff(moment.unix(object.start_date), 'day') + 1);
        let object_type_list = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_object_type);

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Minisite</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="object_type" label="Đối tượng" data={object_type_list} required={object_required.includes('object_type')}
                                         error={object_error.object_type} value={object.object_type} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" readOnly required={object_required.includes('start_date')}
                                                    value={object.start_date} nameFocus={name_focus}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb15">
                                    <DateTimePicker name="end_date" label="Ngày kết thúc" readOnly required={object_required.includes('end_date')}
                                                    value={object.end_date} nameFocus={name_focus}
                                    />
                                    {day_quantity && (
                                        <div className="end-date"><span>{day_quantity}</span></div>
                                    )}
                                </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupMinisitePackageRegistration);
