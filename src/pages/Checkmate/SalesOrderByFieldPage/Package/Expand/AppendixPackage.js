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
    deleteFieldSalesOrderScheduleUser,
    getListFieldSalesOrderScheduleUser
} from "api/saleOrder";
import Gird from "components/Common/Ui/Table/Gird";
import moment from "moment";
import * as Constant from "utils/Constant";
import PopupAddCandidate from "pages/Checkmate/SalesOrderByFieldPage/Package/Popup/PopupAddCandidate";
import {formatNumber} from "utils/utils";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "AppendixPackageUserList";

class AppendixPackage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {column: null};
        this.onCreate = this._onCreate.bind(this);
        this.onUpdate = this._onUpdate.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onCreate() {
        const {actions, id, sales_order} = this.props;
        actions.createPopup(PopupAddCandidate, "Thêm mới", {
                idKey: idKey,
                sales_order: sales_order,
                schedule_id: id
            },
        );
    }

    _onUpdate(object_id) {
        const {actions, id, sales_order} = this.props;
        actions.createPopup(PopupAddCandidate, "Chỉnh sửa", {
                id: object_id,
                idKey: idKey,
                sales_order: sales_order,
                schedule_id: id
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
                const res = await deleteFieldSalesOrderScheduleUser({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    initColumn() {
        this.setState({
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Tên ứng viên",
                    width: 140,
                    accessor: "seeker_name"
                },
                {
                    title: "Mức lương",
                    width: 120,
                    cell: row => <>{formatNumber(row.salary, 0, '.', ' đ')}</>
                },
                {
                    title: "Tỉ lệ thanh toán",
                    width: 140,
                    cell: row => <>{row.payment_rate}%</>
                },
                {
                    title: "Tin tuyển dụng",
                    width: 100,
                    cell: row => {
                        return <>{row?.job_id} - {row?.cache_job_title}</>
                    }
                },
                {
                    title: "Tuyển dụng bảo hành",
                    width: 140,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_compensation_recruitment_status} value={row.compensation_recruitment} />
                },
                {
                    title: "File đính kèm",
                    width: 140,
                    cell: row => row.document_file && <a href={row.document_file_url || ""} download rel="noopener noreferrer" className="text-link" target="_blank">Tải xuống</a>
                },
                {
                    title: "Thành tiền",
                    width: 120,
                    cell: row => <span className="text-red">{formatNumber(row.hiring_fee, 0, '.', ' đ')}</span>
                },
                {
                    title: "Ngày onboard",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.onboard_at).format("DD-MM-YYYY hh:mm:ss")}</>;
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
                    width: 80,
                    cell: row => (
                        <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_appendix}>
                            {parseInt(this.props.status) === Constant.SALE_ORDER_NOT_COMPLETE && (
                                <>
                                    <span className="text-link text-blue font-bold mr10"
                                          onClick={() => this.onUpdate(row?.id)}>
                                        Chỉnh sửa
                                    </span>
                                    <span className="text-link text-red font-bold"
                                          onClick={() => this.onDelete(row?.id)}>Xóa đăng ký
                                    </span>
                                </>
                            )}
                        </CanRender>
                    )
                },
            ]
        })
    }

    componentDidMount() {
        this.initColumn();
    }

    render() {
        const {columns} = this.state;
        const {query, history, id, status} = this.props;

        return (
            <div>
                <div className="mt10 mb10">
                    {parseInt(status) === Constant.SALE_ORDER_NOT_COMPLETE && (
                        <button className="el-button el-button-primary el-button-small" type="button"
                                onClick={this.onCreate}>
                            Thêm ứng viên
                        </button>
                    )}
                </div>
                {columns && (
                    <Gird idKey={idKey}
                          fetchApi={getListFieldSalesOrderScheduleUser}
                          query={{...query, schedule_id: id}}
                          columns={columns}
                          defaultQuery={{}}
                          history={history}
                          isPushRoute={false}
                          isRedirectDetail={false}
                          isPagination={false}
                    />
                )}
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

export default connect(null, mapDispatchToProps)(AppendixPackage);
