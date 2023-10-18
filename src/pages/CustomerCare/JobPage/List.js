import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import Gird from "components/Common/Ui/Table/Gird";
import {getList} from "api/job";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/JobPage/ComponentFilter";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import {Link} from "react-router-dom";
import queryString from "query-string";

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = {...props.query, ...{action: 'detail'}};
        this.state = {
            columns: [
                {
                    title: "Tin tuyển dụng",
                    width: 140,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_JOB}?${queryString.stringify({...paramsQuery, ...{id: row.id}})}`}>
                            <span>{row.id} - {row.title}</span>
                            {(row?.old_channel_code === Constant.CHANNEL_CODE_MW || row?.old_channel_code === Constant.CHANNEL_CODE_MW_FROM_TVN || row?.old_channel_code === Constant.CHANNEL_CODE_VL24H_DELETE) && (
                                <span className="ml5 label"
                                      style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW</span>
                            )}
                            {row?.old_channel_code === Constant.CHANNEL_CODE_TVN && (
                                <span className="ml5 label" style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN</span>
                            )}
                        </Link>
                    )
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            <span
                                style={{color: '#3276b1'}}>{row.employer_info_basic.id} - {row.employer_info_basic.name}</span>
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
                    cell: row => <div
                        className={"text-center"}>{row?.total_views || 0} - {row?.total_resume_applied || 0}</div>
                },
					 {
						title: "Số CV cam kết / Số CV đã đến NTD",
						width: 90,
						cell: row => (
							row?.commited_cv 
							? <div className={"text-center"}>
                                    {row?.commited_cv} cv&nbsp;/&nbsp;{row?.resumes_applied || 0}
							 </div>
							 : null
						)
				  },
                {
                    title: "Ngày tạo",
                    width: 140,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày cập nhật",
                    width: 140,
                    cell: row => (
                        <React.Fragment>
                            {row.updated_at && moment.unix(row.updated_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hạn nộp HS",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            {row.resume_apply_expired && moment.unix(row.resume_apply_expired).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái hiển thị",
                    width: 120,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_is_search_allowed}
                                        value={row.is_search_allowed}/>

                        </>

                    )
                },
                {
                    title: "Trạng thái tin",
                    width: 130,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_status} value={row.status_combine}/>

                            {row.job_post_status && (
                                <span className="ml10">
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_post_status}
                                                value={row.job_post_status}/>
                                </span>
									 )}
									 {row.view_per_post_score === Constant.VIEW_PER_POST_SCORE && row.is_search_allowed === Constant.VIEW_PER_POST_SCORE && (
										<span className="ml10">
												<SpanCommon idKey={Constant.COMMON_DATA_KEY_view_per_post_score}
																value={row.view_per_post_score}/>
										</span>
                            )}
                            <span className="ml10">
                              <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_post_guarantee_status }
                                          value={row.job_post_guarantee_status }/>
                            </span>
                        </>

                    )
                },
                {
                    title: "CSKH",
                    width: 130,
                    cell: row => (
                        row.employer_info_basic.assigned_staff_username &&
                        `${row.employer_info_basic.assigned_staff_username}`
                    )
                },
            ]
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history, query} = this.props;
        const source = query?.employer_create ? `&employer_create=${query.employer_create}` : "";
        history.push({
            pathname: Constant.BASE_URL_JOB,
            search: `?action=edit&id=0` + source
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, is_archived} = this.props;
        const idKey = "JobList";

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}
                                is_archived={is_archived}/>
                )}
                title={`Danh Sách Tin Tuyển Dụng ${is_archived ? "Đã xóa" : ""}`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <CanRender actionCode={ROLES.customer_care_job_create}>
                        <div className="left btnCreateNTD">
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm Tin <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getList}
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

export default connect(null, null)(List);
