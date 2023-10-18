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
import {deleteSalesOrderByFieldItems, getListSalesOrderByFieldItems} from "api/saleOrder";
import Gird from "components/Common/Ui/Table/Gird";
import moment from "moment";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {formatNumber} from "utils/utils";
import PopupFieldPackage from "pages/Checkmate/SalesOrderByFieldPage/Package/Popup/PopupFieldPackage";
import FieldPackageList from "pages/Checkmate/SalesOrderByFieldPage/Package/Expand/FieldPackage";

const idKey = "FieldPackageList";

class FieldPackage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Thông tin cơ bản",
                    width: 250,
                    cell: row => (
                        <>
                            <p className="mb0">Mã mua dịch vụ: <b>{row.id}</b></p>
                            <p className="mb0">Mã SKU: <b>{row.sku_code}</b></p>
                            <p className="mb0">Tên gói: <b>{row.sku_name}</b></p>
                            <p className="mb0">Số lượng tuyển dụng: <b>{row.total_resume_required}</b></p>
                            <p className="mb0">Level tuyển dụng:
                                <b className="ml5"><SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_by_field_items_level}
                                               value={row.job_level} notStyle/></b>
                            </p>
                            <p className="mb0">Thời gian mua: <b>{row.total_week} tuần</b></p>
                            <p className="mb0">Số tin: <b>{row?.total_job} tin</b></p>
                            <p className="mb0">Ngày tạo: <b>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</b></p>
                        </>
                    )
                },
                {
                    title: "Thông tin gói",
                    width: 200,
                    cell: row => (
                        <p className="mb0">Tên gói: <b>{row?.price_list_info?.name}</b></p>
                    )
                },
                {
                    title: "Thành tiền",
                    width: 200,
                    cell: row => (
                        <>
                            <p className="mb0">Lương tối thiểu:
                                <b className="ml5">{formatNumber(row.salary_min, 0, ".", " đ")}</b>
                            </p>
                            <p className="mb0">Lương tối đa:
                                <b className="ml5">{formatNumber(row.salary_max, 0, ".", " đ")}</b>
                            </p>
                            <p className="mb0">Lương trung bình:
                                <b className="ml5">{formatNumber(row.salary_average, 0, ".", " đ")}</b>
                            </p>
                            <p className="mb0">Đơn giá:
                                <b className="ml5">{formatNumber(row.unit_price, 0, ".", " đ")}</b>
                            </p>
                            <p className="mb0">Tỉ lệ:
                                <b className="ml5">{row?.price_list_percent}% * {row.price_list_total_month} tháng</b>
                            </p>
                            <p className="mb0"><span className="text-red">Tổng tiền dự tính</span>:
                                <b className="ml5">{formatNumber(row.total_price, 0, ".", " đ")}</b>
                            </p>
                        </>
                    )
                },
                {
                    title: "Hành động",
                    width: 80,
                    cell: row => {
                        if (parseInt(props.object?.status) !== Constant.SALE_ORDER_NOT_COMPLETE) {
                            return <></>;
                        }
                        return (
                            <>
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_update_items}>
                                    <span className="text-link text-blue font-bold mr10"
                                          onClick={() => this.onUpdate(row?.id)}>
                                        Chỉnh sửa
                                    </span>
                                </CanRender>
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_delete_items}>
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
    }

    _onCreate() {
        const {actions, sales_order_id} = this.props;
        actions.createPopup(PopupFieldPackage, "Thêm mới", {
                id: 0,
                sales_order_id: sales_order_id,
                idKey: idKey
            },
        );
    }

    _onUpdate(id) {
        const {actions, sales_order_id} = this.props;
        actions.createPopup(PopupFieldPackage, "Chỉnh sửa", {
                id: id,
                sales_order_id: sales_order_id,
                idKey: idKey
            },
        );
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteSalesOrderByFieldItems({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                    publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_BY_FIELD_EDIT);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, history, sales_order_id, object} = this.props;

        return (
            <Default
                title="Gói bán hiệu quả ngành IT"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_create_items}>
                        {[Constant.SALE_ORDER_NOT_COMPLETE].includes(parseInt(object?.status)) && (
                            <div className="left btnCreateNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small mr10"
                                        onClick={this.onCreate}>
                                    <span>Mua gói <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        )}
                    </CanRender>
                }
            >
                <h5 className="text-red mt30 mb20">Tổng tiền dự tính: {formatNumber(object?.total_price, 0, '.', 'đ')}</h5>
                <Gird idKey={idKey}
                      fetchApi={getListSalesOrderByFieldItems}
                      query={query}
                      columns={columns}
                      defaultQuery={{sales_order_id: sales_order_id}}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                      isOpenExpand={true}
                      isExpandRowChild={true}
                      expandRow={row => <FieldPackageList history={history} sales_order={object} {...row}/>}
                      isPagination={false}
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

export default connect(null, mapDispatchToProps)(FieldPackage);
