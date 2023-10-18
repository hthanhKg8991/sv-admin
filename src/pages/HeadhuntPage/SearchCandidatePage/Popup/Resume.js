import React, {Component} from "react";
import {connect} from "react-redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {publish, subscribe} from "utils/event";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import SpanText from "components/Common/Ui/SpanText";
import _ from "lodash";
import {Link} from "react-router-dom";
import moment from "moment";
import {bindActionCreators} from "redux";
import {
    deleteHeadhuntCandidate,
    getCandidateDetailHeadhunt,
    getListCandidateHeadhunt, staffSeenCandidateHeadhunt,
    syncResumeCandidateHeadhunt
} from "api/headhunt";
import {createPopup, deletePopup, SmartMessageBox, hideSmartMessageBox, putToastSuccess} from "actions/uiAction";
import AddCampaignPopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddCampaign";
import GirdCustomHeader from "pages/HeadhuntPage/SearchCandidatePage/GirdCustomHeader";
import HistoryUploadFilePopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/HistoryUploadFile";
import AddTagResume from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddTagResume";
import AddCandidatePopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddCandidate";

const idKey = "ResumeDetail";

class ResumeDetailPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loading_seen: null,
            resume: null,
            temp_seen: [],
            columns: [
                {
                    title: "Channel",
                    width: 50,
                    cell: row => <span>{{
                        ...Constant.CHANNEL_LIST,
                        "sourced": "Sourced"
                    }[String(row?.channel_code)]}</span>
                },
                {
                    title: "Resume ID",
                    width: 50,
                    accessor: "resume_id"
                },
                {
                    title: "Tiêu đề",
                    width: 50,
                    cell: row => (
                        <>
                            <span>{`${row.resume_id} - ${row.title}`}</span>
                            {(row.staff_seen === Constant.HEADHUNT_STAFF_SEEN_YES || this.state.temp_seen.includes(row.id)) && (
                                <span className="text-red">&nbsp;(Đã xem)</span>
                            )}
                        </>

                    )
                },
                {
                    title: "Resume",
                    width: 80,
                    cell: row => {
                        const link = row.exist_applicant === Constant.HEADHUNT_EXIST_APPLICANT_YES ? row.cv_file_url : row.cv_file_hidden_url;
                        const exitsFile = link && link !== "";
                        return (
                            <div>
                                {exitsFile && (
                                    <a className="text-link" target="_blank" onClick={() => this.trackStaffSeen(row)}
                                       href={link}>File</a>
                                )}
                                {this.state.loading_seen !== row.id ? (
                                    <>
                                        {!exitsFile && [Constant.RESUME_STATUS_REQUEST_ACTIVED, Constant.RESUME_STATUS_ACTIVED].includes(row.status) && (
                                            <span className="text-link"
                                                  onClick={() => this.onClickSyncResume(row.resume_id, true)}>
                                            File
                                            </span>)
                                        }
                                    </>
                                ) : (<i className="fa fa-spinner" aria-hidden="true"/>)}
                            </div>
                        )
                    }
                },
            ]
        };
        this.btnAdd = this._btnAdd.bind(this);
        this.onEditCandidate = this._onEditCandidate.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.onClickSyncResume = this._onClickSyncResume.bind(this);
        this.trackStaffSeen = this._trackStaffSeen.bind(this);
        this.btnViewHistoryUploadCV = this._btnViewHistoryUploadCV.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
    }

    async _trackStaffSeen(object) {
        if (object?.staff_seen === Constant.HEADHUNT_STAFF_SEEN_NO) {
            const res = await staffSeenCandidateHeadhunt({id: object.id})
            if (res && res.code === 200) {
                const {temp_seen} = this.state;
                this.setState({temp_seen: [...temp_seen, object.id]});
            }
        }
    }

    async _onClickSyncResume(resume_id, seen_list) {
        if (seen_list) {
            this.setState({loading_seen: resume_id});
        } else {
            this.setState({loading: true});
        }
        const res = await syncResumeCandidateHeadhunt({id: this.props.id});
        if (res) {
            this.setState({loading: false, loading_seen: null});
            const link = res.exist_applicant === Constant.HEADHUNT_EXIST_APPLICANT_YES ? res.cv_file_url : res.cv_file_hidden_url;
            if (link && link !== "") {
                window.open(link, "_blank")
            }
        }
    }

    _btnAdd(id) {
        const {actions, idKey: idKeyList} = this.props;
        actions.createPopup(AddCampaignPopup, 'Thêm mới', {list_candidate_id: [id], idKey: idKeyList});
    }

    _onEditCandidate() {
        const {actions, idKey} = this.props;
        const {resume} = this.state;
        actions.createPopup(AddCandidatePopup, 'Chỉnh sửa Candidate', {idKey, object: resume});
    }

    async _btnDelete() {
        const {actions, id, idKeyList} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa Candidate ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteHeadhuntCandidate({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKeyList);
                    actions.hideSmartMessageBox();
                    actions.deletePopup();
                }
            }
        });
    }

    _btnViewHistoryUploadCV(candidate_id) {
        const {actions} = this.props;
        actions.createPopup(HistoryUploadFilePopup, 'Lịch sử upload file CV', {candidate_id});
    }

    async _asyncData() {
        const {id} = this.props;
        if (id <= 0) {
            this.setState({loading: false});
            return;
        }
        const resume = await getCandidateDetailHeadhunt({id});
        if (resume) {
            this.setState({
                resume,
                loading: false
            });
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {resume, loading, columns} = this.state;
        const {history, id} = this.props;

        if (!resume) {
            return <></>
        }
        let province = this.props.province.items;
        let jobField = this.props.jobField.list;
        let resume_level_requirement = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_level_requirement);
        let resume_experience_range = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_experience_range);
        const gender = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_gender);

        let text_job_field = '';
        let text_job_province = '';

        if (resume?.field_ids) {
            jobField?.filter((value) => (resume.field_ids.includes(Number(value.id)))).forEach((val, key) => {
                text_job_field += key === 0 ? val.name : ', ' + val.name;
            });
        }

        if (resume?.province_ids) {
            province?.filter((value) => ((resume.province_ids).includes(Number(value.id)))).forEach((val, key) => {
                text_job_province += key === 0 ? val.name : ', ' + val.name;
            });
        }

        const updated_at = moment.unix(_.get(resume, 'updated_at')).format("DD/MM/YYYY HH:mm:ss");

        const link = resume.exist_applicant === Constant.HEADHUNT_EXIST_APPLICANT_YES ? resume.cv_file_url : resume.cv_file_hidden_url;
        const exitsFile = link && link !== "";
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
                                                to={`${Constant.BASE_URL_RESUME}/list?action=detail&id=${resume?.resume_id}`}>
                                                <span
                                                    className="col-sm-8 col-xs-8 text-bold text-link">{resume?.resume_id}</span>
                                            </Link>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Tiêu đề hồ sơ</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">{resume.title}</div>
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
                                                {utils.formatNumber(resume.salary, 0, ".", "đ")}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Số năm kinh nghiệm</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                {resume_experience_range[resume.experience] ? resume_experience_range[resume.experience] : resume.experience}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Địa điểm làm việc</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                {text_job_province}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Cấp bậc hiện tại</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                {resume_level_requirement[resume.position] ? resume_level_requirement[resume.position] : resume.position}
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Trình độ học vấn cao nhất</div>
                                            <div className="col-sm-8 col-xs-8 text-bold padding0">
                                                <SpanText idKey={Constant.COMMON_DATA_KEY_seeker_level}
                                                          value={resume.level}/>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Ngày cập nhật</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{updated_at}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Social url</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <a href={resume.social_url} className="text-link"
                                                   target="_blank">{resume.social_url}</a>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Lịch sử upload file CV</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span className="text-link"
                                                      onClick={() => this.btnViewHistoryUploadCV(resume.id)}>Xem lịch sử</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">File đính kèm</div>
                                            {resume.channel_code === "sourced" ? (
                                                <div className="col-sm-8 col-xs-8 text-bold">
                                                      <span className="text-link"
                                                            onClick={() => this.onClickSyncResume(resume.resume_id)}>
                                                        File che
                                                    </span>
                                                    <a href={resume?.cv_file_url}
                                                       download
                                                       target={"_blank"}>
                                                        <span
                                                            className={"text-underline text-primary pointer ml30"}>File gốc</span>
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="col-sm-8 col-xs-8 text-bold">
                                                    {exitsFile && (
                                                        <a href={link}
                                                           download
                                                           target={"_blank"}>
                                                        <span
                                                            className={"text-underline text-primary pointer"}>Xem file</span>
                                                        </a>
                                                    )}
                                                    {!exitsFile && [Constant.RESUME_STATUS_REQUEST_ACTIVED, Constant.RESUME_STATUS_ACTIVED].includes(resume.status) && (
                                                        <span className="text-link"
                                                              onClick={() => this.onClickSyncResume(resume.resume_id)}>
                                                        File
                                                    </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-xs-12">
                                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin
                                            Seeker
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Họ và tên</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <Link
                                                    to={`${Constant.BASE_URL_SEEKER}?action=detail&id=${resume?.seeker_id}`}>
                                                    <span className="text-link">{resume?.name}</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{resume?.address}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Tỉnh/ Thành phố</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{province?.find(value => value.id === resume.seeker_province_id)?.name || ''}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Ngày sinh</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{resume?.birthday ? moment.unix(resume.birthday).format("DD/MM/YYYY") : ""}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Giới tính</div>
                                            <div
                                                className="col-sm-8 col-xs-8 text-bold">{gender[resume.gender] || "Chưa cập nhật"}</div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Channel</div>
                                            <div
                                                className="col-sm-8 col-xs-8 text-bold">{{
                                                ...Constant.CHANNEL_LIST,
                                                "sourced": "Sourced"
                                            }[String(resume?.channel_code)]}</div>
                                        </div>

                                        <AddTagResume asyncData={this.asyncData} tag_info={resume?.tag_info} id={id}/>
                                    </div>
                                </div>
                            )}
                            {
                                resume?.channel_code === "sourced" && (
                                    <>
                                        <button className="el-button el-button-primary el-button-small"
                                                onClick={this.onEditCandidate}>
                                            Chỉnh sửa
                                        </button>
                                        <button className="el-button el-button-bricky el-button-small"
                                                onClick={this.btnDelete}>
                                            Xóa
                                        </button>
                                    </>
                                )
                            }

                            <button className="el-button el-button-success el-button-small mr10"
                                    onClick={() => this.btnAdd(resume.id)}>
                                Add vào Campaign
                            </button>
                            <>
                                {Array.isArray(resume.applicant_ids) && resume.applicant_ids?.length > 0 && (
                                    <>
                                    <span className="text-red font-bold">
                                            Campaign đã add&nbsp;
                                        </span>
                                        {resume.applicant_ids?.map((v, i) => (
                                            <span key={i} className="text-info font-bold ml5">
                                                {v}
                                            </span>
                                        ))}
                                    </>
                                )}
                            </>
                            <>
                                <div className="col-sm-12 col-xs-12 row-content row-title padding0">Các CV khác của cùng
                                    ứng viên này
                                </div>
                                {resume?.email && (
                                    <GirdCustomHeader idKey={idKey} fetchApi={getListCandidateHeadhunt}
                                                      query={{email: resume.email}}
                                                      columns={columns}
                                                      isRedirectDetail={false}
                                                      isPushRoute={false}
                                                      history={history}/>
                                )}
                            </>
                        </div>
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
            createPopup,
            deletePopup,
            SmartMessageBox,
            hideSmartMessageBox,
            putToastSuccess
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResumeDetailPopup);
