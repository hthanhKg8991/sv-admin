import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import { hideLoading, putToastSuccess, showLoading } from "actions/uiAction";
import { connect } from "react-redux";
import moment from "moment";
import * as utils from "utils/utils";
import { getConfigForm, getMergeDataRevision } from "utils/utils";
import SpanText from 'components/Common/Ui/SpanText';

class Info extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ResumeInfo");
        this.state = {
            loading: false,
            configForm: configForm,
        };
        this.viewDetail = this._viewDetail.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    async _viewDetail(object) {
        if (object?.resume_type === Constant.RESUME_NORMAL) {
            window.open(`${Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP}?id=${object?.id}&seeker_id=${object?.seeker_id}&canEdit=false`)
        } else if (object?.cv_file_hidden_url || object?.cv_file_url) {
            window.open(object?.cv_file_hidden_url || object?.cv_file_url);
        }
    }

    _goBack() {
        const { history } = this.props;
        history.goBack();
    }

    render() {
        const { seeker, revision, resume, history } = this.props;
        const { loading, configForm } = this.state;
        const resumeMerge = getMergeDataRevision(resume, revision);
        let province = this.props.province.items;
        let jobField = this.props.jobField.items;
        let resume_level_requirement = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_level_requirement);
        let resume_experience_range = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_experience_range);
        let marital_status = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_marital_status);
        let text_job_field = '';
        let text_job_province = '';
        let text_seeker_province = '';

        if (resumeMerge?.field_ids) {
            jobField.filter((value) => ((resumeMerge.field_ids).includes(value.id))).forEach((val, key) => {
                text_job_field += key === 0 ? val.name : ', ' + val.name;
            });
        }

        if (resumeMerge?.province_ids) {
            province.filter((value) => ((resumeMerge.province_ids).includes(Number(value.id)))).forEach((val, key) => {
                text_job_province += key === 0 ? val.name : ', ' + val.name;
            });
        }

        if (seeker?.province_id) {
            province.filter((value) => Number(seeker.province_id) === Number(value.id)).forEach((val, key) => {
                text_seeker_province += key === 0 ? val.name : ', ' + val.name;
            });
        }

        let url = parseInt(resumeMerge.resume_type) === Constant.RESUME_NORMAL ? Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP : Constant.BASE_URL_SEEKER_RESUME_ATTACH;
        url = `${url}?id=${resumeMerge.id}&seeker_id=${resumeMerge.seeker_id}`;
        const created_at = moment.unix(_.get(resume, 'created_at')).format("DD/MM/YYYY HH:mm:ss");
        const updated_at = moment.unix(_.get(resume, 'updated_at')).format("DD/MM/YYYY HH:mm:ss");

        if (loading) {
            return (
                <LoadingSmall style={{ textAlign: "center" }} />
            )
        }

        return (
            <div className="row content-box">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Hồ sơ</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{resumeMerge.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Kênh</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {Constant.CHANNEL_LIST[String(resumeMerge?.channel_code)]}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tiêu đề hồ sơ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{resumeMerge.title}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngành nghề</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {text_job_field}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mức lương tối thiểu</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {utils.formatNumber(resumeMerge.min_expected_salary, 0, ".", "đ")}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Số năm kinh nghiệm</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {resume_experience_range[resumeMerge.experience] ? resume_experience_range[resumeMerge.experience] : resumeMerge.experience}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa điểm làm việc</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {text_job_province}
                        </div>
                    </div>
                    {configForm.includes("current_position") && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Cấp bậc hiện tại</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {resume_level_requirement[resumeMerge.current_position] ? resume_level_requirement[resumeMerge.current_position] : resumeMerge.current_position}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Cấp bậc mong muốn</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {resume_level_requirement[resumeMerge.position] ? resume_level_requirement[resumeMerge.position] : resumeMerge.position}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trình độ học vấn cao nhất</div>
                        <div className="col-sm-8 col-xs-8 text-bold padding0">
                            <SpanText idKey={Constant.COMMON_DATA_KEY_seeker_level} value={resumeMerge.level} />
                        </div>
                    </div>
                    {_.get(resumeMerge, 'revision_status') === Constant.STATUS_DISABLED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do từ chối</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {_.isArray(_.get(revision, 'rejected_reason')) && _.get(
                                    revision,
                                    'rejected_reason').map(reason => (
                                        <div key={reason}>
                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_rejected_reason}
                                                value={reason}
                                                notStyle />
                                        </div>
                                    ))}
                                {_.get(revision, 'rejected_reason_note') && (<div>- {_.get(
                                    revision,
                                    'rejected_reason_note')}</div>)}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày tạo</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{created_at}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày cập nhật</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{updated_at}</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xs-12">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Người tìm việc</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Họ và tên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {seeker?.name}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker?.email}</span>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker?.address}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tỉnh/ Thành phố</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{text_seeker_province}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày sinh</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker?.birthday ? moment.unix(seeker.birthday).format("DD/MM/YYYY") : ""}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Hôn nhân</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{marital_status[seeker?.marital_status]}</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt10">
                    <button type="button" className="el-button el-button-small el-button-success" onClick={() => this.viewDetail(resumeMerge)}>
                        Thông tin đầy đủ / CV đính kèm
                    </button>
                    {/* <button type="button" className="el-button el-button-primary el-button-small">
                        CV đính kèm (dự phòng)
                    </button> */}
                    <button type="button" className="el-button el-button-default el-button-small"
                        onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({ putToastSuccess, showLoading, hideLoading }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        common: state.sys.common,
        province: state.sys.province,
        jobField: state.sys.jobField,
        branch: state.branch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
