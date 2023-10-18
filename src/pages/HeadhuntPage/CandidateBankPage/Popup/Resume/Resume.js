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
    getDetailCandidateBankHeadhunt,
    syncResumeCandidateHeadhunt, viewContactCandidateBankHeadhunt
} from "api/headhunt";
import {createPopup, deletePopup, SmartMessageBox, hideSmartMessageBox, putToastSuccess,putToastError} from "actions/uiAction";
import AddCampaignPopup from "../AddCampaign";
import EvaluatePopup from "../EvaluateSourcer";
import HistoryUploadFilePopup from "pages/HeadhuntPage/SearchCandidatePage/Popup/HistoryUploadFile";
import AddTagResume from "pages/HeadhuntPage/SearchCandidatePage/Popup/AddTagResume";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import ResultContact from "pages/HeadhuntPage/CandidateBankPage/Popup/Resume/ResultContact";

const idKey = "ResumeDetailCandidateBank";

class ResumeDetailPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loading_seen: null,
            object: null,
            temp_seen: [],
        };
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEvaluate = this._btnEvaluate.bind(this);
        this.onClickSyncResume = this._onClickSyncResume.bind(this);
        this.btnViewHistoryUploadCV = this._btnViewHistoryUploadCV.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.viewContact = this._viewContact.bind(this);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
    }

    async _viewContact() {
        const {actions, id} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xem contact ứng viên',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await viewContactCandidateBankHeadhunt({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                    actions.hideSmartMessageBox();
                }
            }
        });
    }

    async _onClickSyncResume(id) {
        const {actions} = this.props;
        this.setState({loading_seen: true});
        const res = await syncResumeCandidateHeadhunt({id});
        if (res) {
            this.setState({loading_seen: false});
            if (res.cv_file_hidden_url && res.cv_file_hidden_url !== "") {
                window.open(res.cv_file_hidden_url, "_blank")
            }else {
                actions.putToastError('Không tìm thấy file');
            }
        }
    }

    _btnAdd(id) {
        const {actions, idKey: idKeyList} = this.props;
        actions.createPopup(AddCampaignPopup, 'Thêm mới', {list_id: [id], idKey: idKeyList});
    }

    _btnEvaluate() {
        const {actions, id} = this.props;
        actions.createPopup(EvaluatePopup, 'Đánh giá CV từ Sourcer',{id});
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
        const object = await getDetailCandidateBankHeadhunt({id});
        if (object) {
            this.setState({
                object,
                loading: false
            });
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {object, loading, loading_seen} = this.state;
        const {id} = this.props;
        const resume = object?.candidate_info;

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
                                                <div className="col-sm-8 col-xs-8 text-bold">
                                                    {!loading_seen && (
                                                        <span className="text-link"
                                                              onClick={() => this.onClickSyncResume(resume.id)}>
                                                        File che
                                                    </span>
                                                    )}
                                                    {resume?.cv_file_url && resume.cv_file_url !== "" && (
                                                        <a href={resume?.cv_file_url}
                                                           download
                                                           target={"_blank"}>
                                                        <span
                                                            className={"text-underline text-primary pointer ml30"}>File gốc</span>
                                                        </a>
                                                    )}
                                                </div>
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
                                            <div className="col-sm-4 col-xs-4 padding0">Email</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{resume?.email}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12 row-content padding0">
                                            <div className="col-sm-4 col-xs-4 padding0">Số điện thoại</div>
                                            <div className="col-sm-8 col-xs-8 text-bold">
                                                <span>{resume?.mobile}</span>
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

                                        <AddTagResume asyncData={this.asyncData} tag_info={object?.tag_info} id={resume.id}/>
                                    </div>
                                </div>
                            )}
                            <CanRender actionCode={ROLES.headhunt_candidate_bank_add_campaign} >
                                <button className="el-button el-button-success el-button-small mr10"
                                        onClick={() => this.btnAdd(object.id)}>
                                    Add vào Campaign
                                </button>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_candidate_bank_view_contact} >
                                <button className="el-button el-button-info el-button-small mr10"
                                        onClick={this.viewContact}>
                                    Xem contact ứng viên
                                </button>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_candidate_bank_evaluate} >
                                <button className="el-button el-button-info el-button-small mr10"
                                        style={{backgroundColor: "#875A7B", border: "solid 1px #875A7B"}}
                                        onClick={this.btnEvaluate}>
                                    Đánh giá CV từ Sourcer
                                </button>
                            </CanRender>
                        </div>
                        <div className="row">
                            <ResultContact id={id} />
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
            putToastSuccess,
            putToastError
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResumeDetailPopup);
