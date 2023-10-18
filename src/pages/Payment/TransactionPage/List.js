import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import {Link} from "react-router-dom";
import queryString from "query-string";
import ComponentFilter from "pages/Payment/TransactionPage/ComponentFilter";
import {exportListTransaction, getListTransaction} from "api/saleOrder";
import {formatNumber} from "utils/utils";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import PopupEditTransaction from "pages/Payment/TransactionPage/Popup/PopupEditTransaction";
import PopupCreateExceptional from "pages/Payment/TransactionPage/Popup/PopupCreateExceptional";
import PopupSaleConfirm from "pages/Payment/TransactionPage/Popup/PopupSaleConfirm";
import PopupSaleNotConfirm from "pages/Payment/TransactionPage/Popup/PopupSaleNotConfirm";
import PopupAccountantNotConfirm from "pages/Payment/TransactionPage/Popup/PopupAccountantNotConfirm";
import PopupAccountantConfirm from "pages/Payment/TransactionPage/Popup/PopupAccountantConfirm";
import PopupSaleCancel from "pages/Payment/TransactionPage/Popup/PopupSalesCancel";
import PopupAccountantCancel from "pages/Payment/TransactionPage/Popup/PopupAccountantCancel";
import {getListConfig} from "api/system";
import PopupUpdateInternal from "pages/Payment/TransactionPage/Popup/PopupUpdateInternal";
import PopupShowTypeLogs from "pages/Payment/TransactionPage/Popup/PopupShowTypeLogs";
import moment from "moment";

const idKey = "TransactionList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Bank Statement ID",
                    width: 100,
                    accessor: "statement_id"
                },
                {
                    title: "Exceptional Statement ID",
                    width: 100,
                    accessor: "exceptional_transaction_id"
                },
                {
                    title: "Virtual Account",
                    width: 100,
                    accessor: "virtual_account"
                },
                {
                    title: "Tên ngân hàng",
                    width: 140,
                    accessor: "bank_name"
                },
                {
                    title: "Ngày giao dịch",
                    width: 120,
                    time: true,
                    accessor: "transaction_date",
                },
                {
                    title: "Nội dung giao dịch",
                    width: 140,
                    accessor: "content",
                },
                {
                    title: "Giá trị giao dịch",
                    width: 120,
                    cell: row => formatNumber(row?.amount, 0, ".", "đ")
                },
                {
                    title: "Payment ID",
                    width: 100,
                    accessor: "payment_id"
                },
                {
                    title: "ID SO",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        row.sales_order_id && <Link
                            to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
                                id: row.sales_order_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Tên công ty",
                    width: 120,
                    accessor: "employer_name"
                },
                {
                    title: "Trạng thái match",
                    width: 120,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_transaction_status}
                                           value={row?.status}/>;
                    }
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_transaction_status_confirm}
                                           value={row?.status_confirm}/>;
                    }
                },
                {
                    title: "Hành động",
                    width: 220,
                    cell: row => {
                        if (Number(row?.type) === Constant.TRANSACTION_TYPE_INTERNAL) {
                            return (
                                <>
                                    <i>Giao dịch nội bộ</i>
                                    <CanRender actionCode={ROLES.payment_manage_transaction_type_logs}>
                                        <span className="text-link text-blue fs12 font-bold ml5"
                                              onClick={() => this.onShowTypeLogs(row?.id)}>
                                            (Chi tiết)
                                        </span>
                                    </CanRender>
                                </>
                            )
                        }
                        // Đánh dấu giao dịch ngoại lệ
                        const isUpdateInternal = Number(row?.status) !== Constant.TRANSACTION_STATUS_MATCH &&
                            Number(row?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_NO;

                        // Sales chỉnh sửa transansaction khi chưa match và chưa xác nhận, chưa chờ kế toán
                        const isEditSale = !(
                            Number(row?.status) === Constant.TRANSACTION_STATUS_MATCH &&
                            [
                                Constant.TRANSACTION_STATUS_CONFIRM_YES,
                                Constant.TRANSACTION_STATUS_CONFIRM_PENDING,
                            ].includes(Number(row?.status_confirm))
                        );
                        // Sales chỉnh sửa transansaction khi chưa match và chưa xác nhận
                        const isEditAccountant = !(
                            Number(row?.status) === Constant.TRANSACTION_STATUS_MATCH &&
                            Number(row?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_YES
                        );
                        // Sales xác nhận khi đã match và chưa xác nhận
                        const isSalesConfirm =
                            Number(row?.status) === Constant.TRANSACTION_STATUS_MATCH &&
                            Number(row?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_NO;
                        // Kế toán xác nhận khi đã match và sales đã xác nhận (trạng thái chờ)
                        const isAccountant =
                            Number(row?.status) === Constant.TRANSACTION_STATUS_MATCH &&
                            Number(row?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_PENDING;
                        const isSaleCancel = Number(row?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_PENDING;
                        const isAccountantCancel = Number(row?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_YES;
                        return (
                            <>
                                <CanRender actionCode={ROLES.payment_manage_transaction_logs}>
                                    <span className="text-link text-blue font-bold mr10"
                                          onClick={() => this.onHistoryLog(row?.id)}>
                                        Xem lịch sử
                                    </span>
                                    <br/>
                                </CanRender>
                                {isEditSale && (
                                    <CanRender actionCode={ROLES.payment_manage_transaction_sales_update_status}>
                                        <span className="text-underline pointer text-warning font-bold mr10"
                                              onClick={() => this.btnEdit(row)}>
                                            Chỉnh sửa
                                        </span>
                                        <br/>
                                    </CanRender>
                                )}
                                {isEditAccountant && (
                                    <CanRender actionCode={ROLES.payment_manage_transaction_accountant_update_status}>
                                        <span className="text-underline pointer text-warning font-bold mr10"
                                              onClick={() => this.btnEdit(row)}>
                                            Chỉnh sửa
                                        </span>
                                        <br/>
                                    </CanRender>
                                )}
                                {isSalesConfirm && (
                                    <>
                                        <CanRender actionCode={ROLES.payment_manage_transaction_sales_confirm_status}>
                                                <span className="text-underline text-primary pointer font-bold mr10"
                                                      onClick={() => this.salesConfirmStatus(row.id)}>
                                                    Sales xác nhận
                                                </span>
                                        </CanRender>
                                        <br/>
                                        <CanRender
                                            actionCode={ROLES.payment_manage_transaction_sales_not_confirm_status}>
                                                <span className="text-underline text-danger pointer font-bold mr10"
                                                      onClick={() => this.salesNotConfirmStatus(row.id)}>
                                                    Sales không xác nhận
                                                </span>
                                            <br/>
                                        </CanRender>
                                    </>

                                )}
                                {isSaleCancel && (
                                    <CanRender
                                        actionCode={ROLES.payment_manage_transaction_sales_cancel_transaction}>
                                            <span className="text-underline text-danger pointer font-bold mr10"
                                                  onClick={() => this.salesCancelConfirm(row.id)}>
                                                Sale hủy xác nhận
                                            </span>
                                        <br/>
                                    </CanRender>
                                )}
                                {isAccountant && (
                                    <>
                                        <CanRender
                                            actionCode={ROLES.payment_manage_transaction_accountant_confirm_status}>
                                                <span className="text-underline text-primary pointer font-bold mr10"
                                                      onClick={() => this.accountantConfirmStatus(row.id)}>
                                                    Kế toán xác nhận
                                                </span>
                                        </CanRender>
                                        <br/>
                                        <CanRender
                                            actionCode={ROLES.payment_manage_transaction_accountant_not_confirm_status}>
                                            <span className="text-underline text-danger pointer font-bold mr10"
                                                  onClick={() => this.accountantNotConfirmStatus(row.id)}>
                                                Kế toán không xác nhận
                                            </span>
                                        </CanRender>
                                    </>
                                )}
                                {isAccountantCancel && (
                                    <CanRender
                                        actionCode={ROLES.payment_manage_transaction_accountant_cancel_transaction}>
                                            <span className="text-underline text-danger pointer font-bold mr10"
                                                  onClick={() => this.accountantCancelConfirm(row.id)}>
                                                Kế toán hủy xác nhận
                                            </span>
                                    </CanRender>
                                )}
                                {isUpdateInternal && (
                                    <CanRender
                                        actionCode={ROLES.payment_manage_transaction_internal}>
                                            <span className="text-link text-blue font-bold mr10"
                                                  onClick={() => this.onUpdateInternal(row.id)}>
                                                Giao dịch nội bộ
                                            </span>
                                    </CanRender>
                                )}
                            </>
                        )
                    }
                }
            ],
            loading: false,
            flagQrCode: false,
        };
        this.btnEdit = this._btnEdit.bind(this);
        this.onClickExport = this._onClickExport.bind(this);
        this.salesConfirmStatus = this._salesConfirmStatus.bind(this);
        this.salesNotConfirmStatus = this._salesNotConfirmStatus.bind(this);
        this.accountantConfirmStatus = this._accountantConfirmStatus.bind(this);
        this.accountantNotConfirmStatus = this._accountantNotConfirmStatus.bind(this);
        this.salesCancelConfirm = this._salesCancelConfirm.bind(this);
        this.accountantCancelConfirm = this._accountantCancelConfirm.bind(this);
        this.onHistoryLog = this._onHistoryLog.bind(this);
        this.btnCreateExceptional = this._btnCreateExceptional.bind(this);
        this.onUpdateInternal = this._onUpdateInternal.bind(this);
        this.onShowTypeLogs = this._onShowTypeLogs.bind(this);
    }

    async _onClickExport() {
        const {query, actions} = this.props;
        actions.showLoading();
        const res = await exportListTransaction(query);
        if (res) {
            window.open(res?.url);
        }
        actions.hideLoading();
    }

    _btnEdit(row) {
        const {actions} = this.props;
        actions.createPopup(PopupEditTransaction, 'Chỉnh sửa transaction', {
            object: {
                id: row?.id,
                statement_id: row?.statement_id,
                exceptional_transaction_id: row?.exceptional_transaction_id,
                payment_id: row?.payment_id,
            },
            idKey: idKey
        });
    }

    _btnCreateExceptional() {
        const {actions} = this.props;
        actions.createPopup(PopupCreateExceptional, 'Thêm giao dịch ngoại lệ', {
            object: {},
            idKey: idKey
        });
    }

    _salesConfirmStatus(id) {
        const {actions} = this.props;
        actions.createPopup(PopupSaleConfirm, 'CSKH xác nhận', {
            id: id,
            idKey: idKey,
        });
    }

    _salesNotConfirmStatus(id) {
        const {actions} = this.props;
        actions.createPopup(PopupSaleNotConfirm, 'CSKH không xác nhận', {
            id: id,
            idKey: idKey,
        });
    }

    _salesCancelConfirm(id) {
        const {actions} = this.props;
        actions.createPopup(PopupSaleCancel, 'CSKH hủy xác nhận', {
            id: id,
            idKey: idKey,
        });
    }

    _accountantConfirmStatus(id) {
        const {actions} = this.props;
        actions.createPopup(PopupAccountantConfirm, 'Kế toán xác nhận', {
            id: id,
            idKey: idKey,
        });
    }

    _accountantNotConfirmStatus(id) {
        const {actions} = this.props;
        actions.createPopup(PopupAccountantNotConfirm, 'Kế toán không xác nhận', {
            id: id,
            idKey: idKey,
        });
    }

    _accountantCancelConfirm(id) {
        const {actions} = this.props;
        actions.createPopup(PopupAccountantCancel, 'Kế toán hủy xác nhận', {
            id: id,
            idKey: idKey,
        });
    }

    _onUpdateInternal(id) {
        const {actions} = this.props;
        actions.createPopup(PopupUpdateInternal, 'Xác nhận giao dịch nội bộ', {
            id: id,
            idKey: idKey,
        });
    }

    _onShowTypeLogs(id) {
        const {actions} = this.props;
        actions.createPopup(PopupShowTypeLogs, 'Lịch sử giao dịch nội bộ', {
            id: id,
            idKey: idKey,
        });
    }

    _onHistoryLog(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_PAYMENT_MANAGE_TRANSACTION,
            search: '?action=logs&transaction_id=' + id
        });
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
        this._getConfig();
    }

    render() {
        const {columns, flagQrCode} = this.state;
        const {query, defaultQuery, history} = this.props;
        console.log(query, "name: query.lg")
        const queryMerge = {
            ...query,
            ...(query.page ? {} : {
                type: Constant.TRANSACTION_TYPE_CUSTOMER,
                "transaction_date[from]": moment().startOf('year').unix(),
                "transaction_date[to]": moment().unix()
            })

        };

        const null_filter = Object.keys(query).filter(_ => !['page', 'per_page'].includes(_)).length === 0;
        return (
            <Default
                title="Danh Sách Transaction"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <ComponentFilter idKey={idKey} query={query}/>
                <div className="mt5 mb10">
                    {flagQrCode && (
                        <CanRender actionCode={ROLES.payment_manage_transaction_create_exceptional}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.btnCreateExceptional}>
                                <span>Thêm giao dịch ngoại lệ</span>
                            </button>
                        </CanRender>
                    )}
                    <CanRender actionCode={ROLES.payment_manage_transaction_export}>
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={() => this.onClickExport()}>
                            <span>Xuất Excel  <i
                                className="glyphicon glyphicon-file"/></span>
                        </button>
                    </CanRender>
                </div>
                {null_filter && (
                    <div className="text-center font-bold text-italic mb10">
                        Do lượng dữ liệu lớn, vui lòng chọn ít nhất 1 bộ lọc để tiếp tục tra cứu!
                    </div>
                )}
                <Gird idKey={idKey}
                      fetchApi={getListTransaction}
                      query={queryMerge}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />

            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
