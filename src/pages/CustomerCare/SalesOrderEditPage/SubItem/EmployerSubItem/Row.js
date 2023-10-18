import React, {Component} from "react";
import {connect} from "react-redux";
import {reserveRegistrationJobCreate, reserveRegistrationJobOpen} from "api/saleOrder";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import EmployerPackageRegistration
    from "pages/CustomerCare/SalesOrderEditPage/Package/EmployerPackage/EmployerPackageRegistration";
import moment from "moment";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import PopupUpdateInfoSub from "pages/CustomerCare/SalesOrderPage/Popup/PopupUpdateInfoSub";
class EmployerSubItemRow extends Component {
    constructor() {
        super();
        this.btnReserveOpen = this._btnReserveOpen.bind(this);
        this.btnReserveCreate = this._btnReserveCreate.bind(this);
        this.updateInfoSub = this._updateInfoSub.bind(this);
    }

    _btnReserveCreate() {
        const {uiAction, sub_item} = this.props;
        // const {channel_code} = branch.currentBranch;
        // const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        uiAction.SmartMessageBox({
            title: "Xác nhận bảo lưu gói dịch vụ",
            content: <p>Số ngày bảo lưu còn lại = {sub_item?.remaining_day_reserve} ngày - {sub_item?.remaining_point} điểm. <br />
                {/*{!isMW ? `Sau khi bảo lưu sẽ không được mở bảo lưu trong ngày, phải qua ngày mới được mở bảo lưu.` : ""}*/}
                {/*{!isMW && <br />}*/}
                Bạn có muốn tiếp tục?</p>,
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await reserveRegistrationJobCreate({
                    id: sub_item?.id
                });
                if (res.code === Constant.CODE_SUCCESS) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    uiAction.hideSmartMessageBox();
                    publish(".refresh", {}, Constant.IDKEY_EMPLOYER_PACKAGE);
                } else {
                    uiAction.putToastError(res.msg);
                    uiAction.hideSmartMessageBox();
                }
            } else {
                uiAction.putToastError(res?.msg)
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _btnReserveOpen() {
        const {uiAction, sub_item} = this.props;
        uiAction.SmartMessageBox({
            title: "Xác nhận mở bảo lưu gói",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await reserveRegistrationJobOpen({
                    id: sub_item?.id
                });
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    uiAction.hideSmartMessageBox();
                    publish(".refresh", {}, Constant.IDKEY_EMPLOYER_PACKAGE);
                }
            } else {
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _updateInfoSub() {
        const {uiAction, idKey, sub_item, branch} = this.props;
        const channel_code = branch.currentBranch.channel_code;

        uiAction.createPopup(PopupUpdateInfoSub, "Cập nhật thông tin sub", {
            item: sub_item,
            idKey: idKey,
            channel_code,
        });
    }

    render() {
        const {sales_order_item, sales_order, idKey, data_list, sub_item, branch} = this.props;
        const channel_code = branch.currentBranch.channel_code;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        const isGift = sales_order_item?.type_campaign === Constant.CAMPAIGN_TYPE_GIFT;

        /**
         * MW bảo lưu có kiểm tra thêm hạn bảo lưu
         * + VHCRMV2-1024 Thêm tính năng bào lưu gói lọc cho VL24H/TVN
         */
        const isReserveDefault = sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_ACTIVED;
        let isReserveCreate = isReserveDefault;
        const now = moment().unix();
        if ([Constant.CHANNEL_CODE_MW, Constant.CHANNEL_CODE_TVN, Constant.CHANNEL_CODE_VL24H].includes(channel_code)) {
            const isExpiredReserve = Number(sub_item?.reserve_expired_at) >= now || !(sub_item?.reserve_expired_at);
            isReserveCreate = isReserveDefault && isExpiredReserve;
        }

        const isReserveOpenDefault = sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_PROCESS;
        let isReserveOpen = isReserveOpenDefault;
        if ([Constant.CHANNEL_CODE_MW, Constant.CHANNEL_CODE_TVN, Constant.CHANNEL_CODE_VL24H].includes(channel_code)) {
            const isExpiredReserve = Number(sub_item?.reserve_expired_at) >= now || !(sub_item?.reserve_expired_at);
            isReserveOpen = isReserveOpenDefault && isExpiredReserve;
        }
        /**
         * Phân quyền bảo lưu theo channel
         * @type {string}
         */
        let reserveCreateCode;
        if(isMW) {
            if(isGift) {
                reserveCreateCode = ROLES.customer_care_sales_order_request_reserve_registration_filter_create_mw_gift;
            } else {
                reserveCreateCode = ROLES.customer_care_sales_order_request_reserve_registration_filter_create_mw;
            }
        } else {
            reserveCreateCode = ROLES.customer_care_sales_order_request_reserve_registration_filter_create;
        }

        let reserveOpenCode;
        if(isMW) {
            if(isGift) {
                reserveOpenCode = ROLES.customer_care_sales_order_request_reserve_registration_filter_open_mw_gift;
            } else {
                reserveOpenCode = ROLES.customer_care_sales_order_request_reserve_registration_filter_open_mw;
            }
        } else {
            reserveOpenCode = ROLES.customer_care_sales_order_request_reserve_registration_filter_open;
        }

        return (
            <div>
                <div className="paddingLeft30 mt10 d-flex">
                    {isReserveCreate &&
                        (isGift ? <CanRender
                            actionCode={ROLES.customer_care_sales_order_request_reserve_registration_filter_create_gift}>
                            <button type="button" className="el-button el-button-info el-button-small"
                                    onClick={this.btnReserveCreate}>
                                <span>Bảo lưu gói tặng</span>
                            </button>
                        </CanRender>
                        : <CanRender
                            actionCode={ROLES.customer_care_sales_order_request_reserve_registration_filter_create}>
                            <button type="button" className="el-button el-button-info el-button-small"
                                    onClick={this.btnReserveCreate}>
                                <span>Bảo lưu gói thường</span>
                            </button>
                        </CanRender>)
                    }
                    {isReserveOpen &&
                    <CanRender
                        actionCode={reserveOpenCode}>
                        <div className="text-underline pointer">
                            <button type="button" className="el-button el-button-warning el-button-small"
                                    onClick={this.btnReserveOpen}>
                                <span>Mở bảo lưu</span>
                            </button>
                        </div>
                    </CanRender>}
                    {
                       [Constant.SALE_ORDER_SUB_ITEM_RESERVING, Constant.SALE_ORDER_SUB_ITEM_ACTIVED, Constant.SALE_ORDER_SUB_ITEM_COMPLETE].includes(Number(sub_item?.status)) && (
                        <CanRender actionCode={ROLES.customer_care_sales_order_update_info_sub}>
                            <div className="text-underline pointer">
                                <button type="button" className="el-button el-button-bricky el-button-small"
                                        onClick={this.updateInfoSub}>
                                    <span>Cập nhật thông tin</span>
                                </button>
                            </div>
                        </CanRender>
                       )
                    }
                </div>
                <EmployerPackageRegistration
                    sales_order_item={sales_order_item}
                    sales_order={sales_order}
                    data_list={data_list}
                    idKey={idKey}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployerSubItemRow);
