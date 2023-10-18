import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import moment from "moment";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import ItemPackage from "pages/HeadhuntPage/SalesOrderEditPage/Package/ItemPackage";
import _ from "lodash";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {
    requestApprove,
} from 'api/saleOrder';
import {publish, subscribe} from "utils/event";
import PopupRequestApprove from "pages/CustomerCare/SalesOrderPage/Popup/PopupRequestApprove";
import PopupSentConfirm from "./Popup/PopupSentConfirm";
import {
    approveSalesOrderHeadhunt,
    createSalesOrderHeadhunt,
    deleteSalesOrderHeadhunt,
    duplicateSalesOrderHeadhunt,
    getDetailHeadhuntSalesOrder,
    getListFullHeadhuntContract, getListFullHeadhuntContractAppendix,
    getListFullHeadhuntCustomer,
    getListHeadhuntGroupMemberAll,
    getListRecruitmentRequest,
    printHeadhuntSalesOrder,
    rejectSalesOrderHeadhunt,
    submitSalesOrderHeadhunt,
    updateSalesOrderHeadhunt
} from "api/headhunt";
import PopupPrintSalesOrder from "./Popup/PopupPrintPackage";

const idKey = "SalesOrderEditPage";

class index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            object: {
                ordered_on: moment().unix(),
            },
            object_error: {},
            object_required: ['customer_id', 'invoice_issuance_method', 'ordered_on',
                'payment_term_method', 'payment_method', 'branch_code', 'revenue_by_staff_code', 'contract_id'],
            name_focus: '',
            customer: {},
            applied: [],
            employer_list: [],
            contract: [],
            contract_appendix: [],
            request_list: [],
            staff_headhunt: [],
            loading_request: false,
            loading_contract: true,
            loading_staff: false,
            loading: false,
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this._getSalesOrder(this.state.object.id);
            });
        }, idKey));

        this.onChange = this._onChange.bind(this);
        this.getListEmployer = this._getListEmployer.bind(this);
        this.getSalesOrder = this._getSalesOrder.bind(this);
        this.onSave = this._onSave.bind(this);
        this.btnComplete = this._btnComplete.bind(this);
        this.btnConfirm = this._btnConfirm.bind(this);
        this.btnRequestApprove = this._btnRequestApprove.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnCopy = this._btnCopy.bind(this);
        this.getListStaffHeadhunt = this._getListStaffHeadhunt.bind(this);
        this.btnPreview = this._btnPreview.bind(this);
    }

    async _getListEmployer(value) {
        this.setState({loading_getEmployer: true});
        const args = {
            q: value,
            status_not: Constant.STATUS_DELETED,
            is_create_sales_order: true
        };
        const res = await getListFullHeadhuntCustomer(args);
        if (Array.isArray(res)) {
            const employer_list = res?.map(item => {
                return {
                    value: item.id,
                    title: item.id + ' - ' + item.company_name + " - " + item.branch_name
                }
            });
            this.setState({employer_list: employer_list, loading_getEmployer: false});
        }
    }

    async _getContract(customer_id) {
        const res = await getListFullHeadhuntContract({customer_id});
        if (Array.isArray(res)) {
            const contract = res?.map(item => {
                return {
                    value: item.id,
                    title: item.id + ' - ' + item.code
                }
            });
            this.setState({contract});
        }
    }

    async _getContractAppendix(contract_id) {
        const res = await getListFullHeadhuntContractAppendix({contract_id});
        if (Array.isArray(res)) {
            const contract_appendix = res?.map(item => {
                return {
                    value: item.id,
                    title: item.id + ' - ' + item.name
                }
            });
            this.setState({contract_appendix, loading_contract: false});
        }
    }

    async _getDetailEmployer(id) {
        const object = {...this.state.object};
        object.employer_id = id;
        this.setState({object});
        this._getListEmployer(object?.employer_id);
    }

    async _getListRecruitmentRequest(customer_id) {
        this.setState({loading_request: true}, async () => {
            const res = await getListRecruitmentRequest({status: Constant.STATUS_ACTIVED, per_page: 999, customer_id});
            if (res) {
                const request_list = Array.isArray(res?.items) ?
                    res?.items?.map(_ => {
                        return {
                            title: `${_?.id} - ${_.customer_info?.company_name}`,
                            value: _?.id
                        }
                    }) : [];
                this.setState({request_list, loading_request: false});
            }
        });

    }

    async _getListStaffHeadhunt() {
        this.setState({loading_staff: true});
        const res = await getListHeadhuntGroupMemberAll({
            status: Constant.STATUS_ACTIVED,
            division_code: Constant.DIVISION_TYPE_customer_headhunt_sale
        });
        if (res?.items) {
            const staff_headhunt = res.items.map(_ => {
                return {
                    title: `${_?.staff_code} - ${_?.display_name}`,
                    value: _?.staff_code
                }
            });
            this.setState({staff_headhunt, loading_staff: false});
        }
    }


    async _getSalesOrder(id) {
        const {uiAction} = this.props;
        this.setState({loading: true});
        uiAction.showLoading();
        const res = await getDetailHeadhuntSalesOrder({id: id});
        if (res) {
            this._getListEmployer(res?.employer_id);
            this._getListRecruitmentRequest(res?.customer_id);
            this.setState({object: res}, () => {
                this._getContract(res?.customer_id);
                this._getContractAppendix(res?.contract_id);
            });
            this.setState({is_showPackage: true});
        }
        uiAction.hideLoading();
        this.setState({loading: false});
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
        if (name === "customer_id") {
            this._getListRecruitmentRequest(value)
            this._getContract(value)
        }
        if (value && name === "contract_id") {
            this._getContractAppendix(value)
        }
        if (this.state.loading_contract) {
            if (name === "contract_appendix_id" && !value) {
                return;
            }
            if (name === "contract_id" && !value) {
                return;
            }
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
            const res = await createSalesOrderHeadhunt(object);
            if (res) {
                uiAction.putToastSuccess("Thao tác thành công!");
                history.push(`${Constant.BASE_URL_EDIT_HEADHUNT_SALES_ORDER}?id=${res?.id}`);
                this._getSalesOrder(res?.id);
            }
            uiAction.hideLoading();
        } else {
            const res = await updateSalesOrderHeadhunt(object);
            if (res) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList(Constant.IDKEY_DISCOUNT_RECONTRACT);
                publish(".refresh", {}, idKey);
            }
            uiAction.hideLoading();
        }
    }

    _btnComplete() {
        const {uiAction} = this.props;
        const {object, object_required} = this.state;
        const isRoot = this.props.user?.division_code === Constant.DIVISION_TYPE_admin;
        const objectRequired = JSON.parse(JSON.stringify(object_required));
        let check = utils.checkOnSaveRequired(object, objectRequired);

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
                    const res = await submitSalesOrderHeadhunt({id: this.state.object.id});
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
        uiAction.createPopup(PopupSentConfirm, "Gửi YC duyệt phiếu", {idKey, id: this.state.object.id})
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
                const res = await approveSalesOrderHeadhunt({id: this.state.object.id});
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
                const res = await rejectSalesOrderHeadhunt({id: this.state.object.id});
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

    _btnDelete() {
        const {uiAction, history} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await deleteSalesOrderHeadhunt({id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    history.push(Constant.BASE_URL_HEADHUNT_SALES_ORDER);
                }
                uiAction.hideLoading();
            }
        });
    }

    _btnCopy() {
        const {uiAction, history} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn sao chép phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                const res = await duplicateSalesOrderHeadhunt({id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    history.push(`${Constant.BASE_URL_EDIT_HEADHUNT_SALES_ORDER}?id=${res.id}`);
                    this._getSalesOrder(res.id);
                }
                uiAction.hideLoading();
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

    async _btnPreview(type) {
        const {uiAction} = this.props;
        const {object} = this.state;
        uiAction.showLoading();
        const res = await printHeadhuntSalesOrder({id: object.id, type: "html"});
        if (res) {
            uiAction.createPopup(PopupPrintSalesOrder, "Xem trước đơn hàng", {object, html: res}, 'popup-preview-a4');
        }
        uiAction.hideLoading();
    }

    componentDidMount() {
        let params = queryString.parse(window.location.search);
        if (params['id']) {
            this._getSalesOrder(params['id']);
        }
        if (params['employer_id']) {
            this._getDetailEmployer(params['employer_id']);
        }
        this.getListStaffHeadhunt();
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
            employer_list,
            loading_getEmployer,
            is_showPackage,
            request_list,
            staff_headhunt,
            loading_request,
            contract,
            contract_appendix,
            loading_staff,
            loading,
            loading_contract
        } = this.state;
        let sales_order_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_status_v2);
        let list_invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_invoice_issuance_method);
        let list_payment_term_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_term_method);
        let list_payment_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_payment_method);
        const branch_name = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_branch_name);
        let title = object.id ? "Cập Nhật Phiếu Đăng Ký: " + object.id + ' - ' + sales_order_status[object.status] : "Tạo Phiếu Đăng Ký";
        if (parseInt(object.payment_method) === Constant.PAYMENT_TERM_METHOD_TM) {
            object_required.push('payment_info');
        } else {
            object_required = object_required.filter(c => c !== 'payment_info');
        }
        const isDisableOrderedOn = ![
            Constant.SALES_ORDER_HEADHUNT_STATUS_DRAFT,
            Constant.SALES_ORDER_HEADHUNT_STATUS_SUBMITTED
        ].includes(Number(object.status)) && object.status;

        return (
            <div className="row-body">
                <div className="col-result-full crm-section">
                    {is_showPackage && (
                        <div className="head-box row">
                            <div className="col-sm-6">
                                <React.Fragment>
                                    {[Constant.SALES_ORDER_HEADHUNT_STATUS_SUBMITTED].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.headhunt_sales_order_create}>
                                            <button type="button"
                                                    className="el-button el-button-success el-button-small"
                                                    onClick={() => this.btnConfirm(object, object_required)}>
                                                <span>Gửi YC duyệt phiếu</span>
                                            </button>
                                        </CanRender>
                                    )}
                                    {[Constant.SALES_ORDER_HEADHUNT_STATUS_CONFIRMED].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.headhunt_sales_order_create}>
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
                                    {[Constant.SALES_ORDER_HEADHUNT_STATUS_DRAFT].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.headhunt_sales_order_create}>
                                            <button type="button"
                                                    className="el-button el-button-success el-button-small"
                                                    onClick={() => this.btnComplete(object, object_required)}>
                                                <span>Hoàn thành</span>
                                            </button>
                                        </CanRender>
                                    )}

                                    <CanRender actionCode={ROLES.headhunt_sales_order_duplicate}>
                                        <button type="button"
                                                className="el-button el-button-primary el-button-small"
                                                onClick={this.btnCopy}>
                                            <span>Sao chép</span>
                                        </button>
                                    </CanRender>

                                    {[
                                        Constant.SALES_ORDER_HEADHUNT_STATUS_DRAFT,
                                        Constant.SALES_ORDER_HEADHUNT_STATUS_CONFIRMED,
                                        Constant.SALES_ORDER_HEADHUNT_STATUS_SUBMITTED].includes(parseInt(object.status)) && (
                                        <CanRender
                                            actionCode={ROLES.headhunt_sales_order_delete}>
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
                                <CanRender actionCode={ROLES.headhunt_sales_order_print}>
                                    {![
                                        Constant.SALES_ORDER_HEADHUNT_STATUS_DELETED,
                                    ].includes(parseInt(object.status)) && (
                                        <>
                                            <button type="button"
                                                    className="el-button el-button-warning el-button-small"
                                                    onClick={() => this.btnPreview(Constant.TYPE_PRINT_PDK)}>
                                                <span>In phiếu</span>
                                            </button>
                                        </>
                                    )}
                                </CanRender>
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
                                        <div className="col-sm-6 col-xs-6 mb10">
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
                                        {loading_staff || (
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Dropbox name="revenue_by_staff_code" label="CSKH ghi nhận doanh thu"
                                                         data={staff_headhunt}
                                                         required={object_required.includes('revenue_by_staff_code')}
                                                         value={object.revenue_by_staff_code}
                                                         error={object_error.revenue_by_staff_code}
                                                         nameFocus={name_focus}
                                                         onChange={this.onChange}
                                                />
                                            </div>
                                        )}

                                    </div>

                                    {object_required.includes('payment_info') && (
                                        <div className="col-sm-12 col-xs-12 padding0">
                                            <div className="col-sm-6 col-xs-12 mb10" style={{paddingBottom: "12px"}}>
                                                <Input2 type="text" name="payment_info" label="Địa chỉ thu tiền"
                                                        required={object_required.includes('payment_info')}
                                                        value={object.payment_info} error={object_error.payment_info}
                                                        nameFocus={name_focus}
                                                        onChange={this.onChange}

                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                        <span>Thông tin hợp đồng</span>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox type="text" name="contract_id" label="Mã hợp đồng"
                                                 value={object.contract_id}
                                                 required={object_required.includes('contract_id')}
                                                 error={object_error.contract_id}
                                                 onChange={this.onChange}
                                                 data={contract}
                                        />
                                    </div>
                                    {object?.recruitment_request_id > 0 && (
                                        <>
                                            {
                                                loading_contract || (
                                                    <div className="col-sm-12 col-xs-12 mb10">
                                                        <Dropbox type="text" name="contract_appendix_id"
                                                                 label="Mã phụ lục hợp đồng"
                                                                 value={object.contract_appendix_id}
                                                                 onChange={this.onChange}
                                                                 data={contract_appendix}
                                                        />
                                                    </div>
                                                )
                                            }
                                            {loading_request || (
                                                <div className="col-sm-12 col-xs-12 mb10">
                                                    <Dropbox name="recruitment_request_id" label="Chọn Request"
                                                             data={request_list}
                                                             required={object_required.includes('recruitment_request_id')}
                                                             value={object.recruitment_request_id}
                                                             error={object_error.recruitment_request_id}
                                                             nameFocus={name_focus}
                                                             onChange={this.onChange}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="col-sm-6 col-xs-12">
                                    <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                        <span>Thông tin khách hàng</span>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="customer_id" label="Khách hàng" data={employer_list}
                                                 required={object_required.includes('customer_id')}
                                                 value={object.customer_id} error={object_error.customer_id}
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
                                        <span>Thông tin xuất hóa đơn</span>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="billing_tax_code" label="Mã số thuế"
                                                value={object.billing_tax_code} onChange={this.onChange}/>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="billing_name" label="Tên công ty"
                                                value={object.billing_name}
                                                onChange={this.onChange}/>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="billing_email" label="Email nhận hóa đơn"
                                                value={object.billing_email}
                                                onChange={this.onChange}/>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="billing_address" label="Địa chỉ"
                                                value={object.billing_address}
                                                onChange={this.onChange}/>
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
                {is_showPackage && !loading && (
                    <React.Fragment>
                        <ItemPackage sales_order={object} channelCode={channelCodeCurrent} idKeySalesOrder={idKey}/>
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
