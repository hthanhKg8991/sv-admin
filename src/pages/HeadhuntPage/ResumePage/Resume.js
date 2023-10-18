import React, {Component} from "react";
import {connect} from "react-redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {subscribe} from "utils/event";
import {getResumeDetailV2, getResumeRevision} from "api/resume";
import {seekerDetail} from "api/seeker";
import {getConfigForm, getMergeDataRevision} from "utils/utils";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import SpanText from "components/Common/Ui/SpanText";
import _ from "lodash";
import {Link} from "react-router-dom";
import moment from "moment";
import PopupGroupForm from "pages/HeadhuntPage/ResumePage/Popup/PopupAdd";
import {bindActionCreators} from "redux";
import {createPopup} from "actions/uiAction";
import DiplomaInfo from "pages/HeadhuntPage/ResumePage/ResumeStepByStep/DiplomaInfo";
import ExperienceInfo from "pages/HeadhuntPage/ResumePage/ResumeStepByStep/ExperienceInfo";
import ConsultorInfo from "pages/HeadhuntPage/ResumePage/ResumeStepByStep/ConsultorInfo";
import LanguageInfo from "pages/HeadhuntPage/ResumePage/ResumeStepByStep/LanguageInfo";
import SkillInfo from "pages/HeadhuntPage/ResumePage/ResumeStepByStep/SkillInfo";
import ItInfo from "pages/HeadhuntPage/ResumePage/ResumeStepByStep/ItInfo";
import queryString from "query-string";

const idKey = "ResumeDetail";

class Resume extends Component {

    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ResumeInfo");
        this.state = {
            configForm: configForm,
            loading: true,
            seeker: null,
            resume: null,
            revision: null,
            resumeMerge: {},
        };
        this.btnAdd = this._btnAdd.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
    }

    _btnAdd(id) {
        const {actions} = this.props;
        actions.createPopup(PopupGroupForm, 'Thêm mới', {id, idKey});
    }

    async asyncData() {
        const {isHidden} = this.props;
        const {id} = this.props.object;
        if(id <= 0) {
            this.setState({loading: false});
            return;
        }
        const includes = isHidden ? "staff_view_resume_info,cv_file_hidden" : "staff_view_resume_info";
        const dataResume = await getResumeDetailV2({id, list: true, includes: includes});
        const dataRevision = await getResumeRevision(id);
        const dataSeeker = await seekerDetail(dataResume?.seeker_id);
        const resumeMerge = getMergeDataRevision(dataResume, dataRevision);
        this.setState({
            seeker: dataSeeker,
            resume: dataResume,
            revision: dataRevision,
            resumeMerge: resumeMerge,
            loading: false
        });
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {isAddCampaign, isHidden} = this.props;
        const {resumeMerge, resume, seeker, configForm, revision, loading} = this.state;

        if(!resume || !revision || !seeker) {
           return <></>
        }

        let province = this.props.province.items;
        let jobField = this.props.jobField.items;

        let resume_level_requirement = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_level_requirement);
        let resume_working_method = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_working_method);
        let resume_experience_range = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_experience_range);
        let marital_status = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_marital_status);
        const gender = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_gender);

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

        const created_at = moment.unix(_.get(resume, 'created_at')).format("DD/MM/YYYY HH:mm:ss");
        const updated_at = moment.unix(_.get(resume, 'updated_at')).format("DD/MM/YYYY HH:mm:ss");
        const approved_at = moment.unix(_.get(revision, 'approved_at')).format("DD/MM/YYYY HH:mm:ss");
        const seeker_created_at = moment.unix(_.get(seeker, 'created_at')).format("DD/MM/YYYY HH:mm:ss");
        const seeker_logined_at = moment.unix(_.get(seeker, 'logined_at')).format("DD/MM/YYYY HH:mm:ss");
        const is_resume_step = resume?.resume_type === Constant.RESUME_TYPE_ONLINE;
        const {status} = resume;

        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 crm-section">
                            {loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <div className="row content-box">
                                    <div className="col-sm-5 col-xs-5">
                                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin
                                            Resume
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                                            <Link
                                                to={`${Constant.BASE_URL_RESUME}/list?action=detail&id=${resumeMerge?.id}`}>
                                                <span
                                                    className="col-sm-8 col-xs-8 text-bold text-link">{resumeMerge?.id}</span>
                                            </Link>
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
                                                <SpanText idKey={Constant.COMMON_DATA_KEY_seeker_level}
                                                          value={resumeMerge.level}/>
                                            </div>
                                        </div>
                                        {configForm.includes("work_time") && (
                                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                                <div className="col-sm-4 col-xs-4 padding0">Hình thức làm việc</div>
                                                <div className="col-sm-8 col-xs-8 text-bold">
                                                    {resume_working_method[resumeMerge.work_time] ? resume_working_method[resumeMerge.work_time] : "Chưa cập nhật"}
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
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Ngày duyệt hồ sơ</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{approved_at}</span>
                                            </div>
                                        </div>
                                        {isHidden ? (
                                            <>{resumeMerge?.resume_type !== Constant.RESUME_TYPE_ONLINE && resumeMerge?.cv_file_hidden &&
                                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                                    <div className="col-sm-4 col-xs-4 padding0">File đính kèm</div>
                                                    <div className="col-sm-8 col-xs-8 text-bold">
                                                        <a href={resumeMerge?.cv_file_hidden_url || "#"} download
                                                           target={"_blank"}>
                                                    <span
                                                        className={"text-underline text-primary pointer"}>Xem file</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            }
                                            </>
                                        ): (
                                            <>{resumeMerge?.resume_type !== Constant.RESUME_TYPE_ONLINE && resumeMerge?.cv_file &&
                                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                                    <div className="col-sm-4 col-xs-4 padding0">File đính kèm</div>
                                                    <div className="col-sm-8 col-xs-8 text-bold">
                                                        <a href={resumeMerge?.cv_file_url || "#"} download
                                                           target={"_blank"}>
                                                    <span
                                                        className={"text-underline text-primary pointer"}>Xem file</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            }
                                            </>
                                        )}

                                    </div>
                                    <div className="col-sm-6 col-xs-12">
                                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin
                                            Seeker
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Họ và tên</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <Link to={`${Constant.BASE_URL_SEEKER}?action=detail&id=${seeker?.id}`}>
                                                    <span className="text-link">{seeker?.name}</span>
                                                </Link>
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
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Giới tính</div>
                                            <div
                                                className="col-sm-8 col-xs-8 text-bold">{gender[seeker.gender] || "Chưa cập nhật"}</div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Ngày đăng ký</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{seeker_created_at}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Ngày đăng nhập gần nhất</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{seeker_logined_at}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Lịch sử ứng tuyển</div>
                                            <div className="col-sm-8 col-xs-8 text-bold textBlue text-link">
                                                <Link to={`${Constant.BASE_URL_SEEKER}?${queryString.stringify({
                                                    action: "job_apply",
                                                    id: seeker?.id
                                                })}`}>
                                                    <span className="textBlue text-link">
                                                        Xem lịch sử
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    {is_resume_step && (
                                        <>
                                            <DiplomaInfo status={status} resume_id={resume.id}/>
                                            <ExperienceInfo status={status} resume_id={resume.id}/>
                                            <ConsultorInfo status={status} resume_id={resume.id}/>
                                            <LanguageInfo status={status} resume_id={resume.id}/>
                                            <SkillInfo status={status} resume_id={resume.id}/>
                                            <ItInfo status={status} resume_id={resume.id}/>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {isAddCampaign && (
                            <button className="color-white border-radius-btn font-bold mr10"
                                    onClick={() => this.btnAdd(resume.id)}>
                                Add vào Campaign
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        common: state.sys.common,
        province: state.sys.province,
        jobField: state.sys.jobField,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Resume);
