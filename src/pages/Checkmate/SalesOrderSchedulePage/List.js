import React from "react";
import {connect} from "react-redux";
import {
    putToastError,
    putToastSuccess,
    createPopup,
    deletePopup,
    SmartMessageBox,
    hideSmartMessageBox
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {
    getListFieldSalesOrderSchedulePagination,
    approveFieldSalesOrderSchedule,
    rejectFieldSalesOrderSchedule,
    confirmPaymentFieldSalesOrderSchedule,
} from "api/saleOrder";
import Gird from "components/Common/Ui/Table/Gird";
import moment from "moment";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {formatNumber} from "utils/utils";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Checkmate/SalesOrderSchedulePage/ComponentFilter";
import {Link} from "react-router-dom";
import queryString from "query-string";
import AppendixPackageList from "pages/Checkmate/SalesOrderByFieldPage/Package/Expand/AppendixPackage";

const idKey = "SalesOrderSchedule";

class SalesOrderSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id",
                },
                {
                    title: "Mã phiếu",
                    width: 60,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            taget="_blank"
                            to={`${Constant.BASE_URL_SALES_ORDER_BY_FIELD}?${queryString.stringify({
                                id: row.sales_order_id,
                                action: "edit"
                            })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Tên biên bản",
                    width: 120,
                    accessor: "name",
                },
                {
                    title: "Mã nhân viên",
                    width: 100,
                    accessor: "staff_code",
                },
                {
                    title: "Tổng tiền",
                    width: 100,
                    cell: row => <>{formatNumber(row.total_amount, 0, '.', ' đ')}</>
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_by_field_status}
                                             value={row?.status}/>
                },
                {
                    title: "Ngày duyệt",
                    width: 100,
                    cell: row => {
                        return <>{row?.approved_at && moment.unix(row?.approved_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Thanh toán",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_schedule_checkout_status}
                                             value={row?.payment_status}/>
                },
                {
                    title: "Ngày xác nhận thanh toán",
                    width: 100,
                    cell: row => {
                        return <>{row?.payment_at && moment.unix(row?.payment_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Hành động",
                    width: 160,
                    onClick: () => {
                    },
                    cell: row => {
                        if([Constant.STATUS_ACTIVED].includes(parseInt(row.payment_status))) {
                            return <></>
                        }
                        if([Constant.SALE_ORDER_ACTIVED].includes(parseInt(row.status))) {
                            return (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_appendix_approve}>
                                    <span className="text-underline text-success cursor-pointer font-bold mr10"
                                          onClick={() => this.onMarkCheckout(row?.id)}>
                                        Xác nhận thanh toán
                                    </span>
                                </CanRender>
                            )
                        }
                        if(parseInt(row.status) === Constant.SALE_ORDER_INACTIVE) {
                            return (
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_appendix_approve}>
                                    <span className="text-link text-success font-bold mr10"
                                          onClick={() => this.onApprove(row?.id)}>
                                        Duyệt
                                    </span>
                                    <span className="text-danger text-underline font-bold mr10"
                                          onClick={() => this.onReject(row?.id)}>
                                        Không duyệt
                                    </span>
                                </CanRender>
                            )
                        }
                    }
                },
            ]
        };

        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onMarkCheckout = this._onMarkCheckout.bind(this);
    }

    _onApprove(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn duyệt ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                const res = await approveFieldSalesOrderSchedule({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    _onReject(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn không duyệt ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                const res = await rejectFieldSalesOrderSchedule({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    _onMarkCheckout(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn đánh dấu thanh toán ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                const res = await confirmPaymentFieldSalesOrderSchedule({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Biên Bản Nghiệm Thu"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListFieldSalesOrderSchedulePagination}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, "not[status]": Constant.STATUS_INACTIVED}}
                      history={history}
                      isRedirectDetail={false}
                      isExpandRowChild={true}
                      expandRow={row => <AppendixPackageList history={history} sales_order={{}} {...row}/>}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            createPopup,
            deletePopup,
            hideSmartMessageBox,
            SmartMessageBox
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SalesOrderSchedule);
