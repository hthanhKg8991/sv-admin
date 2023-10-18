import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {Link} from "react-router-dom";
import * as Constant from "utils/Constant";
import moment from "moment";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {getDetail, getRevision} from "api/job";
import {getDetail as getEmployerDetail} from "api/employer";
import * as utils from "utils/utils";
import {getMergeDataRevision, transformSalaryRange} from "utils/utils";
import SpanSystem from "components/Common/Ui/SpanSystem";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {hideLoading, putToastSuccess, showLoading} from 'actions/uiAction';

class Info extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            loading: true,
            revision: null,
            employer: null,
            job: null,
            configForm: utils.getConfigForm(channelCodeCurrent, "CustomerCare.JobPage.Detail")
        };
    }

    async asyncData() {
        const {id} = this.props;
        const data = await getDetail(id);
        const revision = await getRevision(id);
        const employerDetail = await getEmployerDetail(data.employer_id);
        this.setState({job: data, revision: revision, employer: employerDetail, loading: false});
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {loading, employer, configForm, job, revision} = this.state;
        const jobMerge = getMergeDataRevision(job, revision);
        if (loading || !employer || !job) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }
        return (
            <div className="row content-box">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content padding0 row-title">Thông tin
                        chung
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{jobMerge.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Kênh</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {Constant.CHANNEL_LIST[String(jobMerge?.channel_code)]}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tiêu đề</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{jobMerge.title}</div>
                    </div>
                    {configForm.includes("level_requirement") && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Cấp bậc</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <SpanSystem value={_.get(jobMerge, 'level_requirement', '')}
                                            type={"jobLevel"} notStyle/>
                            </div>
                        </div>
                    )}
                    {configForm.includes("gate_code") && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Cổng</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <SpanSystem value={_.get(jobMerge, 'gate_code', '')}
                                            idKey={"code"} type={"gate"}
                                            label={"full_name"} notStyle/>
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngành chính</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanSystem value={_.get(jobMerge, 'field_ids_main', '')}
                                        type={"jobField"} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngành Phụ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {_.isArray(_.get(jobMerge, 'field_ids_sub')) && _.get(jobMerge,
                                'field_ids_sub').map((field_id, key) => (
                                <span key={key}>
                                    <SpanSystem value={field_id} type={"jobField"} notStyle
                                                multi={key !== 0}/>
                                </span>
                            ))}
                        </div>
                    </div>
                    {
                        !!jobMerge["field_ids_child"]?.length &&
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Ngành con</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {_.isArray(_.get(jobMerge, 'field_ids_child')) && _.get(jobMerge,
                                    'field_ids_child').map((field_id, key) => (
                                    <span key={key}>
                                        <SpanSystem value={field_id} type={"jobFieldChild"} notStyle
                                                    multi={key !== 0}/>
                                    </span>
                                ))}
                            </div>
                        </div>
                    }
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tỉnh thành làm việc</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {_.isArray(_.get(jobMerge, 'province_ids')) && _.get(jobMerge,
                                'province_ids').map((province_id, key) => (
                                <span key={key}>
                                    <SpanSystem value={province_id} type={"province"} notStyle
                                                multi={key !== 0}/>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Số lượng cần tuyển</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{jobMerge?.vacancy_quantity}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mức lương</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {jobMerge?.salary_range === Constant.SALARY_RANGE_CUSTOM ? (
                                <>
                                    {`${transformSalaryRange(jobMerge?.salary_min)} - ${transformSalaryRange(jobMerge?.salary_max)}`}
                                </>
                            ) : (
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_salary_range}
                                            value={jobMerge?.salary_range} notStyle/>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Hình thức làm việc</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_working_method}
                                        value={jobMerge?.working_method} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Bằng cấp</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_degree_requirement}
                                        value={jobMerge?.degree_requirement} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Kinh nghiệm</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_experience_range}
                                        value={jobMerge?.experience_range} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Giới tính</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_gender}
                                        value={jobMerge?.gender} notStyle/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-2 col-xs-2"/>
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin liên hệ</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Tên người liên hệ</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{jobMerge?.job_contact_info?.contact_name}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Địa chỉ liên hệ</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{jobMerge?.job_contact_info?.contact_address}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0 mt20">Nhà tuyển dụng</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Tên NTD</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <Link to={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${employer.id}`}>
                                <a className="text-link"
                                   href={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${employer.id}`}>{employer.name}</a>
                            </Link>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Loại tài khoản</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <div>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                                            value={_.get(employer, 'premium_status', '')}
                                            notStyle/>&nbsp;
                                {employer.premium_renewed_at && employer.premium_end_at && (
                                    <span>{`${moment.unix(employer.premium_renewed_at).format(
                                        "DD/MM/YYYY")} - ${moment.unix(employer.premium_end_at)
                                        .format("DD/MM/YYYY")} `}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Trạng thái tài khoản</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                        value={_.get(employer, 'status_combine', '')} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Ngày đăng ký</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{moment.unix(employer.created_at)
                                .format("DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                    {_.get(employer, 'last_logged_in_at', '') && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Đăng nhập gần nhất</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <span>{moment.unix(employer.last_logged_in_at).format(
                                    "DD/MM/YYYY HH:mm:ss")}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-12 col-xs-12 row-content padding0 row-title">Mô tả công việc
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div dangerouslySetInnerHTML={{__html: jobMerge.description}}/>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-12 col-xs-12 row-content padding0 row-title">Quyền lợi
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div dangerouslySetInnerHTML={{__html: jobMerge.benefit}}/>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-12 col-xs-12 row-content padding0 row-title">Yêu cầu công việc
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div dangerouslySetInnerHTML={{__html: jobMerge.job_requirement}}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, showLoading, hideLoading}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
