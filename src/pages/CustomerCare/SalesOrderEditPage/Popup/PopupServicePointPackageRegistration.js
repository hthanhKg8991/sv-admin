import React, {Component} from "react";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
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
import {publish} from "utils/event";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupServicePointPackageRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['sales_order_items_sub_id', 'service_code', 'total_buy_point', 'start_date', 'end_date',],
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
        const {sales_order_items} = this.state;
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
        object.sales_order_id = this.props.sales_order.id;
        object.sales_order_items_id = this.props.sales_order_item.id;

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
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_EDIT, object);
        }
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        /**
         * Cập nhật số tuần khi chọn sub item
         */
        if (String(name) === "sales_order_items_sub_id") {
            if(value) {
                const {sales_order_items_subs} = this.state.sales_order_items;
                const subItem = sales_order_items_subs?.find(sub => Number(sub.id) === Number(value));
                const dayQuantitySub = subItem?.remaining_day;
                object.total_buy_point = subItem?.quantity_buy;
                object.end_date = moment.unix(object.start_date).add(parseInt(dayQuantitySub) - 1, 'days').unix();
            } else {
                const {end_date_item, point_item} = this.state;
                object.end_date = end_date_item;
                object.total_buy_point = point_item;
            }
        }
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_REGIS_SERVICE_POINT_DETAIL, args);
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
                    object.service_code = response.data.service_code;
                    object.total_buy_point = response.data?.service_items_info?.quantity_buy;
                    // object.start_date = response.data.start_date < curr ? curr : response.data.start_date;
                    object.start_date = curr;
                    object.end_date = moment.unix(object.start_date).add(parseInt(response.data.total_day_quantity) - 1, 'days').unix();
                    this.setState({end_date_item: object.end_date});
                    this.setState({point_item: object.total_buy_point});
                    this.setState({object: object});
                }
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_REGIS_SERVICE_POINT_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_REGIS_SERVICE_POINT_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.service_code = response.data.service_code;
                object.total_buy_point = response.data.total_point;
                object.start_date = response.data.start_date;
                object.end_date = response.data.end_date;
                this.setState({object: object});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_REGIS_SERVICE_POINT_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_SERVICE_POINT_PACKAGE);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideSmartMessageBox();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, Constant.IDKEY_SERVICE_POINT_PACKAGE);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideSmartMessageBox();
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_SERVICE_POINT_EDIT);
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
        let {object, object_required, name_focus, sales_order_items} = this.state;
        let day_quantity = utils.convertNumberToWeekDay(moment.unix(object.end_date).diff(moment.unix(object.start_date), 'day') + 1);
        let box_code_list = this.props.sys.service.items;

        /**
         * Chọn sub item khi chọn split với trạng thái
         */
        let subItemsOption = [];
        if (Array.isArray(sales_order_items?.sales_order_items_subs)) {
            subItemsOption = sales_order_items.sales_order_items_subs
                .filter(sub => [Constant.STATUS_SALES_ORDER_ITEM_NEW].includes(Number(sub.status)))
                .map(sub => {
                    return {
                        title: `ID ${sub?.id} - ${sub?.remaining_day} ngày`,
                        value: sub.id
                    }
                });
        }

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Điểm Dịch Vụ</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="sales_order_items_sub_id"
                                             label="Chọn SubItem"
                                             data={subItemsOption}
                                             required={object_required.includes('sales_order_items_sub_id')}
                                             value={object.sales_order_items_sub_id}
                                             nameFocus={name_focus}
                                             onChange={this.onChange}

                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="service_code" label="Gói dịch vụ" data={box_code_list} required={object_required.includes('service_code')} readOnly
                                             key_value="code" key_title="name"
                                             value={object.service_code}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 name="total_buy_point" label="Điểm mua" isNumber required={object_required.includes('total_buy_point')} readOnly
                                            value={object.total_buy_point}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Ngày bắt đầu" readOnly required={object_required.includes('start_date')}
                                                    value={object.start_date} nameFocus={name_focus}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupServicePointPackageRegistration);
