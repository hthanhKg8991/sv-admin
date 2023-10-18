import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {getDetailPromotionPrograms, restoreOpportunity} from "api/saleOrder";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import moment from "moment";
import {formatNumber} from "utils/utils";
import PopupCancel from "pages/CustomerCare/OpportunityPage/Popup/PopupCancel";
import {
    createPopup, hideLoading,
    putToastError,
    putToastSuccess,
    showLoading,
} from "actions/uiAction";
import {publish} from "utils/event";
import {getCustomerListNew} from "api/auth";
import PopupKeep from "pages/CustomerCare/OpportunityPage/Popup/PopupKeep";
import ROLES from "utils/ConstantActionCode";
import {CanRender} from "components/Common/Ui";
import {Link} from "react-router-dom";

class PopupOpportunityDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: props.row,
            staff_team: null,
            campaign: null,
        };
        this.asyncData = this._asyncData.bind(this);
        this.onCancel = this._onCancel.bind(this);
        this.onRestore = this._onRestore.bind(this);
        this.onKeep = this._onKeep.bind(this);
    }

    async _asyncData() {
        const {campaign} = this.state.object;
        if (campaign) {
            const res_campaign = await getDetailPromotionPrograms({id: campaign});
            if (res_campaign) {
                this.setState({campaign: res_campaign});
            }
        }
        const res = await getCustomerListNew({
            execute: 1,
            scopes: 1,
            has_room: 1,
            includes: "team,room",
            withTeam: 1,
            team_channel_code: this.props.branch?.currentBranch?.channel_code,
            room_channel_code: this.props.branch?.currentBranch?.channel_code,
        })
        if (res) {
            const staff = res.find(v => v.login_name === this.state.object?.staff_email);
            if (staff) {
                this.setState({staff_team: staff.team?.name});
            }
        }
    }

    _onCancel() {
        const {row, actions, idKey} = this.props;
        actions.createPopup(PopupCancel, "Lý do thất bại", {
            row,
            idKey,
        });
    }

    async _onRestore() {
        const {actions, row, idKey, uiAction} = this.props;
        actions.showLoading();
        const res = await restoreOpportunity({
            id: row.id,
        });
        if (res.code === 200) {
            actions.putToastSuccess("Khôi phục thành công!");
            publish(".refresh", {}, idKey);
            uiAction.deletePopup();
        } else {
            actions.putToastError(res.msg);
        }
        actions.hideLoading();
    }

    async _onKeep() {
        const {row, actions, idKey} = this.props;
        actions.createPopup(PopupKeep, "Lý do giữ cơ hội", {
            row,
            idKey,
        });
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {object, staff_team, campaign} = this.state;
        if (!object) return null;
        const expected_revenue = Number(object.revenue) / ((100 + Number(object.vat_percent || 0)) / 100);
        const format_expected_revenue = expected_revenue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&' + ",");
        const mapList = {
            1: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_1,
            2: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_2,
            4: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_4,
            5: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_5,
            6: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_6,
            7: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_7,
            99: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_99,
        }

        let commonReason;
        let cancelBySystem = false;
        if(object.cancel_status === 1 && object.cancel_reason === 99){
            commonReason = Constant.COMMON_DATA_KEY_opportunity_cancel_reason_system;
            cancelBySystem = true;
        }else{
            commonReason = mapList[object?.level] || Constant.COMMON_DATA_KEY_opportunity_cancel_reason_1;
        }
        return (
            <div className="content-box p-4 padding-10">
                <div className="row margin-top-10 margin-bottom-10">
                    {object.level !== 8 && (
                        <>
                            <div className="col-sm-6 text-left">
                                {
                                    (object.level < 8 || object.level === 99) && object.cancel_status === 99 && (
                                        <CanRender actionCode={ROLES.customer_care_opportunity_cancel}>
                                            <button type="submit" onClick={this.onCancel}
                                                    className="el-button el-button-bricky el-button-small">
                                                <span>Đánh thất bại</span>
                                            </button>
                                        </CanRender>
                                    )
                                }
                                {
                                    (object.level === 4 || object.level === 5) && object.keep_status === 99 && object.cancel_status === 99 && (
                                        <CanRender actionCode={ROLES.customer_care_opportunity_keep}>
                                            <button onClick={this.onKeep} type="submit"
                                                    className="el-button el-button-pink el-button-small">
                                                <span>Giữ cơ hội</span>
                                            </button>
                                        </CanRender>
                                    )
                                }
                                {
                                    (object.cancel_status === 1 && !cancelBySystem) && (
                                        <CanRender actionCode={ROLES.customer_care_opportunity_restore}>
                                            <button type="submit" onClick={this.onRestore}
                                                    className="el-button el-button-success el-button-small">
                                                <span>Khôi phục</span>
                                            </button>
                                        </CanRender>
                                    )
                                }
                            </div>
                            <div className="col-sm-6 text-right">
                                <CanRender actionCode={ROLES.customer_care_opportunity_send_price_report}>
                                    <button onClick={() => this.props.onSendPriceReport(object?.id, object?.employer_email)}
                                            className="el-button el-button-primary el-button-small">
                                        <span>Gửi Báo giá</span>
                                    </button>
                                </CanRender>
                                <CanRender actionCode={ROLES.customer_care_opportunity_edit}>
                                    <button onClick={() => this.props.onEdit(object)} type="submit"
                                            className="el-button el-button-primary el-button-small">
                                        <span>Chỉnh sửa</span>
                                    </button>
                                </CanRender>
                                <CanRender actionCode={ROLES.customer_care_opportunity_change_level}>
                                    <button onClick={() => this.props.onLevelUp(object, true)} type="submit"
                                            className="el-button el-button-warning el-button-small">
                                        <span>Lên level</span>
                                    </button>
                                </CanRender>
                            </div>
                        </>
                    )}

                </div>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row mb10">
                    <div className="col-sm-6">
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Tên cơ hội</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.name}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Cấp độ khả năng</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_ability} value={object?.ability}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Khả năng</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_ability_map}
                                            value={object?.ability}
                                            notStyle/>%
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ngày kỳ vọng</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.expected_date ? moment.unix(object.expected_date).format("DD-MM-YYYY") : ""}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ghi chú</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.note}
                            </div>
                        </div>
                        {object.keep_status === 1 && (
                            <>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Lý do giữ cơ hội</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_keep_reason}
                                                    value={object.keep_reason}
                                                    notStyle/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Ghi chú giữ cơ hội</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        {object.keep_notice}
                                    </div>
                                </div>
                            </>
                        )}
                        {object.cancel_status === 1 && (
                            <>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Lý do thất bại</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        <SpanCommon idKey={commonReason}
                                                    value={object.cancel_reason}
                                                    notStyle/>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-5 col-xs-5 padding0">Ghi chú thất bại</div>
                                    <div className="col-sm-7 col-xs-7 text-bold">
                                        {object.cancel_notice}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                    <div className="col-sm-6">
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Doanh số bao gồm thuế</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {formatNumber(object.revenue)}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Thuế GTGT (%)</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.vat_percent}%
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Doanh thu kỳ vọng</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {format_expected_revenue}
                            </div>
                        </div>


                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Lý do dự đoán</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.reason_guess}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Gói dịch vụ</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {Array.isArray(object.package_type) && object.package_type.map((v, i) => (
                                    <span key={i}>
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_package_type}
                                                    value={v}
                                                    notStyle/>{object.package_type.length - 1 === i ? "" : ", "}
                                    </span>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin cơ hội</span>
                    </div>
                </div>
                <div className="row mb10">
                    <div className="col-sm-6">
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Thời hạn đóng cơ hội</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.expired_date ? moment.unix(object.expired_date).format("DD-MM-YYYY") : ""}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Độ ưu tiên</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_priority}
                                            value={object?.priority}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">CSKH</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object?.staff_email}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Nhóm</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {staff_team}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Chiến dịch</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {campaign && `${campaign.id} - ${campaign.code} - ${campaign.title}`}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Trạng thái cơ hội</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_status}
                                            value={object?.opportunity_status}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Lịch gọi lại</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.schedule_call ? moment.unix(object.schedule_call).format("DD-MM-YYYY") : ""}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Trạng thái cơ hội</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_contact_status}
                                            value={object?.contact_status}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Nhu cầu tuyển</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.recruitment_demand}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Từ khóa</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {Array.isArray(object.keywords) && object.keywords.map((v, i) => (
                                    <span key={i}>
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_keywords}
                                                    value={v}
                                                    notStyle/>{object.keywords.length - 1 === i ? "" : ", "}
                                    </span>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="row ">
                            <div className="col-sm-12 sub-title-form mb10 padding0">
                                <span>Báo giá</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Gửi báo giá</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_send_quote_status}
                                            value={object.send_quote_status}
                                            notStyle/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ngày KH dự kiến phản hồi về báo giá/proposal
                            </div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.response_quote_date ? moment.unix(object.response_quote_date).format("DD-MM-YYYY") : ""}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Phản hồi về báo giá/proposal</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_response_quote_status}
                                            value={object.response_quote_status}
                                            notStyle/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="row ">
                            <div className="col-sm-12 sub-title-form mb10 padding0">
                                <span>Thông tin khách hàng</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Khách hàng</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.employer_id && (<Link
                                    to={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${object?.employer_id}`}>
                                    <span>{object?.employer_id || "Chưa cập nhật"} - {object?.employer_name}</span>
                                </Link>)
                                }
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-sm-12 sub-title-form mb10 padding0">
                                <span>Thông tin đơn hàng</span>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Mã phiếu</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object?.sales_order_id && (<Link
                                    to={`${Constant.BASE_URL_SALES_ORDER}?action=detail&id=${object?.sales_order_id}`}>
                                    <span>{object?.sales_order_id || "Chưa cập nhật"}</span>
                                </Link>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupOpportunityDetail);
