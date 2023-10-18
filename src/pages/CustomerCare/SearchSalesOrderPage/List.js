import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {
    getListSearchSalesOrderRegistration,
    previewSalesOrder,
    printPaymentRequest,
} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/SalesOrderPage/ComponentFilter";
import {hideLoading, showLoading} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as utils from "utils/utils";
import queryString from "query-string";
import {Link} from "react-router-dom";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "SearchSalesOrder",
            columns: [
                {
                    title: "Mã phiếu",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
                                id: row.id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.id}</span>
                            {(row?.old_channel_code === Constant.CHANNEL_CODE_MW || row?.old_channel_code === Constant.CHANNEL_CODE_MW_FROM_TVN || row?.old_channel_code === Constant.CHANNEL_CODE_VL24H_DELETE) && (
                                <span className="ml5 label"
                                      style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW</span>
                            )}
                            {row?.old_channel_code === Constant.CHANNEL_CODE_TVN && (
                                <span className="ml5 label"
                                      style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN</span>
                            )}
                        </Link>
                    )
                },
                {
                    title: "Tên NTD",
                    width: 200,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail",
                                id: row?.employer_info?.id
                            })}`}>
                            <span>{row?.employer_info?.id} - {row?.employer_info?.name}</span>
                        </Link>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 140,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Ngày duyệt",
                    width: 140,
                    cell: row => {
                        return <>{row?.approved_at && moment.unix(row?.approved_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status} value={row?.status}/>;
                    }
                },
                {
                    title: "Loại phiếu",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_type_campaign} value={row?.type_campaign}/>;
                    }
                },
                {
                    title: "Trạng thái thanh toán",
                    width: 100,
                    cell: row => {
                        return (
                            <>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status}
                                            value={row?.payment_status}/>
                                {row?.request_approve_status &&
                                <>
                                    <br/>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_approve_status}
                                                value={row?.request_approve_status}/>
                                </>
                                }
                                <br/>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_confirm_payment_status}
                                            value={row?.confirm_payment_status}/>
                            </>
                        );
                    }
                },
                {
                    title: "Hết hạn",
                    width: 90,
                    cell: row => {
                        const oneDay = 60 * 60 * 24;
                        const date = (row.expired_at - moment()
                            .unix()) > 0 ? Math.floor((row.expired_at - moment()
                            .unix()) / oneDay) : false;
                        return (
                            row.expired_at &&
                            <React.Fragment>
                                <div>
                                    {moment.unix(row.expired_at).format("DD/MM/YYYY")}
                                </div>
                                {date && (
                                    <div className="textRed">
                                        {`(Còn ${date} ngày)`}
                                    </div>
                                )}
                            </React.Fragment>
                        )
                    }
                },
                {
                    title: "Tổng tiền",
                    width: 100,
                    cell: row => {
                        let total = row?.total_amount_unit;
                        if (row?.credit_apply) {
                            total = row?.total_amount_credit_apply;
                        }
                        return <>{utils.formatNumber(total, 0, ".", "đ")}</>;
                    }
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    }
                },
                {
                    title: "Hành động",
                    width: 200,
                    cell: row => <div>
                        {[
                            Constant.SALE_ORDER_NOT_COMPLETE,
                            Constant.SALE_ORDER_INACTIVE,
                            Constant.SALE_ORDER_ACTIVED,
                            Constant.SALE_ORDER_EXPIRED,
                            Constant.SALE_ORDER_EXPIRED_ACTIVE,
                        ].includes(parseInt(row.status)) && (
                            <CanRender
                                actionCode={ROLES.customer_care_sales_order_preview_sales_order}>
                                <div
                                        className="text-primary font-bold"
                                        onClick={() => this.btnPrint(row.id)}>
                                    <span>In phiếu</span>
                                </div>
                            </CanRender>

                        )}
                        {[
                            Constant.SALE_ORDER_INACTIVE,
                            Constant.SALE_ORDER_ACTIVED,
                            Constant.SALE_ORDER_EXPIRED,
                            Constant.SALE_ORDER_EXPIRED_ACTIVE,
                        ].includes(parseInt(row.status)) && Constant.SALE_ORDER_CANCEL !== parseInt(row.status) && (
                            <CanRender
                                actionCode={ROLES.customer_care_sales_order_print_payment_request}>
                                <div
                                    className="text-primary font-bold"
                                    onClick={() => this.btnPrintPaymentRequest(row.id)}>
                                    <span>In phiếu đề nghị thanh toán</span>
                                </div>
                            </CanRender>
                        )}

                    </div>
                },
            ],
            loading: false,
        };
        this.btnPrint = this._btnPrint.bind(this);
        this.btnPrintPaymentRequest = this._btnPrintPaymentRequest.bind(this);
    }

    async _btnPrint(id) {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await previewSalesOrder({id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    async _btnPrintPaymentRequest(id) {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await printPaymentRequest({id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    render() {
        const {columns, idKey} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách Phiếu Đăng Ký"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListSearchSalesOrderRegistration}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators({showLoading, hideLoading}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);