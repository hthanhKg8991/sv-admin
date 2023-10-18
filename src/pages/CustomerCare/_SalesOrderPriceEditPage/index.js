import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import moment from "moment";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import InputArea from "components/Common/InputValue/InputArea";
import JobBasicPackage from "./Package/JobBasicPackage";
import JobPackage from "./Package/JobPackage";
import EffectPackage from "./Package/EffectPackage";
import EmployerPackage from "./Package/EmployerPackage";
import BannerPackage from "./Package/BannerPackage";
import MinisitePackage from "./Package/MinisitePackage";
import SalePackage from "./Package/SalePackage";
import PopupCustomer from "pages/Accountant/CustomerPage/Popup/PopupCustomer";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {getListAccountantCampaign} from "api/saleOrder";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_error: {},
            object_required: ['employer_id', 'is_signature', 'invoice_issuance_method', 'ordered_on', 'payment_term_method', 'payment_method'],
            name_focus: '',
            customer: {},
            employer_list: [],
            customer_list: [],
            campaign_list: [],
        };
        this.onChange = this._onChange.bind(this);
        this.getListEmployer = this._getListEmployer.bind(this);
        this.getListCustomer = this._getListCustomer.bind(this);
        this.getSalesOrder = this._getSalesOrder.bind(this);
        this.onSave = this._onSave.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnPreview = this._btnPreview.bind(this);
        this.btnChangeSalesOrder = this._btnChangeSalesOrder.bind(this);
        this.btnAddCustomer = this._btnAddCustomer.bind(this);
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        if(name === 'payment_method' && (!value || parseInt(value) === Constant.PAYMENT_TERM_METHOD_CK)){
            delete object['payment_info'];
        }
        this.setState({object: object});

    }
    _getListEmployer(value){
        this.setState({loading_getEmployer: true});
        let args = {
            q: value,
            status_not: Constant.STATUS_DELETED,
            per_page: 10,
            page: 1
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, args);
    }
    _getListCustomer(value){
        this.setState({loading_getCustomer: true});
        let args = {
            tax_code: value,
            status_not: Constant.STATUS_DELETED,
            per_page: 10,
            page: 1
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST, args);
    }
    _getSalesOrder(id){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_DETAIL, {id: id, type: Constant.SALES_ORDER_TYPE_PRICE});
    }
    _onSave(object, object_required){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        object.accountant_customer_id = this.state.customer.id;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        object.sales_order_type = Constant.SALES_ORDER_TYPE_PRICE;
        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALES_ORDER_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALES_ORDER_EDIT, object);
        }
    }
    _btnDelete(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phiếu báo giá ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALES_ORDER_DELETE, {id: this.state.object.id});
            }
        });
    }
    _btnPreview(){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW, {id: this.state.object.id});
    }
    _btnChangeSalesOrder(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn chuyển phiếu báo giá thành phiếu đăng ký ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION, {id: this.state.object.id});
            }
        });
    }
    _btnAddCustomer(){
        this.props.uiAction.createPopup(PopupCustomer, "Thêm Khách Hàng Kế Toán", {
            isSelect: true,
            changeCustomer: (customer)=>{
                this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST, {id: customer.id});
                this.setState({customer: customer});
            }
        });
    }

    async _geListCampaign() {
        const res = await getListAccountantCampaign({status: Constant.STATUS_ACTIVED, per_page: 999});
        if(res) {
            const campaigns = Array.isArray(res?.items) ?
                res?.items?.map(_ => {return {
                    title: _?.campaign_name,
                    value: _?.campaign_id
                }}) : [];
            this.setState({campaign_list: campaigns});
        }
    }

    componentWillMount(){
        let params = queryString.parse(window.location.search);
        if (params['id']){
            this.getSalesOrder(params['id']);
        }
    }

    componentDidMount() {
        this._geListCampaign();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let employer_list = [];
                response.data.items.forEach((item) => {
                    employer_list.push({value: item.id, title: item.id + ' - ' + item.name +  " - " + item.email});
                });
                this.setState({employer_list: employer_list});
            }
            this.setState({loading_getEmployer: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER]){
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER];
            if (response.code === Constant.CODE_SUCCESS) {
                let employer_list = [];
                employer_list.push({value: response.data.id, title: response.data.id + ' - ' + response.data.email + " - " + response.data.name});
                this.setState({employer_list: employer_list});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER);
        }
        if (newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let customer_list = [];
                let customer = {};
                response.data.items.forEach((item) => {
                    if (response.info?.args?.id === item.id){
                        customer = item;
                    }
                    customer_list.push({
                        value: item.id,
                        title: item.tax_code + " - " + item.name + " - " + item.address,
                        item: item
                    });
                });
                this.setState({customer: customer});
                this.setState({customer_list: customer_list});
            }
            this.setState({loading_getCustomer: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                let pathname = window.location.pathname;
                this.props.history.push(pathname + "?id=" + response.data.id);
                this.setState({is_showPackage: 1});
                this.setState({object: response.data});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALES_ORDER_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('DiscountRecontract');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALES_ORDER_EDIT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER, {id: response.data.employer_id});
                this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST, {id: response.data.accountant_customer_id});
                this.setState({object: response.data});
                this.setState({is_showPackage: true});
            }else{
                this.props.history.push(Constant.BASE_URL_ERROR);
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                let object = Object.assign({},this.state.object);
                object.status = Constant.STATUS_DELETED;
                this.setState({object: object})
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALES_ORDER_DELETE);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW];
            if (response.code === Constant.CODE_SUCCESS) {
                if (response.data.url) {
                    window.open(response.data.url, "_blank");
                }
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW);
        }
        if (newProps.api[ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION]) {
            let response = newProps.api[ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.history.push(Constant.BASE_URL_EDIT_SALES_ORDER + '?id=' + this.state.object.id);
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION);
        }
        if (newProps.refresh['SalesOrderEditPage']){
            this.getSalesOrder(this.state.object.id);
            this.props.uiAction.deleteRefreshList('SalesOrderEditPage');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        let {object, object_error, object_required, name_focus, customer, employer_list, customer_list, campaign_list,
            loading_getEmployer, loading_getCustomer, is_showPackage} = this.state;
        let title = object.id ? "Cập Nhật Phiếu Báo Giá: " + object.id : "Tạo Phiếu Báo Giá";
        let list_invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_invoice_issuance_method);
        let list_is_signature = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_is_signature);
        let list_payment_term_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_payment_term_method);
        let list_payment_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_payment_method);
        let list_type_campaign = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_campaign);

        if(parseInt(object.payment_method) === Constant.PAYMENT_TERM_METHOD_TM){
            object_required.push('payment_info');
        }else{
            object_required = object_required.filter(c => c !== 'payment_info');
        }

        const isCampaign = Number(object?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT;
        if(isCampaign) {
            object_required.push('campaign_id');
        }

        return (
                <div className="row-body">
                    <div className="col-result-full crm-section">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">{title}</span>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6 col-xs-12">
                                        <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                            <span>Thông tin chung</span>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            <Dropbox name="employer_id"
                                                     label="Nhà tuyển dụng"
                                                     data={employer_list}
                                                     required={object_required.includes('employer_id')}
                                                     value={object.employer_id}
                                                     error={object_error.employer_id}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                                     timeOut={1000}
                                                     loading={loading_getEmployer}
                                                     onChangeTimeOut={this.getListEmployer}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-xs-12 padding0">
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Dropbox name="type_campaign" label="Loại phiếu"
                                                         data={list_type_campaign}
                                                         required={object_required.includes('type_campaign')}
                                                         value={object.type_campaign}
                                                         error={object_error.type_campaign} nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                            {isCampaign &&
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Dropbox name="campaign_id" label="Chương trình tặng"
                                                         data={campaign_list}
                                                         required={object_required.includes('campaign_id')}
                                                         value={object.campaign_id}
                                                         error={object_error.campaign_id} nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                            }
                                        </div>
                                        <div className="col-sm-12 col-xs-12 padding0">
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Dropbox name="is_signature" label="Siêu Việt ký" data={list_is_signature} required={object_required.includes('is_signature')}
                                                         value={object.is_signature} error={object_error.is_signature} nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Dropbox name="invoice_issuance_method" label="Xuất hóa đơn" data={list_invoice_issuance_method} required={object_required.includes('invoice_issuance_method')}
                                                         value={object.invoice_issuance_method} error={object_error.invoice_issuance_method} nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 padding0">
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <DateTimePicker name="ordered_on" label="Ngày ghi nhận" minDate={moment()} required={object_required.includes('ordered_on')}
                                                                value={object.ordered_on} error={object_error.ordered_on} nameFocus={name_focus}
                                                                onChange={this.onChange}
                                                />
                                            </div>
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Dropbox name="payment_term_method" label="Hạn thanh toán" data={list_payment_term_method} required={object_required.includes('payment_term_method')}
                                                         value={object.payment_term_method} error={object_error.payment_term_method} nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 padding0">
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Dropbox name="payment_method" label="Hình thức thanh toán" data={list_payment_method} required={object_required.includes('payment_method')}
                                                         value={object.payment_method} error={object_error.payment_method} nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                            {object_required.includes('payment_info') && (
                                                <div className="col-sm-6 col-xs-12 mb10" style={{paddingBottom:"12px"}}>
                                                    <Input2 type="text" name="payment_info" label="Địa chỉ thu tiền" required={object_required.includes('payment_info')}
                                                            value={object.payment_info} error={object_error.payment_info} nameFocus={name_focus}
                                                            onChange={this.onChange}

                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            <InputArea name="note" label="Ghi chú" required={object_required.includes('note')}
                                                       style={{height:"100px", minHeight:"100px"}} nameFocus={name_focus}
                                                       value={object.note} error={object_error.note}
                                                       onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-xs-12">
                                        <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                            <span>Khách hàng kế toán</span>
                                            <span className="ml10 pointer" onClick={this.btnAddCustomer}>
                                                <i className="glyphicon glyphicon-plus"/>
                                            </span>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            <Dropbox name="accountant_customer_id" label="Mã số thuế" data={customer_list} required={object_required.includes('accountant_customer_id')}
                                                     value={customer.id} nameFocus={name_focus}
                                                     onChange={(value)=>{
                                                         let customer_list = this.state.customer_list.filter(c => c.value === value);
                                                         let customer = customer_list[0] ? customer_list[0].item : {};
                                                         this.setState({customer: customer});
                                                     }}
                                                     timeOut={1000} loading={loading_getCustomer}
                                                     onChangeTimeOut={this.getListCustomer}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            <Input2 type="text" name="name" label="Tên công ty" value={customer.name} readOnly/>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            <Input2 type="text" name="address" label="Địa chỉ" value={customer.address} readOnly/>
                                        </div>
                                        <div className="col-xs-12 col-sm-12">
                                            {object.total_amount_info && (
                                                <React.Fragment>
                                                    <div className="col-sm-12 col-xs-12 sub-title-form padding0">
                                                        <span>Thành tiền ({utils.formatNumber(object.total_amount_unit,0,".","đ")})</span>
                                                    </div>
                                                    {object.total_amount_info && Object.keys(object.total_amount_info).map((item, key) => {
                                                        if (!['discount_non_policy_info','recontract_info'].includes(item)) {
                                                            return (
                                                                <div className="col-sm-12 col-xs-12 row-content padding0" key={key}>
                                                                    <div className="col-sm-6 col-xs-6 padding0">
                                                                        <span>{object.total_amount_info[item].cache_service_name}</span>
                                                                    </div>
                                                                    <div className="col-sm-6 col-xs-6 number-money">
                                                                        <span>{utils.formatNumber(object.total_amount_info[item].total_amount, 0, ".", "đ")}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }else{
                                                            return <React.Fragment key={key}/>
                                                        }
                                                    })}
                                                    {parseInt(object.recontract_discount_amount) > 0 && (
                                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                                            <div className="col-sm-6 col-xs-6 padding0">Giảm giá tái ký</div>
                                                            <div className="col-sm-6 col-xs-6 number-money textRed">
                                                                <span>- {utils.formatNumber(object.recontract_discount_amount,0,".","đ")}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {parseInt(object.non_policy_discount_amount) > 0 && (
                                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                                            <div className="col-sm-6 col-xs-6 padding0">GGNCS</div>
                                                            <div className="col-sm-6 col-xs-5 number-money textRed">
                                                                <span>- {utils.formatNumber(object.non_policy_discount_amount,0,".","đ")}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                                        <div className="col-sm-6 col-xs-6 text-bold padding0">Tổng</div>
                                                        <div className="col-sm-6 col-xs-6 number-money last">
                                                            <span>{utils.formatNumber(object.total_amount_unit,0,".","đ")}</span>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12">
                                        <div className="text-right mb15 mr15">
                                            {![Constant.STATUS_DELETED].includes(parseInt(object.status)) && (
                                                <React.Fragment>
                                                    {!is_showPackage && (
                                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={()=>{this.onSave(object, object_required)}}>
                                                            <span>Lưu</span>
                                                        </button>
                                                    )}
                                                    {is_showPackage && (
                                                        <React.Fragment>
                                                            <button type="button" className="el-button el-button-success el-button-small" onClick={()=>{this.onSave(object, object_required)}}>
                                                                <span>Lưu lại</span>
                                                            </button>
                                                            <button type="button" className="el-button el-button-warning el-button-small" onClick={this.btnChangeSalesOrder}>
                                                                <span>Chuyển thành PĐK</span>
                                                            </button>
                                                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnPreview}>
                                                                <span>In phiếu</span>
                                                            </button>
                                                            <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnDelete}>
                                                                <span>Xóa phiếu</span>
                                                            </button>
                                                        </React.Fragment>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {is_showPackage && (
                        <React.Fragment>
                            <JobBasicPackage sales_order={object} />
                            <JobPackage sales_order={object} />
                            <EffectPackage sales_order={object} />
                            <EmployerPackage sales_order={object} />
                            <BannerPackage sales_order={object} />
                            <MinisitePackage sales_order={object} />
                            <SalePackage sales_order={object} />
                        </React.Fragment>
                    )}
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
