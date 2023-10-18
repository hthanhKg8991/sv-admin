import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import SeekerSupport from './SeekerSupport';
import PopupHistory from '../Popup/PopupHistory/index';
import PopupSeeker from '../Popup/PopupSeeker';
import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class GeneralInf  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_revision: {},
            resume:{},
            loading: true
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnHistory = this._btnHistory.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnVerifyEmail = this._btnVerifyEmail.bind(this);
        this.btnVerifySms = this._btnVerifySms.bind(this);
        this.btnSendVerifyEmail = this._btnSendVerifyEmail.bind(this);
        this.btnSendVerifySms = this._btnSendVerifySms.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }
    _refreshList(){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER, {seeker_id: this.props.id, list: true});
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_LIST, {seeker_id: this.props.id});
        });
    }
    _btnHistory(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Lịch Sử Thay Đổi NTV: " + object.id + " - " + seeker_status[status];
        this.props.uiAction.createPopup(PopupHistory, title, {object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'history';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnEdit(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Chỉnh Sửa NTV: " + object.id + " - " + seeker_status[status];
        this.props.uiAction.createPopup(PopupSeeker, title,{object: object});

        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnApprove(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Duyệt NTV: " + object.id + " - " + seeker_status[status];

        this.props.uiAction.createPopup(PopupHistory, title,{object: object, approve: true});
    }
    _btnReject(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Không Duyệt NTV: " + object.id + " - " + seeker_status[status];

        this.props.uiAction.createPopup(PopupHistory, title,{object: object, reject: true});
    }
    _btnDelete(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Bạn có chắc muốn xóa NTV: " + object.id + " - " + seeker_status[status];

        this.props.uiAction.SmartMessageBox({
            title: title,
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_DELETE, {seeker_id: this.props.id});
                this.props.uiAction.showLoading();
            }
        });
    }
    _btnVerifyEmail(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Bạn có chắc muốn xác thực email NTV: " + object.id + " - " + seeker_status[status];

        this.props.uiAction.SmartMessageBox({
            title: title,
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_VERIFIED_EMAIL, {id: this.props.id});
                this.props.uiAction.showLoading();
            }
        });
    }
    _btnVerifySms(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Bạn có chắc muốn xác thực sms NTV: " + object.id + " - " + seeker_status[status];

        this.props.uiAction.SmartMessageBox({
            title: title,
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_VERIFIED_SMS, {id: this.props.id});
                this.props.uiAction.showLoading();
            }
        });
    }
    _btnSendVerifyEmail(){
        this.props.uiAction.SmartMessageBox({
            title: "Chức năng đang trong quá trình hoàn thiện",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.hideSmartMessageBox();
            }
        });
    }
    _btnSendVerifySms(){
        this.props.uiAction.SmartMessageBox({
            title: "Chức năng đang trong quá trình hoàn thiện",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.hideSmartMessageBox();
            }
        });
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
                default:
                    break;
            }
        }
    }
    componentWillMount() {
        this.props.uiAction.deleteRefreshList('SeekerGeneralInf');
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER];
            if(response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    if (parseInt(response.data.last_revision_status) === Constant.STATUS_DISABLED) {
                        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION, {seeker_id: this.props.id, list: true});
                    }
                    this.setState({object: response.data},()=>{
                        this.showPopup();
                    });
                    this.setState({loading: false});
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_SEEKER);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION];
            if(response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({object_revision: response.data});
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_LIST]){
            let response_resume = newProps.api[ConstantURL.API_URL_GET_RESUME_LIST];
            if (response_resume.code === Constant.CODE_SUCCESS) {
                let resume = {};
                response_resume.data.items.forEach(item => {
                    resume[item.resume_type] = item;
                });
                this.setState({resume: resume});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('SeekerPage', {delay: Constant.DELAY_LOAD_LIST_2S});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_DELETE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_VERIFIED_EMAIL]){
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_VERIFIED_EMAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");

                let object = Object.assign({},this.state.object);
                object.token_email = 'verified';
                this.setState({object:object})
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_VERIFIED_EMAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_VERIFIED_SMS]){
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_VERIFIED_SMS];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");

                let object = Object.assign({},this.state.object);
                object.token_sms = 'verified';
                this.setState({object:object})
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_VERIFIED_SMS);
        }
        if (newProps.refresh['SeekerGeneralInf']){
            this.refreshList();
            this.props.uiAction.deleteRefreshList('SeekerGeneralInf');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        if (this.state.loading){
            return(
                <div className="row content-box">
                    <div className="relative card-body text-center">
                        <LoadingSmall />
                    </div>
                </div>
            )
        }

        let {object, object_revision, resume} = this.state;

        let created_source = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_created_source);
        let seeker_rejected_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_rejected_reason);

        let status = parseInt(object.status);
        let last_revision_status = parseInt(object.last_revision_status);

        let keyPress = [];
        if (last_revision_status) {
            if (![Constant.STATUS_DELETED].includes(status)) {
                keyPress.push("1");
                keyPress.push("4");
                if ([Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(last_revision_status)) {
                    keyPress.push("2");
                }
                if ([Constant.STATUS_INACTIVED].includes(last_revision_status)) {
                    keyPress.push("3");
                }
            }
        }
        return (
            <div className="row content-box">
                <div className="col-sm-5 col-xs-5">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Tài Khoản</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.id}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.email}</div>
                    </div>
                    {last_revision_status === Constant.STATUS_DISABLED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {Array.isArray(object_revision.rejected_reason) && object_revision.rejected_reason.map(reason => {
                                    return(
                                        <div key={reason}>- {seeker_rejected_reason[reason] ? seeker_rejected_reason[reason] : reason}</div>
                                    )
                                })}
                                {object_revision.rejected_reason_note && (<div>- {object_revision.rejected_reason_note}</div>)}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{object.token_email === 'verified' ? "Đã xác thực" : "Chưa xác thực"}</span>
                            {object.token_email !== 'verified' && ![Constant.STATUS_DELETED].includes(status) &&(
                                <span className="text-underline text-primary pointer ml10" onClick={()=>{this.btnSendVerifyEmail()}}>Gửi email xác thực</span>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trạng thái ĐT</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{object.token_sms === 'verified' ? "Đã xác thực" : "Chưa xác thực"}</span>
                            {object.token_sms !== 'verified' && ![Constant.STATUS_DELETED].includes(status) &&(
                                <span className="text-underline text-primary pointer ml10" onClick={()=>{this.btnSendVerifySms()}}>Gửi sms xác thực</span>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span className="text-underline text-primary pointer" onClick={this.btnHistory}>Xem chi tiết</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin thêm</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Nguồn tạo</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{created_source[object.created_source]}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Người duyệt</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object_revision.approved_by}</span>
                        </div>
                    </div>
                    {object.id && (
                        <SeekerSupport object={object}/>
                    )}
                </div>
                <div className="col-sm-3 col-xs-3">
                    <div className="logo-c">
                        {object.avatar && (
                            <img src={utils.urlFile(object.avatar, config.urlCdnFile)} alt="logo" />
                        )}
                        {!object.avatar && (
                            <img src="/assets/img/no_image.dc8b35d.png" alt="no logo" />
                        )}
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt10">
                    {keyPress.includes("1") && (
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
                    {keyPress.includes("4") && (
                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnDelete}>
                            <span>Xóa</span>
                        </button>
                    )}
                </div>
                <div className="col-sm-12 col-xs-12">
                    {object.token_email !== 'verified' && ![Constant.STATUS_DELETED].includes(status) && (
                        <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnVerifyEmail}>
                            <span>Xác thực email</span>
                        </button>
                    )}
                    {object.token_sms !== 'verified' && ![Constant.STATUS_DELETED].includes(status) && (
                        <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnVerifySms}>
                            <span>Xác thực ĐT</span>
                        </button>
                    )}
                </div>
                <div className="col-sm-12 col-xs-12">
                    {![Constant.STATUS_DELETED].includes(status) && (
                        <>
                            {resume[Constant.RESUME_NORMAL] ? (
                                <a className="el-button el-button-primary el-button-small" target="_blank" rel="noopener noreferrer"
                                   href={`${Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP}?seeker_id=${object.id}&id=${resume[Constant.RESUME_NORMAL].id}`}>
                                    <span>Chỉnh sửa hồ sơ từng bước</span>
                                </a>
                            ) : (
                                <a className="el-button el-button-primary el-button-small" target="_blank" rel="noopener noreferrer"
                                   href={`${Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP}?seeker_id=${object.id}`}>
                                    <span>Thêm hồ sơ từng bước</span>
                                </a>
                            )}
                            {resume[Constant.RESUME_NORMAL_FILE] ? (
                                <a className="el-button el-button-primary el-button-small" target="_blank" rel="noopener noreferrer"
                                   href={`${Constant.BASE_URL_SEEKER_RESUME_ATTACH}?seeker_id=${object.id}&id=${resume[Constant.RESUME_NORMAL_FILE].id}`}>
                                    <span>Chỉnh sửa hồ sơ đính kèm</span>
                                </a>
                            ) : (
                                <a className="el-button el-button-primary el-button-small" target="_blank" rel="noopener noreferrer"
                                   href={`${Constant.BASE_URL_SEEKER_RESUME_ATTACH}?seeker_id=${object.id}`}>
                                    <span>Thêm hồ sơ đính kèm</span>
                                </a>
                            )}
                        </>
                    )}
                    <a className="el-button el-button-primary el-button-small" target="_blank" rel="noopener noreferrer"
                       href={`${Constant.BASE_URL_SEEKER_RESUME}?seeker_id=${object.id}`}>
                        <span>Danh sách hồ sơ</span>
                    </a>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
        sys: state.sys,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(GeneralInf);
