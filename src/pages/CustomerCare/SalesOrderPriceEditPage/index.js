import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import moment from "moment";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import InputArea from "components/Common/InputValue/InputArea";
import JobBasicPackage from "pages/CustomerCare/SalesOrderEditPage/Package/JobBasicPackage/index";
import JobPackage from "pages/CustomerCare/SalesOrderEditPage/Package/JobPackage/index";
import EffectPackage from "pages/CustomerCare/SalesOrderEditPage/Package/EffectPackage/index";
import EmployerPackage from "pages/CustomerCare/SalesOrderEditPage/Package/EmployerPackage/index";
import BannerPackage from "pages/CustomerCare/SalesOrderEditPage/Package/BannerPackage/index";
import MinisitePackage from "pages/CustomerCare/SalesOrderEditPage/Package/MinisitePackage/index";
import SalePackage from "pages/CustomerCare/SalesOrderEditPage/Package/SalePackage/index";
import PromotionsPackage from "pages/CustomerCare/SalesOrderEditPage/Package/PromotionsPackage";
import PopupCustomer from "pages/Accountant/CustomerPage/Popup/PopupCustomer";
import _ from "lodash";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {
    changePriceToRegisTration,
    createSalesOrder,
    deleteSalesOrder,
    getDetailSalesOrder,
    getListAccountantCampaign,
    getListAccountantCustomerFull,
    getPromotionProgramAppliedsBySalesOrder,
    previewSalesOrder,
    printSalesOrder,
    updateSalesOrder
} from 'api/saleOrder';
import {getList} from "api/employer";
import {publish, subscribe} from "utils/event";
import {getTeamMember} from "api/auth";
import CanAction from "components/Common/Ui/CanAction";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import BundlePackage from "pages/CustomerCare/SalesOrderEditPage/Package/BundlePackage";

const idKey = Constant.IDKEY_SALES_ORDER_EDIT_PAGE;

class index extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            object: {
                ordered_on: moment().unix(),
                is_signature: Constant.SALES_ORDER_IS_SIGNATURE_YES,
            },
            object_error: {},
            object_required: ['employer_id', 'is_signature', 'invoice_issuance_method', 'ordered_on',
                'payment_term_method', 'payment_method', 'type_campaign'],
            name_focus: '',
            customer: {},
            applied: [],
            employer_list: [],
            customer_list: [],
            campaign_list: [],
            staff_list: [],
            staff_info: [],
            is_show_campaign: false,
            configPackageBySite: utils.getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Package")
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.getSalesOrder(this.state.object.id);
                this.getAppliedPromotions(this.state.object.id);
            });
        }, idKey));

        this.onChange = this._onChange.bind(this);
        this.getListEmployer = this._getListEmployer.bind(this);
        this.getListCustomer = this._getListCustomer.bind(this);
        this.getListStaff = this._getListStaff.bind(this);
        this.getSalesOrder = this._getSalesOrder.bind(this);
        this.geListCampaign = this._geListCampaign.bind(this);
        this.getAppliedPromotions = this._getAppliedPromotions.bind(this);
        this.onSave = this._onSave.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnPreview = this._btnPreview.bind(this);
        this.btnPrint = this._btnPrint.bind(this);
        this.btnAddCustomer = this._btnAddCustomer.bind(this);
        this.btnChangeCustomer = this._btnChangeCustomer.bind(this);
        this.afterSubmitAppend = this._afterSubmitAppend.bind(this);
        this.btnChangeSalesOrder = this._btnChangeSalesOrder.bind(this);
    }

    async _getListEmployer(value) {
        this.setState({loading_getEmployer: true});
        const args = {
            q: value,
            status_not: Constant.STATUS_DELETED,
            per_page: 10,
            page: 1
        };
        const res = await getList(args);
        if (Array.isArray(res?.items)) {
            const employer_list = res?.items?.map(item => {
                return {
                    value: item.id,
                    title: item.id + ' - ' + item.name + " - " + item.email
                }
            });
            this.setState({employer_list: employer_list});
        }
    }

    async _getListCustomer(value) {
        this.setState({loading_getCustomer: true});
        const args = {
            tax_code: value,
            status: Constant.STATUS_ACTIVED,
            per_page: 1000,
            page: 1
        };
        this._getListAccountCustomer(args);
    }

    async _getListAccountCustomer(args) {
        const res = await getListAccountantCustomerFull(args);
        const {object} = this.state;
        if (Array.isArray(res?.data?.items)) {
            const customer_list = res?.data?.items?.map(item => {
                if (Number(object?.accountant_customer_id) === Number(item.id)) {
                    this.setState({customer: item});
                }
                return {
                    value: item.id,
                    title: item.tax_code + " - " + item.name + " - " + item.address,
                    item: item
                };
            });
            this.setState({customer_list: customer_list});
            this.setState({loading_getCustomer: false});
        }
    }

    async _getDetailEmployer(id) {
        const object = {...this.state.object};
        object.employer_id = id;
        this.setState({object});
        this._getListEmployer(object?.employer_id);
    }

    async _geListCampaign() {
        const res = await getListAccountantCampaign({status: Constant.STATUS_ACTIVED, per_page: 999});
        if (res) {
            const campaigns = Array.isArray(res?.items) ?
                res?.items?.map(_ => {
                    return {
                        title: _?.campaign_name,
                        value: _?.campaign_id
                    }
                }) : [];
            this.setState({campaign_list: campaigns});
        }
    }

    async _getListStaff() {
        const res = await getTeamMember({
            status: Constant.STATUS_ACTIVED,
            division_code_list: [
                Constant.DIVISION_TYPE_customer_care_leader,
                Constant.DIVISION_TYPE_customer_care_member,
            ],
            per_page: 999
        });
        if (res) {
            const staff = Array.isArray(res) ?
                res?.map(_ => {
                    return {
                        title: `${_?.code || ""} ${_?.code ? ` - ${_?.display_name}` : `${_?.display_name}`}`,
                        value: _?.id,
                        code: _?.code,
                    }
                }) : [];
            this.setState({staff_list: staff});
        }
    }

    async _getSalesOrder(id) {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await getDetailSalesOrder({id: id, type: Constant.SALES_ORDER_TYPE_PRICE});
        if (res) {
            this._getListEmployer(res?.employer_id);
            this._getListAccountCustomer({id: res.accountant_customer_id});
            this.setState({object: res});
            this.setState({is_showPackage: true});
        }
        uiAction.hideLoading();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        if (name === 'payment_method' && (!value || parseInt(value) === Constant.PAYMENT_TERM_METHOD_CK)) {
            delete object['payment_info'];
        }
        this.setState({object: object});
    }

    async _onSave(object, object_required) {
        const {uiAction, history, user} = this.props;
        const {staff_list} = this.state;
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
        object.package = object.package || Constant.SALES_ORDER_PACKAGE;

        const isCustomerCare = [
            Constant.DIVISION_TYPE_customer_care_member,
            Constant.DIVISION_TYPE_customer_care_leader
        ].includes(user?.division_code);
        const userId = user?.data?.id;

        if (isCustomerCare && !object.revenue_by_staff_id && userId) {
            object.revenue_by_staff_id = userId;
        }
        object.revenue_by_staff_code = staff_list.find(s => Number(s.value) === Number(object.revenue_by_staff_id))?.code;

        if (!object.id) {
            const res = await createSalesOrder(object);
            if (res) {
                uiAction.putToastSuccess("Thao tác thành công!");
                history.push(`${Constant.BASE_URL_EDIT_SALES_SERVICE_PRICE}?id=${res?.id}`);
                this._getSalesOrder(res?.id);
            }
            uiAction.hideLoading();
        } else {
            const res = await updateSalesOrder(object);
            if (res) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList(Constant.IDKEY_DISCOUNT_RECONTRACT);
            }
            uiAction.hideLoading();
        }
    }

    _btnChangeCustomer() {
        this.popupReject._handleShow();
    }

    _afterSubmitAppend() {
        publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
    }

    _btnDelete() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phiếu báo giá ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                const res = await deleteSalesOrder({id: this.state.object.id});
                if (res) {
                    let {object} = this.state;
                    this.setState({object: {...object, status: Constant.STATUS_DELETED}});
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công!");
                    uiAction.hideLoading();
                }
            }
        });
    }

    async _btnPreview() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await previewSalesOrder({id: this.state.object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPrint() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrder({id: this.state.object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    _btnChangeSalesOrder() {
        const {uiAction, history} = this.props;
        const {id} = this.state.object;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn chuyển phiếu báo giá thành phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await changePriceToRegisTration({id: id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    history.push(Constant.BASE_URL_EDIT_SALES_ORDER + '?id=' + id);
                }
                uiAction.hideSmartMessageBox();
                uiAction.hideLoading();
            }
        });
    }

    _btnAddCustomer() {
        this.setState({name_focus: ""});
        this.props.uiAction.createPopup(PopupCustomer, "Thêm Khách Hàng Kế Toán", {
            isSelect: true,
            changeCustomer: (customer) => {
                this.setState({customer: customer});
                this._getListAccountCustomer({id: customer.id});
            }
        });
    }

    async _getAppliedPromotions(id) {
        const res = await getPromotionProgramAppliedsBySalesOrder({sales_order_id: id});
        if(res) {
            this.setState({applied: res});
        }
    }

    componentDidMount() {
        let params = queryString.parse(window.location.search);
        if (params['id']) {
            this._getSalesOrder(params['id']);
            this._getAppliedPromotions(params['id']);
        }
        if (params['employer_id']) {
            this._getDetailEmployer(params['employer_id']);
        }
        this.geListCampaign();
        this.getListStaff();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {user, history} = this.props;
        let {
            object, object_error, object_required, name_focus, customer, employer_list, customer_list, campaign_list,
            staff_list, loading_getEmployer, loading_getCustomer, is_showPackage, configPackageBySite, applied
        } = this.state;
        let quotation_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_quotation_status);
        let list_invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_invoice_issuance_method);
        let list_is_signature = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_is_signature);
        let list_payment_term_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_term_method);
        let list_payment_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_method);
        let list_type_campaign = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_campaign);
        let list_sales_order_package = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_package);

        let title = object.id ? "Cập Nhật Phiếu Báo Giá: " + object.id + ' - ' + quotation_status[object.status] : "Tạo Phiếu Báo Giá";

        if (parseInt(object.payment_method) === Constant.PAYMENT_TERM_METHOD_TM) {
            object_required.push('payment_info');
        } else {
            object_required = object_required.filter(c => c !== 'payment_info');
        }

        const isCampaign = Number(object?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT;
        if (isCampaign) {
            object_required.push('campaign_id');
        }

        // set default payment_method
        if (!object.payment_method) {
            object.payment_method = Constant.PAYMENT_METHOD_DEFAULT;
        }

        const isCustomerCare = [
            Constant.DIVISION_TYPE_customer_care_member,
            Constant.DIVISION_TYPE_customer_care_leader
        ].includes(user?.division_code);
        const userId = isCustomerCare ? user?.data?.id : 0;

        if (isCustomerCare && !object.revenue_by_staff_id && userId) {
            object.revenue_by_staff_id = userId;
        }

        const taxRate = (100 + Number(object.vat_percent))/100;
        const totalAmount =  object.is_include_tax === true ?  object.total_amount_unit/taxRate : object.total_amount_unit;
        const totalAmountIncludedTax = object.is_include_tax === true ? object.total_amount_unit : object.total_amount_unit*taxRate;
        const totalTax = totalAmountIncludedTax - totalAmount;

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
                                        <Dropbox name="employer_id" label="Nhà tuyển dụng" data={employer_list}
                                                 required={object_required.includes('employer_id')}
                                                 value={object.employer_id} error={object_error.employer_id}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                                 timeOut={1000} loading={loading_getEmployer}
                                                 onChangeTimeOut={this.getListEmployer}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="name_representative" label="Người đại diện"
                                                value={object.name_representative}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="position_representative" label="Chức vụ"
                                                value={object.position_representative}
                                                onChange={this.onChange}
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
                                            <Dropbox name="invoice_issuance_method" label="Xuất hóa đơn"
                                                     data={list_invoice_issuance_method}
                                                     required={object_required.includes('invoice_issuance_method')}
                                                     value={object.invoice_issuance_method}
                                                     error={object_error.invoice_issuance_method} nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <DateTimePicker name="ordered_on" label="Ngày ghi nhận" minDate={moment()}
                                                            required={object_required.includes('ordered_on')}
                                                            value={object.ordered_on} error={object_error.ordered_on}
                                                            nameFocus={name_focus}
                                                            onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Dropbox name="payment_method" label="Hình thức thanh toán"
                                                     data={list_payment_method}
                                                     required={object_required.includes('payment_method')}
                                                     value={object.payment_method} error={object_error.payment_method}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                        {object_required.includes('payment_info') && (
                                            <div className="col-sm-6 col-xs-12 mb10" style={{paddingBottom: "12px"}}>
                                                <Input2 type="text" name="payment_info" label="Địa chỉ thu tiền"
                                                        required={object_required.includes('payment_info')}
                                                        value={object.payment_info} error={object_error.payment_info}
                                                        nameFocus={name_focus}
                                                        onChange={this.onChange}

                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Dropbox name="payment_term_method" label="Hạn thanh toán"
                                                     data={list_payment_term_method}
                                                     required={object_required.includes('payment_term_method')}
                                                     value={object.payment_term_method}
                                                     error={object_error.payment_term_method} nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Dropbox name="is_signature" label="Siêu Việt ký" data={list_is_signature}
                                                     required={object_required.includes('is_signature')}
                                                     value={object.is_signature} error={object_error.is_signature}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <InputArea name="note" label="Ghi chú"
                                                   required={object_required.includes('note')}
                                                   style={{height: "100px", minHeight: "100px"}} nameFocus={name_focus}
                                                   value={object.note} error={object_error.note}
                                                   onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Dropbox name="package" label="Loại bảng giá"
                                                 data={list_sales_order_package}
                                                 required={object_required.includes('package')}
                                                 value={object.package || Constant.SALES_ORDER_PACKAGE}
                                                 error={object_error.package} nameFocus={name_focus}
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
                                        <Dropbox name="accountant_customer_id"
                                                 label="Mã số thuế"
                                                 data={customer_list}
                                                 value={customer.id}
                                                 nameFocus={name_focus}
                                                 onChange={(value) => {
                                                     let customer_list = this.state.customer_list.filter(c => c.value === value);
                                                     let customer = customer_list[0] ? customer_list[0].item : {};
                                                     this.setState({customer: customer});
                                                 }}
                                                 timeOut={1000}
                                                 loading={loading_getCustomer}
                                                 onChangeTimeOut={this.getListCustomer}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="name" label="Tên công ty" value={customer.name}
                                                readOnly/>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="address" label="Địa chỉ" value={customer.address}
                                                readOnly/>
                                    </div>
                                    <CanAction isDisabled={isCustomerCare}>
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            <Dropbox name="revenue_by_staff_id" label="CSKH ghi nhận doanh thu"
                                                     data={staff_list}
                                                     required={object_required.includes("revenue_by_staff_id")}
                                                     value={object.revenue_by_staff_id}
                                                     error={object_error.revenue_by_staff_id}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                                     readOnly={[Constant.SALE_ORDER_ACTIVED].includes(object.status)}
                                            />
                                        </div>
                                    </CanAction>
                                    <div className="col-xs-12 col-sm-12">
                                        {object.total_amount_info && (
                                            <React.Fragment>
                                                <div className="col-sm-12 col-xs-12 sub-title-form padding0 mb10">
                                                    <span>Thành tiền ({utils.formatNumber(totalAmountIncludedTax, 0, ".", "đ")})</span>
                                                </div>
                                                {object.total_amount_info && Object.keys(object.total_amount_info).map((item, key) => {
                                                    if (!['discount_non_policy_info', 'recontract_info'].includes(item)) {
                                                        return (
                                                            <div
                                                                className="col-sm-12 col-xs-12 row-content padding0 mb10"
                                                                key={key}>
                                                                <div className="col-sm-6 col-xs-6 padding0">
                                                                    <span>{object.total_amount_info[item].cache_service_name}</span>
                                                                </div>
                                                                <div className="col-sm-6 col-xs-6 number-money">
                                                                    <span>{utils.formatNumber(object.total_amount_info[item].total_amount, 0, ".", "đ")}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else {
                                                        return <React.Fragment key={key}/>
                                                    }
                                                })}
                                                {parseInt(object.recontract_discount_amount) > 0 && (
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                        <div className="col-sm-6 col-xs-6 padding0">Giảm giá tái ký
                                                        </div>
                                                        <div className="col-sm-6 col-xs-6 number-money textRed">
                                                            <span>- {utils.formatNumber(object.recontract_discount_amount, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {parseInt(object.non_policy_discount_amount) > 0 && (
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                        <div className="col-sm-6 col-xs-6 padding0">GGNCS</div>
                                                        <div className="col-sm-6 col-xs-5 number-money textRed">
                                                            <span>- {utils.formatNumber(object.non_policy_discount_amount, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {applied.map((a, idx) => (
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10"
                                                         key={idx.toString()}>
                                                        <div className="col-sm-6 col-xs-6 padding0">{a?.title}</div>
                                                        <div className="col-sm-6 col-xs-5 number-money textRed">
                                                            <span>- {utils.formatNumber(a?.discount_amount, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {object.is_include_tax === false && <>
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                        <div className="col-sm-6 col-xs-6 px-0 pt-10">Tiền trước thuế</div>
                                                        <div className="col-sm-6 col-xs-6 number-money last pt-10">
                                                            <span>{utils.formatNumber(totalAmount, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                        <div className="col-sm-6 col-xs-6 padding0">Thuế VAT</div>
                                                        <div className="col-sm-6 col-xs-6 number-money">
                                                            <span>{utils.formatNumber(totalTax ,0,".","đ")}</span>
                                                        </div>
                                                    </div>
                                                </>}
                                            
                                                <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                    <div className="col-sm-6 col-xs-6 text-bold px-0 pt-10">Tổng tiền {object.is_include_tax === false && 'sau thuế'}</div>
                                                    <div className="col-sm-6 col-xs-6 number-money last pt-10">
                                                        <span>{utils.formatNumber(totalAmountIncludedTax, 0, ".", "đ")}</span>
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
                                                    <button type="button"
                                                            className="el-button el-button-primary el-button-small"
                                                            onClick={() => {
                                                                this.onSave(object, object_required)
                                                            }}>
                                                        <span>Lưu</span>
                                                    </button>
                                                )}
                                                {is_showPackage && (
                                                    <React.Fragment>
                                                        <button type="button"
                                                                className="el-button el-button-success el-button-small"
                                                                onClick={() => {
                                                                    this.onSave(object, object_required)
                                                                }}>
                                                            <span>Lưu lại</span>
                                                        </button>
                                                        <button type="button"
                                                                className="el-button el-button-warning el-button-small"
                                                                onClick={this.btnChangeSalesOrder}>
                                                            <span>Chuyển thành PĐK</span>
                                                        </button>
                                                        <CanRender actionCode={ROLES.customer_care_sales_order_preview_sales_order}>
                                                            <button type="button"
                                                                    className="el-button el-button-primary el-button-small"
                                                                    onClick={this.btnPreview}>
                                                                <span>In phiếu</span>
                                                            </button>
                                                        </CanRender>
                                                        <button type="button"
                                                                className="el-button el-button-bricky el-button-small"
                                                                onClick={this.btnDelete}>
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
                        {_.includes(configPackageBySite, "bundle_package") && (
                            <BundlePackage sales_order={object} />
                        )}
                        {_.includes(configPackageBySite, "jobbox_basic") && (
                            <JobBasicPackage sales_order={object}/>
                        )}

                        {_.includes(configPackageBySite, "jobbox") && (
                            <JobPackage sales_order={object}/>
                        )}

                        {_.includes(configPackageBySite, "filter_resume_2018") && (
                            <EmployerPackage sales_order={object}/>
                        )}

                        {_.includes(configPackageBySite, "effect") && (
                            <EffectPackage sales_order={object}/>
                        )}

                        {_.includes(configPackageBySite, "banner") && (
                            <BannerPackage sales_order={object}/>
                        )}

                        {_.includes(configPackageBySite, "minisite") && (
                            <MinisitePackage sales_order={object}/>
                        )}

                        <SalePackage sales_order={object}/>

                        <PromotionsPackage sales_order={object} history={history}/>
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
        branch: state.branch,
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
