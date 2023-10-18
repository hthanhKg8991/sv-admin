import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {verifyEmailSeeker, verifySmsSeeker} from "api/seeker";
import queryString from "query-string";
import ROLES from 'utils/ConstantActionCode';
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {hideLoading, putToastSuccess, showLoading} from "actions/uiAction";
import {connect} from "react-redux";
import {publish} from "utils/event";
import {Link} from "react-router-dom";
import moment from "moment";
import * as utils from "utils/utils";
import {getConfigForm, getMergeDataRevision} from "utils/utils";
import {approveResume, deleteResume, rejectResume} from "api/resume";
import SpanText from 'components/Common/Ui/SpanText';
import PopupForm from "components/Common/Ui/PopupForm";
import FormReject from "pages/SeekerCare/ResumePage/DetailNew/HistoryChanged/FormReject";
import * as Yup from "yup";
import ViewedHistory from './ViewedHistory';

let timer = null;

class Info extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ResumeInfo");
        this.state = {
            loading: false,
            configForm: configForm,
        };

        this.goBack = this._goBack.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);

        this.verifyEmail = this._verifyEmail.bind(this);
        this.verifySms = this._verifySms.bind(this);
        this.onSearchPhone = this._onSearchPhone.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onRejectSuccess = this._onRejectSuccess.bind(this);
    }

    _onEdit() {
        const {history, seeker} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                search: '?action=edit&id=' + _.get(seeker, 'id')
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            const params = {
                ...search,
                action: "edit"
            };

            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                search: '?' + queryString.stringify(params)
            });

            return true;
        }
    }

    _onSearchPhone() {
        if (!this.props.seeker.mobile) {
            alert("Chưa có sđt!");
            return;
        }
        window.open(`/seeker?page=1&per_page=10&q=${this.props.seeker.mobile}`);
    }

    _onDelete() {
        const {resume, idKey} = this.props;
        this.props.uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa HS: ' + resume.id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const {actions, uiAction} = this.props;
                this.setState({loading: true})
                const res = await deleteResume(resume.id);
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_RESUME,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_SEEKER_RESUME,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    _verifyEmail() {
        const {seeker} = this.props;
        this.props.uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xác thực Email NTV: ' + seeker.id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const {actions, uiAction} = this.props;
                const res = await verifyEmailSeeker({
                    id: seeker.id
                });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, 'SeekerDetail')
            }
        });
    }

    _verifySms() {
        const {seeker} = this.props;
        this.props.uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xác thực SĐT NTV: ' + seeker.id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const {actions, uiAction} = this.props;
                const res = await verifySmsSeeker({
                    id: seeker.id
                });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    // Lỗi Api k sync kịp fix tạm
                    setTimeout(() => publish(".refresh", {}, 'SeekerDetail'), 1000)
                }
                uiAction.hideSmartMessageBox();
            }
        });
    }

    async _onApprove() {
        const {actions, resume} = this.props;
        actions.showLoading();
        const res = await approveResume(Number(resume.id));
        if (res) {
            actions.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, "ResumeDetail");
        }
        actions.hideLoading();
    }

    _onReject() {
        // const {actions, resume} = this.props;
        // this.props.uiAction.SmartMessageBox({
        //     title: 'Bạn có chắc muốn hủy duyệt hồ sơ: ' + resume.id,
        //     content: "",
        //     buttons: ['No', 'Yes']
        // }, async (ButtonPressed) => {
        //     if (ButtonPressed === "Yes") {
        //         const res = await rejectResume(Number(resume.id));
        //         if (res) {
        //             actions.putToastSuccess("Thao tác thành công");
        //         }
        //         publish(".refresh", {}, "ResumeDetail");
        //     }
        // });
        this.popupReject._handleShow();
    }

    _onRejectSuccess() {
        publish(".refresh", {}, this.props.idKey);
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    render() {
        const {seeker, revision, resume, history} = this.props;
        const {loading, configForm} = this.state;
        const search = queryString.parse(_.get(history, ['location', 'search']));
        const resumeMerge = getMergeDataRevision(resume, revision);
        const isDelete = resume.status === Constant.STATUS_DELETED;
        let province = this.props.province.items;
        let occupation = this.props.occupations.items;

        let resume_level_requirement = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_level_requirement);
        let resume_working_method = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_working_method);
        let resume_experience_range = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_resume_experience_range);
        let marital_status = utils.convertObjectValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_marital_status);

        let text_occupation = '';
        let text_job_province = '';
        let text_seeker_province = '';

        if (resumeMerge?.occupation_ids) {
            occupation.filter((value) => ((resumeMerge.occupation_ids).includes(value.id))).forEach((val, key) => {
                text_occupation += key === 0 ? val.name : ', ' + val.name;
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
                <LoadingSmall style={{textAlign: "center"}}/>
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
                        <div className="col-sm-4 col-xs-4 padding0">Nghề nghiệp</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {text_occupation}
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
                            <SpanText idKey={Constant.COMMON_DATA_KEY_seeker_level} value={resumeMerge.level}/>
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
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái hiển thị</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_is_search_allowed} value={resumeMerge?.is_search_allowed} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái hồ sơ</div>
                        <SpanText idKey={Constant.COMMON_DATA_KEY_resume_status}
                                  value={Number(resumeMerge.status_combine)}/>
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
                                                    notStyle/>
                                    </div>
                                ))}
                                {_.get(revision, 'rejected_reason_note') && (<div>- {_.get(
                                    revision,
                                    'rejected_reason_note')}</div>)}
                            </div>
                        </div>
                    )}
                    {resumeMerge?.id && (
                        <ViewedHistory resume={resumeMerge}/>
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
                        <div className="col-sm-4 col-xs-4 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <Link
                                to={{
                                    pathname: Constant.BASE_URL_SEEKER_RESUME,
                                    search: '?' + queryString.stringify({
                                        action: 'history_changed',
                                        id: _.get(resumeMerge, 'id')
                                    })
                                }}
                            >
                                <span className="text-underline text-primary pointer">Xem chi tiết</span>
                            </Link>
                        </div>
                    </div>
                    {resumeMerge?.resume_type !== Constant.RESUME_TYPE_ONLINE && resumeMerge?.cv_file &&
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">File đính kèm</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <a href={resumeMerge?.cv_file_url || "#"} download target={"_blank"}>
                                    <span className={"text-underline text-primary pointer"}>Xem file</span>
                                </a>
                            </div>
                        </div>
                    }
                </div>
                <div className="col-sm-6 col-xs-12">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Người tìm việc</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Họ và tên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <Link to={`${Constant.BASE_URL_SEEKER}?action=detail&id=${seeker?.id}`}>
                                <a className="text-link" href={`${Constant.BASE_URL_SEEKER}?action=detail&id=${seeker?.id}`}>{seeker?.name}</a>
                            </Link>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker?.email}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Điện thoại</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker?.mobile}</span>
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

                {!isDelete &&
                    <div className="col-sm-12 col-xs-12 mt10">

                        <CanRender actionCode={ROLES.seeker_care_resume_update}>
                            <Link
                                className={"el-button el-button-small el-button-success"}
                                to={url}
                            >
                                <span>Chỉnh sửa</span>
                            </Link>
                        </CanRender>
                        <CanRender actionCode={ROLES.seeker_care_resume_approval}>
                            {/*{
                                Number(_.get(resumeMerge, 'status', '')) !== Constant.STATUS_ACTIVED &&
                                Number(_.get(resumeMerge, 'revision_status', '')) !== Constant.STATUS_ACTIVED
                                && (
                                <button type="button" className="el-button el-button-info el-button-small"
                                        onClick={this.onApprove}>
                                    <span>Duyệt</span>
                                </button>
                            )}*/}
                            {Number(_.get(resumeMerge, 'revision_status', '')) === Constant.STATUS_INACTIVED && (
                                <Link
                                    className={"el-button el-button-small el-button-success"}
                                    to={{
                                        pathname: Constant.BASE_URL_SEEKER_RESUME,
                                        search: '?' + queryString.stringify({
                                            ...search,
                                            action: 'history_changed',
                                            id: _.get(resumeMerge, 'id')
                                        })
                                    }}
                                >
                                    Xét duyệt
                                </Link>
                            )}
                            {Number(_.get(resumeMerge, 'revision_status', '')) !== Constant.STATUS_INACTIVED && (
                                <>
                                    {Number(_.get(resumeMerge, 'status', '')) === Constant.STATUS_ACTIVED && (
                                        <>
                                            <button type="button" className="el-button el-button-bricky el-button-small"
                                                    onClick={this.onReject}>
                                                <span>Không duyệt</span>
                                            </button>
                                            <PopupForm onRef={ref => (this.popupReject = ref)}
                                                       title={"Không duyệt hồ sơ"}
                                                       FormComponent={FormReject}
                                                       initialValues={{id: resumeMerge.id, rejected_reason: ''}}
                                                       validationSchema={Yup.object().shape({
                                                           rejected_reason: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                                                       })}
                                                       apiSubmit={rejectResume}
                                                       afterSubmit={this.onRejectSuccess}
                                                       hideAfterSubmit/>
                                        </>
                                    )}
                                </>
                            )}
                        </CanRender>
                        <CanRender actionCode={ROLES.seeker_care_resume_delete}>
                            {![Constant.STATUS_DELETED].includes(_.get(resumeMerge, 'status')) && (
                                <button type="button"
                                        className="el-button el-button-bricky el-button-small"
                                        onClick={this.onDelete}>
                                    <span>Xóa</span>
                                </button>
                            )}
                        </CanRender>
                    </div>
                }
                <div className="col-sm-12 col-xs-12">
                    {!isDelete &&
                        <CanRender actionCode={ROLES.seeker_care_resume_list}>
                            <a className="el-button el-button-primary el-button-small" target="_blank"
                               rel="noopener noreferrer"
                               href={`${Constant.BASE_URL_SEEKER_RESUME}?seeker_id=${resumeMerge.seeker_id}`}>
                                <span>Danh sách hồ sơ</span>
                            </a>
                        </CanRender>
                    }
                    <button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
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
        actions: bindActionCreators({putToastSuccess, showLoading, hideLoading}, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        common: state.sys.common,
        province: state.sys.province,
        occupations: state.sys.occupations,
        branch: state.branch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
