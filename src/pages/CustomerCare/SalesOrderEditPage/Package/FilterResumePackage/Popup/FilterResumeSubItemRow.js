import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupChangeStaffRevenue from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeStaffRevenue";
import PopupDeleteRegisCancel from "./PopupDeleteRegisCancel";
import PopupRegisCancel from "./PopupRegisCancel";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import SpanSystem from "components/Common/Ui/SpanSystem";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { reserveRegistrationJobCreate, reserveRegistrationJobOpen } from "api/saleOrder";
import { removeRegisFilterResumer, approveRegisFilterResumer, approveDropRegisFilterResumer } from "api/saleOrder";

class FilterResumeSubItemRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.btnDelete = this._btnDelete.bind(this);
        this.btnRegisCancel = this._btnRegisCancel.bind(this);
        this.btnDeleteRegisCancel = this._btnDeleteRegisCancel.bind(this);
        this.btnApprove = this._btnApproveRegistration.bind(this);
        this.btnApproveCancel = this._btnApproveCancel.bind(this);
        this.onUpdateStaff = this._onUpdateStaff.bind(this);
        this.btnReserveOpen = this._btnReserveOpen.bind(this);
        this.btnReserveCreate = this._btnReserveCreate.bind(this);
    }

    async _btnDelete(object) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                const params = {
                    id: object.id,
                    sales_order_id: this.props.sales_order_id,
                    sales_order_items_id: object?.sales_order_items_id
                };
                const res = await removeRegisFilterResumer(params);
                if (res) {
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    this.props.fallback()
                }

                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.hideLoading();
            }
        });
    }

    _btnRegisCancel(object) {
        this.props.uiAction.createPopup(PopupRegisCancel, "Đăng Ký Hạ Dịch Vụ", {
            object: {
                registration_id: object?.id,
                sales_order_id: object.sales_order_id,
                sales_order_items_id: object.sales_order_items_id,
            },
            refresh_page: ConstantURL.API_URL_POST_DROP_REGIS_FILTER_RESUME,
            url_reject: ConstantURL.API_URL_POST_DROP_REGIS_FILTER_RESUME,
            fallback: () => this.props.fallback()
        });
    }

    _btnDeleteRegisCancel(object) {
        this.props.uiAction.createPopup(PopupDeleteRegisCancel, "Hủy Đăng Ký Hạ Dịch Vụ", {
            object: {
                id: object?.request_drop_id,
                sales_order_id: this.props.sales_order.id,
            },
            refresh_page: ConstantURL.API_URL_POST_REGIS_CANCEL_DELETE,
            url_reject: ConstantURL.API_URL_POST_REGIS_CANCEL_DELETE,
            fallback: () => this.props.fallback()
        });
    }

    async _btnApproveRegistration(id) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt gói?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            const { loading } = this.state;

            if (ButtonPressed === "Yes" && !loading) {
                this.setState({ loading: true })
                this.props.uiAction.showLoading();
                const params = { registration_account_service_resume_id: id };
                const res = await approveRegisFilterResumer(params);
                this.setState({ loading: false })
                if (res) {
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    this.props.fallback()
                }

                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.hideLoading();
            }
        });
    }

    _btnApproveCancel(item) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt hạ gói quản lý tài khoản điểm dịch vụ ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                const params = { drop_registration_id: item.request_drop_id };
                const res = await approveDropRegisFilterResumer(params);
                if (res) {
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    this.props.fallback();
                }
                else {
                    this.props.uiAction.putToastError(res?.msg);
                }
                this.props.uiAction.hideLoading();
            }
            this.props.uiAction.hideSmartMessageBox();
        });
    }

    _onUpdateStaff(item) {
        this.props.uiAction.createPopup(PopupChangeStaffRevenue, "Thay đổi CSKH nhận revenue", {
            item: item,
        });
    }

    _btnReserveCreate() {
        const { uiAction, sub_item } = this.props;
        uiAction.SmartMessageBox({
            title: "Xác nhận bảo lưu gói dịch vụ",
            content: <p>Số ngày bảo lưu còn lại = {sub_item?.remaining_day_reserve} ngày - {sub_item.remaining_point} CV. <br />
                Bạn có muốn tiếp tục?</p>,
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await reserveRegistrationJobCreate({
                    id: sub_item?.id
                });
                if (res?.code === Constant.CODE_SUCCESS) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    uiAction.hideSmartMessageBox();
                    this.props.fallback()
                } else {
                    this.props.uiAction.putToastError(res?.msg);
                    uiAction.hideSmartMessageBox();
                }
            } else {
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _btnReserveOpen() {
        const { uiAction, sub_item } = this.props;
        uiAction.SmartMessageBox({
            title: "Xác nhận mở bảo lưu gói?",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await reserveRegistrationJobOpen({
                    id: sub_item?.id,
                });

                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");;
                    this.props.fallback();
                }
            }
            uiAction.hideSmartMessageBox();
        })
    }

    render() {
        const { isLoading, data_list, branch, data } = this.props;
        const channel_code = branch.currentBranch.channel_code;
        const sales_order_regis_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_regis_status);
        const isGift = data?.type_campaign === Constant.CAMPAIGN_TYPE_GIFT;

        const isReserveDefault = this.props.sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_ACTIVED;

        let isReserveCreate = isReserveDefault;
        const now = moment().unix();
        if ([Constant.CHANNEL_CODE_MW].includes(channel_code)) {
            const isExpiredReserve = Number(this.props.sub_item?.reserve_expired_at) >= now || !(this.props.sub_item?.reserve_expired_at);
            isReserveCreate = isReserveDefault && isExpiredReserve;
        }

        const isReserveOpenDefault = this.props.sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_PROCESS;

        let isReserveOpen = isReserveOpenDefault;
        if ([Constant.CHANNEL_CODE_MW].includes(channel_code)) {
            const isExpiredReserve = Number(this.props.sub_item?.reserve_expired_at) >= now || !(this.props.sub_item?.reserve_expired_at);
            isReserveOpen = isReserveOpenDefault && isExpiredReserve;
        }

        return (
            <div className="card-body children-table">
                {isLoading ? (
                    <div className="text-center">
                        <LoadingSmall />
                    </div>
                ) : (
                    <div className="body-table el-table table-child">
                        <div className="mt10 d-flex">
                            {
                                isReserveCreate && (
                                    isGift ? <CanRender actionCode={ROLES.customer_care_sales_order_reserve_registration_assistant_job_create_gift}>
                                        <button type="button" className="el-button el-button-info el-button-small"
                                            onClick={this.btnReserveCreate}>
                                            <span>Bảo lưu gói tặng</span>
                                        </button>
                                    </CanRender>
                                    : <CanRender actionCode={ROLES.customer_care_sales_order_reserve_registration_assistant_job_create}>
                                        <button type="button" className="el-button el-button-info el-button-small"
                                            onClick={this.btnReserveCreate}>
                                            <span>Bảo lưu gói thường</span>
                                        </button>
                                    </CanRender>
                                )
                            }
                            {
                                isReserveOpen &&
                                <CanRender
                                    actionCode={ROLES.customer_care_sales_order_reserve_registration_assistant_job_open}>
                                    <div className="text-underline pointer">
                                        <button type="button" className="el-button el-button-warning el-button-small"
                                            onClick={this.btnReserveOpen}>
                                            <span>Mở bảo lưu</span>
                                        </button>
                                    </div>
                                </CanRender>
                            }
                        </div>
                        <TableComponent>
                            <TableHeader tableType="TableHeader" width={400}>
                                Thông tin đăng ký
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Thao tác
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Lịch sử ghi nhận
                            </TableHeader>
                            <TableBody tableType="TableBody">
                                {Array.isArray(data_list) && data_list.map((sub_item, key) => {
                                    let status = parseInt(sub_item.status);

                                    return (
                                        <tr key={key} className={classnames("el-table-row")}>
                                            <td>
                                                <div className="cell-custom">
                                                    <div>Mã đăng ký: <span className="text-bold">{sub_item.id}</span></div>
                                                    <div>Loại gói: <span className="text-bold text-red">
                                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_fee_type} value={Number(sub_item?.fee_type)} notStyle />
                                                    </span>
                                                        <div>CV mua: <span className="text-bold">{sub_item.total_point} CV</span></div>
                                                    </div>
                                                    <div>Thời gian hiệu lực:  <span className="text-bold">{utils.convertNumberToWeekDay(sub_item?.total_day_quantity)} ({moment.unix(sub_item.start_date).format("DD/MM/YYYY")} - {moment.unix(sub_item?.end_date).format("DD/MM/YYYY")})</span></div>
                                                    <div>Ngày chạy thực tế: (<span className="text-bold">{moment.unix(sub_item.start_date).format("DD/MM/YYYY")} - {moment.unix(sub_item?.expired_at).format("DD/MM/YYYY")})</span></div>
                                                    <div>Trạng thái đăng ký: <span className="text-bold textBlue">{sales_order_regis_status[sub_item.status]}</span></div>
                                                    {[Constant.STATUS_DISABLED].includes(status) && (
                                                        <div>Lý do: {sub_item.rejected_note}</div>
                                                    )}
                                                    {sub_item.request_drop_status && (
                                                        <div>Trạng thái hạ dịch vụ: <span className="text-bold textBlue">{sales_order_regis_status[sub_item.request_drop_status]}</span></div>
                                                    )}
                                                    {sub_item.field_id && (
                                                        <div>Ngành hiển thị: <SpanSystem value={sub_item?.field_id} type={"jobField"} notStyle /></div>
                                                    )}
                                                    {sub_item.gate && (
                                                        <div>Cổng hiển thị: <SpanSystem value={sub_item?.gate} idKey={"code"} label={"full_name"} type={"gate"} notStyle /></div>
                                                    )}
                                                    {
                                                        sub_item?.booking_banner_code &&
                                                        <div>Mã booking: <span className="text-bold">{sub_item.booking_banner_code}</span></div>
                                                    }

                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    {[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(status) &&
                                                        (
                                                            <>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-success" onClick={() => { this.btnApprove(sub_item.id) }}>
                                                                        Duyệt
                                                                    </span>
                                                                </div>

                                                                <CanRender actionCode={ROLES.customer_care_sales_order_remove_regis_filter_resume}>
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-danger" onClick={() => { this.btnDelete(sub_item) }}>Xóa đăng ký</span>
                                                                    </div>
                                                                </CanRender>
                                                            </>

                                                        )}
                                                    {[Constant.STATUS_ACTIVED].includes(status) && (
                                                        <>
                                                            {!sub_item.request_drop_id && (
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger" onClick={() => { this.btnRegisCancel(sub_item) }}>Đăng ký hạ dịch vụ</span>
                                                                </div>
                                                            )}
                                                            {sub_item.request_drop_id !== null && (
                                                                <div>
                                                                    <CanRender actionCode={ROLES.customer_care_sales_order_drop_regis_filter_resume}>
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-success" onClick={() => { this.btnApproveCancel(sub_item) }}>
                                                                                Duyệt hạ
                                                                            </span>
                                                                        </div>
                                                                    </CanRender>
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-danger" onClick={() => { this.btnDeleteRegisCancel(sub_item) }}>Xóa đăng ký hạ dịch vụ</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    <div>CSKH nhận revenue: <span className="text-bold margin-bottom-5">{sub_item.revenue_by_staff_code}</span></div>
                                                    <div>Người hạ: <span className="text-bold margin-bottom-5">{sub_item.request_drop_approved_by}</span></div>
                                                    <div>Lý do hạ: <span className="text-bold margin-bottom-5">{sub_item.request_drop_rejected}</span></div>
                                                    <CanRender actionCode={ROLES.customer_care_sales_order_change_staff_revenue}>
                                                        <div className="mt-5">
                                                            <span className="text-link text-red pointer" onClick={() => this.onUpdateStaff(sub_item)}>Thay đổi CSKH nhận revenue</span>
                                                        </div>
                                                    </CanRender>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </TableBody>
                        </TableComponent>
                    </div>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterResumeSubItemRow);