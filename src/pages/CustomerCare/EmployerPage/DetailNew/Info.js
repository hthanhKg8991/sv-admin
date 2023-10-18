import React from "react";
import { Link } from "react-router-dom";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {
    approve,
    deleteAssignStaff,
    deleteRoomNewCustomer,
    deleteRoomVerify,
    getKeywordLock,
    getKeywordSuspect,
    getReasonLock,
    getReasonSuspect,
    getRevision,
    reject,
    resendVerifyEmail,
    verifyEmail,
    updateVipEmployer, 
    sendMailWarningDrop,
    changeStatusOtp
} from "api/employer";
import { asyncApi } from "api";
import { getMergeDataRevision } from "utils/utils";
import { publish } from 'utils/event';
import { bindActionCreators } from 'redux';
import { hideLoading, hideSmartMessageBox, putToastSuccess, showLoading, SmartMessageBox , putToastError} from 'actions/uiAction';
import { connect } from 'react-redux';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import PopupForm from "components/Common/Ui/PopupForm";
import * as Yup from "yup";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import queryString from "query-string";
import BtnPopup from "components/Common/Ui/BtnPopup";
import FormReject from "pages/CustomerCare/EmployerPage/DetailNew/HistoryChanged/FormReject";
import PopupDeleteEmployer from "pages/CustomerCare/EmployerPage/Popup/PopupDeleteEmployer";
import PopupChangeBasket from "pages/CustomerCare/EmployerPage/Popup/PopupChangeBasket";
import PopupChangeAccountService from "pages/CustomerCare/EmployerPage/Popup/PopupChangeAccountService";
import PopupLockedEmployer from "pages/CustomerCare/EmployerPage/Popup/PopupLockedEmployer";
import PopupUnLockedEmployer from "pages/CustomerCare/EmployerPage/Popup/PopupUnLockedEmployer";
import PopupSuspectEmployer from "pages/CustomerCare/EmployerPage/Popup/PopupSuspectEmployer";
import PopupUnSuspectEmployer from "pages/CustomerCare/EmployerPage/Popup/PopupUnSuspectEmployer";
import PopupUnAssignCustomer from "pages/CustomerCare/EmployerPage/Popup/PopupUnAssignCustomer";
import EmployerKind from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerKind";
import EmployerFolder from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerFolder";
import EmployerNote from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerNote";
import BoxNotAllowed from "pages/CustomerCare/EmployerPage/DetailNew/BoxNotAllowed";
import BoxBlockAndUnblock from "pages/CustomerCare/EmployerPage/DetailNew/BoxBlockAndUnblock";
import BoxSuspect from "pages/CustomerCare/EmployerPage/DetailNew/BoxSuspect";
import EmployerKeywordBlock from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerKeywordBlock";
import EmployerBasic from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerBasic";
import EmployerStatus from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerStatus";
import EmployerRevision from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerRevision";
import EmployerEmail from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerEmail";
import EmployerLicense from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerLicense";
import EmployerAssignment from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployAssignment";
import EmployerRoom from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerRoom";
import EmployerJob from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerJob";
import EmployerHistoryChange from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerHistoryChange";
import EmployerViewResume from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerViewResume";
import EmployerByStaff from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerByStaff";
import EmployerLogo from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerLogo";
import EmployerCustomer from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerCustomer";
import EmployerSupport from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerSupport";
import EmployerContact from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerContact";
import EmployerHistoryClass from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerHistoryClass";
import EmployerTrademarkChange from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerTrademarkChange";
import EmployerCorssSellingStaff from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerCorssSellingStaff"
import EmployFreemium from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployFreemium";
import EmployerByAccountService from "pages/CustomerCare/EmployerPage/DetailNew/GeneralInf/EmployerByAccountService";
import * as uiAction from "actions/uiAction";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            revision: null,
            lock_reason: null,
            lock_keyword: null,
            suspect_reason: null,
            suspect_keyword: null,
        };

        this.goBack = this._goBack.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onChangePassword = this._onChangePassword.bind(this);
        this.btnVerifyEmail = this._btnVerifyEmail.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onRequest = this._onRequest.bind(this);
        this.onRejectSuccess = this._onRejectSuccess.bind(this);
        this.onRedirectSaleOrder = this._onRedirectSaleOrder.bind(this);
        this.sendMailVerify = this._sendMailVerify.bind(this);
        this.onDeleteAssignStaff = this._onDeleteAssignStaff.bind(this);
        this.onDeleteRoomVerify = this._onDeleteRoomVerify.bind(this);
        this.onDeleteRoomNewCustomer = this._onDeleteRoomNewCustomer.bind(this);
        this.onUpdateVipEmployer = this._onUpdateVipEmployer.bind(this);
        this.onSendMailNTD = this._onSendMailNTD.bind(this);
        this.onOffOtp = this._onOffOtp.bind(this);

    }

    async asyncData() {
        const { employer } = this.props;
        let fetch = {};
        fetch['revision'] = getRevision(employer.id);
        if ([Constant.STATUS_LOCKED].includes(_.get(employer, 'status'))) {
            fetch['lock_reason'] = getReasonLock(employer.id);
            fetch['lock_keyword'] = getKeywordLock(employer.id);
        }
        if ([Constant.STATUS_SUSPECTED].includes(_.get(employer, 'suspect_status'))) {
            fetch['suspect_reason'] = getReasonSuspect(employer.id);
            fetch['suspect_keyword'] = getKeywordSuspect(employer.id);
        }
        const res = await asyncApi(fetch);
        this.setState({
            loading: false,
            ...res
        })

    }

    _onSendMailNTD(){
        const { actions, employer, idKey} = this.props;
        actions.SmartMessageBox({
            title: 'Thông báo nhắc nhở',
            content: "Bạn có xác nhận gửi email cảnh báo hạ tài khoản NTD Freemium?",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await sendMailWarningDrop({ employer_id: employer.id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }

                actions.hideSmartMessageBox();
            }
        });
    }

    
    async _onOffOtp(status) {
        const { actions, employer, idKey } = this.props;
        const res = await changeStatusOtp({ employer_id: employer.id , status });
        if (res.code === Constant.CODE_SUCCESS) {
             actions.putToastSuccess('Thao tác thành công');
             publish(".refresh", {}, idKey);
         }else{
            actions.putToastError(res.msg);
         }
    }

    _onEdit() {
        const { history, employer } = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?action=edit&id=' + _.get(employer, 'id')
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
                pathname: Constant.BASE_URL_EMPLOYER,
                search: '?' + queryString.stringify(params)
            });

            return true;
        }
    }

    _onChangePassword() {
        const { history, employer } = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER,
            search: '?action=change_password&id=' + _.get(employer, 'id')
        });
    }

    _onRequest() {
        const { history, employer } = this.props;
        history.push({
            pathname: Constant.BASE_URL_REQUIREMENT_APPROVE,
            search: '?action=edit&id=' + _.get(employer, 'id')
        });
    }

    async _onDeleteRoomVerify() {
        const { actions, employer, idKey } = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc chắn Xả phòng khối hỗ trợ?',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteRoomVerify({ id: employer.id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    async _onDeleteAssignStaff() {
        const { actions, employer, idKey } = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc chắn xả NTD ra giỏ chung?',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteAssignStaff({ id: employer.id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    async _onDeleteRoomNewCustomer() {
        const { actions, employer, idKey } = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc chắn xả bộ phận chăm sóc?',
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteRoomNewCustomer({ id: employer.id });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    async _btnVerifyEmail() {
        const { actions, employer, idKey } = this.props;
        const res = await verifyEmail(employer.id);
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
        }
        publish(".refresh", {}, idKey)
    }

    async _sendMailVerify() {
        const { actions, employer } = this.props;
        const res = await resendVerifyEmail(employer.id);
        if (res) {
            actions.putToastSuccess('Gửi lại email xác thực thành công!');
        }
    }

    async _onApprove() {
        const { actions, employer, idKey } = this.props;
        actions.showLoading();
        const res = await approve(Number(employer.id));
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, idKey);
        }
        actions.hideLoading();
    }

    _onReject() {
        this.popupReject._handleShow();
    }

    _onRejectSuccess() {
        const { idKey } = this.props;
        publish(".refresh", {}, idKey);
    }

    _onRedirectSaleOrder() {
        const { history, employer } = this.props;
        // history.push({
        //     pathname: Constant.BASE_URL_ADD_SALES_ORDER,
        //     search: `?employer_id=${employer.id}`
        // });
        window.open(
            Constant.BASE_URL_ADD_SALES_ORDER + `?employer_id=${employer.id}`,
            '_blank' 
          );
    }

    _goBack() {
        const { history } = this.props;
        history.goBack();
    }

    async _onUpdateVipEmployer() {
        const { actions, employer, idKey } = this.props;
        actions.showLoading();
        const res = await updateVipEmployer({ employer_id: employer.id });
        if (res) {
            actions.putToastSuccess('Cập nhật thành công');
            publish(".refresh", {}, idKey);
        }
        actions.hideLoading();
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const { employer, history, common, idKey, branch } = this.props;
        const channel_code = branch.currentBranch.channel_code;
        const { loading, revision, lock_reason, lock_keyword, suspect_reason, suspect_keyword } = this.state;
        const employerMerge = getMergeDataRevision(employer, revision);
        const search = queryString.parse(_.get(history, ['location', 'search']));
        const items = _.get(common, Constant.COMMON_DATA_KEY_employer_rival_type);
        const riverObject = _.find(items, (o) => String(o.value) === String(employerMerge?.rival_type));
        if (loading) {
            return (
                <LoadingSmall style={{ textAlign: "center" }} />
            )
        }

        const isDelete = _.get(employerMerge, 'status') === Constant.STATUS_DELETED;
        const isShowPending = Number(employerMerge?.revision_status) === Constant.STATUS_INACTIVED &&
            Number(employerMerge?.suspect_status) !== Constant.STATUS_SUSPECTED;
        const isShowApprove = Number(employerMerge?.revision_status) !== Constant.STATUS_ACTIVED &&
            employerMerge?.status !== Constant.STATUS_ACTIVED;
        const isShowReject = Number(employerMerge?.revision_status) !== Constant.STATUS_INACTIVED &&
            employerMerge?.status === Constant.STATUS_ACTIVED;
        const isShowDelete = _.get(employerMerge, 'premium_status') !== Constant.EMPLOYER_PREMIUM;
        const isShowEmail = _.get(employerMerge, 'email_verified_status') === Constant.MAIL_NOT_VERIFIED &&
            ![Constant.STATUS_LOCKED].includes(_.get(employerMerge, 'status'));
        const isBlock = _.get(employerMerge, 'status') === Constant.STATUS_LOCKED;
        const isShowBlock = /*_.get(employerMerge, 'premium_status') !== Constant.EMPLOYER_PREMIUM &&*/
            ![Constant.STATUS_LOCKED].includes(_.get(employerMerge, 'status'));
        const isSuspect = _.get(employerMerge, 'suspect_status') === Constant.STATUS_ACTIVED &&
            ![Constant.STATUS_LOCKED].includes(_.get(employerMerge, 'status'));
        const isEmployerNotPotenital = _.get(employerMerge, 'assigned_type') === Constant.ASSIGNED_TYPE_NOT_POTENTIAL;
        const isEmployerFilter = _.get(employerMerge, 'assigned_type') === Constant.ASSIGNED_TYPE_FILTER;
        const isOnOtp = _.get(employerMerge, 'status_white_list') === Constant.STATUS_ACTIVED;

        const buttons = {
            UPDATE:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_update}>
                    <button type="button"
                            className="el-button el-button-primary el-button-small"
                            onClick={this.onEdit}>
                        <span>Chỉnh sửa</span>
                    </button>
                </CanRender>,
            DELETE:
                isShowDelete &&
                <CanRender actionCode={ROLES.customer_care_employer_delete}>
                    {_.get(employerMerge, 'premium_status') !== Constant.EMPLOYER_PREMIUM && (
                        <BtnPopup label={"Xóa"} className={"el-button-bricky"}
                                  Component={PopupDeleteEmployer} title={"Xóa NTD"}
                                  params={{ object: employerMerge }} />
                    )}
                </CanRender>,
            RESTORE:
                <CanRender actionCode={ROLES.customer_care_employer_delete}>
                    {_.get(employerMerge, 'status') === Constant.STATUS_DELETED && (
                        <button type="button"
                                className="el-button el-button-bricky el-button-small"
                                onClick={() => alert('Chức năng chưa hoạt động')}>
                            <span>Khôi phục</span>
                        </button>
                    )}
                </CanRender>,
            CHANGE_ASSIGN:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_change_assignment_manage}>
                    <BtnPopup label={"Chuyển CSKH"} className={"el-button-info"}
                              Component={PopupChangeBasket} title={"Chuyển CSKH"}
                              params={{ object: employerMerge }} />
                </CanRender>,
            VERIFY_EMAIL:
                isShowEmail && !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_email_manage}>
                    <button type="button"
                            className="el-button el-button-success el-button-small"
                            onClick={this.btnVerifyEmail}>
                        <span>Xác thực email</span>
                    </button>
                </CanRender>,
            BLOCK:
                isShowBlock &&
                <CanRender actionCode={ROLES.customer_care_employer_lock_active}>
                    <BtnPopup label={"Khóa tài khoản"} className={"el-button-bricky"}
                              Component={PopupLockedEmployer} title={"Khóa Tài Khoản NTD"}
                              params={{ object: employerMerge }} />
                </CanRender>,
            UN_BLOCK:
                isBlock &&
                <CanRender actionCode={ROLES.customer_care_employer_lock_active}>
                    <BtnPopup label={"Bỏ khóa"} className={"el-button-success"}
                              Component={PopupUnLockedEmployer}
                              title={"Bỏ Khóa Tài Khoản NTD"}
                              params={{ object: employerMerge }} />,
                </CanRender>,
            SUSPECT:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_suspect}>
                    <BtnPopup label={"Đánh dấu nghi ngờ"} className={"el-button-warning"}
                              Component={PopupSuspectEmployer}
                              title={"Đánh Dấu Nghi Ngờ NTD"}
                              params={{ object: employerMerge }} />
                </CanRender>,
            UN_SUSPECT:
                isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_unsuspect}>
                    <BtnPopup label={"Bỏ nghi ngờ"} className={"el-button-success"}
                              Component={PopupUnSuspectEmployer} title={"Bỏ nghi ngờ"}
                              params={{ object: employerMerge }} />
                </CanRender>,
            CREATE_SALE_ORDER:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_update}>
                    <button type="button"
                            className="el-button el-button-primary el-button-small"
                            onClick={this.onRedirectSaleOrder}>
                        <span>Tạo phiếu đăng ký</span>
                    </button>
                </CanRender>,
            DELETE_ASSIGN_STAFF:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_delete_room_verify}>
                    <button type="button"
                            className="el-button el-button-primary el-button-small"
                            onClick={this.onDeleteRoomVerify}>
                        <span>Xả phòng khối hỗ trợ</span>
                    </button>
                </CanRender>,
            DELETE_ROOM_ASSIGN_STAFF:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_delete_room_new_customer}>
                    <button type="button"
                            className="el-button el-button-info el-button-small"
                            onClick={this.onDeleteRoomNewCustomer}>
                        <span>Xả phòng New Customer</span>
                    </button>
                </CanRender>,
            DELETE_ASSIGN_STAFF_FROM_CUS:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_delete_assign_staff_from_cus}>
                    <BtnPopup label={"Xả NTD ra khỏi Customer"} className={"el-button-info"}
                              Component={PopupUnAssignCustomer} title={"Xả NTD ra khỏi Customer"}
                              params={{ employer_id: employer.id, idKey: idKey }} />
                </CanRender>,
            DELETE_ASSIGN:
                <CanRender actionCode={ROLES.customer_care_employer_delete_assign_staff}>
                    <button type="button"
                            className="el-button el-button-primary el-button-small"
                            onClick={this.onDeleteAssignStaff}>
                        <span>Xả NTD ra giỏ chung</span>
                    </button>
                </CanRender>
            ,
            SEND_REQUEST:
                !isSuspect &&
                <CanRender actionCode={ROLES.quality_control_employer_staff_request_employer_create}>
                    <button type="button"
                            className="el-button el-button-bricky el-button-small"
                            onClick={this.onRequest}>
                        <span>Gửi yêu cầu</span>
                    </button>
                </CanRender>,
            CHANGE_PASSWORD:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_change_password}>
                    <button type="button" className="el-button el-button-info el-button-small"
                            onClick={this.onChangePassword}>
                        <span>Đổi mật khẩu</span>
                    </button>
                </CanRender>,
            APPROVE:
                isShowApprove && !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_approval_employer}>
                    <button type="button"
                            className="el-button el-button-info el-button-small"
                            onClick={this.onApprove}>
                        <span>Duyệt</span>
                    </button>
                </CanRender>,
            PENDING:
                isShowPending && !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_approval_employer}>
                    <Link
                        className={"el-button el-button-small el-button-success"}
                        to={{
                            pathname: Constant.BASE_URL_EMPLOYER,
                            search: '?' + queryString.stringify({
                                ...search,
                                action: 'history_changed',
                                id: _.get(employerMerge, 'id')
                            })
                        }}
                    >
                        Xét duyệt
                    </Link>
                </CanRender>,
            REJECT:
                isShowReject && !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_approval_employer}>
                    <button type="button"
                            className="el-button el-button-bricky el-button-small"
                            onClick={this.onReject}>
                        <span>Không duyệt</span>
                    </button>
                    <PopupForm onRef={ref => (this.popupReject = ref)}
                               title={"Không duyệt NTD"}
                               FormComponent={FormReject}
                               initialValues={{
                                   id: employerMerge.id,
                                   rejected_reason: ''
                               }}
                               validationSchema={Yup.object().shape({
                                   rejected_reason: Yup.string().required(
                                       Constant.MSG_REQUIRED).nullable()
                               })}
                               apiSubmit={reject}
                               afterSubmit={this.onRejectSuccess}
                               hideAfterSubmit
                    />
                </CanRender>,
            BACK:
                <button type="button" className="el-button el-button-default el-button-small"
                        onClick={this.goBack}>
                    <span>Quay lại</span>
                </button>,
            UPDATE_TYPE_ACCOUNT:
                <CanRender actionCode={ROLES.customer_care_update_type_account}>
                    <button type="button"
                            className="el-button el-button-bricky el-button-small"
                            onClick={this.onUpdateVipEmployer}>
                        <span>UPDATE LOẠI TÀI KHOẢN</span>
                    </button>
                </CanRender>,
            ACCOUNTSERVICE:
                !isSuspect &&
                <CanRender actionCode={ROLES.customer_care_employer_change_account_service}>
                    <BtnPopup label={"Chuyển CSKH Account Service"} className={"el-button-info"}
                              Component={PopupChangeAccountService} title={"Chuyển CSKH Account Service"}
                              params={{ object: employerMerge }} />
                </CanRender>,
            MAILNTD:
                employer?.is_freemium &&
                <CanRender actionCode={ROLES.customer_care_send_mail_warning_drop}>
                    <button type="button"
                            className="el-button el-button-info el-button-small"
                            onClick={this.onSendMailNTD}>
                        <span>Gửi mail cảnh báo hạ Freemium</span>
                    </button>
                </CanRender>,
                ONOTP:
                !isOnOtp &&
                <CanRender actionCode={ROLES.customer_care_employer_white_list_change_status}>
                <button type="button"
                    className="el-button el-button-bricky el-button-small"
                    onClick={() => this.onOffOtp(1)}>
                    <span>Bỏ xác thực OTP</span>
                </button>
                </CanRender>,
                 OFFOTP:
                isOnOtp &&
                <CanRender actionCode={ROLES.customer_care_employer_white_list_change_status}>
                 <button type="button"
                    className="el-button el-button-success el-button-small"
                    onClick={() => this.onOffOtp(2)}>
                    <span>Phải xác thực OTP</span>
                </button>
                </CanRender>,
        };

        return (
            <div className="row">
                {
                    (!isBlock && !isEmployerFilter && !isEmployerNotPotenital && !isDelete) &&
                    <BoxNotAllowed employer={employer} />
                }
                <BoxBlockAndUnblock employer={employer} />
                <BoxSuspect employer={employer} />
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Tài Khoản</div>
                    <EmployerBasic employerMerge={employerMerge} />
                    <EmployerStatus employerMerge={employerMerge}
                                    lock_reason={lock_reason}
                                    lock_keyword={lock_keyword}
                                    suspect_reason={suspect_reason}
                                    suspect_keyword={suspect_keyword}
                    />
                    <EmployerRevision employerMerge={employerMerge} revision={revision} />
                    <EmployerEmail employerMerge={employerMerge} sendMailVerify={this.sendMailVerify} {...this.props} />
                    <EmployerLicense employerMerge={employerMerge} riverObject={riverObject} />
                    <EmployerAssignment employer={employer} employerMerge={employerMerge} />
                    <EmployerRoom id={employerMerge.room_id} />
                    <EmployerJob employerMerge={employerMerge} />
                    <EmployerKeywordBlock id={employerMerge?.id} idKey={idKey} />
                    {channel_code === Constant.CHANNEL_CODE_VL24H
                        ?
                        <>
                            <CanRender actionCode={ROLES.customer_care_employer_view_select_cross_selling}>
                                <EmployerCorssSellingStaff employer={employerMerge} />
                            </CanRender>
                            <EmployFreemium employer={employer} />
                        </>
                        : null
                    }
                </div>
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin liên hệ</div>
                    <EmployerContact employerMerge={employerMerge} />
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0 mt-10">Thông tin thêm</div>
                    <EmployerTrademarkChange employerMerge={employerMerge} />
                    <EmployerHistoryChange employerMerge={employerMerge} search={search} />
                    <EmployerViewResume employerMerge={employerMerge} />
                    <EmployerHistoryClass employerMerge={employerMerge} />
                    <EmployerKind {...employerMerge} idKey={idKey} />
                    <EmployerFolder {...employerMerge} idKey={idKey} />
                    <EmployerNote {...employerMerge} idKey={idKey} />
                    <EmployerByStaff employerMerge={employerMerge} />
                    <EmployerByAccountService employerMerge={employerMerge} />
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Hỗ trợ</div>
                    <EmployerSupport {...employerMerge} idKey={idKey} history={history} />
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Company</div>
                    <EmployerCustomer employerMerge={employerMerge} history={history} idKey={idKey} />
                </div>
                <div className="col-sm-3 col-xs-3">
                    <EmployerLogo employerMerge={employerMerge} />
                </div>
                <div className="row">
                    {!isDelete && !isBlock && <>
                        <div className="col-md-12 mt10">
                            {buttons.UPDATE}
                            {buttons.CHANGE_PASSWORD}
                            {/*{buttons.APPROVE}*/}
                            {buttons.PENDING}
                            {buttons.REJECT}
                            {buttons.VERIFY_EMAIL}
                            {buttons.SEND_REQUEST}
                            {buttons.CREATE_SALE_ORDER}
                            {buttons.UPDATE_TYPE_ACCOUNT}
                            {buttons.MAILNTD}
                            {buttons.ONOTP}
                            {buttons.OFFOTP}
                        </div>
                        <div className="col-sm-12 col-xs-12 mt10">
                            {buttons.CHANGE_ASSIGN}
                            {buttons.ACCOUNTSERVICE}
                            {/* {buttons.DELETE_ASSIGN_STAFF} */}
                            {buttons.DELETE_ASSIGN_STAFF_FROM_CUS}
                            {/* Off nút xả giỏ (task PT-594) */}
                            {/* {buttons.DELETE_ROOM_ASSIGN_STAFF} */}
                            {/* {buttons.DELETE_ASSIGN} */}
                            {buttons.BLOCK}
                            {buttons.SUSPECT}
                            {buttons.UN_SUSPECT}
                            {buttons.RESTORE}
                            {buttons.DELETE}
                        </div>
                    </>}
                    <div className="col-sm-12 col-xs-12 mt10">
                        {buttons.UN_BLOCK}
                    </div>
                    <div className="col-sm-12 col-xs-12 mt10">
                        {buttons.BACK}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        common: _.get(state, ['sys', 'common', 'items'], null),
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            showLoading,
            hideLoading,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
