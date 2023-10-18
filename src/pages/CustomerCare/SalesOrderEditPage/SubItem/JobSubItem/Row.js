import React, {Component} from "react";
import ROLES from "utils/ConstantActionCode";
import {connect} from "react-redux";
import {getJobOrEffectRunning, reserveRegistrationJobCreate} from "api/saleOrder";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import JobPackageRegistration from "pages/CustomerCare/SalesOrderEditPage/Package/JobPackage/JobPackageRegistration";
import PopupChangeJobBox from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeJobBox";
import moment from "moment";
import PopupJobPackageReserve from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupJobPackageReserve";
import PopupUpdateInfoSub from "pages/CustomerCare/SalesOrderPage/Popup/PopupUpdateInfoSub";
import {reserveRegistrationJobOpen} from "api/saleOrder";
class JobSubItemRow extends Component {
    constructor() {
        super();
        this.state = {
            isChange: false
        };
        this.btnReserveOpen = this._btnReserveOpen.bind(this);
        this.btnReserveCreate = this._btnReserveCreate.bind(this);
        this.btnChangeJob = this._btnChangeJob.bind(this);
        this.getJobRunning = this._getJobRunning.bind(this);
        this.updateInfoSub = this._updateInfoSub.bind(this);
    }

    _btnReserveCreate() {
        const {uiAction, sub_item} = this.props;
        uiAction.SmartMessageBox({
            title: "Xác nhận bảo lưu gói dịch vụ",
            content: <p>Số ngày bảo lưu còn lại = {sub_item?.remaining_day_reserve} ngày. <br/>
                Sau khi bảo lưu sẽ không được mở bảo lưu trong ngày, phải qua ngày mới được mở bảo lưu.
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
                    publish(".refresh", {}, Constant.IDKEY_JOB_PACKAGE);
                } else {
                    uiAction.putToastError(res.msg);
                    uiAction.hideSmartMessageBox();
                }
            } else {
                uiAction.hideSmartMessageBox();
                uiAction.putToastError(res?.msg);
            }
        });
    }

    _btnReserveOpen() {
        const {uiAction, sales_order, sales_order_item, sub_item, branch,idKey} = this.props;

        const isMW = branch.currentBranch.channel_code  === Constant.CHANNEL_CODE_MW 

        if(isMW){
            uiAction.createPopup(PopupJobPackageReserve, "Mở bảo lưu", {
                sales_order: sales_order,
                sales_order_item: sales_order_item,
                sub_item: sub_item
            });
        }else{
            uiAction.SmartMessageBox({
                title: "Xác nhận mở bảo lưu gói?",
                buttons: ['No','Yes']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Yes"){
                    uiAction.hideSmartMessageBox();
                    const res = await reserveRegistrationJobOpen({
                        id: sub_item?.id,
                    });
                    if (res) {
                        uiAction.putToastSuccess("Thao tác thành công!");
                        uiAction.deletePopup();
                        publish(".refresh", {}, idKey);
                    }else{
                        uiAction.deletePopup();
                    }
                }
                uiAction.hideSmartMessageBox();
            })
        }
        
    }

    _btnChangeJob() {
        const {uiAction, sales_order, sales_order_item, sub_item} = this.props;
        uiAction.createPopup(PopupChangeJobBox, "Thay tin", {
            sales_order: sales_order,
            sales_order_item: sales_order_item,
            sub_item: sub_item,
        });
    }

    async _getJobRunning() {
        const {sub_item} = this.props;
        const res = await getJobOrEffectRunning({id: sub_item?.id});
        if(res && res?.id > 0) {
            this.setState({isChange: true});
        }
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

    componentDidMount() {
        const {sub_item} = this.props;
        if (sub_item?.id) {
            this.getJobRunning();
        }
    }

    render() {
        const {sales_order_item, sales_order, sub_item, idKey, data_list, branch, isChangeArea} = this.props;
        const {isChange} = this.state;
        const channel_code = branch.currentBranch.channel_code;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;

        /**
         * MW bảo lưu có kiểm tra thêm hạn bảo lưu
         */
        const isReserveDefault = sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_ACTIVED;
        let isReserveCreate = isReserveDefault;
        const now = moment().unix();
        if ([Constant.CHANNEL_CODE_MW].includes(channel_code)) {
            const isExpiredReserve = Number(sub_item?.reserve_expired_at) >= now || !(sub_item?.reserve_expired_at);
            isReserveCreate = isReserveDefault && isExpiredReserve;
        }

        const isReserveOpenDefault = sub_item?.status === Constant.SALE_ORDER_SUB_ITEM_PROCESS;
        let isReserveOpen = isReserveOpenDefault;
        if ([Constant.CHANNEL_CODE_MW].includes(channel_code)) {
            const isExpiredReserve = Number(sub_item?.reserve_expired_at) >= now || !(sub_item?.reserve_expired_at);
            isReserveOpen = isReserveOpenDefault && isExpiredReserve;
        }

        /**
         * Phân quyền bảo lưu theo channel
         * @type {string}
         */

        const reserveOpenCode = isMW ?
            ROLES.customer_care_sales_order_request_reserve_registration_job_open_mw :
            ROLES.customer_care_sales_order_request_reserve_registration_job_open;


        /**
         * Chức năng thay đổi tin
         */
        const isChangeJob = Number(sub_item?.id) > 0 && [Constant.CHANNEL_CODE_MW].includes(channel_code) && isChange;
        return (
            <div>
                <div className="paddingLeft30 mt10 d-flex">
                    {isReserveCreate && (
                        sales_order_item?.type_campaign == Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN?.gift ?
                            <CanRender
                                actionCode={ROLES.customer_care_sales_order_request_reserve_registration_job_create_gift}>
                                <button type="button" className="el-button el-button-info el-button-small"
                                        onClick={this.btnReserveCreate}>
                                    <span>Bảo lưu gói tặng</span>
                                </button>
                            </CanRender>
                        : <CanRender
                            actionCode={ROLES.customer_care_sales_order_request_reserve_registration_job_create}>
                            <button type="button" className="el-button el-button-info el-button-small"
                                    onClick={this.btnReserveCreate}>
                                <span>Bảo lưu gói thường</span>
                            </button>
                        </CanRender>
                    )}
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
                    {isChangeJob && (
                        <CanRender
                            actionCode={ROLES.customer_care_sales_order_request_job_change}>
                            <div className="text-underline pointer">
                                <button type="button" className="el-button el-button-warning el-button-small"
                                        onClick={this.btnChangeJob}>
                                    <span>Thay tin</span>
                                </button>
                            </div>
                        </CanRender>
                    )}
                    {
                        [Constant.SALE_ORDER_SUB_ITEM_RESERVING, Constant.SALE_ORDER_SUB_ITEM_ACTIVED, Constant.SALE_ORDER_SUB_ITEM_COMPLETE].includes(Number(sub_item?.status))
                       && (
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
                <JobPackageRegistration
                    sales_order_item={sales_order_item}
                    sales_order={sales_order}
                    data_list={data_list}
                    idKey={idKey}
                    isChangeArea={isChangeArea}
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

export default connect(mapStateToProps, mapDispatchToProps)(JobSubItemRow);
