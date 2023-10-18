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
import CanAction from "components/Common/Ui/CanAction";
import {publish} from "utils/event";
import {getDetailSKU} from "api/system";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupBannerPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['service_code', 'start_date', 'week_quantity'],
            object_error: {},
            name_focus: "",
            is_area_disable: false,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeService = this._onChangeService.bind(this);
        this.getDetail = this._getDetail.bind(this);
    }
    _onSave(data){
        this.setState({object_error: {}, loading: false, name_focus: ""});

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
        object.type_campaign = this.props.type_campaign;
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_BANNER_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_BANNER_EDIT, object);
            this.setState({loading: false});
        }
    }
    _onChange(value, name){
        const channel_code = this.props.branch.currentBranch.channel_code;
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});

        // Xử lý thay đổi gói dịch vụ
        // #CONFIG_BRANCH
        if(name === "service_code" && channel_code === Constant.CHANNEL_CODE_VL24H) {
            const service_list = this.props.sys.service.items.filter(c =>
                c.service_type === Constant.SERVICE_TYPE_BANNER &&
                c.page_type === Constant.SERVICE_PAGE_TYPE_HOME_PAGE &&
                c.code === value &&
                parseInt(c.status) === Constant.STATUS_ACTIVED,
            );

            if(service_list.length > 0) {
                object.displayed_area = Constant.AREA_ALL;
                this.setState({
                    is_area_disable:true,
                    object: object,
                });
            } else {
                object["displayed_area"] = null;
                this.setState({
                    is_area_disable: false,
                    object: object,
                });
            }
        }
    }
    async _onChangeService(value, name) {
        const {object} = this.state;
        if (value) {
            const res = await getDetailSKU({service_code: value});
            if (res) {
                this.setState({object: {...object, sku_code_service: res?.sku_code}});
            }
        } else {
            object.sku_code_service = null;
            this.setState({object: object});
        }
        this.onChange(value, name);
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
        if (newProps.api[ConstantURL.API_URL_POST_BANNER_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_BANNER_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('BannerPackage');
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_BANNER_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_BANNER_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_BANNER_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('BannerPackage');
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_BANNER_EDIT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                let object = {};
                object.id = response.data.id;
                object.service_code = response.data.service_code;
                object.displayed_area = response.data.service_items_info.displayed_area;
                object.displayed_method = response.data.service_items_info.displayed_method;
                object.start_date = response.data.start_date;
                object.week_quantity = response.data.week_quantity;
                object.day_quantity = response.data.day_quantity;
                object.sku_code_service = response.data.sku_code_service;
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
        let {object, object_error, object_required, name_focus, is_area_disable} = this.state;
        let box_code_list = this.props.sys.service.items.filter(c =>
            c.service_type === Constant.SERVICE_TYPE_BANNER &&
            parseInt(c.status) === Constant.STATUS_ACTIVED
        );
        let area = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_area);
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
                                <span>Quảng bá thương hiệu</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="service_code" label="Gói dịch vụ" data={box_code_list} required={object_required.includes('service_code')}
                                         key_value="code" key_title="name"
                                         error={object_error.service_code} value={object.service_code} nameFocus={name_focus}
                                         onChange={this.onChangeService}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <CanAction isDisabled={is_area_disable}>
                                        <Dropbox name="displayed_area" label="Khu vực hiển thị" data={area} required={object_required.includes('displayed_area')}
                                                 error={object_error.displayed_area} value={object.displayed_area} nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    </CanAction>
                                </div>
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
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="sku_code_service" label="Mã SKU" value={object.sku_code_service} readOnly/>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupBannerPackage);
