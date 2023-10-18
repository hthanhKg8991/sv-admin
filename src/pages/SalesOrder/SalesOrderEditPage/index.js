import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import moment from "moment";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import InputArea from "components/Common/InputValue/InputArea";
import ItemPackage from "pages/SalesOrder/SalesOrderEditPage/Package/ItemPackage";
import PopupCustomer from "pages/Accountant/CustomerPage/Popup/PopupCustomer";
import _ from "lodash";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {
    getListAccountantCampaign,
    getListAccountantCustomerFull,
    getListOpportunity,
    getPromotionProgramAppliedsBySalesOrder,
    printPaymentRequest,
    printSalesOrder,
    printSalesOrderNew,
    printSalesOrderWord,
    requestApprove,
    requestConfirmPayment,
    salesOrderReSyncOdoo,
} from 'api/saleOrder';
import {getList} from "api/employer";
import {publish, subscribe} from "utils/event";
import {getTeamMember} from "api/auth";
import CanAction from "components/Common/Ui/CanAction";
import PopupChangeBranch from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeBranch";
import PopupChangeOpportunity from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeOpportunity";
import PopupRequestApprove from "pages/CustomerCare/SalesOrderPage/Popup/PopupRequestApprove";
import PopupRequestConfirmPayment from "pages/CustomerCare/SalesOrderPage/Popup/PopupRequestConfirmPayment";
import {getListConfig} from "api/system";
import {
    approveDebtSalesOrderV2,
    approveSalesOrderV2,
    confirmSalesOrderV2,
    deleteSalesOrderV2,
    duplicateSalesOrderV2,
    getDetailSalesOrderV2,
    postCreateSalesOrderV2,
    postUpdateSalesOrderV2, previewSalesOrderV2,
    printSalesOrderOriginalV2,
    rejectDebtSalesOrderV2,
    rejectSalesOrderV2,
    requestApproveDebtSalesOrderV2,
    submitSalesOrderV2
} from "api/saleOrderV2";
import PromotionsPackage from "pages/SalesOrder/SalesOrderEditPage/Package/PromotionsPackage";
import PopupPrintSalesOrder from "pages/SalesOrder/SalesOrderEditPage/Popup/PopupPrintPackage";
import PopupPrintContract from "pages/SalesOrder/SalesOrderEditPage/Popup/PopupContract";
import PopupSelectContract from "pages/SalesOrder/SalesOrderEditPage/Popup/PopupSelectContract";

const idKey = "SalesOrderEditPage";

class index extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const {user} = props;
        const isCustomerCare = [
            Constant.DIVISION_TYPE_customer_care_member,
            Constant.DIVISION_TYPE_customer_care_leader
        ].includes(user?.division_code);
        const userCode = user?.code;
        const revenue_by_staff_code = isCustomerCare && userCode;

        this.state = {
            object: {
                ordered_on: moment().unix(),
                is_signature: Constant.SALES_ORDER_IS_SIGNATURE_YES,
                type_campaign: Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.default,
                revenue_by_staff_code: revenue_by_staff_code || null
            },
            object_error: {},
            object_required: ['employer_id', 'is_signature', 'invoice_issuance_method', 'ordered_on',
                'payment_term_method', 'payment_method', 'type_campaign','branch_code','revenue_by_staff_code'],
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
        this.btnConfirm = this._btnConfirm.bind(this);
        this.btnAddCustomer = this._btnAddCustomer.bind(this);
        this.btnChangeCustomer = this._btnChangeCustomer.bind(this);
        this.afterSubmitAppend = this._afterSubmitAppend.bind(this);
        this.btnPrintContractWord = this._btnPrintContractWord.bind(this);
        this.btnPrintContract = this._btnPrintContract.bind(this);
        this.btnPrintPaymentRequest = this._btnPrintPaymentRequest.bind(this);
        this.btnPreviewNew = this._btnPreviewNew.bind(this);
        this.btnChangeBranch = this._btnChangeBranch.bind(this);
        this.btnChangeOpportunity = this._btnChangeOpportunity.bind(this);
        this.btnReSyncOdoo = this._btnReSyncOdoo.bind(this);
        this.btnRequestApprove = this._btnRequestApprove.bind(this);
        this.btnRequestConfirmPayment = this._btnRequestConfirmPayment.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnApproveDebt = this._btnApproveDebt.bind(this);
        this.btnRejectDebt = this._btnRejectDebt.bind(this);
        this.btnRequestApproveDebt = this._btnRequestApproveDebt.bind(this);
    }

    async _getListEmployer(value) {
        this.setState({loading_getEmployer: true});
        const args = {
            q: value,
            status_not: Constant.STATUS_DELETED,
            per_page: 10,
            page: 1,
            is_create_sales_order: true
        };
        const res = await getList(args);
        if (Array.isArray(res?.items)) {
            const employer_list = res?.items?.map(item => {
                return {
                    value: item.id,
                    title: item.id + ' - ' + item.name + " - " + item.email + " - " + item.channel_code
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
                        value: _?.code,
                    }
                }) : [];
            this.setState({staff_list: staff});
        }
    }

    async _getListStaffAll() {
        const res = await getTeamMember({per_page: 999});
        if (res) {
            const staff = Array.isArray(res) ?
                res?.map(_ => {
                    return {
                        title: `${_?.code || ""} ${_?.code ? ` - ${_?.display_name}` : `${_?.display_name}`}`,
                        value: _?.code,
                    }
                }) : [];
            this._setOpportunity(staff);
            this.setState({staff_list_all: staff});
        }
    }

    async _getSalesOrder(id) {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await getDetailSalesOrderV2({id: id});
        if (res) {
            this._getListEmployer(res?.employer_id);
            this._getListAccountCustomer({id: res.accountant_customer_id});
            this.setState({object: res, so_payment_term_method: res?.payment_term_method});
            this.setState({is_showPackage: true});
            this._getListOpportunity(res?.revenue_by_staff_code);
        }
        uiAction.hideLoading();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        /*
        * Lần đầu chọn phiếu thường nhấn hoàn thành sẽ báo lỗi cần chọn opportunity
        * Đổi lại thành phiếu tặng thì xóa lỗi đi
        */
        if (name === 'type_campaign' && Number(value) === Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift) {
            delete object_error["opportunity_id"];
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
        if (name === 'revenue_by_staff_code') {
            const {staff_list_all} = this.state;
            const staff_code = staff_list_all.find(s => s.value === value)?.value;
            this._getListOpportunity(staff_code);
        }
        this.setState({object: object});
    }

    async _onSave(object, object_required) {
        const {uiAction, history} = this.props;
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

        if (!object.id) {
            const res = await postCreateSalesOrderV2(object);
            if (res) {
                uiAction.putToastSuccess("Thao tác thành công!");
                history.push(`${Constant.BASE_URL_EDIT_SALES_ORDER_V2}?id=${res?.id}`);
                this._getSalesOrder(res?.id);
            }
            uiAction.hideLoading();
        } else {
            const res = await postUpdateSalesOrderV2(object);
            if (res) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList(Constant.IDKEY_DISCOUNT_RECONTRACT);
                publish(".refresh", {}, idKey);
                publish(".refresh", {}, Constant.IDKEY_PROMOTION);
                publish(".refresh", {}, Constant.IDKEY_ITEM_PACKAGE);
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
                const res = await deleteSalesOrderV2({id: this.state.object.id});
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

    async _btnPreview(type) {
        const {uiAction} = this.props;
        const {object} = this.state;
        uiAction.showLoading();
        const res = await previewSalesOrderV2({id: object.id,is_preview: 1,type});
        if (res){
            uiAction.createPopup(PopupPrintSalesOrder,"Xem trước đơn hàng", {object, type, html: res.html},'popup-preview-a4');
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
        const {object} = this.state;
        uiAction.showLoading();
        const res = await printSalesOrderWord({id: object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPrintContract() {
        const {uiAction} = this.props;
        const {object} = this.state;
        uiAction.createPopup(PopupSelectContract,"Xem trước hợp đồng", {sales_order: object},'popup-preview-a4');
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
                const res = await duplicateSalesOrderV2({id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    const url = Constant.BASE_URL_EDIT_SALES_ORDER_V2 + "?id=" + res.id;
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

        if (Number(object?.type_campaign) !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift) {
            /* Theo define thì lúc hoàn thành check required opportuniry */
            // objectRequired.push('opportunity_id'); TODO live bật lại
        }

        let check = utils.checkOnSaveRequired(object, objectRequired);
        /*
        * Không required opportunity dưới dev (task VHCRMV2-905)
        * Trên production:
        * - Không cần để key REACT_APP_NOT_REQUIRED_OPPORTUNITY
        * - Nhưng các account (trừ root) trên production phải required field opportunity
        * - Dưới dev thì tất cả account không cần required
        */
        /*
         * - Là phiếu tặng thì không cần required field opportunity_id (VHCRMV2-1349)
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
                    const res = await submitSalesOrderV2({id: this.state.object.id});
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

    _btnConfirm() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn gửi YC duyệt phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await confirmSalesOrderV2({id: this.state.object.id});
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
    _btnApprove() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await approveSalesOrderV2({id: this.state.object.id});
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
    _btnReject() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn không duyệt phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await rejectSalesOrderV2({id: this.state.object.id});
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
    _btnApproveDebt() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xác nhận công nợ phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await approveDebtSalesOrderV2({id: this.state.object.id});
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
    _btnRejectDebt() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn không từ chối xác nhận công nợ phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await rejectDebtSalesOrderV2({id: this.state.object.id});
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
    _btnRequestApproveDebt() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn gửi YC xác nhận công nợ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await requestApproveDebtSalesOrderV2({id: this.state.object.id});
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

    async _getListOpportunity(value) {
        if (value) {
            const params = {
                sellerCode: value
            }
            const {object} = this.state;

            if (object && object?.id && parseInt(object?.status) === Constant.SALE_ORDER_ACTIVED) {
                params.is_exist_registration_form_ref = 'both';
            }

            const res = await getListOpportunity(params);
            if (res && Array.isArray(res?.data?.records)) {
                const opportunity = res?.data?.records.map(item => {
                    return {title: `${item?.deal_ref} - ${item?.customer_ref} - ${item?.name}`, value: item.id}
                })
                this.setState({opportunity: opportunity});
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

    async _getConfig() {
        const res = await getListConfig({code: Constant.CONFIG_FLAG_QRCODE_CODE});
        if (res && res?.items?.length > 0) {
            const [config] = res?.items;
            this.setState({
                flagQrCode: Number(config?.value) === Constant.CONFIG_FLAG_QRCODE_LOAD,
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
        }
        this._geListCampaign();
        this._getListStaff();
        this._getListStaffAll();
        this._getConfig();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const channelCodeCurrent = _.get(this.props, "branch.currentBranch.channel_code".split("."), null);
        let {
            object,
            object_error,
            object_required,
            name_focus,
            customer,
            employer_list,
            customer_list,
            staff_list,
            loading_getEmployer,
            loading_getCustomer,
            is_showPackage,
            opportunity,
        } = this.state;
        let sales_order_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_status_v2);
        let list_invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_invoice_issuance_method);
        let list_is_signature = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_is_signature);
        let list_payment_term_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_term_method);
        let list_payment_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_method);
        let list_type_campaign = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_campaign);
        const branch_name = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_branch_name);
        let title = object.id ? "Cập Nhật Phiếu Đăng Ký: " + object.id + ' - ' + sales_order_status[object.status] : "Tạo Phiếu Đăng Ký";
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


        const isDisableOrderedOn = ![
            Constant.SALES_ORDER_V2_STATUS_DRAFT,
            Constant.SALES_ORDER_V2_STATUS_SUBMITTED
        ].includes(Number(object.status)) && object.status;

        return (
            <div className="row-body">
                <div className="col-result-full crm-section">
                    {is_showPackage && (
                        <div className="head-box row">
                            <div className="col-sm-6">
                                <React.Fragment>
                                    {[Constant.SALES_ORDER_V2_STATUS_SUBMITTED].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_confirm}>
                                            <button type="button"
                                                    className="el-button el-button-success el-button-small"
                                                    onClick={() => this.btnConfirm(object, object_required)}>
                                                <span>Gửi YC duyệt phiếu</span>
                                            </button>
                                        </CanRender>
                                    )}
                                    {[Constant.SALES_ORDER_V2_STATUS_CONFIRMED].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_approve}>
                                            <button type="button"
                                                    className="el-button el-button-success el-button-small"
                                                    onClick={() => this.btnApprove(object, object_required)}>
                                                <span>Duyệt</span>
                                            </button>
                                            <button type="button"
                                                    className="el-button el-button-bricky el-button-small"
                                                    onClick={() => this.btnReject(object, object_required)}>
                                                <span>Không Duyệt</span>
                                            </button>
                                        </CanRender>
                                    )}
                                    {[Constant.SALES_ORDER_V2_STATUS_SUBMITTED].includes(parseInt(object.status)) &&
                                    [Constant.PAYMENT_DEBT_STATUS_DRAFT,Constant.PAYMENT_DEBT_STATUS_REJECTED].includes(parseInt(object.payment_debt_status)) &&
                                    (
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_request_approve_debt}>
                                            <button type="button"
                                                    className="el-button el-button-info el-button-small"
                                                    onClick={() => this.btnRequestApproveDebt(object, object_required)}>
                                                <span>Gửi yêu cầu công nợ xác nhận </span>
                                            </button>
                                        </CanRender>
                                    )}
                                    {[Constant.PAYMENT_DEBT_STATUS_SUBMITTED].includes(parseInt(object.payment_debt_status)) && (
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_approve_debt}>
                                            <button type="button"
                                                    className="el-button el-button-warning el-button-small"
                                                    onClick={() => this.btnApproveDebt(object, object_required)}>
                                                <span>Xác nhận công nợ</span>
                                            </button>
                                            <button type="button"
                                                    className="el-button el-button-bricky el-button-small"
                                                    onClick={() => this.btnRejectDebt(object, object_required)}>
                                                <span>Từ chối xác nhận công nợ</span>
                                            </button>
                                        </CanRender>
                                    )}
                                    {[Constant.SALES_ORDER_V2_STATUS_DRAFT].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_submit}>
                                            <button type="button"
                                                    className="el-button el-button-success el-button-small"
                                                    onClick={() => this.btnComplete(object, object_required)}>
                                                <span>Hoàn thành</span>
                                            </button>
                                        </CanRender>
                                    )}

                                    <CanRender actionCode={ROLES.sales_order_sales_order_duplicate}>
                                        <button type="button"
                                                className="el-button el-button-primary el-button-small"
                                                onClick={this.btnCopy}>
                                            <span>Sao chép</span>
                                        </button>
                                    </CanRender>

                                    {[Constant.SALES_ORDER_V2_STATUS_DRAFT].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_delete}>
                                            <button type="button"
                                                    className="el-button el-button-bricky el-button-small"
                                                    onClick={this.btnDelete}>
                                                <span>Xóa phiếu</span>
                                            </button>
                                        </CanRender>
                                    )}

                                </React.Fragment>
                            </div>
                            <div className="col-sm-6 text-right">
                                {![
                                    Constant.SALES_ORDER_V2_STATUS_DELETED,
                                ].includes(parseInt(object.status)) && (
                                    <>
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_print}>
                                            <button type="button"
                                                    className="el-button el-button-warning el-button-small"
                                                    onClick={()=> this.btnPreview(Constant.TYPE_PRINT_PBG)}>
                                                <span>In phiếu báo giá</span>
                                            </button>
                                            <button type="button"
                                                    className="el-button el-button-warning el-button-small"
                                                    onClick={()=> this.btnPreview(Constant.TYPE_PRINT_PDK)}>
                                                <span>In phiếu</span>
                                            </button>
                                        </CanRender>
                                    </>
                                )}
                                {![
                                    Constant.SALES_ORDER_V2_STATUS_DRAFT,
                                    Constant.SALES_ORDER_V2_STATUS_DELETED
                                ].includes(parseInt(object.status)) && (
                                    <>
                                        <CanRender
                                            actionCode={ROLES.sales_order_sales_order_print_contract}>
                                            <button type="button"
                                                    className="el-button el-button-warning el-button-small"
                                                    onClick={this.btnPrintContract}>
                                                <span>In hợp đồng</span>
                                            </button>
                                        </CanRender>
                                    </>
                                )}
                            </div>

                        </div>
                    )}

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
                                        <Dropbox name="type_campaign" label="Loại phiếu"
                                                 data={list_type_campaign}
                                                 required={object_required.includes('type_campaign')}
                                                 value={object.type_campaign}
                                                 error={object_error.type_campaign} nameFocus={name_focus}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-6 col-xs-6 mb10">
                                            <Dropbox label="Miền"
                                                     name="branch_code"
                                                     data={branch_name}
                                                     required={object_required.includes('branch_code')}
                                                     onChange={this.onChange}
                                                     value={object.branch_code}
                                                     nameFocus={name_focus}
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
                                            <Dropbox name="payment_term_method" label="Hình thức thanh toán"
                                                     data={list_payment_method}
                                                     required={object_required.includes('payment_method')}
                                                     value={object.payment_method} error={object_error.payment_method}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Dropbox name="payment_term_method" label="Hạn thanh toán"
                                                     data={list_payment_term_method}
                                                     required={object_required.includes('payment_term_method')}
                                                     value={object.payment_term_method}
                                                     error={object_error.payment_term_method} nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
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
                                            <Dropbox name="is_signature" label="Siêu Việt ký" data={list_is_signature}
                                                     required={object_required.includes('is_signature')}
                                                     value={object.is_signature} error={object_error.is_signature}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <CanAction actionCode={ROLES.customer_care_sales_order_update_staff}>
                                            <div className="col-sm-6 col-xs-6 mb10">
                                                {staff_list && (
                                                    <Dropbox name="revenue_by_staff_code" label="CSKH ghi nhận doanh thu"
                                                             data={staff_list}
                                                             required={object_required.includes("revenue_by_staff_code")}
                                                             value={object.revenue_by_staff_code}
                                                             error={object_error.revenue_by_staff_code}
                                                             nameFocus={name_focus}
                                                             onChange={this.onChange}
                                                    />
                                                )}
                                            </div>
                                        </CanAction>
                                        <div className="col-sm-6 col-xs-12 mb10">
                                            <Dropbox name="opportunity_id" label="Opportunity"
                                                     data={opportunity || []}
                                                     // required={object_required.includes('opportunity_id') && Number(object?.type_campaign) !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift} //TODO live sẽ bật
                                                     value={object.opportunity_id}
                                                     error={Number(object?.type_campaign) !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift ? object_error.opportunity_id : ""}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                                     readOnly={object?.status === Constant.SALE_ORDER_ACTIVED}
                                                     timeOut
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-12 col-xs-12 mb10">
                                            <InputArea name="note" label="Ghi chú"
                                                       required={object_required.includes('note')}
                                                       style={{height: "100px", minHeight: "100px"}}
                                                       nameFocus={name_focus}
                                                       value={object.note} error={object_error.note}
                                                       onChange={this.onChange}
                                            />
                                        </div>
                                    </div>


                                    {/*<div className="col-sm-12 col-xs-12 padding0">*/}

                                    {/*    {isCampaign &&*/}
                                    {/*    <div className="col-sm-6 col-xs-12 mb10">*/}
                                    {/*        <Dropbox name="campaign_id" label="Chương trình tặng"*/}
                                    {/*                 data={campaign_list}*/}
                                    {/*                 required={object_required.includes('campaign_id')}*/}
                                    {/*                 value={object.campaign_id}*/}
                                    {/*                 error={object_error.campaign_id} nameFocus={name_focus}*/}
                                    {/*                 onChange={this.onChange}*/}
                                    {/*        />*/}
                                    {/*    </div>*/}
                                    {/*    }*/}
                                    {/*</div>*/}

                                    <div className="col-sm-12 col-xs-12 padding0">
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

                                    {/*<div className="col-sm-12 col-xs-12 padding0">*/}
                                    {/*    <div className="col-sm-6 col-xs-12 mb10">*/}
                                    {/*        <DateTimePicker name="registration_expired_at"*/}
                                    {/*                        label="Ngày hết hạn kích hoạt"*/}
                                    {/*                        beforeApply={{*/}
                                    {/*                            title: (value) => `Các gói dịch vụ chưa được kích hoạt đến ngày ${moment.unix(value).format("DD/MM/YYYY")} sẽ không được kích hoạt nữa. Xác nhận chọn ngày hết hạn kích hoạt ?`,*/}
                                    {/*                            content: ""*/}
                                    {/*                        }}*/}
                                    {/*                        minDate={moment()}*/}
                                    {/*                        required={object_required.includes('registration_expired_at')}*/}
                                    {/*                        value={object.registration_expired_at || null}*/}
                                    {/*                        error={object_error.registration_expired_at}*/}
                                    {/*                        nameFocus={name_focus}*/}
                                    {/*                        onChange={this.onChange}*/}
                                    {/*        />*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    {/*<div className="col-sm-6 col-xs-12 mb10">*/}
                                    {/*    <Dropbox name="package" label="Loại bảng giá"*/}
                                    {/*             data={list_sales_order_package}*/}
                                    {/*             required={object_required.includes('package')}*/}
                                    {/*             value={object.package || Constant.SALES_ORDER_PACKAGE}*/}
                                    {/*             error={object_error.package} nameFocus={name_focus}*/}
                                    {/*             onChange={this.onChange}*/}
                                    {/*    />*/}
                                    {/*</div>*/}

                                </div>
                                <div className="col-sm-6 col-xs-12">
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                        <span>Thông tin khách hàng</span>
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
                                        <Input2 type="text" name="representative_name" label="Người đại diện"
                                                value={object.representative_name}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb20">
                                        <Input2 type="text" name="representative_position" label="Chức vụ"
                                                value={object.representative_position}
                                                onChange={this.onChange}
                                        />
                                    </div>
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
                                        <Input2 type="text" name="email" label="Email nhận hóa đơn"
                                                value={customer.email}
                                                readOnly/>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="address" label="Địa chỉ" value={customer.address}
                                                readOnly/>
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
                        <ItemPackage sales_order={object} channelCode={channelCodeCurrent} idKeySalesOrder={idKey}/>
                        <PromotionsPackage sales_order={object} channelCode={channelCodeCurrent} idKeySalesOrder={idKey}/>
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
