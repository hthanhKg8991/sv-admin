import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import { getListFreemium, getDropJobFreemiumDetail } from "api/jobFreemium";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/JobFreemiumPage/ComponentFilter";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";
import * as uiAction from "actions/uiAction";
import {bindActionCreators} from "redux";
import PopupDropJob from "pages/CustomerCare/JobFreemiumPage/Popup/PopupDropJob";
import PopupReasonDropJob from "pages/CustomerCare/JobFreemiumPage/Popup/PopupReasonDropJob";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupPostFreemium from "pages/CustomerCare/JobFreemiumPage/Popup/PopupPostFreemium";
import * as utils from "utils/utils";
class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = {...props.query, ...{action: 'detail'}};
        const type_sales_order_id = this.props.sys.common.items[Constant.COMMON_DATA_KEY_type_sales_order_id];
        this.state = {
            columns: [
                {
                    title: "Tin tuyển dụng",
                    width: 140,
                    onClick: () => {},
                    cell: row => (
                        <Link to={`${Constant.BASE_URL_JOB}?${queryString.stringify({...paramsQuery, ...{id: row.job_info.id}})}`}>
                            <span>{row.job_info.id} - {row.job_info.title}</span>
                        </Link>
                    )
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            <span style={{color:'#3276b1'}}>{row.employer_id} - {row.employer_name}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.employer_id
                        };
                        window.open(Constant.BASE_URL_EMPLOYER + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Lượt xem/nộp",
                    width: 60,
                    cell: row => <div className={"text-center"}>{row?.total_views || 0} - {row?.total_resume_applied || 0}</div>
                },
                {
                    title: "Loại tài khoản",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status} value={row?.premium_status} />
                    )
                },
                {
                    title: "Ngày kích hoạt",
                    width: 140,
                    cell: row => (
                        <React.Fragment>
                            {row.approved_at && moment.unix(row.approved_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày hết hạn",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            {row.expired_at && moment.unix(row.expired_at).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái hiển thị",
                    width: 80,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_is_search_allowed} value={row.job_is_search_allowed}/>
                    )
                },
                {
                    title: "Trạng thái tin",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_status} value={row.job_info.status_combine}/>
                    )
                },
                {
                    title: "Trạng thái tài khoản",
                    width: 130,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                value={row?.employer_status} />
                        </>
                    )
                },
                {
                    title: "Nhãn gói",
                    width: 100,
                    cell: row => {
                        const find = type_sales_order_id?.find?.(item=>!!item.value==!!row.sales_order_id);
                        const styles = { background: find?.background_color, color: find?.text_color || "#000000" };
                        return (
                            <span className="label" style={styles}>
                                {find?.name}
                            </span>
                        )
                    }
                },
                {
                    title: "CSKH",
                    width: 130,
                    cell: row => (
                        row.staff_username &&
                            `${row.staff_username}`
                    )
                },
                {
                    title: "CSKH Account Service",
                    width: 130,
                    accessor: "account_service_username"
                },
                {
                    title: "Người đăng",
                    width: 130,
                    accessor: "approved_by"
                },
                {
                    title: "Hành động",
                    width: 130,
                    cell: row => {

                        const now = moment(new Date());
                        const end = moment(moment.unix(row?.expired_at));
                        const duration = moment.duration(end.diff(now));
                        const days = Math.ceil(duration.asDays());

                        return(
                            row.status === Constant.FREEMIUM_CONFIG_STATUS_APPROVED ?
                                (days > 0 && !row?.sales_order_id ) ?
                                    <CanRender actionCode={ROLES.customer_care_job_freemium_drop}>
                                        <span idKey={Constant.COMMON_DATA_KEY_drop_job_freemium_action} className="text-link text-red" onClick={() => this.onViewDropJob(row)}>Hạ tin</span>
                                    </CanRender>
                                    : ""    
                                :
                                <CanRender actionCode={ROLES.customer_care_job_freemium_reason_drop}>
								    <span idKey={Constant.COMMON_DATA_KEY_reason_drop_job_freemium_action} className="text-link mr10" onClick={() => this.onViewReasonDropJob(row)}>Lý do hạ</span>
                                </CanRender>
                        )
                    }
                },
            ]
        };
        this.onViewReasonDropJob = this._onViewReasonDropJob.bind(this);
        this.onViewDropJob = this._onViewDropJob.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        this.props.uiAction.createPopup(PopupPostFreemium, 'Đăng tin miễn phí', {object: {}});
    }


    _onViewDropJob(row) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupDropJob, "Hạ tin đăng Freemium", {object: row});
    }

    async _onViewReasonDropJob(row) {
        const {uiAction} = this.props;
        const res = await getDropJobFreemiumDetail({ registration_id: row?.id, service_type: row?.service_type });
        if (res) {
            uiAction.createPopup(PopupReasonDropJob, "Lý do hạ tin", {note: res?.drop_note});
        }
    }


    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, is_archived} = this.props;
        const idKey = Constant.IDKEY_JOB_FREEMIUM_LIST;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter} is_archived={is_archived}/>
                )}
                title="Quản lý tin đăng Freemium"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <CanRender actionCode={ROLES.customer_care_post}>
                        <div className="left btnCreateNTD">
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Đăng tin miễn phí <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListFreemium}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isReplaceRoute
                />
            </Default>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
