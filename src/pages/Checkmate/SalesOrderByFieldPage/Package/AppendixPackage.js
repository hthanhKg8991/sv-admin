import React from "react";
import {connect} from "react-redux";
import {
    putToastError,
    putToastSuccess,
    createPopup,
    deletePopup,
    SmartMessageBox,
    hideSmartMessageBox,
    showLoading,
    hideLoading,
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {
    approveFieldSalesOrderSchedule,
    deleteFieldSalesOrderSchedule,
    getListFieldSalesOrderSchedule,
    printFieldPrintTemplate,
    rejectFieldSalesOrderSchedule,
    submitFieldSalesOrderSchedule
} from "api/saleOrder";
import Gird from "components/Common/Ui/Table/Gird";
import PopupAppendixPackage from "pages/Checkmate/SalesOrderByFieldPage/Package/Popup/PopupAppendixPackage";
import AppendixPackageList from "pages/Checkmate/SalesOrderByFieldPage/Package/Expand/AppendixPackage";
import moment from "moment";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {formatNumber} from "utils/utils";

const idKey = "AppendixExpandPackageList";

class AppendixPackage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 80,
                    accessor: "id",
                },
                {
                    title: "Tên biên bản",
                    width: 140,
                    accessor: "name",
                },
                {
                    title: "Mã nhân viên",
                    width: 140,
                    accessor: "staff_code",
                },
                {
                    title: "Tổng tiền",
                    width: 120,
                    cell: row => <>{formatNumber(row.total_amount, 0, '.', ' đ')}</>
                },
                {
                    title: "Trạng thái",
                    width: 80,
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
                    width: 140,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Hành động",
                    width: 200,
                    onClick: () => {},
                    cell: row => {
                        if([Constant.SALE_ORDER_ACTIVED, Constant.SALE_ORDER_DISABLED, Constant.SALE_ORDER_INACTIVE].includes(parseInt(row.status))) {
                            return (
                                <>
                                    <span className="text-underline cursor-pointer text-success font-bold mr10"
                                          onClick={() => this.onPrint(row?.sales_order_id, row?.id, 'bien_ban_nghiem_thu')}>
                                        In biên bản nghiệm thu
                                </span>
                                </>
                            );
                        }
                        return (
                            <>
                                <span className="text-underline cursor-pointer text-success font-bold mr10"
                                      onClick={() => this.onPrint(row?.sales_order_id, row?.id, 'bien_ban_nghiem_thu')}>
                                        In biên bản nghiệm thu
                                </span>
                                <br/>
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_schedule_manage}>
                                    <span className="text-link text-blue font-bold mr10"
                                          onClick={() => this.onUpdate(row?.id)}>
                                        Chỉnh sửa
                                    </span>
                                </CanRender>
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_schedule_manage}>
                                    <span className="text-link text-success font-bold mr10"
                                          onClick={() => this.onComplete(row?.id)}>
                                        Hoàn thành
                                    </span>
                                </CanRender>
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_schedule_manage}>
                                    <span className="text-link text-red font-bold"
                                          onClick={() => this.onDelete(row?.id)}>
                                         Xóa
                                    </span>
                                </CanRender>
                            </>
                        )
                    }
                },
            ]
        };

        this.onCreate = this._onCreate.bind(this);
        this.onUpdate = this._onUpdate.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onComplete = this._onComplete.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onPrint = this._onPrint.bind(this);
    }

    _onCreate() {
        const {actions, object} = this.props;
        actions.createPopup(PopupAppendixPackage, "Thêm mới", {
                idKey: idKey,
                sales_order: object,
            },
        );
    }

    _onUpdate(id) {
        const {actions, object} = this.props;
        actions.createPopup(PopupAppendixPackage, "Chỉnh sửa", {
                id: id,
                idKey: idKey,
                sales_order: object,
            },
        );
    }

    _onComplete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn hoàn thành ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                const res = await submitFieldSalesOrderSchedule({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                    publish(".refresh", {}, "AppendixExpandPackageList");
                }
                publish(".refresh", {}, idKey)
            }
        });
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

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                actions.hideSmartMessageBox();
                const res = await deleteFieldSalesOrderSchedule({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
            }
        });
    }

    async _onPrint(sales_order_id, id, code) {
        const {actions} = this.props;
        actions.showLoading();
        const res = await printFieldPrintTemplate({sales_order_id: sales_order_id, schedule_id: id, code: code});
        if (res) {
            window.open(res?.url, "_blank");
        }
        actions.hideLoading();
    }

    render() {
        const {columns} = this.state;
        const {query, history, sales_order_id, object} = this.props;

        return (
            <Default
                title="Biên bản nghiệm thu"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_schedule_manage}>
                        <div className="left btnCreateNTD">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small mr10"
                                    onClick={this.onCreate}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getListFieldSalesOrderSchedule}
                      query={query}
                      columns={columns}
                      defaultQuery={{sales_order_id: sales_order_id}}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                      isExpandRowChild={true}
                      isPagination={false}
                      expandRow={row => <AppendixPackageList history={history} sales_order={object} {...row}/>}
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
            SmartMessageBox,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(AppendixPackage);
