import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from "moment";
import EmployerNote from './EmployerNote';
import EmployerFolder from './EmployerFolder';
import EmployerKind from './EmployerKind';
import PopupEmployer from "../../Popup/PopupEmployer";
import PopupHistory from "../../Popup/PopupHistory/index";
import PopupHistoryViewResume from "../../Popup/PopupHistoryViewResume";
import PopupHistoryReportSeeker from "../../Popup/PopupHistoryReportSeeker";
import PopupBusinessLicense from "../../Popup/PopupBusinessLicense";
import PopupChangeBasket from "../../Popup/PopupChangeBasket";
import PopupLockedEmployer from "../../Popup/PopupLockedEmployer";
import PopupUnLockedEmployer from "../../Popup/PopupUnLockedEmployer";
import PopupSuspectEmployer from "../../Popup/PopupSuspectEmployer";
// import PopupUnSuspectEmployer from "../../Popup/PopupUnSuspectEmployer";
import PopupDeleteEmployer from "../../Popup/PopupDeleteEmployer";
import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import PopOver from "components/Common/Ui/PopOver";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: null,
            object_revision: {},
            reason_lock: [],
            reason_suspect: [],
            reason_blacklist_keyword_lock: [],
            reason_blacklist_keyword_suspect: [],
            loading: true
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnRestore = this._btnRestore.bind(this);
        this.btnHistory = this._btnHistory.bind(this);
        this.btnHistoryViewResume = this._btnHistoryViewResume.bind(this);
        this.btnHistoryReportSeeker = this._btnHistoryReportSeeker.bind(this);
        this.btnBusinessLicense = this._btnBusinessLicense.bind(this);
        this.btnChangeBasket = this._btnChangeBasket.bind(this);
        this.btnLockEmployer = this._btnLockEmployer.bind(this);
        this.btnUnLockEmployer = this._btnUnLockEmployer.bind(this);
        this.btnUnSuspectEmployer = this._btnUnSuspectEmployer.bind(this);
        this.btnSuspectEmployer = this._btnSuspectEmployer.bind(this);
        this.btnVerifyEmail = this._btnVerifyEmail.bind(this);
        this.btnReSendVerifyEmail = this._btnReSendVerifyEmail.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }
    _refreshList(delay = 0){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER, {id: this.props.id, list: true}, delay);
        });
    }
    _btnEdit(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Chỉnh Sửa NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupEmployer, title,{object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnApprove(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Duyệt NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupHistory, title,{object: object, approve: true});
    }
    _btnReject(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Không Duyệt NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupHistory, title,{object: object, reject: true});
    }
    _btnDelete(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Xóa NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupDeleteEmployer, title, {object: object});
    }
    _btnRestore(){
        alert('Chức năng chưa hoạt động');
    }
    _btnHistory(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Lịch Sử Thay Đổi NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupHistory, title, {object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'history';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnHistoryViewResume(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Lịch Sử Xem Hồ Sơ NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupHistoryViewResume, title,{object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'viewresume';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnHistoryReportSeeker(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Lịch Sử Báo Xấu Ứng Viên NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupHistoryReportSeeker, title,{object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'reportseeker';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnBusinessLicense(){
        let object = this.state.object;
        //let status = utils.parseStatus(object.status, object.last_revision_status);
        //let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Giấy Phép Kinh Doanh NTD: " + object.id + " - " + utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_business_license_status, parseInt(object.business_license_status));

        this.props.uiAction.createPopup(PopupBusinessLicense, title, {object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'license';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnChangeBasket(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Chuyển Giỏ NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupChangeBasket, title,{object: object});
    }
    _btnLockEmployer(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Khóa Tài Khoản NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupLockedEmployer, title, {object: object});
    }
    _btnUnLockEmployer(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Bỏ Khóa Tài Khoản NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupUnLockedEmployer, title, {object: object});
    }
    _btnSuspectEmployer(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let title = "Đánh Dấu Nghi Ngờ NTD: " + object.id + " - " + employer_status[status];
        this.props.uiAction.createPopup(PopupSuspectEmployer, title, {object: object});
    }
    _btnUnSuspectEmployer(){
        //không cần lý do bỏ nghi ngờ
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn bỏ nghi ngờ nhà tuyển dụng ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                let args = {
                    employer_id: this.state.object.id,
                };
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT, args);
                this.props.uiAction.showLoading();
            }
        });
    }

    _btnVerifyEmail(){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_VERIFY_EMAIL, {id: this.state.object.id});
    }
    _btnReSendVerifyEmail(){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_RESEND_VERIFY_EMAIL, {id: this.state.object.id});
    }
    _showPopup(){
        let query = queryString.parse(window.location.search);
        if(query.action_active){
            switch (query.action_active){
                case 'edit':
                    this.btnEdit();
                    break;
                case 'history':
                    this.btnHistory();
                    break;
                case 'license':
                    this.btnBusinessLicense();
                    break;
                case 'reportseeker':
                    this.btnHistoryReportSeeker();
                    break;
                case 'viewresume':
                    this.btnHistoryViewResume();
                    break;
                default:
                    break;
            }
        }
    }

    componentWillMount() {
        this.props.uiAction.deleteRefreshList('EmployerGeneralInf');
        this.refreshList();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER];
            if(response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    if (parseInt(response.data.last_revision_status) === Constant.STATUS_DISABLED) {
                        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION, {employer_id: this.props.id, list: true});
                    }
                    this.setState({object: response.data},()=>{
                        this.showPopup();
                    });
                    this.setState({loading: false});

                    if([Constant.STATUS_LOCKED].includes(parseInt(response.data.status))){
                        //khóa tài khoản
                        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_REASON_LOCK, {employer_id: this.props.id});

                        //dính từ khóa cấm
                        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_LOCK, {employer_id: this.props.id});
                    }

                    if ([Constant.STATUS_ACTIVED].includes(parseInt(response.data.suspect_status))) {
                        //đánh dấu nghi ngờ
                        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_REASON_SUSPECT, {employer_id: this.props.id});

                        //dính từ khóa cấm
                        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_SUSPECT, {employer_id: this.props.id});
                    }
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION];
            if(response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({object_revision: response.data});
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_LOCK]) {
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_LOCK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({reason_lock : response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_REASON_LOCK);
        }
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_SUSPECT]) {
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_SUSPECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({reason_suspect : response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_REASON_SUSPECT);
        }

        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_LOCK]) {
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_LOCK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({reason_blacklist_keyword_lock : response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_LOCK);
        }
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_SUSPECT]) {
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_SUSPECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({reason_blacklist_keyword_suspect : response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_REASON_BLACKLIST_KEYWORD_SUSPECT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_VERIFY_EMAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_VERIFY_EMAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_VERIFY_EMAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_RESEND_VERIFY_EMAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_RESEND_VERIFY_EMAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_RESEND_VERIFY_EMAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.refreshList('EmployerGeneralInf');
            }

            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT);
        }
        if (newProps.refresh['EmployerGeneralInf']){
            let delay = newProps.refresh['EmployerGeneralInf'].delay ? newProps.refresh['EmployerGeneralInf'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('EmployerGeneralInf');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div className="row">
                    <div className="relative card-body text-center">
                        <LoadingSmall />
                    </div>
                </div>
            )
        }
        let {object, object_revision} = this.state;
        let employer_premium_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_premium_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        let email_verified_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_email_verified_status);
        let license_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_business_license_status);
        let rival_type = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_rival_type);
        let employer_rejected_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_rejected_reason);
        let employer_size = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_size);
        let premium_start_at = object.premium_renewed_at ? moment.unix(object.premium_renewed_at) : moment.unix(object.premium_created_at);
        let premium_end_at = object.premium_end_at ? moment.unix(object.premium_end_at).format("DD/MM/YYYY") : null;
        let assigning_changed_at = object.assigning_changed_at ? moment.unix(object.assigning_changed_at).format("DD/MM/YYYY HH:mm:ss") : null;

        let status = parseInt(object.status);
        let last_revision_status = parseInt(object.last_revision_status);

        let rival_type_warning = [1,2,4]; // Đối thủ trực tiếp, Đối thủ gián tiếp, Thuộc diện theo dõi

        let keyPress = [];
        if (last_revision_status) {
            if (![Constant.STATUS_LOCKED].includes(status)) {
                if (![Constant.STATUS_DELETED].includes(status)) {
                    keyPress.push("1");
                    if ([Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(last_revision_status)) {
                        keyPress.push("2");
                    }
                    if ([Constant.STATUS_INACTIVED].includes(last_revision_status)) {
                        keyPress.push("3");
                    }
                    if (this.props.user.isRole([Constant.DIVISION_TYPE_admin, Constant.DIVISION_TYPE_customer_care_leader, Constant.DIVISION_TYPE_root, Constant.DIVISION_TYPE_quality_control_employer])) {
                        keyPress.push("5");
                    }
                }
            }
            if (![Constant.STATUS_DELETED].includes(status)) {
                keyPress.push("4");
            }
        }

        return (
            <div className="row">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Tài Khoản</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên NTD</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.name}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email đăng nhập</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.email}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Điện thoại liên hệ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.phone}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Loại tài khoản</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <div>
                                <span>{employer_premium_status[object.premium_status]} </span>
                                {parseInt(object.premium_status) === Constant.EMPLOYER_PREMIUM && (
                                    <span>{`(${premium_start_at.format("DD/MM/YYYY")} - ${premium_end_at})`}</span>
                                )}
                            </div>
                            {parseInt(object.premium_status) === Constant.EMPLOYER_PREMIUM && parseInt(object.total_remaining_buy_point) <= 0 && (
                                <div>
                                    <span>Còn lại {premium_end_at.diff(premium_start_at,"days")} ngày</span>
                                </div>
                            )}
                            {parseInt(object.total_remaining_buy_point) > 0 && (
                                <div>
                                    <span>Còn lại {utils.formatNumber(object.total_remaining_buy_point, 0, ".", "điểm")}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái tài khoản</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{employer_status[utils.parseStatus(status, last_revision_status)]}</span>
                            {parseInt(object.suspect_status) === Constant.STATUS_ACTIVED && (
                                <PopOver renderTitle={<i className='fa fa-ban' style={{color: "orange", fontSize: "15px",marginLeft: "5px"}}/> }>
                                    {this.state.reason_suspect.map(reason => {
                                        return(
                                            <div key={reason}>- {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_suspect_reason, reason)}</div>
                                        )
                                    })}
                                    {this.state.reason_blacklist_keyword_suspect.length > 0 && (
                                        <>
                                            <p><b>NTD có từ khóa nghi ngờ</b></p>
                                            {this.state.reason_blacklist_keyword_suspect.map(reason => {
                                                return(
                                                    <div key={reason.id}>- {reason.title}</div>
                                                )
                                            })}
                                        </>
                                    )}
                                </PopOver>
                            )}

                            {[Constant.STATUS_LOCKED].includes(status) && (
                                <PopOver renderTitle={<i className='fa fa-lock' style={{color: "red", fontSize: "15px",marginLeft: "5px"}}/> }>
                                    {this.state.reason_lock.map(reason => {
                                        return(
                                                <div key={reason}>- {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_locked_reason, reason)}</div>
                                        )
                                    })}

                                    {this.state.reason_blacklist_keyword_lock.length > 0 && (
                                        <>
                                            <p><b>NTD có từ khóa cấm</b></p>
                                            {this.state.reason_blacklist_keyword_lock.map(reason => {
                                                return(
                                                    <div key={reason.id}>- {reason.title}</div>
                                                )
                                            })}
                                        </>
                                    )}
                                </PopOver>
                            )}

                        </div>
                    </div>
                    {last_revision_status === Constant.STATUS_DISABLED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do từ chối</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {Array.isArray(object_revision.rejected_reason) && object_revision.rejected_reason.map(reason => {
                                    return(
                                        <div key={reason}>- {employer_rejected_reason[reason] ? employer_rejected_reason[reason] : reason}</div>
                                    )
                                })}
                                {object_revision.rejected_reason_note && (<div>- {object_revision.rejected_reason_note}</div>)}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{email_verified_status[object.email_verified_status]}</span>
                            {parseInt(object.email_verified_status) === Constant.MAIL_NOT_VERIFIED
                            && ![Constant.STATUS_LOCKED].includes(parseInt(object.status))
                            && (
                                <span className="text-underline text-primary pointer ml10" onClick={this.btnReSendVerifyEmail}>Gửi email xác thực</span>
                            )}
                            &nbsp;
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">GPKD</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {object.business_license_info.business_license_file ? (
                                <span>{license_status[object.business_license_info.business_license_status] ? license_status[object.business_license_info.business_license_status] : object.business_license_info.business_license_status}</span>
                            ) : (
                                <span>Chưa có</span>
                            )}
                            {rival_type_warning.includes(parseInt(object.rival_type)) && (
                                <i className='fa fa-warning' style={{color: "red", fontSize: "15px",marginLeft: "5px"}} title={rival_type[object.rival_type]}/>
                            )}
                            <span className="text-underline text-primary pointer ml10" onClick={this.btnBusinessLicense}>Xem chi tiết</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày vào giỏ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{assigning_changed_at}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Quy mô nhân sự</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <div>
                                <span>{employer_size[object.company_size]} </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Nguồn tạo</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{object.created_source}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Danh sách TTD</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span className="text-underline text-primary">
                                {this.props.is_archived && (
                                  <a target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_ARCHIVED_JOB + "?employer_id=" + object.id}>Xem chi tiết</a>
                                )}
                                {!this.props.is_archived && (
                                  <a target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_JOB + "?employer_id=" + object.id}>Xem chi tiết</a>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Danh sách PĐK</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span className="text-underline"><a target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_SALES_ORDER + "?employer_id=" + object.id}>Xem chi tiết</a></span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin thêm</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span className="text-underline text-primary pointer" onClick={this.btnHistory}>Xem chi tiết</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Lịch sử xem hồ sơ</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span className="text-underline text-primary pointer" onClick={this.btnHistoryViewResume}>Xem chi tiết</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Lịch sử báo xấu</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span className="text-underline text-primary pointer" onClick={this.btnHistoryReportSeeker}>Xem chi tiết</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Nhãn</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.company_kind_label}</span>
                        </div>
                    </div>
                    <EmployerKind {...object} />
                    <EmployerFolder {...object} />
                    <EmployerNote {...object} />
                </div>
                <div className="col-sm-3 col-xs-3">
                    <div className="logo-c">
                        {object.logo && (
                            <img src={object.logo_url} alt="logo" />
                        )}
                        {!object.logo && (
                            <img src="/assets/img/no_image.dc8b35d.png" alt="no logo" />
                        )}
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt15">
                    {keyPress.includes("1")&& (
                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnEdit}>
                            <span>Chỉnh sửa</span>
                        </button>
                    )}
                    {keyPress.includes("2") && (
                        <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnApprove}>
                            <span>Duyệt</span>
                        </button>
                    )}
                    {keyPress.includes("3") && (
                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnReject}>
                            <span>Không duyệt</span>
                        </button>
                    )}
                    {keyPress.includes("4") && parseInt(object.premium_status) !== Constant.EMPLOYER_PREMIUM && (
                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnDelete}>
                            <span>Xóa</span>
                        </button>
                    )}
                    {status === Constant.STATUS_DELETED && (
                      <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnRestore}>
                          <span>Khôi phục</span>
                      </button>
                    )}
                    {keyPress.includes("5") && (
                        <button type="button" className="el-button el-button-default el-button-small" onClick={this.btnChangeBasket}>
                            <span>Chuyển Giỏ</span>
                        </button>
                    )}
                </div>
                {last_revision_status && (
                    <div className="col-sm-12 col-xs-12 mt10">
                        {parseInt(object.email_verified_status) === Constant.MAIL_NOT_VERIFIED && ![Constant.STATUS_LOCKED].includes(status) && this.props.user.isRole([Constant.DIVISION_TYPE_admin, Constant.DIVISION_TYPE_root, Constant.DIVISION_TYPE_quality_control_employer]) && (
                            <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnVerifyEmail}>
                                <span>Xác thực email</span>
                            </button>
                        )}
                        {parseInt(object.premium_status) !== Constant.EMPLOYER_PREMIUM && ![Constant.STATUS_LOCKED].includes(status) && (
                            <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnLockEmployer}>
                                <span>Khóa tài khoản</span>
                            </button>
                        )}
                        {status === Constant.STATUS_LOCKED && (
                            <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnUnLockEmployer}>
                                <span>Bỏ khóa</span>
                            </button>
                        )}
                        {parseInt(object.suspect_status) === Constant.STATUS_INACTIVED && ![Constant.STATUS_LOCKED].includes(status) && (
                            <button type="button" className="el-button el-button-warning el-button-small" onClick={this.btnSuspectEmployer}>
                                <span>Đánh dấu nghi ngờ</span>
                            </button>
                        )}
                        {parseInt(object.suspect_status) === Constant.STATUS_ACTIVED && ![Constant.STATUS_LOCKED].includes(status) && (
                            <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnUnSuspectEmployer}>
                                <span>Bỏ nghi nghờ</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
