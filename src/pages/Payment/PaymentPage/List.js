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
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import ComponentFilter from "pages/Payment/PaymentPage/ComponentFilter";
import {getListPayment} from "api/saleOrder";
import {formatNumber} from "utils/utils";

const idKey = "PaymentList";

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
                    title: "Sale Order",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
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
                    width: 100,
                    accessor: "employer_name"
                },
                {
                    title: "CSKH",
                    width: 100,
                    cell: row => (<span>{row?.revenue_by_staff?.login_name}</span>)
                },
                {
                    title: "Trạng thái SO",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status}
                                           value={row?.sales_order_status}/>;
                    }
                },
                {
                    title: "QR code",
                    width: 100,
                    accessor: "qr_code"
                },
                {
                    title: "Paid Amount/ Amount",
                    width: 120,
                    cell: row => {
                        let amountTransaction = 0;
                        if (Array.isArray(row?.transaction_items)) {
                            amountTransaction = row?.transaction_items.reduce((c, v) => {
                                const amount = Number(v?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_YES ? Number(v.amount) : 0;
                                c += amount;
                                return c;
                            }, 0);
                        }
                        return <>
                            {formatNumber(amountTransaction, 0, ".", "đ")}
                            <span className="ml5 mr5">/</span>
                            {formatNumber(row?.amount, 0, ".", "đ")}
                        </>
                    }
                },
                {
                    title: "Trạng thái payment",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status}
                                           value={row?.status}/>;
                    }
                },
                {
                    title: "Transaction ID",
                    width: 160,
                    cell: row => {
                        const transaction_items = row?.transaction_items || [];
                        return transaction_items.map((item, idx) => (
                            Number(item?.status_confirm) === Constant.TRANSACTION_STATUS_CONFIRM_YES &&
                            <Link
                                to={`${Constant.BASE_URL_PAYMENT_MANAGE_TRANSACTION}?${queryString.stringify({
                                    transaction_id: item.id,
                                    action: "list"
                                })}`}
                                key={idx.toString()}
                            >
                                <span className="text-link mr10">{item.id}</span>
                            </Link>
                        ));
                    }
                },
                {
                    title: "Hành động",
                    width: 160,
                    cell: row => (
                        <CanRender actionCode={ROLES.payment_manage_payment_logs}>
                                <span className="text-link text-warning font-bold mr5"
                                      onClick={() => this.onHistoryLog(row?.id)}>
                                    Xem lịch sử
                                </span>
                        </CanRender>
                    )
                }
            ],
            loading: false,
        };
        this.onHistoryLog = this._onHistoryLog.bind(this);
    }

    _onHistoryLog(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_PAYMENT_MANAGE_PAYMENT,
            search: '?action=logs&payment_id=' + id
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                title="Danh Sách Payment"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <ComponentFilter idKey={idKey} query={query}/>
                <Gird idKey={idKey}
                      fetchApi={getListPayment}
                      query={query}
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
