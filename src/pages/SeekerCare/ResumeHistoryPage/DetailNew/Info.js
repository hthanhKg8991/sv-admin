import React from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {hideLoading, putToastSuccess, showLoading} from "actions/uiAction";
import {connect} from "react-redux";
import {publish} from "utils/event";
import {Link} from "react-router-dom";
import moment from "moment";
import * as utils from "utils/utils";
import {getConfigForm, getMergeDataRevision} from "utils/utils";
import {approveResume, rejectResume} from "api/resume";
import ROLES from "utils/ConstantActionCode";
import {CanRender, SpanCommon} from "components/Common/Ui";
import PopupForm from "components/Common/Ui/PopupForm";
import FormReject from "pages/SeekerCare/ResumePage/DetailNew/HistoryChanged/FormReject";
import * as Yup from "yup";

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
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
    }


    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_RESUME_APPLIED_HISTORY,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_SEEKER_RESUME_APPLIED_HISTORY,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    async _onApprove() {
        const {actions, resumeHistory} = this.props;
        actions.showLoading();
        const res = await approveResume(Number(resumeHistory.id));
        if (res) {
            actions.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, "ResumeHistoryDetail");
        }
        actions.hideLoading();
    }

    async _onReject() {
        this.popupReject._handleShow();
        // const {actions, resumeHistory} = this.props;
        // actions.showLoading();
        // const res = await rejectResumeQuickApplied(Number(resumeHistory.id));
        // if (res) {
        //     actions.putToastSuccess("Thao tác thành công");
        //     publish(".refresh", {}, "ResumeHistoryDetail");
        // }
        // actions.hideLoading();
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    render() {
        const {seeker, revision, resume, history, resumeHistory} = this.props;
        if (!resume) return null;
        const {loading} = this.state;
        const resumeMerge = getMergeDataRevision(resume, revision);
        const isDelete = resume.status === Constant.STATUS_DELETED;
        let province = this.props.province.items;
        let jobField = this.props.jobField.items;
        const file_preview = resumeHistory.cv_file_url;
        const cvFileExtension = file_preview ? file_preview?.split(".").pop() : "";

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


        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <div className="row content-box">
                <div className="col-sm-12 col-xs-12">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Người tìm việc</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Họ và tên</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <Link to={`${Constant.BASE_URL_SEEKER}?action=detail&id=${seeker?.id}`}>
                                <a className="text-link"
                                   href={`${Constant.BASE_URL_SEEKER}?action=detail&id=${seeker?.id}`}>{seeker?.name}</a>
                            </Link>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Email</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{seeker?.email}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Điện thoại</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{seeker?.mobile}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{seeker?.address}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Tỉnh/ Thành phố</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{text_seeker_province}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Ngày sinh</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{seeker?.birthday ? moment.unix(seeker.birthday).format("DD/MM/YYYY") : ""}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Hôn nhân</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{marital_status[seeker?.marital_status]}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Trạng thái người tìm việc</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span><SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_status}
                                              value={seeker?.status_combine}/></span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Trạng thái hồ sơ</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span><SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_history_status}
                                              value={resumeHistory?.status}/></span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{revision?.approved_by ? `${revision?.approved_by} - ${moment.unix(revision?.approved_at).format("DD/MM/YYYY HH:mm:ss")}` : ""}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">Lý do từ chối</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            {_.isArray(_.get(revision, 'rejected_reason')) ? _.get(
                                revision,
                                'rejected_reason').map(reason => (
                                <div key={reason}>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_rejected_reason}
                                                value={reason}
                                                notStyle/>
                                </div>
                            )) : (
                                <div>
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_rejected_reason}
                                                value={resumeHistory.rejected_reason}
                                                notStyle/>
                                </div>
                            )}
                            {_.get(revision, 'rejected_reason_note') && (<div>- {_.get(
                                revision,
                                'rejected_reason_note')}</div>)}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-1 col-xs-4 padding0">DS việc làm đã nộp</div>
                        <div className="col-sm-11 col-xs-8 text-bold">
                            <span>{resumeHistory?.job_applied?.map((job, index) => (
                                <div>
                                    <Link to={`${Constant.BASE_URL_JOB}?${queryString.stringify({
                                        action: "detail",
                                        id: job?.id
                                    })}`} target="_blank">
                                        <span className="text-link mx-2">{index + 1} - {job?.title}</span>
                                    </Link>
                                </div>
                            ))}</span>
                        </div>
                    </div>
                </div>
                <hr className="col-xs-12"/>
                <div className="col-sm-12 col-xs-12">
                    {file_preview && (
                        <div className="row mt30">
                            <div className="col-md-12">
                                {Constant.EXTENSION_DOC.includes(cvFileExtension) && (
                                    <iframe
                                        title="docx"
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${file_preview}`}
                                        width="100%" height="1000px" frameBorder='0'/>
                                )}
                                {Constant.EXTENSION_PDF === cvFileExtension && (
                                    <div className="pg-viewer-wrapper mb10">
                                        <iframe
                                            title="pdf"
                                            src={file_preview}
                                            style={{width: "100%", height: "1000px"}} frameBorder="0"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-sm-12 col-xs-12 mt10">
                    {!isDelete && Number(resumeHistory?.status) === Constant.RESUME_HISTORY_STATUS_INACTIVE &&
                        <CanRender actionCode={ROLES.seeker_care_resume_history_approve}>
                            <button type="button" className="el-button el-button-success el-button-small"
                                    onClick={this.onApprove}>
                                <span>Duyệt</span>
                            </button>
                        </CanRender>
                    }
                    {[Constant.RESUME_HISTORY_STATUS_INACTIVE, Constant.RESUME_STATUS_ACTIVED].includes(Number(resumeHistory?.status)) && (
                        <CanRender actionCode={ROLES.seeker_care_resume_history_reject}>
                            <button type="button" className="el-button el-button-bricky el-button-small"
                                    onClick={this.onReject}>
                                <span>Không duyệt</span>
                            </button>
                            <PopupForm onRef={ref => (this.popupReject = ref)}
                                       title={"Không duyệt hồ sơ"}
                                       FormComponent={FormReject}
                                       initialValues={{
                                           id: this.props?.resumeHistory?.id,
                                           seeker_id: seeker.id,
                                           resume_id: resumeMerge.resume_id,
                                           rejected_reason: ''
                                       }}
                                       validationSchema={Yup.object().shape({
                                           rejected_reason: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                                       })}
                                       apiSubmit={rejectResume}
                                       afterSubmit={() => {
                                           publish(".refresh", {}, "ResumeHistoryDetail");
                                       }}
                                       hideAfterSubmit/>
                        </CanRender>
                    )}
                </div>
                <div className="col-sm-12 col-xs-12">
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
        jobField: state.sys.jobField,
        branch: state.branch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
