import React, {Component} from "react";
import {connect} from "react-redux";
import {reserveRegistrationJobCreate, reserveRegistrationJobOpen} from "api/saleOrder";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import BannerPackageRegistration
    from "pages/CustomerCare/SalesOrderEditPage/Package/BannerPackage/BannerPackageRegistration";

class BannerSubItemRow extends Component {
    constructor() {
        super();
        this.btnReserveOpen = this._btnReserveOpen.bind(this);
        this.btnReserveCreate = this._btnReserveCreate.bind(this);
    }

    _btnReserveCreate() {
        const {uiAction, sub_item, branch} = this.props;
        const {channel_code} = branch.currentBranch;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        uiAction.SmartMessageBox({
            title: "Xác nhận bảo lưu gói dịch vụ",
            content: <p>Số ngày bảo lưu còn lại = {sub_item?.remaining_day_reserve} ngày. <br/>
                {!isMW ? `Sau khi bảo lưu sẽ không được mở bảo lưu trong ngày, phải qua ngày mới được mở bảo lưu.` : ""}
                {!isMW && <br/>}
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
                    publish(".refresh", {}, Constant.IDKEY_BANNER_PACKAGE);
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
                    publish(".refresh", {}, Constant.IDKEY_BANNER_PACKAGE);
                }
            } else {
                uiAction.hideSmartMessageBox();
            }
        });
    }

    render() {
        const {sales_order_item, sales_order, idKey, data_list} = this.props;
        // const isReserveCreate = sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_ACTIVED;
        // const isReserveOpen = sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_PROCESS;

        return (
            <div>
                <BannerPackageRegistration
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
export default connect(mapStateToProps,mapDispatchToProps)(BannerSubItemRow);