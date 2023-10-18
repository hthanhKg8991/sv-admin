import React from "react";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {
    approveSeeker,
    deleteSeeker,
    rejectSeeker,
    seekerRevision,
    verifyEmailSeeker,
    verifySmsSeeker,
    seekerDetailExperiment,
    seekerCvDetail,
    seekerCvDetailMW, seekerCvDetailChannel
} from "api/seeker";
import queryString from "query-string";
import {asyncApi} from "api";
import SeekerSupport from '../Detail/SeekerSupport';
import ROLES from 'utils/ConstantActionCode';
import CanRender from "components/Common/Ui/CanRender";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {hideLoading, putToastSuccess, showLoading} from "actions/uiAction";
import {connect} from "react-redux";
import {publish} from "utils/event";
import InfoResume from "pages/SeekerCare/SeekerPage/DetailNew/InfoResume";
import {Link} from "react-router-dom";
import moment from "moment";
import * as utils from "utils/utils";
import * as Yup from "yup";
import {getMergeDataRevision} from "utils/utils";
import SpanText from "components/Common/Ui/SpanText";
import PopupChangeBasket from 'pages/SeekerCare/SeekerPage/Popup/PopupChangeBasket';
import BtnPopup from 'components/Common/Ui/BtnPopup';
import PopupForm from "components/Common/Ui/PopupForm";
import FormReject from "pages/SeekerCare/SeekerPage/DetailNew/HistoryChanged/FormReject";
import SpanSystem from "components/Common/Ui/SpanSystem";

let timer = null;

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            revision: null,
            experiment: null,
            cvMe: null,
            cvMeMW: null,
            cvMeTVN: null,
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
        this.onChangePassword = this._onChangePassword.bind(this);
        this.onViewLog = this._onViewLog.bind(this);
    }

    async asyncData() {
        const {seeker} = this.props;
        let fetch = {};
        fetch['revision'] = seekerRevision(seeker.id);
        fetch['experiment'] = seekerDetailExperiment(seeker.id);
        fetch['cvMe'] = seekerCvDetail(seeker.id);
        fetch['cvMeMW'] = seekerCvDetailChannel(seeker.id, "mw");
        fetch['cvMeTVN'] = seekerCvDetailChannel(seeker.id, "tvn");
        const res = await asyncApi(fetch);
        this.setState({
            loading: false,
            ...res
        })
    }

    _onChangePassword() {
        const {history, seeker} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SEEKER,
            search: '?action=change_password&id=' + _.get(seeker, 'id')
        });
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
        const {seeker, history} = this.props;
        this.props.uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa NTV: ' + seeker.id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const {actions, uiAction} = this.props;
                const res = await deleteSeeker(seeker.id);
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    history.push({
                        pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                    });
                }
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
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
        const {actions, seeker, idKey} = this.props;
        actions.showLoading();
        const res = await approveSeeker(Number(seeker.id));
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
        publish(".refresh", {}, idKey);
    }

    _onViewLog(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SEEKER,
            search: '?action=history_verify&id=' + id
        });
    }

    componentDidMount() {
        this.asyncData();
    }

    componentWillUnmount() {
        clearTimeout(timer);
    }

    render() {
        const {seeker, history} = this.props;
        const {loading, revision, cvMe, cvMeMW, cvMeTVN} = this.state;
        const gender = utils.convertObjectValueCommonData(this.props.sys.items, Constant.COMMON_DATA_KEY_gender);
        const marital_status = utils.convertObjectValueCommonData(this.props.sys.items, Constant.COMMON_DATA_KEY_marital_status);
        const search = queryString.parse(_.get(history, ['location', 'search']));
        const seekerMerge = getMergeDataRevision(seeker, revision);
        const isDelete = seeker?.status === Constant.STATUS_DELETED;
        const created_at = moment.unix(_.get(seeker, 'created_at')).format("DD/MM/YYYY HH:mm:ss");
        const last_logged_in_at = seeker?.logined_at ?
            moment.unix(_.get(seeker, 'logined_at')).format("DD/MM/YYYY HH:mm:ss") :
            "Chưa cập nhật";

        if (loading) {
            return (
                <LoadingSmall style={{textAlign: "center"}}/>
            )
        }

        return (
            <div className="row content-box">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Tài Khoản</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seekerMerge.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Kênh</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {Constant.CHANNEL_LIST[String(seekerMerge?.channel_code)]}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Họ và tên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seekerMerge.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seekerMerge.email}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Điện thoại</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seekerMerge.mobile || "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày sinh</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{seekerMerge.birthday ? moment.unix(seekerMerge.birthday).format("DD/MM/YYYY") : "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Giới tính</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{gender[seekerMerge.gender] || "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{seekerMerge.address || "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tỉnh/ Thành phố</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {seekerMerge.province_id &&
                            <SpanSystem value={seekerMerge.province_id} type={"province"} notStyle/>}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Miền theo IP đăng ký</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_branch_name}
                                        value={seekerMerge?.branch_register} notStyle/>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Hôn nhân</div>
                        <div
                            className="col-sm-8 col-xs-8 text-bold">{marital_status[seekerMerge.marital_status] || "Chưa cập nhật"}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày đăng ký</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{created_at}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Đăng nhập gần nhất</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{last_logged_in_at}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái TK</div>
                        <div className="col-sm-6 col-xs-6 padding0">
                            <SpanText
                                idKey={Constant.COMMON_DATA_KEY_seeker_status}
                                value={seekerMerge.status_combine} />
                            {/*{experiment?.experiment_user_info && (*/}
                            {/*    <span style={{color: '#ff0000'}}>*/}
                            {/*        (CV Builder)*/}
                            {/*    </span>*/}
                            {/*)}*/}
                        </div>
                    </div>
                    {parseInt(_.get(seekerMerge, 'status')) !== Constant.STATUS_ACTIVED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do từ chối</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {_.isArray(_.get(revision, 'rejected_reason')) && _.get(
                                    revision,
                                    'rejected_reason').map(reason => (
                                    <div key={reason}>
                                        - <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_rejected_reason}
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
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Xác thực Email</div>
                        <div className="col-sm-6 col-xs-6 text-bold padding0">
                            <SpanText idKey={Constant.COMMON_DATA_KEY_token_email}
                                      value={seekerMerge.token_email}
                                      cls={"col-sm-6 col-xs-6"}
                            />
                            <CanRender actionCode={ROLES.customer_care_employer_history_email_verify}>
                                <span className={"text-link font-weight-bold"}
                                      onClick={() => this._onViewLog(seekerMerge?.id)}>
                                    Xem chi tiết
                                </span>
                            </CanRender>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Xác thực SĐT</div>
                        <div className="col-sm-6 col-xs-6 text-bold padding0">
                            <SpanText idKey={Constant.COMMON_DATA_KEY_token_mobile}
                                      value={seekerMerge.token_sms}
                                      cls={"col-sm-6 col-xs-6"}
                            />
                            <CanRender actionCode={ROLES.customer_care_employer_history_email_verify}>
                                <span className={"text-link font-weight-bold"}
                                      onClick={() => this._onViewLog(seekerMerge?.id)}>
                                    Xem chi tiết
                                </span>
                            </CanRender>
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <Link
                                to={{
                                    pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                                    search: '?' + queryString.stringify({
                                        ...search,
                                        action: 'history_changed',
                                        id: _.get(seekerMerge, 'id')
                                    })
                                }}
                            >
                                <span className="text-underline text-primary pointer">Xem chi tiết</span>
                            </Link>
                        </div>
                    </div>

                </div>
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin thêm
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Nguồn tạo</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{_.get(seekerMerge, 'created_source')}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Người duyệt</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{_.get(revision, 'approved_by')}</span>
                        </div>
                    </div>
                    {seekerMerge.id && (
                        <SeekerSupport {...seekerMerge}/>
                    )}
                </div>
                <div className="col-sm-3 col-xs-3">
                    <div className="logo-c">
                        {seekerMerge.avatar_url
                            ? <img src={seekerMerge.avatar_url} alt="logo"/>
                            : <img src="/assets/img/no_image.dc8b35d.png" alt="no logo"/>
                        }
                    </div>
                </div>
                {!isDelete &&
                <>
                    <div className="col-sm-12 col-xs-12 mt10">
                        <CanRender actionCode={ROLES.seeker_care_seeker_update}>
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onEdit}>
                                <span>Chỉnh sửa</span>
                            </button>
                        </CanRender>
                        <CanRender actionCode={ROLES.seeker_care_seeker_change_password}>
                            <button type="button" className="el-button el-button-info el-button-small"
                                    onClick={this.onChangePassword}>
                                <span>Đổi mật khẩu</span>
                            </button>
                        </CanRender>
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={this.onSearchPhone}>
                            <span>Tra Cứu SĐT</span>
                        </button>
                        <CanRender actionCode={ROLES.seeker_care_seeker_approval}>
                            {/* {
                                    Number(_.get(seekerMerge, 'status', '')) !== Constant.STATUS_ACTIVED &&
                                    Number(_.get(seekerMerge, 'revision_status', '')) !== Constant.STATUS_ACTIVED
                                    && (
                                    <button type="button" className="el-button el-button-info el-button-small"
                                            onClick={this.onApprove}>
                                        <span>Duyệt</span>
                                    </button>
                                )}*/}
                            {parseInt(_.get(seekerMerge, 'revision_status', '')) === Constant.STATUS_INACTIVED && (
                                <Link
                                    className={"el-button el-button-small el-button-success"}
                                    to={{
                                        pathname: Constant.BASE_URL_SEEKER_CARE_SEEKER,
                                        search: '?' + queryString.stringify({
                                            ...search,
                                            action: 'history_changed',
                                            id: _.get(seekerMerge, 'id')
                                        })
                                    }}
                                >
                                    Xét duyệt
                                </Link>
                            )}
                            {parseInt(_.get(seekerMerge, 'revision_status', '')) !== Constant.STATUS_INACTIVED && (
                                <>
                                    {_.get(seekerMerge, 'status', '') === Constant.STATUS_ACTIVED && (
                                        <>
                                            <button type="button" className="el-button el-button-bricky el-button-small"
                                                    onClick={this.onReject}>
                                                <span>Không duyệt</span>
                                            </button>
                                            <PopupForm onRef={ref => (this.popupReject = ref)}
                                                       title={"Không duyệt NTV"}
                                                       FormComponent={FormReject}
                                                       initialValues={{id: seekerMerge.id, rejected_reason: ''}}
                                                       validationSchema={Yup.object().shape({
                                                           rejected_reason: Yup.string().required(Constant.MSG_REQUIRED).nullable()
                                                       })}
                                                       apiSubmit={rejectSeeker}
                                                       afterSubmit={this.onRejectSuccess}
                                                       hideAfterSubmit/>
                                        </>
                                    )}
                                </>
                            )}
                        </CanRender>
                        <CanRender actionCode={ROLES.seeker_care_seeker_delete}>
                            {![Constant.STATUS_DELETED].includes(_.get(seekerMerge, 'status')) && (
                                <button type="button"
                                        className="el-button el-button-bricky el-button-small"
                                        onClick={this.onDelete}>
                                    <span>Xóa</span>
                                </button>
                            )}
                        </CanRender>
                    </div>
                    <div className="col-sm-12 col-xs-12">
                        <CanRender actionCode={ROLES.seeker_care_seeker_approval}>
                            {seekerMerge.token_email !== Constant.IS_VERIFIED && ![Constant.STATUS_DELETED].includes(seekerMerge.status) && (
                                <CanRender actionCode={ROLES.seeker_care_seeker_verify_email}>
                                    <button type="button"
                                            className="el-button el-button-success el-button-small"
                                            onClick={this.verifyEmail}>
                                        <span>Xác thực email</span>
                                    </button>
                                </CanRender>
                            )}
                            {seekerMerge.token_sms !== Constant.IS_VERIFIED && ![Constant.STATUS_DELETED].includes(seekerMerge.status) && (
                                <CanRender actionCode={ROLES.seeker_care_seeker_verify_phone}>
                                    <button type="button"
                                            className="el-button el-button-success el-button-small"
                                            onClick={this.verifySms}>
                                        <span>Xác thực ĐT</span>
                                    </button>
                                </CanRender>
                            )}
                        </CanRender>
                        <CanRender actionCode={ROLES.seeker_care_seeker_change_staff}>
                            {seekerMerge.id && (
                                <BtnPopup label={"Chuyển Giỏ"} className={"el-button-warning el-button-small"}
                                          Component={PopupChangeBasket} title={"Chuyển Giỏ NTV"}
                                          params={{object: seekerMerge}}/>
                            )}
                        </CanRender>
                        <CanRender actionCode={ROLES.seeker_care_seeker_view_apply_job}>
                            <Link to={`${Constant.BASE_URL_SEEKER}?${queryString.stringify({
                                action: "job_apply",
                                id: seekerMerge?.id
                            })}`}>
                                <button type="button" className="el-button el-button-info el-button-small">
                                    Việc làm đã ứng tuyển
                                </button>
                            </Link>
                        </CanRender>
                    </div>
                    <div className="col-sm-12 col-xs-12">
                        <CanRender actionCode={ROLES.seeker_care_resume_list}>
                            <a className="el-button el-button-primary el-button-small" target="_blank"
                               rel="noopener noreferrer"
                               href={`${Constant.BASE_URL_SEEKER_RESUME}?seeker_id=${seeker.id}`}>
                                <span>Danh sách hồ sơ</span>
                            </a>
                        </CanRender>
                        {[Constant.STATUS_ACTIVED, Constant.STATUS_INACTIVED].includes(seekerMerge.status) && (
                            <>
                                <InfoResume {...seekerMerge} />
                                <CanRender actionCode={ROLES.seeker_care_seeker_create_cv}>
                                    <Link to={`${Constant.BASE_URL_SEEKER}?${queryString.stringify({
                                        action: "cv",
                                        seeker_id: seekerMerge?.id
                                    })}`}>
                                        <button type="button" className="el-button el-button-primary el-button-small">
                                            {cvMe ? "Chỉnh sửa CV" : "Tạo CV"}
                                        </button>
                                    </Link>
                                </CanRender>
                                {cvMeMW?.file_url &&  (
                                    <button type="button"
                                            className="el-button el-button-primary el-button-small"
                                            onClick={() => window.open(cvMeMW?.file_url, "_blank")}>
                                        <span>Xem trước CV Mywork</span>
                                    </button>
                                )}
                                {cvMeTVN?.file_url &&  (
                                    <button type="button"
                                            className="el-button el-button-primary el-button-small"
                                            onClick={() => window.open(cvMeTVN?.file_url, "_blank")}>
                                        <span>Xem trước CV Tìm Việc Nhanh</span>
                                    </button>
                                )}
                            </>
                        )}
                        <a className="el-button el-button-primary el-button-small" target="_blank"
                            rel="noopener noreferrer"
                            href={`${Constant.BASE_URL_SEEKER_RESUME_APPLIED_HISTORY}?${queryString.stringify({seeker_q:seekerMerge?.email})}`}>
                            <span>Danh sách file upload</span>
                        </a>
                    </div>
                </>
                }
                <div className="col-sm-12 col-xs-12">
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={() => this.goBack()}>
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
        sys: state.sys.common
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
