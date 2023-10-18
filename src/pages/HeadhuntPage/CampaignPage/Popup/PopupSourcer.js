import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import {getListApplicantGroupHeadhunt, getListHeadhuntApplicant} from "api/headhunt";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";

const idKeyApplicantGroup = "ApplicantGroupList"
const idKeyApplicant = "ApplicantList"

class PopupSource extends Component {
    constructor() {
        super();
        this.state = {
            columns_applicant_group: [
                {
                    title: "Code",
                    width: 60,
                    accessor: "code"
                },
                {
                    title: "Date",
                    width: 80,
                    cell: row => (<div>{moment.unix(row.created_at).format("DD-MM-YYYY")}</div>)
                },
                {
                    title: "Người add",
                    width: 100,
                    accessor: "created_by"
                },
                {
                    title: "Số lượng đã add",
                    width: 50,
                    accessor: "total_applicant.all"
                },
                {
                    title: "Qualified",
                    width: 50,
                    accessor: "total_applicant.qualified"
                },
                {
                    title: "Not Relevant",
                    width: 50,
                    accessor: "total_applicant.not_relevant"
                },
                {
                    title: "Chưa đánh giá",
                    width: 50,
                    accessor: "total_applicant.not_evaluation"
                },

            ],
            columns_applicant: [
                {
                    title: "Candidate",
                    width: 100,
                    cell: row => <div>{`${row.id} - ${row.seeker_name}`}</div>
                },
                {
                    title: "Người add",
                    width: 100,
                    accessor: "applicant_group_create_info.created_by"
                },
                {
                    title: "Ngày add",
                    width: 80,
                    cell: row => (row.applicant_group_create_info?.created_at ?
                        <div>{moment.unix(row.applicant_group_create_info?.created_at).format("DD-MM-YYYY")}</div> : "")
                },
                {
                    title: "Recruiter đánh giá",
                    width: 50,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_evaluation}
                                             value={row.evaluation}/>
                },
                {
                    title: "Người đánh giá",
                    width: 100,
                    accessor: "evaluation_by"
                },
                {
                    title: "Ngày đánh giá",
                    width: 50,
                    cell: row => (
                        <div>{row.evaluation_at && moment.unix(row.evaluation_at).format("DD-MM-YYYY")}</div>)
                }
            ],
        }
    }

    render() {
        const {history, id} = this.props;
        const {columns_applicant_group, columns_applicant} = this.state;
        return (
            <div className="form-container">
                <div className="row mb20">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Tổng quan</span>
                    </div>
                    <div className="col-sm-12">
                        <div className="crm-section">
                            <div className="body-table el-table">
                                <Gird idKey={idKeyApplicantGroup}
                                      query={{campaign_id: id}}
                                      fetchApi={getListApplicantGroupHeadhunt}
                                      columns={columns_applicant_group}
                                      history={history}
                                      isPushRoute={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 text-italic">
                        (Báo cáo này chỉ count số lượng UV đã add từ team Sourcer)
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Chi tiết</span>
                    </div>
                    <div className="col-sm-12">
                        <div className="crm-section">
                            <div className="body-table el-table">
                                <Gird idKey={idKeyApplicant}
                                      query={{campaign_id: id}}
                                      fetchApi={getListHeadhuntApplicant}
                                      columns={columns_applicant}
                                      history={history}
                                      isPushRoute={false}
                                />
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
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupSource);
