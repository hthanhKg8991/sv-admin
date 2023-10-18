import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import _ from "lodash";
import queryString from "query-string";
import {publish, subscribe} from "utils/event";
import FormUpdate from "pages/CustomerCare/SalesOrderEditPage/Popup/FormUpdate";
import {
    completeSalesOrder,
    deleteSalesOrder,
    duplicateSalesOrder,
    getDetailAccountCustomer,
    getDetailSalesOrder,
    getPromotionProgramAppliedsBySalesOrder,
    previewSalesOrder,
    printPaymentRequest,
    printSalesOrder,
    printSalesOrderNew,
    printSalesOrderOriginal,
    printSalesOrderWord,
    requestApprove,
    requestConfirmPayment,
    salesOrderCheckCancel,
    salesOrderRequestDropDetail,
    salesOrderReSyncOdoo,
    sendRevenueReceive,
    updateOrderDetail,
    resendEmail,
    previewContractAddendum,
    previewReportDeal,
    previewReportConfirm
} from "api/saleOrder";
import PopupForm from "components/Common/Ui/PopupForm";
import * as Yup from 'yup';
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {Link} from "react-router-dom";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupUpdateExpired from "pages/CustomerCare/SalesOrderPage/Popup/PopupUpdateExpired";
import PopupChangeBranch from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeBranch";
import PopupCancelSalesOrder from "pages/CustomerCare/SalesOrderPage/Popup/PopupCancelSalesOrder";
import PopupRequestApprove from "pages/CustomerCare/SalesOrderPage/Popup/PopupRequestApprove";
import PopupRequestConfirmPayment from "pages/CustomerCare/SalesOrderPage/Popup/PopupRequestConfirmPayment";
import {getListConfig} from "api/system";
import ListLog from './ListLogChangeEmailReceiveInfo';
import config from "config";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            accountant_customer: {},
            object: {},
            requestDropItem: {},
            applied: [],
            flagQrCode: false,
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.refreshList();
            });
        }, props.idKey));

        this.refreshList = this._refreshList.bind(this);
        this.getCustomer = this._getCustomer.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnPreview = this._btnPreview.bind(this);
        this.btnPrintContract = this._btnPrintContract.bind(this);
        this.btnPrintContractWord = this._btnPrintContractWord.bind(this);
        this.btnPrintContractOriginal = this._btnPrintContractOriginal.bind(this);
        this.btnPrintPaymentRequest = this._btnPrintPaymentRequest.bind(this);
        this.btnPreviewNew = this._btnPreviewNew.bind(this);
        this.btnCopy = this._btnCopy.bind(this);
        this.btnComplete = this._btnComplete.bind(this);
        this.getRequestDropItem = this._getRequestDropItem.bind(this);
        this.btnUpdateExpired = this._btnUpdateExpired.bind(this);
        this.getAppliedPromotions = this._getAppliedPromotions.bind(this);
        this.btnChangeBranch = this._btnChangeBranch.bind(this);
        this.btnCancel = this._btnCancel.bind(this);
        this.btnReSyncOdoo = this._btnReSyncOdoo.bind(this);
        this.onUpdateNetSales = this._onUpdateNetSales.bind(this);
        this.btnRequestApprove = this._btnRequestApprove.bind(this);
        this.btnRequestConfirmPayment = this._btnRequestConfirmPayment.bind(this);
        this.goBack = this._goBack.bind(this);
        this.onResendMail = this._onResendMail.bind(this);
        this.btnPhuLucHopDong = this._btnPhuLucHopDong.bind(this);
        this.btnThoaThuanHopDong = this._btnThoaThuanHopDong.bind(this);
        this.btnConfirm24h = this._btnConfirm24h.bind(this);
    }

    _refreshList() {
        const {id, uiAction} = this.props;
        this.setState({loading: true}, async () => {
            const res = await getDetailSalesOrder({
                id: id,
                type: Constant.SALES_ORDER_TYPE
            });
            this.setState({object: res, loading: false});
            if(res){
                uiAction?.addSOStaffId(res?.assigned_staff_old_id, res?.employer_info?.assigned_staff_id)
            }
            if (res.accountant_customer_id) {
                this.getCustomer(res.accountant_customer_id);
            }
        });
        this.getAppliedPromotions(id);
        // this.getRequestDropItem();
    }

    _btnDelete() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteSalesOrder({id: this.state.object?.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    this.refreshList();
                }
                uiAction.hideLoading();
                uiAction.hideSmartMessageBox();
            }
        });
    }

    async _btnPreview() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await previewSalesOrder({id: this.state.object?.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    _btnChangeBranch() {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupChangeBranch, "Chọn thông tin công ty", {sales_order: this.state.object});
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
                const res = await duplicateSalesOrder({id: this.state.object?.id});
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
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn hoàn thành phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await completeSalesOrder({id: this.state.object?.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    this._refreshList();
                }
                uiAction.hideLoading();
            }
        });
    }

    async _btnPrintContract() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrder({id: this.state.object?.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPrintContractWord() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrderWord({id: this.state.object?.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPrintContractOriginal() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrderOriginal({sales_order_id: this.state.object?.id});
        if (res) {
            window.open(res?.file_preview, "_blank",);
            setTimeout(function () {
                window.open(res?.file_print_contract, "_blank",);
            }, 500);
        }
        uiAction.hideLoading();
    }

    async _btnPrintPaymentRequest() {
        const { uiAction } = this.props;
        uiAction.showLoading();
        const res = await printPaymentRequest({ id: this.state.object?.id });
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPreviewNew() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printSalesOrderNew({id: this.state.object?.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    _btnChangeCustomer() {
        this.popupRejectAction._handleShow();
    }

    _btnUpdateExpired() {
        const {uiAction, idKey} = this.props;
        const {object} = this.state;
        uiAction.createPopup(PopupUpdateExpired, "Chỉnh sửa trạng thái và HSD phiếu", {
            item: object,
            idKey: idKey
        });
    }

    async _btnReSyncOdoo() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await salesOrderReSyncOdoo({sales_order_id: this.state.object?.id});
        if (res) {
            uiAction.putToastSuccess("Lệnh bắn thành công");
        }
        uiAction.hideLoading();
    }

    _onUpdateNetSales() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn Cập nhật Net Sales?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await sendRevenueReceive({sales_order_id: this.state.object?.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    this._refreshList();
                }
                uiAction.hideSmartMessageBox();
                uiAction.hideLoading();
            }
        });
    }

    _btnRequestApprove() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Xác nhận gửi yêu cầu duyệt PĐK. Bạn có muốn upload chứng từ?",
            content: "",
            buttons: ['Hủy', 'Không', 'Có']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Có") {
                uiAction.hideSmartMessageBox();
                uiAction.createPopup(PopupRequestApprove, "Upload chứng từ", {
                    id: this.state.object?.id,
                    object: this.state.object,
                    idKey: this.props.idKey
                })
            } else if (ButtonPressed === "Không") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await requestApprove({sales_order_id: this.state.object?.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish('.refresh', {}, this.props.idKey);
                }
                uiAction.hideLoading();
            } else {
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _btnRequestConfirmPayment() {
        const {uiAction, idKey} = this.props;
        uiAction.SmartMessageBox({
            title: "Xác nhận gửi xác nhận chờ thanh toán. Bạn có muốn upload chứng từ?",
            content: "",
            buttons: ['Hủy', 'Không', 'Có']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Có") {
                uiAction.hideSmartMessageBox();
                uiAction.createPopup(PopupRequestConfirmPayment, "Upload chứng từ", {
                    id: this.state.object?.id,
                    object: this.state.object,
                    idKey,
                })
            } else if (ButtonPressed === "Không") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await requestConfirmPayment({sales_order_id: this.state.object?.id});
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
    async _btnPhuLucHopDong() {
        const { id, uiAction } = this.props;

        uiAction.showLoading();
        const res = await previewContractAddendum({ id });
        if (res?.url) {
            window.open(res?.url)
        }
        uiAction.hideLoading();
    }

    async _btnThoaThuanHopDong() {
        const { id, uiAction } = this.props;
  
        uiAction.showLoading();
        const res = await previewReportDeal({ id });
        if (res?.url) {
            window.open(res?.url)
        }
        uiAction.hideLoading();
    }

    async _btnConfirm24h() {
        const { uiAction } = this.props;
        uiAction.showLoading();
        const res = await previewReportConfirm({ id: this.state.object?.convert_from_id });
        if (res?.url) {
            window.open(res?.url)
        }
        uiAction.hideLoading();
    }

    async _getCustomer(accountant_customer_id) {
        const res = await getDetailAccountCustomer({id: accountant_customer_id});
        if (res) {
            this.setState({accountant_customer: res});
        }
    }

    async _getRequestDropItem() {
        const args = {
            sales_order_id: this.props.id,
            request_type: Constant.REQUEST_DROP_SALES_ORDER
        };
        const res = await salesOrderRequestDropDetail(args);
        if (res) {
            this.setState({requestDropItem: res});
        }
    }

    async _getAppliedPromotions(id) {
        const res = await getPromotionProgramAppliedsBySalesOrder({sales_order_id: id});
        if (res) {
            this.setState({applied: res});
        }
    }

    async _btnCancel() {
        const {uiAction} = this.props;
        const {object} = this.state;
        const isCheck = await salesOrderCheckCancel({id: object?.id});
        if(!isCheck) {
            uiAction.putToastError("Phiếu đã được sử dụng, không cho phép Hủy phiếu");
            return false;
        }
        uiAction.createPopup(PopupCancelSalesOrder, "Hủy phiếu đăng ký", {id: object?.id});
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SALES_ORDER,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_SALES_ORDER,
                search: '?' + queryString.stringify(search)
            });

            return true;
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

    _onResendMail() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn gửi lại email?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await resendEmail({sales_order_id: this.state.object?.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    this._refreshList();
                }
                uiAction.hideSmartMessageBox();
                uiAction.hideLoading();
            }
        });
    }

    componentDidMount() {
        this.refreshList();
        this._getConfig();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="row content-box">
                    <div className="relative card-body text-center">
                        <LoadingSmall/>
                    </div>
                </div>
            )
        }
        const {object, applied, requestDropItem, flagQrCode} = this.state;
        const requestDropStatusList = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_request_status);
        const channelCodeCurrent = _.get(this.props, "branch.currentBranch.channel_code".split("."), null);
        const status = parseInt(object?.status);

        const taxRate = (100 + Number(object?.vat_percent))/100;
        const totalAmount =  object?.is_include_tax === true ?  object?.total_amount_unit/taxRate : object?.total_amount_unit;
        const totalAmountIncludedTax = object?.is_include_tax === true ? object?.total_amount_unit : object?.total_amount_unit*taxRate;
        const totalTax = totalAmountIncludedTax - totalAmount;
        
        // 1 chi tiết, 2 in phiếu, 3 hoàn thành, 4 sao chép, 5 hủy phiếu, 6 xóa phiếu, 7 đổi HĐ, 8 in hợp đồng
        // order status 1 đã duyệt, 2 chưa hoàn thành , 3 không duyệt, 4 hoàn thành, 5 đã hủy, 99 đã xóa
        let keyPress = [];
        switch (status) {
            case Constant.STATUS_INACTIVED:
                keyPress = ["1", "2", "4", "6"];
                if (parseInt(object?.total_amount_unit) > 0) {
                    keyPress.push("3");
                }
                break;
            case Constant.STATUS_COMPLETE:
                keyPress = ["1", "2", "4", "5", "6", "7"];
                break;
            case Constant.STATUS_ACTIVED:
                keyPress = ["1", "2", "5", "4", "8"];
                break;
            case Constant.STATUS_DISABLED:
            case Constant.STATUS_DELETED:
            case Constant.STATUS_LOCKED:
            case Constant.SALE_ORDER_EXPIRED_ACTIVE:
            case 0:
            default:
                keyPress = ["1"];
                break;
        }

        // phần hiển thị request drop sales order
        let requestDropStatusShow = [Constant.STATUS_INACTIVED, Constant.STATUS_ACTIVED, Constant.STATUS_DISABLED];
        let requestDropText = _.get(requestDropItem, "description", null);
        let isShowRequestDrop = false;
        if (_.get(requestDropItem, "id", null) && _.includes(requestDropStatusShow, requestDropItem.status)) {
            isShowRequestDrop = true;
            if (parseInt(requestDropItem.status) === Constant.STATUS_DISABLED) {
                requestDropText = _.get(requestDropItem, "rejected_note", null);
            }
        }
        const isRequestApprove = [Constant.SALE_ORDER_INACTIVE].includes(parseInt(object?.status)) &&
            (
                (
                    Number(object?.payment_term_method) === Constant.PAYMENT_METHOD_PAY_NOW &&
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
                Number(object?.payment_term_method) !== Constant.PAYMENT_METHOD_PAY_NOW
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
       if (!object){
           return null;
       }
        return (
            <div className="content-box">
                <div className="row mt10">
                    <div className="col-sm-5 col-xs-5">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            <span>Thông tin phiếu</span>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Trạng thái</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status} value={object?.status} notStyle/>
                            </div>
                        </div>
                        {/*lý do không duyệt phiếu*/}
                        {[Constant.STATUS_DISABLED, Constant.STATUS_LOCKED].includes(status) && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Lý do</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {object?.rejected_note}
                                </div>
                            </div>
                        )}

                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ngày tạo phiếu</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {moment.unix(object?.created_at).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        {object?.approved_at && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày duyệt</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object?.approved_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Người tạo</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {_.get(object, 'created_by', null)}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">CSKH ghi nhận doanh thu</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object?.revenue_by_staff_code} - {object?.revenue_by_staff_name}
                            </div>
                        </div>
                        {object?.approved_at && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày duyệt phiếu</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object?.approved_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        )}
                        {object?.expired_at && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày hết hạn</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object?.expired_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        )}
                        {object?.registration_expired_at ? (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày hết hạn kích hoạt</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object?.registration_expired_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        ) : <></>}
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Tái ký</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {parseInt(object?.recontract_status) === Constant.RECONTRACT_STATUS_ACTIVE ? <span>Có</span> : <span className="textRed">Không</span>}
                            </div>
                        </div>
                        {parseInt(object?.payment_method) === Constant.PAYMENT_TERM_METHOD_TM && object?.payment_info &&
                        (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Địa chỉ thu tiền mặt</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {object?.payment_info}
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Hạn thanh toán</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_payment_term_method}
                                            value={object?.payment_term_method} notStyle/>
                            </div>
                        </div>
                        {!(Object.entries(this.state.accountant_customer).length === 0) && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Khách hàng kế toán</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {this.state.accountant_customer.name}
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Miền</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_branch_name} value={object?.branch_code} notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ghi chú</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object?.note}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Loại bảng giá</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_package} value={object?.package} notStyle/>
                            </div>
                        </div>
                        {object?.virtual_account && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Số tài khoản VA</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    <strong>{object?.virtual_account} <i onClick={()=>{
                                        navigator.clipboard.writeText(object?.virtual_account)
                                        this.props.uiAction.putToastSuccess("Đã copy!")
                                    }} title="Click to copy" className="fa fa-copy cursor-pointer text-link"/></strong>
                                </div>
                            </div>
                        )}
                        {flagQrCode && (
                            <>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">QR Code</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        {object?.qr_code}
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Trạng thái thanh toán</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status} value={object?.payment_status}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Yêu cầu duyệt phiếu</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_approve_status} value={object?.request_approve_status}/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Yêu cầu xác nhận chờ thanh toán</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_confirm_payment_status} value={object?.confirm_payment_status}/>
                                    </div>
                                </div>
                            </>
                        )}

                        {/*yêu cầu huỷ phiếu*/}
                        {isShowRequestDrop &&(
                            <div>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Trạng thái duyệt hạ Phiếu</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        {requestDropStatusList[requestDropItem.status]}
                                    </div>
                                </div>

                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Lý do</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">{requestDropText}</div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-sm-7 col-xs-7">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            <span>Thành tiền ({object?.total_amount_unit ? utils.formatNumber(Math.round(totalAmountIncludedTax),0,".","đ") : "Không có"})</span>
                        </div>
                        {object?.total_amount_info && (
                            <React.Fragment>
                                {object?.total_amount_info && Object.keys(object?.total_amount_info).map((item, key) => {
                                    if (!['discount_non_policy_info','recontract_info'].includes(item)) {
                                        return (
                                            <div className="col-sm-12 col-xs-12 row-content padding0" key={key}>
                                                <div className="col-sm-6 col-xs-6 padding0">
                                                    <span>{object?.total_amount_info[item].cache_service_name}</span>
                                                </div>
                                                <div className="col-sm-6 col-xs-6 number-money">
                                                    <span>{utils.formatNumber(object?.total_amount_info[item].total_amount, 0, ".", "đ")}</span>
                                                </div>
                                            </div>
                                        )
                                    }else{
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
                                {parseInt(object?.recontract_discount_amount) > 0 && (
                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                        <div className="col-sm-6 col-xs-6 padding0">Giảm giá tái ký</div>
                                        <div className="col-sm-6 col-xs-6 number-money textRed">
                                            <span>- {utils.formatNumber(object?.recontract_discount_amount,0,".","đ")}</span>
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
                                {parseInt(object?.non_policy_discount_amount) > 0 && (
                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                        <div className="col-sm-6 col-xs-6 padding0">GGNCS</div>
                                        <div className="col-sm-6 col-xs-5 number-money textRed">
                                            <span>- {utils.formatNumber(object?.non_policy_discount_amount,0,".","đ")}</span>
                                        </div>
                                    </div>
                                )}
                                {/* Tổng tiền */}
                                {object?.is_include_tax === false && <>
                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                        <div className="col-sm-6 col-xs-6 px-0 pt-10">Tiền trước thuế</div>
                                        <div className="col-sm-6 col-xs-6 number-money last pt-10">
                                            <span>{utils.formatNumber(totalAmount,0,".","đ")}</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb5">
                                        <div className="col-sm-6 col-xs-6 padding0">Thuế VAT</div>
                                        <div className="col-sm-6 col-xs-6 number-money">
                                            <span>{utils.formatNumber(Math.round(totalTax) ,0,".","đ")}</span>
                                        </div>
                                    </div>
                                </>}
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-6 col-xs-6 text-bold px-0 pt-10">Tổng tiền {object?.is_include_tax === false && 'sau thuế'}</div>
                                    <div className="col-sm-6 col-xs-6 number-money last  pt-10">
                                    <span>{utils.formatNumber(Math.round(totalAmountIncludedTax),0,".","đ")}</span>
                                    </div>
                                </div>

                                {Number(object?.type_campaign) === Constant.CAMPAIGN_TYPE_CONVERT_POINT && 
                                <div className="col-sm-12 col-xs-12  row-content padding0 mb10">
                                    <div className="col-sm-6 col-xs-6 text-bold padding0">Số điểm dịch vụ đã quy đổi</div>
                                    <div className="col-sm-6 col-xs-6 text-bold text-right">
                                        <span>{utils.formatNumber(object?.point_converted, 0, ".", "đ")}</span>
                                    </div>
                                </div>}
                                {/* Credit áp dụng */}
                                {object?.credit_apply ? (
                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                        <div className="col-sm-6 col-xs-6 padding0">Credit áp dụng</div>
                                        <div className="col-sm-6 col-xs-6 number-money">
                                            <span className="text-red">- {utils.formatNumber(object?.credit_apply, 0, ".", "đ")}</span>
                                        </div>
                                    </div>
                                ) : null}
                                {/* Tổng tiền sau credit*/}
                                {object?.credit_apply ? (
                                    <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                        <div className="col-sm-6 col-xs-6 text-bold padding0">Phải thanh toán</div>
                                        <div className="col-sm-6 col-xs-6 number-money last">
                                            <span>{utils.formatNumber(object?.total_amount_credit_apply, 0, ".", "đ")}</span>
                                        </div>
                                    </div>
                                ) : null}
                            </React.Fragment>
                        )}
                    </div>
                    <div className="col-sm-12 col-xs-12 mt15">
                        <React.Fragment>
                                {keyPress.includes("1") && (
                                    <Link to={Constant.BASE_URL_EDIT_SALES_ORDER + "?id=" + object?.id}>
                                        <span className="el-button el-button-primary el-button-small" type={"button"}>
                                        Chi tiết
                                        </span>
                                    </Link>
                                )}
                            {isRequestApprove && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_request_approve}>
                                    <button type="button" className="el-button el-button-bricky el-button-small"
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
                                    <CanRender actionCode={ROLES.customer_care_sales_order_waiting_confirm_payment}>
                                        <button type="button" className="el-button el-button-bricky el-button-small"
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
                            {[
                                Constant.SALE_ORDER_NOT_COMPLETE,
                                Constant.SALE_ORDER_INACTIVE,
                                Constant.SALE_ORDER_ACTIVED,
                                Constant.SALE_ORDER_EXPIRED,
                                Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                Constant.SALE_ORDER_CANCEL,
                            ].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_preview_sales_order}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.btnPreview}>
                                        <span>In phiếu</span>
                                    </button>
                                </CanRender>
                            )}
                            {[
                                Constant.SALE_ORDER_INACTIVE,
                                Constant.SALE_ORDER_ACTIVED,
                                Constant.SALE_ORDER_EXPIRED,
                                Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                Constant.SALE_ORDER_CANCEL,
                            ].includes(parseInt(object?.status)) && (
                                <>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_print_contract}>
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                                onClick={this.btnPrintContract}>
                                            <span>In hợp đồng</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_print_contract_word}>
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                                onClick={this.btnPrintContractWord}>
                                            <span>In hợp đồng khác mẫu</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_preview_sales_order_new}>
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                                onClick={this.btnPreviewNew}>
                                            <span>In phiếu (New)</span>
                                        </button>
                                    </CanRender>
                                    {Constant.SALE_ORDER_CANCEL !== parseInt(object?.status) && (
                                        <CanRender
                                            actionCode={ROLES.customer_care_sales_order_print_payment_request}>
                                            <button type="button"
                                                    className="el-button el-button-primary el-button-small"
                                                    onClick={this.btnPrintPaymentRequest}>
                                                <span>In phiếu đề nghị thanh toán</span>
                                            </button>
                                        </CanRender>
                                    )}
                                    {!(Constant.SALE_ORDER_INACTIVE === parseInt(object?.status)) && (
                                        <CanRender actionCode={ROLES.customer_care_sales_order_print_contract_original}>
                                            <button type="button" className="el-button el-button-primary el-button-small"
                                                    onClick={this.btnPrintContractOriginal}>
                                                <span>In HD/Phiếu (Gốc)</span>
                                            </button>
                                        </CanRender>
                                    )}
                                </>
                            )}
                            {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(object?.status)) && parseInt(object?.total_amount_unit) > 0 && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_complete}>
                                    <button type="button" className="el-button el-button-success el-button-small"
                                            onClick={this.btnComplete}>
                                        <span>Hoàn thành</span>
                                    </button>
                                </CanRender>
                            )}
                            <CanRender actionCode={ROLES.customer_care_sales_order_copy}>
                                <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnCopy}>
                                    <span>Sao chép</span>
                                </button>
                            </CanRender>
                            {/*Huy phiếu chỉ chạy trên vtn*/}
                            {/*{![Constant.STATUS_ACTIVED].includes(parseInt(object?.status)) && (*/}
                            {/*    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnCancel}>*/}
                            {/*        <span>Hủy phiếu</span>*/}
                            {/*    </button>*/}
                            {/*)}*/}
                            {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_delete}>
                                    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnDelete}>
                                        <span>Xóa phiếu</span>
                                    </button>
                                </CanRender>
                            )}
                            {[Constant.STATUS_ACTIVED, Constant.STATUS_COMPLETE].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_update}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this._btnChangeCustomer.bind(this)}>
                                        <span>Đổi thông tin xuất HĐ</span>
                                    </button>
                                </CanRender>
                            )}
                            {![
                                Constant.SALE_ORDER_DISABLED,
                                Constant.SALE_ORDER_INACTIVE,
                                Constant.SALE_ORDER_CANCEL,
                                Constant.SALE_ORDER_NOT_COMPLETE,
                                Constant.SALE_ORDER_EXPIRED,
                            ].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_update_expired}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.btnUpdateExpired}>
                                        <span>Chỉnh sửa trạng thái và HSD phiếu</span>
                                    </button>
                                </CanRender>
                            )}
                            {![
                                Constant.SALE_ORDER_DISABLED,
                                Constant.SALE_ORDER_CANCEL,
                                Constant.SALE_ORDER_ACTIVED,
                            ].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_change_branch_code}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.btnChangeBranch}>
                                        <span>Đổi miền</span>
                                    </button>
                                </CanRender>
                            )}
                            {[Constant.STATUS_ACTIVED].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_cancel_sales_order}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.btnCancel}>
                                        <span>Hủy phiếu</span>
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
                                [Constant.STATUS_ACTIVED].includes(parseInt(object?.status)) && object?.convert_from_id &&
                                <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.btnConfirm24h}>
                                    <span>Xác nhận từ VL24H</span>
                                </button>
                            }
                            {[Constant.STATUS_ACTIVED].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_re_sync_odoo}>
                                    <button type="button"
                                            className="el-button el-button-pink el-button-small"
                                            onClick={this.btnReSyncOdoo}>
                                        <span>Bắn thông tin phiếu qua Odoo</span>
                                    </button>
                                </CanRender>
                            )}
                            {[
                                Constant.SALE_ORDER_ACTIVED,
                                Constant.SALE_ORDER_EXPIRED,
                                Constant.SALE_ORDER_EXPIRED_ACTIVE,
                            ].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_update_net_sales}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.onUpdateNetSales}>
                                        <span>Cập nhật Net Sales Hoa hồng</span>
                                    </button>
                                </CanRender>
                            )}
                            {[Constant.STATUS_ACTIVED].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_exchange}>
                                    <Link to={Constant.BASE_URL_SALES_ORDER + "?action=exchange&id=" + object?.id}>
                                        <span className="el-button el-button-bricky el-button-small" type={"button"}>
                                            Quy đổi đơn hàng
                                        </span>
                                    </Link>
                                </CanRender>
                            )}
                            {[Constant.SALE_ORDER_ACTIVED].includes(parseInt(object?.status)) && (
                                <CanRender actionCode={ROLES.customer_care_sales_order_resend_mail}>
                                    <button type="button" className="el-button el-button-primary el-button-small"
                                            onClick={this.onResendMail}>
                                        <span>Gửi lại mail</span>
                                    </button>
                                </CanRender>
                            )}
                            <button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
                                <span>Quay lại</span>
                            </button>
                        </React.Fragment>
                    </div>
                </div>
                <CanRender actionCode={ROLES.customer_care_sales_order_request_change_email_receive_info_create}>
                    <div className="mt15">
                        <ListLog object={object} history={this.props.history}/>
                    </div>
                </CanRender>
                <PopupForm onRef={ref => (this.popupRejectAction = ref)}
                           title={"Bổ sung thông tin in hợp đồng"}
                           FormComponent={FormUpdate}
                           initialValues={this.state.object}
                           validationSchema={Yup.object().shape({
                               name_representative: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
                               position_representative: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                           })}
                           apiSubmit={updateOrderDetail}
                           hideAfterSubmit/>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
