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
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {
    approveFieldRegistrationJobBox, cancelFieldRegistrationJobBox,
    deleteFieldRegistrationJobBox,
    getListFieldRegistrationJobBox
} from "api/saleOrder";
import Gird from "components/Common/Ui/Table/Gird";
import moment from "moment";
import * as Constant from "utils/Constant";
import PopupRegistrationJobBox from "pages/Checkmate/SalesOrderByFieldPage/Package/Popup/PopupRegistrationJobBox";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "FieldRegistrationJobBox";

class FieldPackageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Tin tuyển dụng",
                    width: 100,
                    cell: row => {
                        return <>{row?.job_id} - {row?.cache_job_title}</>
                    }
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_field_registration_status}
                                             value={row?.status}/>
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.start_date).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Ngày hết hạn",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.end_date).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Hành động",
                    width: 80,
                    cell: row => (
                        <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_registration}>
                            {parseInt(row?.status) === Constant.STATUS_INACTIVED && (
                                <>
                                    <span className="text-link text-blue font-bold mr10"
                                          onClick={() => this.onApprove(row?.id)}>Duyệt
                                    </span>
                                    <span className="text-link text-red font-bold"
                                          onClick={() => this.onDelete(row?.id)}>Xóa đăng ký
                                </span>
                                </>
                            )}
                            {parseInt(row?.status) === Constant.STATUS_ACTIVED && (
                                <span className="text-link text-red font-bold mr10"
                                      onClick={() => this.onCancel(row?.id)}>Hạ tin
                                </span>
                            )}
                        </CanRender>
                    )
                },
            ]
        };

        this.onCreate = this._onCreate.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onCancel = this._onCancel.bind(this);
    }

    _onCreate() {
        const {actions, id, sales_order} = this.props;
        actions.createPopup(PopupRegistrationJobBox, "Thêm mới", {
                idKey: idKey,
                sales_order: sales_order,
                sales_order_items_id: id
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
                const res = await deleteFieldRegistrationJobBox({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
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
                const res = await approveFieldRegistrationJobBox({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    _onCancel(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn hạ tin ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await cancelFieldRegistrationJobBox({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, history, id, sales_order} = this.props;

        return (
            <div>
                <div className="mt10 mb10">
                    {parseInt(sales_order.status) === Constant.SALE_ORDER_ACTIVED && (
                        <button className="el-button el-button-primary el-button-small" type="button"
                                onClick={this.onCreate}>
                            Đăng ký
                        </button>
                    )}
                </div>
                <Gird idKey={idKey}
                      fetchApi={getListFieldRegistrationJobBox}
                      query={{...query, sales_order_items_id: id}}
                      columns={columns}
                      defaultQuery={{}}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                      isPagination={false}
                />
            </div>
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

export default connect(null, mapDispatchToProps)(FieldPackageList);
