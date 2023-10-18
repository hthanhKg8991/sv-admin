import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import moment from "moment";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import InputTags from 'components/Common/InputValue/InputTags'; 
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import InputArea from "components/Common/InputValue/InputArea";
import JobBasicPackage from "pages/CustomerCare/SalesOrderEditPage/Package/JobBasicPackage/index";
import JobPackage from "pages/CustomerCare/SalesOrderEditPage/Package/JobPackage/index";
import GroupPackage from "pages/CustomerCare/SalesOrderEditPage/Package/GroupPackage/index";
import BundlePackage from "pages/CustomerCare/SalesOrderEditPage/Package/BundlePackage/index";
import ComboPackage from "pages/CustomerCare/SalesOrderEditPage/Package/ComboPackage/index";
import ComboPost from "pages/CustomerCare/SalesOrderEditPage/Package/ComboPost/index";
import SubscriptionPackage from "pages/CustomerCare/SalesOrderEditPage/Package/SubscriptionPackage/index";
import EffectPackage from "pages/CustomerCare/SalesOrderEditPage/Package/EffectPackage/index";
import EmployerPackage from "pages/CustomerCare/SalesOrderEditPage/Package/EmployerPackage/index";
import BannerPackage from "pages/CustomerCare/SalesOrderEditPage/Package/BannerPackage/index";
import MinisitePackage from "pages/CustomerCare/SalesOrderEditPage/Package/MinisitePackage/index";
import SalePackage from "pages/CustomerCare/SalesOrderEditPage/Package/SalePackage/index";
import PromotionsPackage from "pages/CustomerCare/SalesOrderEditPage/Package/PromotionsPackage";
import CreditPackage from "pages/CustomerCare/SalesOrderEditPage/Package/CreditPackage";
import RecruiterAssistantPackage from "pages/CustomerCare/SalesOrderEditPage/Package/RecruiterAssistantPackage";
import FilterResumePackage from "pages/CustomerCare/SalesOrderEditPage/Package/FilterResumePackage";
import PopupCustomer from "pages/Accountant/CustomerPage/Popup/PopupCustomer";
import _ from "lodash";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Yup from 'yup';
import PopupForm from 'components/Common/Ui/PopupForm';
import FormUpdate from './Popup/FormUpdate';
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {
    completeSalesOrder,
    createSalesOrder,
    deleteSalesOrder,
    duplicateSalesOrder,
    getDetailAccountantCampaign,
    getDetailSalesOrder,
    getListAccountantCampaign,
    getListAccountantCustomerFull,
    getPromotionProgramAppliedsBySalesOrder,
    previewSalesOrder,
    printPaymentRequest,
    printSalesOrder,
    printSalesOrderNew,
    printSalesOrderOriginal,
    printSalesOrderWord,
    requestApprove,
    requestConfirmPayment,
    salesOrderReSyncOdoo,
    updateOrderDetail,
    updateSalesOrder,
    previewContractAddendum,
    previewReportDeal,
    previewReportConfirm, getListOpportunityCanUse
} from 'api/saleOrder';
import {getList} from "api/employer";
import {publish, subscribe} from "utils/event";
import {getCustomerListNewIgnoreChannelCode, getStaffHeadhunt, getTeamMember} from "api/auth";
import CanAction from "components/Common/Ui/CanAction";
import PopupChangeBranch from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeBranch";
import PopupChangeOpportunity from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeOpportunity";
import PopupRequestApprove from "pages/CustomerCare/SalesOrderPage/Popup/PopupRequestApprove";
import PopupRequestConfirmPayment from "pages/CustomerCare/SalesOrderPage/Popup/PopupRequestConfirmPayment";
import {getListConfig} from "api/system";
import {Link} from "react-router-dom";
import {getConfigForm} from "utils/utils";
import JobFreePackage from "pages/CustomerCare/SalesOrderEditPage/Package/JobFreePackage";

const idKey = "SalesOrderEditPage";

class index extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            object: {
                ordered_on: moment().unix(),
                is_signature: Constant.SALES_ORDER_IS_SIGNATURE_YES,
                type_assignment: Constant.TYPE_ASSIGNMENT_SALE,
                email_e_invoices: [],
            },
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Info"),
            object_error: {},
            object_required: ['employer_id', 'is_signature', 'invoice_issuance_method', 'ordered_on',
                'payment_term_method', 'payment_method', 'type_campaign'],
            name_focus: '',
            customer: {},
            applied: [],
            employer_list: [],
            customer_list: [],
            campaign_list: [],
            staff_list: null,
            staff_list_all: [],
            staff_info: [],
            opportunity: [],
            is_show_campaign: false,
            configPackageBySite: utils.getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Package"),
            so_payment_term_method: null,
            flagQrCode: null,
            staffCrossSelling: {},
            staffsCrossSelling: [],
            campaign_info: {},
            areaChangeRegistrationCode: null,
            customer_email_e_invoices: [],
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this._getSalesOrder(this.state.object.id);
                this._getAppliedPromotions(this.state.object.id);
            });
        }, idKey));

        this.onChange = this._onChange.bind(this);
        this.getListEmployer = this._getListEmployer.bind(this);
        this.getListCustomer = this._getListCustomer.bind(this);
        this.getListStaff = this._getListStaff.bind(this);
        this.getSalesOrder = this._getSalesOrder.bind(this);
        this.onSave = this._onSave.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnPreview = this._btnPreview.bind(this);
        this.btnPrint = this._btnPrint.bind(this);
        this.btnCopy = this._btnCopy.bind(this);
        this.btnComplete = this._btnComplete.bind(this);
        // this.btnCancel = this._btnCancel.bind(this);
        this.btnAddCustomer = this._btnAddCustomer.bind(this);
        this.btnChangeCustomer = this._btnChangeCustomer.bind(this);
        this.afterSubmitAppend = this._afterSubmitAppend.bind(this);
        this.btnPrintContractWord = this._btnPrintContractWord.bind(this);
        this.btnPrintContractOriginal = this._btnPrintContractOriginal.bind(this);
        this.btnPrintPaymentRequest = this._btnPrintPaymentRequest.bind(this);
        this.btnPreviewNew = this._btnPreviewNew.bind(this);
        this.btnChangeBranch = this._btnChangeBranch.bind(this);
        this.btnChangeOpportunity = this._btnChangeOpportunity.bind(this);
        this.btnReSyncOdoo = this._btnReSyncOdoo.bind(this);
        this.btnRequestApprove = this._btnRequestApprove.bind(this);
        this.btnRequestConfirmPayment = this._btnRequestConfirmPayment.bind(this);
        this.btnPhuLucHopDong = this._btnPhuLucHopDong.bind(this);
        this.btnThoaThuanHopDong = this._btnThoaThuanHopDong.bind(this);
        this.btnConfirm24h = this._btnConfirm24h.bind(this);
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
                    title: item.id + ' - ' + item.name + " - " + item.email,
                    cross_sale_assign_id: item.cross_sale_assign_id
                }
            });
            this.setState({employer_list: employer_list, loading_getEmployer: false});
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
        //todo
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

    async _getListCampaign(type_campaign = Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.default) {
        const {configForm} = this.state;
        const isCrossSelling = configForm.includes("cross_selling");
        const sales_order_type =
            Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift === type_campaign
                ? Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift
                : Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.default;

        const res = await getListAccountantCampaign({
            status: Constant.STATUS_ACTIVED,
            per_page: 999,
            filter_expired: true,
            sales_order_type: isCrossSelling ? sales_order_type : null
        });
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

    async _getStaffHeadhunt() {
        const res = await getStaffHeadhunt();
        if (res) {
            const staff = Array.isArray(res) ?
                res?.map(_ => {
                    return {
                        title: `${_?.code || ""} ${_?.code ? ` - ${_?.display_name}` : `${_?.display_name}`}`,
                        value: _?.id,
                        code: _?.code,
                    }
                }) : [];
            this.setState({staff_list: staff})
        }
    }

    async _getListStaffAll() {
        const res = await getTeamMember({per_page: 999});
        if (res) {
            const staff = Array.isArray(res) ?
                res?.map(_ => {
                    return {
                        title: `${_?.code || ""} ${_?.code ? ` - ${_?.display_name}` : `${_?.display_name}`}`,
                        value: _?.id,
                        code: _?.code,
                    }
                }) : [];
            this._setOpportunity(staff);
            this.setState({staff_list_all: staff});
        }
    }

    async _getSalesOrder(id) {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await getDetailSalesOrder({id: id, type: Constant.SALES_ORDER_TYPE});
        if (res) {

            if (Number(res?.type_assignment) === Constant.TYPE_ASSIGNMENT_HEADHUNT) {
                this._getStaffHeadhunt();
            }

            if(res?.invoice_issuance_method){
                let object_required = this.state.object_required
                if(res?.invoice_issuance_method === Constant.NO_NEED_INVOICE_ISSUANCE){
                    object_required = object_required.filter((item) => item !== "email_e_invoices");
                }else{
                    object_required.push("email_e_invoices")
                }
                this.setState({object_required: object_required});
            }

            if(res.accountant_customer_id !==0 && res.accountant_customer_id){
                this._getListAccountCustomer({id: res.accountant_customer_id});
            }else{
                this._getListAccountCustomer({id: res.accountant_customer_id , status:[Constant.STATUS_ACTIVED, Constant.STATUS_INACTIVED]});
            }
            this._getListEmployer(res?.employer_id);
            this.setState({object: res, so_payment_term_method: res?.payment_term_method});
            this.setState({is_showPackage: true});
            this._getListOpportunity(res?.revenue_by_staff_code);
            this._getStaffCrossSellingFirst();
            this._getListCampaign(res.type_campaign);
            this._getCampaignDetail(res.campaign_id);
        }
        uiAction.hideLoading();
    }

    async _getStaffCrossSelling(id) {
        const {configForm} = this.state;
        const isCrossSelling = configForm.includes("cross_selling");
        if (isCrossSelling && id > 0) {
            const res = await getCustomerListNewIgnoreChannelCode({ids: [id], execute: 1});
            if (res && res?.length > 0) {
                const [first] = res || [];
                const staffs = [{
                    title: `${first?.code || ""} ${first?.code ? ` - ${first?.display_name}` : `${first?.display_name}`}`,
                    value: first?.id,
                }]
                this.setState({staffCrossSelling: first, staffsCrossSelling: staffs});
            }
        }

    }

    async _getStaffCrossSellingFirst() {
        let params = queryString.parse(window.location.search);
        const {object} = this.state;
        const employerId = params['employer_id'] ? params['employer_id'] : object?.employer_id;
        const args = {
            q: employerId,
            status_not: Constant.STATUS_DELETED,
            per_page: 10,
            page: 1
        };

        const res = await getList(args);
        if (res) {
            const id_cross_selling = res.items.find(_ => Number(_.id) === Number(employerId))?.cross_sale_assign_id;
            this._getStaffCrossSelling(id_cross_selling);
        }

    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        /*
        * Lần đầu chọn phiếu thường nhấn hoàn thành sẽ báo lỗi cần chọn opportunity
        * Đổi lại thành phiếu tặng thì xóa lỗi đi
        */
        if (name === 'type_campaign') {
            if (Number(value) === Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift) {
                delete object_error["opportunity_new_id"];
            }
            this._getListCampaign(value);
        }
        if (name === 'invoice_issuance_method') {
            let object_required = this.state.object_required
            if(value == Constant.NO_NEED_INVOICE_ISSUANCE){
                object_required = object_required.filter((item) => item !== "email_e_invoices");
                delete object_error["email_e_invoices"];
            }else{
                object_required.push("email_e_invoices")
            }
            this.setState({object_required: object_required}, () => console.log(object_required));
        }
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;

        if (name === 'payment_method' && (!value || parseInt(value) === Constant.PAYMENT_TERM_METHOD_CK)) {
            delete object['payment_info'];
        } else if (name === 'registration_expired_at' && object.id) {
            /*
            * Khi có sự thay đổi của Ngày hết hạn kích hoạt
            * thì thêm field updated_by để  BE check thôn tin User thay đổi
            */
            object['update_registration_expired'] = true
        }
        if (name === 'revenue_by_staff_id') {
            const {staff_list_all} = this.state;
            const staff_code = staff_list_all.find(s => Number(s.value) === Number(value))?.code;
            this._getListOpportunity(staff_code);
        }
        if (name === 'employer_id') {
            const {employer_list} = this.state;
            const cross_sale_assign_id = employer_list.find(s => Number(s.value) === Number(value))?.cross_sale_assign_id;
            this._getStaffCrossSelling(cross_sale_assign_id)
            object['cross_sale_by_staff_id'] = cross_sale_assign_id;
            object['cross_sale_receive_value_percent'] = 50;
        }

        if (name === 'type_assignment') {
            if (Number(value) === Constant.TYPE_ASSIGNMENT_HEADHUNT) {
                this._getStaffHeadhunt();
            } else {
                this._getListStaff();
            }
        }

        if (name === 'campaign_id') {
            this._getCampaignDetail(value);
        }
        this.setState({object: object});
    }

    async _onSave(object, object_required) {
        const {uiAction, history, user} = this.props;
        const {staff_list_all, staff_list, configForm, staffCrossSelling, campaign_info} = this.state;
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
        object.sales_order_type = Constant.SALES_ORDER_TYPE;
        object.package = object.package || Constant.SALES_ORDER_PACKAGE;

        const isCustomerCare = [
            Constant.DIVISION_TYPE_customer_care_member,
            Constant.DIVISION_TYPE_customer_care_leader
        ].includes(user?.division_code);
        const userId = user?.data?.id;

        if (isCustomerCare && !object.revenue_by_staff_id && userId) {
            object.revenue_by_staff_id = userId;
        }

        if (Number(object?.type_assignment) === Constant.TYPE_ASSIGNMENT_HEADHUNT) {
            object.revenue_by_staff_code = staff_list.find(s => Number(s.value) === Number(object.revenue_by_staff_id))?.code;
        } else {
            object.revenue_by_staff_code = staff_list_all.find(s => Number(s.value) === Number(object.revenue_by_staff_id))?.code;
        }

        if(!object.email_e_invoices){
            object.email_e_invoices = []
        }

        const isCrossSelling = configForm.includes("cross_selling");
        if (isCrossSelling) {
            object['cross_sale_by_staff_code'] = staffCrossSelling?.code;
            object['cross_sale_by_staff_id'] = staffCrossSelling?.id;
            object['cross_sale_receive_value_percent'] = 50;
        }

        if (!object?.campaign_id || parseInt(campaign_info?.type) <= 0) {
            delete object['cross_sale_by_staff_code'];
            delete object['cross_sale_by_staff_id'];
            delete object['cross_sale_receive_value_percent'];
        }

        // check required CSKH cross selling
        const showStaffCrossSelling = parseInt(campaign_info?.type) > 0;
        if (showStaffCrossSelling && !(parseInt(object['cross_sale_by_staff_id']) > 0)) {
            uiAction.putToastError("Vui lòng cập nhật thông tin CKSH bán hàng");
            uiAction.hideLoading();
            return;
        }

        if (!object.id) {
            const res = await createSalesOrder(object);
            if (res) {
                uiAction.putToastSuccess("Thao tác thành công!");
                history.push(`${Constant.BASE_URL_EDIT_SALES_ORDER}?id=${res?.id}`);
                this._getSalesOrder(res?.id);
            }
            uiAction.hideLoading();
        } else {
            const res = await updateSalesOrder(object);
            if (res) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList(Constant.IDKEY_DISCOUNT_RECONTRACT);
                this.setState({so_payment_term_method: object?.payment_term_method})
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
            title: "Bạn có chắc muốn xóa phiếu đăng ký ?",
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

    _btnChangeBranch() {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupChangeBranch, "Chọn thông tin công ty", {sales_order: this.state.object});
    }

    _btnChangeOpportunity() {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupChangeOpportunity, "Chọn thông tin Opportunity", {
            sales_order: this.state.object,
            listStaffAll: this.state.staff_list_all || []
        });
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

    async _btnPrintContractWord() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrderWord({id: this.state.object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPrintContractOriginal() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrderOriginal({sales_order_id: this.state.object.id});
        if (res) {
            window.open(res?.file_preview, "_blank",);
            setTimeout(function () {
                window.open(res?.file_print_contract, "_blank",);
            }, 500);
        }
        uiAction.hideLoading();
    }

    async _btnPrintPaymentRequest() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printPaymentRequest({id: this.state.object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPreviewNew() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrderNew({id: this.state.object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    _btnCopy() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn sao chép phiếu đăng ký này ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await duplicateSalesOrder({id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    const url = Constant.BASE_URL_EDIT_SALES_ORDER + "?id=" + res.id;
                    window.open(url, "_blank");
                }
                uiAction.hideSmartMessageBox();
                uiAction.hideLoading();
            }
        });
    }

    _btnComplete() {
        const {uiAction} = this.props;
        const {object, object_required} = this.state;
        const isRoot = this.props.user?.division_code === Constant.DIVISION_TYPE_admin;
        const objectRequired = JSON.parse(JSON.stringify(object_required));

        //   if (Number(object?.type_campaign) !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift) {
        //       /* Theo define thì lúc hoàn thành check required opportuniry */
        //       objectRequired.push('opportunity_new_id');
        //   }

        let check = utils.checkOnSaveRequired(object, objectRequired);
        /*
        * Không required opportunity dưới dev (task VHCRMV2-905)
        * Trên production:
        * - Không cần để key REACT_APP_NOT_REQUIRED_OPPORTUNITY
        * - Nhưng các account (trừ root) trên production phải required field opportunity
        * - Dưới dev thì tất cả account không cần required
        */
        /*
         * - Là phiếu tặng thì không cần required field opportunity_new_id (VHCRMV2-1349)
        */
        if ((check.error && !process.env.REACT_APP_NOT_REQUIRED_OPPORTUNITY && !isRoot) || (check.error && Number(object?.type_campaign) !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift && !isRoot)) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        } else {
            uiAction.SmartMessageBox({
                title: "Bạn có chắc muốn hoàn thành phiếu đăng ký ?",
                content: "",
                buttons: ['No', 'Yes']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    uiAction.hideSmartMessageBox();
                    uiAction.showLoading();
                    const res = await completeSalesOrder({id: this.state.object.id});
                    if (res) {
                        uiAction.putToastSuccess("Thao tác thành công!");
                        const params = queryString.parse(window.location.search);
                        if (params['id']) {
                            this._getSalesOrder(params['id']);
                        }
                    }
                    uiAction.hideLoading();
                }
            });
        }
    }

    // _btnCancel() {
    //     this.props.uiAction.createPopup(PopupCancelSalesOrder, "Hủy Phiếu Đăng Ký", {object: this.state.object});
    // }

    _btnAddCustomer() {
        const newObj = Object.assign({}, this.state.object);
        this.setState({name_focus: ""});
        this.props.uiAction.createPopup(PopupCustomer, "Thêm Khách Hàng Kế Toán", {
            isSelect: true,
            changeCustomer: (customer) => {
                const filteredListEmail = this.state.object?.email_e_invoices?.filter((itmEmail) => !this.state.custom_email_e_invoices?.includes(itmEmail))
                const customEmails = customer?.email_e_invoices ? customer?.email_e_invoices : []
                newObj["email_e_invoices"] =  [...filteredListEmail, ...customEmails];
                this.setState({customer: customer, object: newObj, custom_email_e_invoices: customEmails});
                this._getListAccountCustomer({id: customer.id});
            }
        });
    }

    _btnRequestApprove() {
        const {uiAction} = this.props;
        const channelCodeCurrent = _.get(this.props, "branch.currentBranch.channel_code".split("."), null);

        uiAction.SmartMessageBox({
            title: "Xác nhận gửi yêu cầu duyệt PĐK. Bạn có muốn upload chứng từ?",
            content: "",
            buttons: ['Hủy', 'Không', 'Có']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Có") {
                uiAction.hideSmartMessageBox();
                uiAction.createPopup(PopupRequestApprove, "Upload chứng từ", {
                    id: this.state.object.id,
                    object: this.state.object,
                    channelCode: channelCodeCurrent,
                    idKey: idKey
                })
            } else if (ButtonPressed === "Không") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await requestApprove({sales_order_id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish('.refresh', {}, idKey);
                }
                uiAction.hideLoading();
            } else {
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _btnRequestConfirmPayment() {
        const {uiAction} = this.props;
        const {object} = this.state;
        uiAction.SmartMessageBox({
            title: `
            ${
                Number(object.confirm_payment_status) === Constant.CONFIRM_PAYMENT_STATUS_SENT_MAIL_AND_WAITING_CONFIRM
                    ? "Bạn có chắc muốn gửi lại xác nhận chờ thanh toán đăng ký?"
                    : "Bạn có chắc muốn xác nhận chờ thanh toán đăng ký?"
            }
            `,
            content: "",
            buttons: ['Hủy', 'Không', 'Có']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Có") {
                uiAction.hideSmartMessageBox();
                uiAction.createPopup(PopupRequestConfirmPayment, "Upload chứng từ", {
                    id: this.state.object.id,
                    object: this.state.object,
                    idKey,
                })
            } else if (ButtonPressed === "Không") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await requestConfirmPayment({sales_order_id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish('.refresh', {}, idKey);
                }
                uiAction.hideLoading();
            } else {
                uiAction.hideSmartMessageBox();
            }
        });
    }

    async _btnReSyncOdoo() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await salesOrderReSyncOdoo({sales_order_id: this.state.object.id});
        if (res) {
            uiAction.putToastSuccess("Lệnh bắn thành công");
        }
        uiAction.hideLoading();
    }

    async _getAppliedPromotions(id) {
        const res = await getPromotionProgramAppliedsBySalesOrder({sales_order_id: id});
        if (res) {
            this.setState({applied: res});
        }
    }

    async _btnPhuLucHopDong() {
        const {uiAction} = this.props;

        uiAction.showLoading();
        const res = await previewContractAddendum({id: this.state.object.id});
        if (res?.url) {
            window.open(res?.url)
        }
        uiAction.hideLoading();
    }

    async _btnThoaThuanHopDong() {
        const {uiAction} = this.props;

        uiAction.showLoading();
        const res = await previewReportDeal({id: this.state.object.id});
        if (res?.url) {
            window.open(res?.url)
        }
        uiAction.hideLoading();
    }

    async _btnConfirm24h() {
        const {uiAction} = this.props;

        uiAction.showLoading();
        const res = await previewReportConfirm({id: this.state.object.convert_from_id});
        if (res?.url) {
            window.open(res?.url)
        }
        uiAction.hideLoading();
    }

    async _getListOpportunity(value) {
        if (value) {
            const params = {
                level: [5],
                per_page: 100,
            }
            // Neu them moi chi lay 5, neu edit lay them 5678 de show ra.
            if (this.state.object?.id && ![
                Constant.SALE_ORDER_INACTIVE,
                Constant.SALE_ORDER_NOT_COMPLETE,
            ].includes(parseInt(this.state.object?.status))) {
                params.level = [5, 6, 7, 8];
            }
            if (this.state.object?.status === Constant.SALE_ORDER_ACTIVED) {
                params.include_so_id = this.state.object?.id;
            }
            const res = await getListOpportunityCanUse(params);
            if (res && Array.isArray(res?.items)) {
                const opportunity = res?.items.map(item => {
                    return {title: `${item?.id} - ${item?.employer_name} - ${item?.name}`, value: item.id}
                })
                this.setState({opportunity});
            } else {
                this.setState({opportunity: []});
            }
        } else {
            this.setState({opportunity: []});
        }
    }

    _setOpportunity(staffAll) {
        const {user} = this.props;
        const isCustomerCare = [
            Constant.DIVISION_TYPE_customer_care_member,
            Constant.DIVISION_TYPE_customer_care_leader
        ].includes(user?.division_code);
        const userId = isCustomerCare ? user?.data?.id : 0;

        if (isCustomerCare && userId) {
            const staff_code = staffAll.find(s => Number(s.value) === Number(userId))?.code;
            this._getListOpportunity(staff_code);
        }
    }

    async _getCampaignDetail(id) {
        if (!id) {
            this.setState({campaign_info: {}});
            return false;
        }
        const res = await getDetailAccountantCampaign({campaign_id: id});
        if (res) {
            this.setState({campaign_info: res?.info});
        }
    }

    async _getConfig() {
        const res = await getListConfig({code: Constant.CONFIG_FLAG_QRCODE_CODE});
        if (res && res?.items?.length > 0) {
            const [config] = res?.items;
            this.setState({
                flagQrCode: Number(config?.value) === Constant.CONFIG_FLAG_QRCODE_LOAD,
            });
        }
    }

    async _getConfigChangeArea() {
        const res = await getListConfig({code: Constant.CONFIG_CHANGE_AREA_REGISTRATION_CODE});
        if (res && res?.items?.length > 0) {
            const [configAreaChange] = res?.items;
            this.setState({
                areaChangeRegistrationCode: Number(configAreaChange?.value),
            });
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
            this._getStaffCrossSellingFirst();
        }
        this._getListCampaign();
        this._getListStaff();
        this._getListStaffAll();
        this._getConfig();
        this._getConfigChangeArea();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {user, history} = this.props;
        const channelCodeCurrent = _.get(this.props, "branch.currentBranch.channel_code".split("."), null);
        let {
            object,
            object_error,
            object_required,
            name_focus,
            customer,
            employer_list,
            customer_list,
            campaign_list,
            flagQrCode,
            staff_list,
            loading_getEmployer,
            loading_getCustomer,
            is_showPackage,
            configPackageBySite,
            applied,
            opportunity,
            so_payment_term_method,
            configForm,
            staffCrossSelling,
            staffsCrossSelling,
            campaign_info,
            areaChangeRegistrationCode,
        } = this.state;
        let sales_order_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_status);
        let list_invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_invoice_issuance_method);
        let list_is_signature = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_is_signature);
        let list_payment_term_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_term_method);
        let list_payment_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_method);
        let list_type_campaign = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_campaign);
        let list_sales_order_package = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_package);
        const branch_name = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_branch_name);
        let title = object.id ? "Cập Nhật Phiếu Đăng Ký: " + object.id + ' - ' + sales_order_status[object.status] : "Tạo Phiếu Đăng Ký";
        
        const taxRate = (100 + Number(object.vat_percent))/100;
        const totalAmount =  object.is_include_tax === true ?  object.total_amount_unit/taxRate : object.total_amount_unit;
        const totalAmountIncludedTax = object.is_include_tax === true ? object.total_amount_unit : object.total_amount_unit*taxRate;
        const totalTax = totalAmountIncludedTax - totalAmount;

        if (parseInt(object.payment_method) === Constant.PAYMENT_TERM_METHOD_TM) {
            object_required.push('payment_info');
        } else {
            object_required = object_required.filter(c => c !== 'payment_info');
        }
        const isCrossSelling = configForm.includes("cross_selling");
        const isCampaign = Number(object?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT || (isCrossSelling && [Constant.CAMPAIGN_TYPE_DEFAULT, Constant.CAMPAIGN_TYPE_GIFT].includes(Number(object?.type_campaign)));
        if (Number(object?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT) {
            object_required.push('campaign_id');
        }

        const showStaffCrossSelling = parseInt(campaign_info?.type) > 0;

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

        const isDisableOrderedOn = ![
            Constant.SALE_ORDER_NOT_COMPLETE,
            Constant.SALE_ORDER_INACTIVE
        ].includes(Number(object.status)) && object.status;

        const isRequestApprove = [Constant.SALE_ORDER_INACTIVE].includes(parseInt(object?.status)) &&
            (
                (
                    Number(so_payment_term_method) === Constant.PAYMENT_METHOD_PAY_NOW &&
                    Number(object?.payment_status) === Constant.PAYMENT_STATUS_PAID
                )
                ||
                (
                    Number(object?.payment_term_method) === Constant.PAYMENT_METHOD_PAY_NOW &&
                    Number(object?.payment_status) === Constant.PAYMENT_STATUS_NOT_PAID &&
                    Number(object?.confirm_payment_status) === Constant.CONFIRM_PAYMENT_STATUS_CONFIRMED
                )
                ||
                (
                    Number(object?.payment_term_method) === Constant.PAYMENT_METHOD_PAY_NOW &&
                    Number(object?.payment_status) === Constant.PAYMENT_STATUS_PAID_A_PART &&
                    Number(object?.confirm_payment_status) === Constant.CONFIRM_PAYMENT_STATUS_CONFIRMED
                )
                ||
                Number(so_payment_term_method) !== Constant.PAYMENT_METHOD_PAY_NOW
            ) && flagQrCode;

        const isRequestConfirmPayment = [Constant.SALE_ORDER_INACTIVE].includes(parseInt(object?.status)) &&
            (
                (
                    Number(object?.payment_term_method) === Constant.PAYMENT_METHOD_PAY_NOW &&
                    Number(object?.payment_status) === Constant.PAYMENT_STATUS_NOT_PAID
                )
                ||
                (
                    Number(object?.payment_term_method) === Constant.PAYMENT_METHOD_PAY_NOW &&
                    Number(object?.payment_status) === Constant.PAYMENT_STATUS_PAID_A_PART
                )
            ) && flagQrCode
            && (
                Number(object?.confirm_payment_status) === Constant.CONFIRM_PAYMENT_STATUS_SENT_MAIL_AND_WAITING_CONFIRM || !object?.confirm_payment_status
            );
        const isExchange = Number(object?.type_campaign) === Constant.CAMPAIGN_TYPE_EXCHANGE;
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
                                            <DateTimePicker name="ordered_on" label="Ngày ghi nhận"
                                                            required={object_required.includes('ordered_on')}
                                                            value={object.ordered_on} error={object_error.ordered_on}
                                                            nameFocus={name_focus}
                                                            onChange={this.onChange}
                                                            readOnly={isDisableOrderedOn}
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
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <DateTimePicker name="registration_expired_at"
                                                            label="Ngày hết hạn kích hoạt"
                                                            beforeApply={{
                                                                title: (value) => `Các gói dịch vụ chưa được kích hoạt đến ngày ${moment.unix(value).format("DD/MM/YYYY")} sẽ không được kích hoạt nữa. Xác nhận chọn ngày hết hạn kích hoạt ?`,
                                                                content: ""
                                                            }}
                                                            minDate={moment()}
                                                            required={object_required.includes('registration_expired_at')}
                                                            value={object.registration_expired_at || null}
                                                            error={object_error.registration_expired_at}
                                                            nameFocus={name_focus}
                                                            onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox label="Miền"
                                                 data={branch_name}
                                                 value={object.branch_code}
                                                 readOnly
                                        />
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
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Dropbox name="opportunity_new_id" label="Opportunity"
                                                 data={opportunity || []}
                                            // required={object_required.includes('opportunity_new_id') && Number(object?.type_campaign) !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift }
                                                 value={object.opportunity_new_id}
                                                 error={Number(object?.type_campaign) !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift ? object_error.opportunity_new_id : ""}
                                                 nameFocus={name_focus}
                                                 onChange={this.onChange}
                                                 readOnly={object?.status === Constant.SALE_ORDER_ACTIVED}
                                                 timeOut
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
                                                     const newObj = Object.assign({}, this.state.object);
                                                     let customer_list = this.state.customer_list.filter(c => c.value === value);
                                                     let customer = customer_list[0] ? customer_list[0].item : {};
                                                     const filteredListEmail = this.state.object?.email_e_invoices?.filter((itmEmail) => !this.state.custom_email_e_invoices?.includes(itmEmail))
                                                     const customEmails = customer?.email_e_invoices ? customer?.email_e_invoices : []
                                                     newObj["email_e_invoices"] =  [...filteredListEmail, ...customEmails];
                                                     this.setState({customer: customer, object: newObj, custom_email_e_invoices: customEmails});
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
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <InputTags type="text"
                                            name="email_e_invoices"
                                            label="Email nhận hóa đơn"
                                            required={object_required.includes('email_e_invoices')}
                                            keyPress={[',', 'Enter', 'Tab']}
                                            nameFocus={name_focus}
                                            value={object?.email_e_invoices || []}
                                            error={object_error.email_e_invoices}
                                            onChange={this.onChange}
                                            isEmail
                                        />
                                    </div>
                                    <CanAction actionCode={ROLES.customer_care_sales_order_update_staff}>
                                        {!isCustomerCare && (
                                            <div className="col-sm-12 col-xs-12 mb10">
                                                <Dropbox name="type_assignment"
                                                         label="Chọn loại CSKH ghi nhận doanh thu"
                                                         data={Constant.TYPE_ASSIGNMENT_LIST}
                                                         required={object_required.includes('type_assignment')}
                                                         nameFocus={name_focus}
                                                         value={object.type_assignment}
                                                         error={object_error.type_assignment}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                        )}
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            {staff_list && (
                                                <Dropbox name="revenue_by_staff_id" label="CSKH ghi nhận doanh thu"
                                                         data={staff_list}
                                                         required={object_required.includes("revenue_by_staff_id")}
                                                         value={object.revenue_by_staff_id}
                                                         error={object_error.revenue_by_staff_id}
                                                         nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            )}
                                        </div>
                                    </CanAction>
                                    {showStaffCrossSelling && (
                                        <>
                                            <div className="col-sm-8 col-xs-12 mb10">
                                                <Dropbox name="cross_sale_by_staff_id" label="CSKH bán hàng"
                                                         data={staffsCrossSelling}
                                                         required
                                                         value={staffCrossSelling?.id}
                                                         error={object_error.cross_sale_by_staff_id}
                                                         nameFocus={name_focus}
                                                         readOnly
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                            <div className="col-sm-4 col-xs-12 mb10">
                                                <Input2 type="text" isNumber label="Giá trị nhận(%)"
                                                        name={"cross_sale_receive_value_percent"} value={50}
                                                        required
                                                        readOnly/>
                                            </div>
                                        </>
                                    )}
                                    <div className="col-xs-12 col-sm-12">
                                        {object.total_amount_info && (
                                            <React.Fragment>
                                                <div className="col-sm-12 col-xs-12 sub-title-form padding0 mb10">
                                                    <span>Thành tiền ({utils.formatNumber(Math.round(totalAmountIncludedTax), 0, ".", "đ")})</span>
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
                                                {/* Giảm trên thành tiền phiếu trước giảm */}
                                                {applied?.filter(a => Number(a?.position_allocate) < Constant.PROMOTION_PROGRAMS_POSITION_ALLOCATE_AFTER)?.map((a, idx) => (
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10"
                                                         key={idx.toString()}>
                                                        <div className="col-sm-6 col-xs-6 padding0">{a?.title}</div>
                                                        <div className="col-sm-6 col-xs-5 number-money textRed">
                                                            <span>- {utils.formatNumber(a?.discount_amount, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                ))}
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
                                                {/* Giảm trên thành tiền phiếu sau giảm */}
                                                {applied?.filter(a => Number(a?.position_allocate) >= Constant.PROMOTION_PROGRAMS_POSITION_ALLOCATE_AFTER)?.map((a, idx) => (
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10"
                                                         key={idx.toString()}>
                                                        <div className="col-sm-6 col-xs-6 padding0">{a?.title}</div>
                                                        <div className="col-sm-6 col-xs-5 number-money textRed">
                                                            <span>- {utils.formatNumber(a?.discount_amount, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Tổng tiền*/}
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
                                                            <span>{utils.formatNumber(Math.round(totalTax) ,0,".","đ")}</span>
                                                        </div>
                                                    </div>
                                                </>}
                                                
                                                <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                    <div className="col-sm-6 col-xs-6 text-bold px-0 pt-10">Tổng tiền {object.is_include_tax === false && 'sau thuế'}</div>
                                                    <div className="col-sm-6 col-xs-6 number-money last pt-10">
                                                        <span>{utils.formatNumber(Math.round(totalAmountIncludedTax), 0, ".", "đ")}</span>
                                                    </div>
                                                </div>
                                                {/* Credit áp dụng */}
                                                {object?.credit_apply ? (
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                        <div className="col-sm-6 col-xs-6 padding0">Credit áp dụng</div>
                                                        <div className="col-sm-6 col-xs-6 number-money">
                                                            <span
                                                                className="text-red">- {utils.formatNumber(object.credit_apply, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                  {/* Tổng điểm dịch vụ đã quy đổi*/}
                                                 
                                                  {Number(object.type_campaign) === Constant.CAMPAIGN_TYPE_CONVERT_POINT && 
                                                  <div className="col-sm-12 col-xs-12  row-content padding0 mb10">
                                                    <div className="col-sm-6 col-xs-6 text-bold padding0">Số điểm dịch vụ đã quy đổi</div>
                                                    <div className="col-sm-6 col-xs-6 text-bold text-right">
                                                        <span>{utils.formatNumber(object?.point_converted, 0, ".", "đ")}</span>
                                                    </div>
                                                </div>}

                                                {/* Tổng tiền sau credit*/}
                                                {object?.credit_apply ? (
                                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                                        <div className="col-sm-6 col-xs-6 text-bold padding0">Phải thanh
                                                            toán
                                                        </div>
                                                        <div className="col-sm-6 col-xs-6 number-money last">
                                                            <span>{utils.formatNumber(object.total_amount_credit_apply, 0, ".", "đ")}</span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12">
                                    <div className="text-right mb15 mr15">
                                        {![Constant.SALE_ORDER_DELETED].includes(parseInt(object.status)) && (
                                            <React.Fragment>
                                                {!([Constant.SALE_ORDER_ACTIVED].includes(parseInt(object.status))) &&
                                                    <button type="button"
                                                            className="el-button el-button-primary el-button-small"
                                                            onClick={() => {
                                                                this.onSave(object, object_required)
                                                            }}>
                                                        <span>Lưu lại</span>
                                                    </button>
                                                }
                                                {[Constant.SALE_ORDER_ACTIVED].includes(parseInt(object.status)) &&
                                                    <CanRender actionCode={ROLES.customer_care_sales_order_save}>
                                                        <button type="button"
                                                                className="el-button el-button-primary el-button-small"
                                                                onClick={() => {
                                                                    this.onSave(object, object_required)
                                                                }}>
                                                            <span>Lưu lại</span>
                                                        </button>
                                                    </CanRender>
                                                }
                                                {is_showPackage && (
                                                    <React.Fragment>
                                                        {[
                                                            Constant.SALE_ORDER_NOT_COMPLETE,
                                                            Constant.SALE_ORDER_INACTIVE,
                                                            Constant.SALE_ORDER_ACTIVED,
                                                            Constant.SALE_ORDER_EXPIRED,
                                                            Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                                        ].includes(parseInt(object.status)) && (
                                                            <>
                                                                <CanRender
                                                                    actionCode={ROLES.customer_care_sales_order_preview_sales_order}>
                                                                    <button type="button"
                                                                            className="el-button el-button-primary el-button-small"
                                                                            onClick={this.btnPreview}>
                                                                        <span>In phiếu</span>
                                                                    </button>
                                                                </CanRender>
                                                                <CanRender
                                                                    actionCode={ROLES.customer_care_sales_order_preview_sales_order_new}>
                                                                    <button type="button"
                                                                            className="el-button el-button-primary el-button-small"
                                                                            onClick={this.btnPreviewNew}>
                                                                        <span>In phiếu (New)</span>
                                                                    </button>
                                                                </CanRender>
                                                            </>
                                                        )}
                                                        {[
                                                            Constant.SALE_ORDER_INACTIVE,
                                                            Constant.SALE_ORDER_ACTIVED,
                                                            Constant.SALE_ORDER_EXPIRED,
                                                            Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                                        ].includes(parseInt(object.status)) && (
                                                            <>
                                                                <CanRender
                                                                    actionCode={ROLES.customer_care_sales_order_print_contract}>
                                                                    <button type="button"
                                                                            className="el-button el-button-primary el-button-small"
                                                                            onClick={this.btnPrint}>
                                                                        <span>In hợp đồng</span>
                                                                    </button>
                                                                </CanRender>
                                                                <CanRender
                                                                    actionCode={ROLES.customer_care_sales_order_print_contract_word}>
                                                                    <button type="button"
                                                                            className="el-button el-button-primary el-button-small"
                                                                            onClick={this.btnPrintContractWord}>
                                                                        <span>In hợp đồng khác mẫu</span>
                                                                    </button>
                                                                </CanRender>
                                                                {Constant.SALE_ORDER_CANCEL !== parseInt(object.status) && (
                                                                    <CanRender
                                                                        actionCode={ROLES.customer_care_sales_order_print_payment_request}>
                                                                        <button type="button"
                                                                                className="el-button el-button-primary el-button-small"
                                                                                onClick={this.btnPrintPaymentRequest}>
                                                                            <span>In phiếu đề nghị thanh toán</span>
                                                                        </button>
                                                                    </CanRender>
                                                                )}
                                                                {!(Constant.SALE_ORDER_INACTIVE === parseInt(object.status)) && (
                                                                    <CanRender
                                                                        actionCode={ROLES.customer_care_sales_order_print_contract_original}>
                                                                        <button type="button"
                                                                                className="el-button el-button-primary el-button-small"
                                                                                onClick={this.btnPrintContractOriginal}>
                                                                            <span>In HD/Phiếu (Gốc)</span>
                                                                        </button>
                                                                    </CanRender>
                                                                )}
                                                            </>
                                                        )}
                                                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(object.status)) && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_complete}>
                                                                <button type="button"
                                                                        className="el-button el-button-success el-button-small"
                                                                        onClick={() => this.btnComplete(object, object_required)}>
                                                                    <span>Hoàn thành</span>
                                                                </button>
                                                            </CanRender>
                                                        )}
                                                        {isRequestApprove && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_request_approve}>
                                                                <button type="button"
                                                                        className="el-button el-button-bricky el-button-small"
                                                                        onClick={this.btnRequestApprove.bind(this)}>
                                                                    <span>
                                                                        {
                                                                            Number(object?.request_approve_status) !== Constant.REQUEST_APPROVE
                                                                                ? "Yêu cầu duyệt PĐK"
                                                                                : "Gửi lại Y/C duyệt PĐK"
                                                                        }
                                                                    </span>
                                                                </button>
                                                            </CanRender>
                                                        )}
                                                        {
                                                            isRequestConfirmPayment && (
                                                                <CanRender
                                                                    actionCode={ROLES.customer_care_sales_order_waiting_confirm_payment}>
                                                                    <button type="button"
                                                                            className="el-button el-button-bricky el-button-small"
                                                                            onClick={this.btnRequestConfirmPayment.bind(this)}>
                                                                        <span>
                                                                            {
                                                                                Number(object?.confirm_payment_status) === Constant.CONFIRM_PAYMENT_STATUS_SENT_MAIL_AND_WAITING_CONFIRM
                                                                                    ? "Gửi lại xác nhận chờ thanh toán"
                                                                                    : "Gửi xác nhận chờ thanh toán"
                                                                            }

                                                                        </span>
                                                                    </button>
                                                                </CanRender>
                                                            )
                                                        }
                                                        <CanRender actionCode={ROLES.customer_care_sales_order_copy}>
                                                            <button type="button"
                                                                    className="el-button el-button-primary el-button-small"
                                                                    onClick={this.btnCopy}>
                                                                <span>Sao chép</span>
                                                            </button>
                                                        </CanRender>
                                                        {/*Hủy phiếu chỉ chạy trên vtn*/}
                                                        {/*{![Constant.STATUS_ACTIVED].includes(parseInt(object.status)) && (*/}
                                                        {/*    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnCancel}>*/}
                                                        {/*        <span>Hủy phiếu</span>*/}
                                                        {/*    </button>*/}
                                                        {/*)}*/}
                                                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(object.status)) && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_delete}>
                                                                <button type="button"
                                                                        className="el-button el-button-bricky el-button-small"
                                                                        onClick={this.btnDelete}>
                                                                    <span>Xóa phiếu</span>
                                                                </button>
                                                            </CanRender>
                                                        )}
                                                        {[Constant.STATUS_ACTIVED, Constant.STATUS_COMPLETE].includes(parseInt(object.status)) && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_update}>
                                                                <button type="button"
                                                                        className="el-button el-button-primary el-button-small"
                                                                        onClick={this.btnChangeCustomer}>
                                                                    <span>Đổi thông tin xuất HĐ</span>
                                                                </button>
                                                            </CanRender>
                                                        )}
                                                        {![
                                                            Constant.SALE_ORDER_DISABLED,
                                                            Constant.SALE_ORDER_CANCEL,
                                                            Constant.SALE_ORDER_ACTIVED,
                                                        ].includes(parseInt(object.status)) && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_change_branch_code}>
                                                                <button type="button"
                                                                        className="el-button el-button-primary el-button-small"
                                                                        onClick={this.btnChangeBranch}>
                                                                    <span>Đổi miền</span>
                                                                </button>
                                                            </CanRender>
                                                        )}
                                                        {
                                                            object?.is_unearned &&
                                                            <button type="button"
                                                                    className="el-button el-button-primary el-button-small"
                                                                    onClick={this.btnPhuLucHopDong}>
                                                                <span>Phụ lục hợp đồng</span>
                                                            </button>
                                                        }
                                                        {
                                                            object?.is_unearned &&
                                                            <button type="button"
                                                                    className="el-button el-button-primary el-button-small"
                                                                    onClick={this.btnThoaThuanHopDong}>
                                                                <span>Thỏa thuận hợp đồng</span>
                                                            </button>
                                                        }
                                                        {
                                                            [Constant.STATUS_ACTIVED].includes(parseInt(object.status)) && object?.convert_from_id &&
                                                            <button type="button"
                                                                    className="el-button el-button-primary el-button-small"
                                                                    onClick={this.btnConfirm24h}>
                                                                <span>Xác nhận từ VL24H</span>
                                                            </button>
                                                        }
                                                        {[Constant.SALE_ORDER_ACTIVED].includes(parseInt(object.status)) && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_re_sync_odoo}>
                                                                <button type="button"
                                                                        className="el-button el-button-pink el-button-small"
                                                                        onClick={this.btnReSyncOdoo}>
                                                                    <span>Bắn thông tin phiếu qua Odoo</span>
                                                                </button>
                                                            </CanRender>
                                                        )}
                                                        {[
                                                            Constant.SALE_ORDER_ACTIVED,
                                                        ].includes(parseInt(object?.status)) && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_change_opportunity}>
                                                                <button type="button"
                                                                        className="el-button el-button-primary el-button-small"
                                                                        onClick={this.btnChangeOpportunity}>
                                                                    <span>Thay đổi Opportunity</span>
                                                                </button>
                                                            </CanRender>
                                                        )}

                                                        {[Constant.STATUS_ACTIVED].includes(parseInt(object.status)) && (
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_exchange}>
                                                                <Link
                                                                    to={Constant.BASE_URL_SALES_ORDER + "?action=exchange&id=" + object.id}>
                                                                    <span
                                                                        className="el-button el-button-bricky el-button-small"
                                                                        type={"button"}>
                                                                        Quy đổi đơn hàng
                                                                    </span>
                                                                </Link>
                                                            </CanRender>
                                                        )}
                                                    </React.Fragment>
                                                )}
                                            </React.Fragment>
                                        )}
                                    </div>
                                    <PopupForm onRef={ref => (this.popupReject = ref)}
                                               title={"Bổ sung thông tin in hợp đồng"}
                                               FormComponent={FormUpdate}
                                               initialValues={this.state.object}
                                               validationSchema={Yup.object().shape({
                                                   name_representative: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
                                                   position_representative: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                                               })}
                                               apiSubmit={updateOrderDetail}
                                               afterSubmit={this.afterSubmitAppend}
                                               hideAfterSubmit/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {is_showPackage && (
                    <React.Fragment>
                        {_.includes(configPackageBySite, "combo_post") && (
                            <ComboPost isChangeArea={object?.campaign_id == areaChangeRegistrationCode}
                                       sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "combo_package") && (
                            <ComboPackage isChangeArea={object?.campaign_id == areaChangeRegistrationCode}
                                          sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "subscription_package") && (
                            <SubscriptionPackage isChangeArea={object?.campaign_id == areaChangeRegistrationCode}
                                                 sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "bundle_package") && (
                            <BundlePackage isChangeArea={object?.campaign_id == areaChangeRegistrationCode}
                                           sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "product_group") && (
                            <GroupPackage isChangeArea={object?.campaign_id == areaChangeRegistrationCode}
                                          sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "jobbox_basic") && (
                            <JobBasicPackage sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "jobbox") && (
                            <JobPackage isChangeArea={object?.campaign_id == areaChangeRegistrationCode}
                                        sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "filter_resume_2018") && (
                            <EmployerPackage sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {/*Pharse sau sẽ mở*/}
                        {/*{_.includes(configPackageBySite, "service_point") && (*/}
                        {/*    <ServicePointPackage sales_order={object} channelCode={channelCodeCurrent} />*/}
                        {/*)}*/}
                        {_.includes(configPackageBySite, "effect") && (
                            <EffectPackage isChangeArea={object?.campaign_id == areaChangeRegistrationCode}
                                           sales_order={object} channelCode={channelCodeCurrent}/>
                        )}

                        {_.includes(configPackageBySite, "banner") && (
                            <BannerPackage sales_order={object} channelCode={channelCodeCurrent}/>
                        )}

                        <RecruiterAssistantPackage sales_order={object} channelCode={channelCodeCurrent}/>

                        {channelCodeCurrent === Constant.CHANNEL_CODE_VL24H && (
                            <FilterResumePackage sales_order={object} channelCode={channelCodeCurrent}/>
                        )}
                        {_.includes(configPackageBySite, "jobbox_freemium") &&
                            (channelCodeCurrent === Constant.CHANNEL_CODE_VL24H || channelCodeCurrent === Constant.CHANNEL_CODE_TVN) && (
                                <JobFreePackage sales_order={object} channelCode={channelCodeCurrent}/>
                            )}

                        {_.includes(configPackageBySite, "minisite") && (
                            <MinisitePackage sales_order={object}/>
                        )}

                        <SalePackage sales_order={object}/>

                        <PromotionsPackage sales_order={object} history={history}/>

                        {isExchange && (
                            <CreditPackage sales_order={object}/>
                        )}
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
