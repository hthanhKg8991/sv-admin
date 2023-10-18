import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {Link} from "react-router-dom";
import * as Constant from "utils/Constant";
import moment from "moment";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { reject, approveRevision, rejectRevision } from "api/job";
import {getDetail as getEmployerDetail} from "api/employer";
import IsSearchAllowed from "pages/CustomerCare/JobPage/Detail/GeneralInf/IsSearchAllowed";
import queryString from "query-string";
import BtnPopup from "components/Common/Ui/BtnPopup";
import * as utils from "utils/utils";
import {getMergeDataRevision, transformSalaryRange} from "utils/utils";
import SpanSystem from "components/Common/Ui/SpanSystem";
import PopupDeleteJob from "pages/CustomerCare/JobPage/Popup/PopupDeleteJob";
import PopupForm from "components/Common/Ui/PopupForm";
import FormReject from "pages/CustomerCare/JobPage/Detail/HistoryChanged/FormReject";
import {publish} from "utils/event";
import * as Yup from "yup";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {hideLoading, putToastSuccess, showLoading} from 'actions/uiAction';
import ViewedHistory from 'pages/CustomerCare/JobPage/Detail/ViewedHistory';

class Info extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            loading: true,
            revision: null,
            employer: null,
            configForm: utils.getConfigForm(channelCodeCurrent, "CustomerCare.JobPage.Detail")
        };

        this.goBack = this._goBack.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onRequest = this._onRequest.bind(this);
        this.onRejectSuccess = this._onRejectSuccess.bind(this);
        this.onViewPackageGuarantee = this._onViewPackageGuarantee.bind(this);
        this.onCopy = this._onCopy.bind(this);
    }

    async asyncData() {
        const { job } = this.props;
        const employerDetail = await getEmployerDetail(job.employer_id);
        this.setState({ employer: employerDetail, loading: false });
    }

    async _onCopy() {
        const { job } = this.props;
        window.open(`${Constant.BASE_URL_JOB}?action=edit&id=0&copy_id=${job?.id}`);
    }

    _onRequest() {
        const { history, job } = this.props;
        history.push({
            pathname: Constant.BASE_URL_REQUIREMENT_APPROVE,
            search: '?action=editJob&id=' + _.get(job, 'id')
        });
    }

    _onEdit() {
        const { history, job } = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_JOB,
                search: '?action=edit&id=' + _.get(job, 'id')
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
                pathname: Constant.BASE_URL_JOB,
                search: '?' + queryString.stringify(params)
            });

            return true;
        }
    }

    async _onApprove() {
        const { actions, job, idKey } = this.props;
        actions.showLoading();
		const res = await approveRevision(job.id);
        if (res) {
            actions.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKey);
        }
        actions.hideLoading();
    }

    _onReject() {
        this.popupReject._handleShow();
    }

    _onRejectSuccess() {
        const {idKey} = this.props;
        publish(".refresh", {}, idKey)
    }

    _goBack() {
        const { history } = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_JOB,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_JOB,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    _onViewPackageGuarantee() {
        const { history, job } = this.props;
        history.push({
            pathname: Constant.BASE_URL_GUARANTEE_JOB,
            search: `?action=listJob&employer_id=${job?.employer_id}&q=${job?.id}`
        });

        return true;
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const { job, history, revision } = this.props;
        const { loading, employer, configForm } = this.state;
        const search = queryString.parse(_.get(history, ['location', 'search']));
        const jobMerge = getMergeDataRevision(job, revision);
        const isDelete = job?.status === Constant.STATUS_DELETED;
        if (loading || !employer) {
            return (
                <LoadingSmall style={{ textAlign: "center" }}/>
            )
        }

        return (
            <div className="row">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin
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
                        <div className="col-sm-4 col-xs-4 padding0">Nghề nghiệp</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {_.isArray(_.get(jobMerge, 'occupation_ids_main')) && _.get(jobMerge,
                                'occupation_ids_main').map((occupation_id, key) => (
                                <span key={key}>
                                    <SpanSystem value={occupation_id} type={"occupations"} notStyle
                                                multi={key !== 0}/>
                                </span>
                            ))}
                        </div>
                    </div>
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
                        !!jobMerge["field_ids_child"]?.length && <div className="col-sm-12 col-xs-12 row-content padding0">
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
                        <div className="col-sm-4 col-xs-4 padding0">Địa Điểm làm việc</div>
                        <ul className="col-sm-8 col-xs-8 text-bold">
                            {_.isArray(_.get(jobMerge, 'places')) && _.get(jobMerge, 'places').length > 0 ? _.get(jobMerge,
                                'places').map((place, key) => (
                                <li key={key} className="mb5">
                                    <SpanSystem value={place.province_id} type={"province"} notStyle
                                               />
                                                {place.address && place.address.trim().length > 0 ? `, ${place.address}` : ''}
                                                {place.district_id ? ', ' : ''}
                                               <SpanSystem value={place.district_id} type={"district"} notStyle/> 
                                </li>
                            )): _.isArray(_.get(jobMerge, 'province_ids')) && _.get(jobMerge,
                                'province_ids').map((province_id, key) => (
                                <span key={key}>
                                    <SpanSystem value={province_id} type={"province"} notStyle
                                                multi={key !== 0}/>
                                </span>
                            ))}
                        </ul>
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
                                   {`${+jobMerge?.salary_min/1000000} - ${+jobMerge?.salary_max/1000000} triệu`}
                               </>
                            ) :(
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_salary_range} value={jobMerge?.salary_range} notStyle/>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Hình thức làm việc</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_working_method} value={jobMerge?.working_method} notStyle/>
                        </div>
                    </div>
                    {jobMerge.is_search_allowed && (
                        <IsSearchAllowed {...jobMerge} />
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_job_status}
                                        value={_.get(jobMerge, 'status_combine', '')}/>
                        </div>
                    </div>
                    {jobMerge.revision_status === Constant.STATUS_DISABLED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {Array.isArray(revision.rejected_reason) && revision.rejected_reason.map(
                                    reason => {
                                        return (
                                            <div key={reason}>-
                                                <SpanCommon
                                                    idKey={Constant.COMMON_DATA_KEY_job_rejected_reason}
                                                    value={reason} notStyle/>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Lượt xem</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{utils.formatNumber(jobMerge.total_views, 0, ".", "")}</span>
                        </div>
                    </div>
						  <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Số CV cam kết/Số CV đã đến NTD</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {jobMerge?.commited_cv && <><SpanCommon idKey={Constant.COMMON_DATA_KEY_commited_cv_status} value={_.get(jobMerge, 'commited_cv', 0)}/>&nbsp;/&nbsp;{_.get(jobMerge, 'resumes_applied', 0)}</>}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày tạo</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{moment.unix(_.get(job, 'created_at')).format(
                                "DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày cập nhật</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{moment.unix(_.get(job, 'updated_at')).format(
                                "DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày hết hạn nộp</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{moment.unix(_.get(jobMerge, 'resume_apply_expired')).format(
                                "DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Nguồn tạo</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_created_source}
                                        value={_.get(jobMerge, 'created_source', '')} notStyle/>
                        </div>
                    </div>
                    {jobMerge?.id && (
                        <ViewedHistory id={jobMerge?.id} />
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <Link
                                to={{
                                    pathname: Constant.BASE_URL_JOB,
                                    search: '?' + queryString.stringify({
                                        ...search,
                                        action: 'history_changed',
                                        id: _.get(jobMerge, 'id')
                                    })
                                }}
                            >
                                <span
                                    className="text-underline text-primary pointer">Xem chi tiết</span>
                            </Link>
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
                        <div className="col-sm-5 col-xs-5 padding0">Email liên hệ</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{jobMerge?.job_contact_info?.contact_email}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Điện thoại liên hệ</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{jobMerge?.job_contact_info?.contact_phone}</span>
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
                                <a className="text-link" href={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${employer.id}`}>{employer.name}</a>
                            </Link>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Email đăng nhập</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{employer.email}</span>
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
                <div className="col-sm-12 col-xs-12 mt15">
                    {!isDelete &&
                        <>
                            {employer?.suspect_status !== Constant.STATUS_ACTIVED &&
                            <>
                                <CanRender actionCode={ROLES.customer_care_job_update}>
                                    <button type="button"
                                            className="el-button el-button-primary el-button-small"
                                            onClick={this.onEdit}>
                                        <span>Chỉnh sửa</span>
                                    </button>
                                </CanRender>
                                <CanRender actionCode={ROLES.quality_control_employer_staff_request_job_create}>
                                    <button type="button"
                                            className="el-button el-button-bricky el-button-small"
                                            onClick={this.onRequest}>
                                        <span>Đổi tiêu đề</span>
                                    </button>
                                </CanRender>
                                <CanRender actionCode={ROLES.customer_care_job_approval_job}>
                                    {/*{
                                        Number(_.get(jobMerge, 'status', '')) !== Constant.STATUS_ACTIVED &&
                                        Number(_.get(jobMerge, 'revision_status', '')) !== Constant.STATUS_ACTIVED
                                        && (
                                            <button type="button"
                                                    className="el-button el-button-info el-button-small"
                                                    onClick={this.onApprove}>
                                                <span>Duyệt</span>
                                            </button>
                                        )
                                    }*/}
                                    {Number(_.get(jobMerge,
                                        'revision_status',
                                        '')) === Constant.STATUS_INACTIVED && (
                                        // <Link
                                        //     className={"el-button el-button-small el-button-success"}
                                        //     to={{
                                        //         pathname: Constant.BASE_URL_JOB,
                                        //         search: '?' + queryString.stringify({
                                        //             ...search,
                                        //             action: 'history_changed',
                                        //             id: _.get(jobMerge, 'id')
                                        //         })
                                        //     }}
                                        // >
                                        //     Xét duyệt
										// </Link>
										<>
											<button type="button" className="el-button el-button-success el-button-small"
												onClick={this.onApprove}>
												<span>Duyệt</span>
											</button>
											<button type="button" className="el-button el-button-bricky el-button-small"
												onClick={this.onReject}>
												<span>Không duyệt</span>
											</button>
											<PopupForm onRef={ref => (this.popupReject = ref)}
												title={"Không duyệt Tin"}
												FormComponent={FormReject}
												initialValues={{ id: jobMerge.id, rejected_reason: '' }}
												validationSchema={Yup.object().shape({
													rejected_reason: Yup.string().required(Constant.MSG_REQUIRED).nullable()
												})}
												apiSubmit={rejectRevision}
												afterSubmit={this.onRejectSuccess}
												hideAfterSubmit />
										</>
                                    )}
                                    {Number(_.get(jobMerge,
                                        'revision_status',
                                        '')) !== Constant.STATUS_INACTIVED && (
                                        <>
                                            {_.get(jobMerge, 'status', '') === Constant.STATUS_ACTIVED && (
                                                <>
                                                    <button type="button"
                                                            className="el-button el-button-bricky el-button-small"
                                                            onClick={this.onReject}>
                                                        <span>Không duyệt</span>
                                                    </button>
                                                    <PopupForm onRef={ref => (this.popupReject = ref)}
                                                               title={"Không duyệt công việc"}
                                                               FormComponent={FormReject}
                                                               initialValues={{
                                                                   id: jobMerge.id,
                                                                   rejected_reason: ''
                                                               }}
                                                               validationSchema={Yup.object().shape({
                                                                   rejected_reason: Yup.string().required(
                                                                       Constant.MSG_REQUIRED).nullable()
                                                               })}
                                                               apiSubmit={reject}
                                                               afterSubmit={this.onRejectSuccess}
                                                               hideAfterSubmit/>
                                                </>
                                            )}
                                        </>
                                    )}
                                </CanRender>
                            </>
                            }
                            <CanRender actionCode={ROLES.customer_care_job_copy_job}>
                                <button type="button"
                                        className="el-button el-button-info el-button-small"
                                        onClick={this.onCopy}>
                                    <span>Sao chép</span>
                                </button>
                            </CanRender>
                            <CanRender actionCode={ROLES.customer_care_job_delete}>
                                {_.get(jobMerge, 'premium_type') !== Constant.JOB_PREMIUM_VIP && (
                                    <BtnPopup label={"Xóa"} className={"el-button-bricky"}
                                              Component={PopupDeleteJob} title={"Xóa Tin"}
                                              params={{ object: jobMerge }}/>
                                )}
                            </CanRender>
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onViewPackageGuarantee}>
                                <span>Xem gói bảo hành</span>
                            </button>
                        </>
                    }
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
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
        actions: bindActionCreators({ putToastSuccess, showLoading, hideLoading }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
