import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {bindActionCreators} from 'redux';
import {
    createPopup, deletePopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import ComponentFilter from "pages/CustomerCare/OpportunityPage/ComponentFilter";
import {changeLevelOpportunity, exportOpportunity, getListOpportunityFull, getOpportunityDetail} from "api/saleOrder";
import PopupOpportunityLogs from "pages/CustomerCare/OpportunityPage/Popup/PopupOpportunityLogs";
import PopupSendReport from "pages/CustomerCare/OpportunityPage/Popup/PopupSendReport";
import {formatNumber} from "utils/utils";
import Form from "pages/CustomerCare/OpportunityPage/Form";
import {Link} from "react-router-dom";
import moment from "moment";
import PopupOpportunityDetail from "pages/CustomerCare/OpportunityPage/Popup/PopupDetail";
import {CanRender} from "components/Common/Ui";
import ROLES from "utils/ConstantActionCode";

const idKey = "OpportunityList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 40,
                    cell: row => <div className="text-center">{row?.id}</div>
                },
                {
                    title: "Tên cơ hội",
                    width: 300,
                    cell: row => (
                        <>
                            <span>
                            - Tên : {row.name}
                            </span>
                            <br/>
                            <span>
                            - CSKH : {row.staff_email}
                            </span>
                            <br/>
                            <span>
                            - Doanh số gồm thuế : {formatNumber(row.revenue)} VNĐ
                            </span>
                            <br/>
                            <span>
                            - Ngày kì vọng : {moment.unix(row?.expected_date)
                                .format("DD/MM/YYYY")}
                            </span>
                            <br/>
                            <span>
                            - Thời hạn : {moment.unix(row?.expired_date)
                                .format("DD/MM/YYYY")}
                            </span>
                        </>
                    )
                },
                {
                    title: "Khách hàng",
                    width: 150,
                    cell: row => row?.employer_id && (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${row?.employer_id}`}>
                            <span>{row?.employer_id || "Chưa cập nhật"} - {row?.employer_name}</span>
                        </Link>
                    )
                },
                {
                    title: "Quy mô",
                    width: 80,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                           value={row?.company_kind}/>;
                    }
                },
                {
                    title: "Trạng thái Liên hệ KH",
                    width: 150,
                    accessor: "contact_status",
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_contact_status}
                                           value={row?.contact_status} notStyle/>;
                    }
                },
                {
                    title: "Số lượt mở/Số lượt gửi",
                    width: 70,
                    cell: row => (
                        <div className="text-center">
                            {`${row?.total_opened} / ${row?.total_sent}`}
                        </div>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    time: true,
                    accessor: "created_at",
                },
                {
                    title: "Nhãn",
                    width: 100,
                    cell: row => (
                        <>
                            <div>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_level}
                                            value={row?.level}/>
                            </div>
                            {row?.cancel_status === 1 && (
                                <div>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_status_cancel}
                                                value={row?.cancel_status}/>
                                </div>
                            )}
                            {row?.schedule_call &&
                                moment.unix(row?.schedule_call).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ?
                                <span className="label ml10" typeof="schedule_call" title="  Cần liên hệ"
                                      style={{background: '#437c49', color: '#ffffff'}}>
                                    Cần liên hệ
                                </span>
                                :
                                <></>
                            }
                        </>
                    )
                },
                {
                    title: "Nhu cầu tuyển",
                    width: 80,
                    accessor: "recruitment_demand"
                },
                {
                    title: "Cấp độ khả năng",
                    width: 120,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_ability}
                                           value={row?.ability} notStyle/>;
                    }
                },
                {
                    title: "Hành động",
                    width: 110,
                    cell: row => (
                        <>
                            {row.level !== 8 && (
                                <>
                                    <CanRender actionCode={ROLES.customer_care_opportunity_change_level}>
                                        <span className="text-link text-brown font-bold mr10"
                                              onClick={() => this.onLevelUp(row)}>
                                            Lên level
                                        </span>
                                    </CanRender>
                                    <br/>
                                    <CanRender actionCode={ROLES.customer_care_opportunity_edit}>
                                        <span className="text-underline pointer text-blue font-bold mr10"
                                              onClick={() => this.btnEdit(row)}>
                                        Chỉnh sửa
                                        </span>
                                    </CanRender>
                                    <br/>
                                </>
                            )}

                            <CanRender actionCode={ROLES.customer_care_opportunity_detail}>
                                <span className="text-underline pointer text-blue font-bold mr10"
                                      onClick={() => this.btnDetail(row)}>
                                    Xem chi tiết
                                </span>
                            </CanRender>
                            <br/>
                            <CanRender actionCode={ROLES.customer_care_opportunity_send_price_report}>
                                <span className="text-underline text-blue pointer font-bold mr10"
                                       onClick={() => this.onSendPriceReport(row.id, row?.employer_email)}>
                                    Gửi báo giá
                                </span>
                            </CanRender>
                            {/* PopupSendReport */}
                            <br/>
                            <CanRender actionCode={ROLES.customer_care_opportunity_log_by_id}>
                                 <span className="text-underline text-blue pointer font-bold mr10"
                                       onClick={() => this.onShowTypeLogs(row.id)}>
                                    Xem lịch sử
                                </span>
                            </CanRender>
                        </>
                    )
                }
            ],
            loading: false,
            flagQrCode: false,
        };
        this.btnDetail = this._btnDetail.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.onClickExport = this._onClickExport.bind(this);
        this.btnCreate = this._btnCreate.bind(this);
        this.onLevelUp = this._onLevelUp.bind(this);
        this.onShowTypeLogs = this._onShowTypeLogs.bind(this);
        this.onSendPriceReport = this._onSendPriceReport.bind(this);
    }

    async _onClickExport() {
        const {query, actions} = this.props;
        actions.showLoading();
        const res = await exportOpportunity(query);
        if (res.code === 200) {
            actions.putToastSuccess("Export Thành công!");
            window.open(res?.data);
        } else {
            let msg = res?.msg;
            if (res.code === 422) {
                msg = "Vui lòng chọn 'ngày tạo'";
            }
            actions.putToastError(msg);
        }
        actions.hideLoading();
    }

    async _onLevelUp(row, isDetail = false) {
        const {actions} = this.props;
        actions.showLoading();
        const resDetail = await getOpportunityDetail({id: row?.id});
        let moved_level = Number(resDetail.level + 1);
        //LV = 0
        if (Number(resDetail.level) === 99) {
            moved_level = 1;
        }
        // LV = 2 thì k có LV 3 nên next = 4
        if (Number(resDetail.level) === 2) {
            moved_level = 4;
        }
        const res = await changeLevelOpportunity({
            id: resDetail.id,
            current_level: resDetail.level,
            moved_level: moved_level,
        });
        if (res.code === 200) {
            actions.putToastSuccess("Nâng cấp thành công!");
            publish(".refresh", {}, idKey);
            if (isDetail) {
                this._btnDetail({...resDetail, level: moved_level});
            }
        } else {
            actions.putToastError(res.msg);
        }
        actions.hideLoading();
    }

    _ComponentTitle(title, row) {
        return <>
            {title} <span className="text-red"><SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_level}
                                                           value={row?.level || 99}
                                                           notStyle/></span> {row?.cancel_status === 1 &&
            <SpanCommon idKey={Constant.COMMON_DATA_KEY_opportunity_status_cancel}
                        value={row?.cancel_status}/>}
            {row?.level === 8 && (
                <span className="bg-color-green"
                      style={{
                          color: "#ffffff",
                          borderRadius: "3px",
                          padding: "4px",
                          fontSize: "13px"
                      }}>Thành công</span>
            )}

        </>
    }

    _btnEdit(row) {
        const {actions} = this.props;
        actions.createPopup(Form, this._ComponentTitle("Sửa cơ hội", row), {
            id: row.id,
            idKey,
        });
    }

    _btnDetail(row) {
        const {actions} = this.props;
        actions.createPopup(PopupOpportunityDetail, this._ComponentTitle("Chi tiết", row), {
            id: row?.id,
            idKey,
            row,
            onEdit: this._btnEdit.bind(this),
            onLevelUp: this._onLevelUp.bind(this),
            onSendPriceReport: this._onSendPriceReport.bind(this)
        });

    }

    _btnCreate() {
        const {actions,query} = this.props;
        actions.createPopup(Form, this._ComponentTitle("Thêm cơ hội", null), {
            idKey: idKey,
            employer_id: Number.isInteger(Number(query.auto_fill))? query.auto_fill : null,
        });
    }

    _onShowTypeLogs(id) {
        const {actions} = this.props;
        actions.createPopup(PopupOpportunityLogs, 'Lịch sử thay đổi', {
            id: id,
            idKey: idKey,
        });
    }

    _onSendPriceReport(id, employer_email) {
        const {actions} = this.props;
        actions.createPopup(PopupSendReport, 'Gửi Báo Giá', {
            opportunity_id: id,
            idKey: idKey,
            employer_email: employer_email
        });
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;
        const queryMerge = {...query,cancel_status: Constant.OPPORTUNITY_CANCEL_STATUS_NORMAL };
        return (
            <Default
                title="Danh Sách Cơ hội"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <ComponentFilter idKey={idKey} query={query}/>
                <div className="mt5 mb10">
                    <CanRender actionCode={ROLES.customer_care_opportunity_create}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.btnCreate}>
                            <span>Thêm cơ hội</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.customer_care_opportunity_export}>
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={() => this.onClickExport()}>
                                <span>Xuất Excel  <i
                                    className="glyphicon glyphicon-file"/></span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.customer_care_opportunity_template_email}>
                        <Link to={Constant.BASE_URL_OPPORTUNITY + "?action=template"}>
                            <span className="el-button el-button-primary el-button-small">Template Email<i
                                        className="fa fa-envelope fs12 ml5"/></span>
                        </Link>
                    </CanRender>
                </div>
                <Gird idKey={idKey}
                      fetchApi={getListOpportunityFull}
                      query={queryMerge}
                      columns={columns}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
            deletePopup,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
