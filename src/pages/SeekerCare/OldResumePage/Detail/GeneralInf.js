import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import config from 'config';
import PopupHistory from '../Popup/PopupHistory'
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import queryString from 'query-string';
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
            seeker:{},
            loading: true
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnHistory = this._btnHistory.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }
    _refreshList(){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_DETAIL, {id: this.props.id, seeker_id: this.props.seeker_id, list: true});
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER, {id: this.props.seeker_id});
        });
    }
    _btnHistory(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Lịch Sử Thay Đổi Hồ Sơ: " + object.id + " - " + seeker_status[status];
        this.props.uiAction.createPopup(PopupHistory, title, {object: object}, 'w90');

        let query = queryString.parse(window.location.search);
        query.action_active = 'history';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnApprove(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Duyệt Hồ Sơ: " + object.id + " - " + seeker_status[status];
        this.props.uiAction.createPopup(PopupHistory, title,{object: object, approve: true}, 'w90');
    }
    _btnReject(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Không Duyệt Hồ Sơ: " + object.id + " - " + seeker_status[status];
        this.props.uiAction.createPopup(PopupHistory, title,{object: object, reject: true}, 'w90');
    }
    _btnDelete(){
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        let title = "Bạn có chắc muốn xóa hồ sơ: " + object.id + " - " + seeker_status[status];
        this.props.uiAction.SmartMessageBox({
            title: title,
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_DELETE, {id: this.state.object.id});
            }
        });
    }
    _showPopup(){
        let query = queryString.parse(window.location.search);
        if(query.action_active){
            switch (query.action_active){
                case 'history':
                    this.btnHistory();
                    break;
                default:
                    break;
            }
        }
    }
    componentWillMount() {
        this.props.uiAction.deleteRefreshList('ResumeGeneralInf');
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_DETAIL];
            if(response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    if (parseInt(response.data.last_revision_status) === Constant.STATUS_DISABLED) {
                        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_DETAIL_REVISION, {resume_id: this.props.id, seeker_id: this.props.seeker_id, list: true});
                    }
                    this.setState({object: response.data},()=>{
                        this.showPopup();
                    });
                    this.setState({loading: false});
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_DETAIL);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_DETAIL_REVISION]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_DETAIL_REVISION];
            if(response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({object_revision: response.data});
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_DETAIL_REVISION);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER]){
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({seeker: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_SEEKER);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('ResumePage', {delay: Constant.DELAY_LOAD_LIST_2S});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_DELETE);
        }
        if (newProps.refresh['ResumeGeneralInf']){
            this.refreshList();
            this.props.uiAction.deleteRefreshList('ResumeGeneralInf');
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
        let {object, object_revision, seeker} = this.state;

        let province = this.props.sys.province.items;
        let jobField = this.props.sys.jobField.items;

        let resume_level_requirement = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_resume_level_requirement);
        let resume_working_method = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_resume_working_method);
        let resume_degree_requirement = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_resume_degree_requirement);
        let resume_experience_range = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_resume_experience_range);
        let marital_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_marital_status);
        let resume_rejected_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_rejected_reason);

        let text_job_field = '';
        let text_job_province = '';
        let text_seeker_province = '';

        if (object.field_ids) {
            jobField.filter((value) => ((object.field_ids).includes(value.id))).forEach((val, key) => {
                text_job_field += key === 0 ? val.name : ', ' + val.name;
            });
        }
        if (object.province_ids) {
            province.filter((value) => ((object.province_ids).includes(value.id))).forEach((val, key) => {
                text_job_province += key === 0 ? val.name : ', ' + val.name;
            });
        }
        if (seeker.province_id) {
            province.filter((value) =>  seeker.province_id === value.id).forEach((val, key) => {
                text_seeker_province += key === 0 ? val.name : ', ' + val.name;
            });
        }

        let status = parseInt(object.status);
        let last_revision_status = parseInt(object.last_revision_status);

        let keyPress = [];
        if(last_revision_status) {
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

        let url = parseInt(object.resume_type) === Constant.RESUME_NORMAL ? Constant.BASE_URL_SEEKER_RESUME_STEP_BY_STEP : Constant.BASE_URL_SEEKER_RESUME_ATTACH;
        url = `${url}?id=${object.id}&seeker_id=${object.seeker_id}`;
        return (
            <div className="row content-box">
                <div className="col-sm-6 col-xs-12">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Hồ sơ</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.id}</div>
                    </div>
                    {last_revision_status === Constant.STATUS_DISABLED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                {Array.isArray(object_revision.rejected_reason) && object_revision.rejected_reason.map(reason => {
                                    return(
                                        <div key={reason}>- {resume_rejected_reason[reason] ? resume_rejected_reason[reason] : reason}</div>
                                    )
                                })}
                                {object_revision.rejected_reason_note && (<div>- {object_revision.rejected_reason_note}</div>)}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tiêu đề hồ sơ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{object.title}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Cấp bậc mong muốn</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {resume_level_requirement[object.position] ? resume_level_requirement[object.position] : object.position}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Cấp bậc hiện tại</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {resume_level_requirement[object.current_position] ? resume_level_requirement[object.current_position] : object.current_position}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Hình thức làm việc</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {resume_working_method[object.work_time] ? resume_working_method[object.work_time] : object.work_time}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Trình độ học vấn cao nhất</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {resume_degree_requirement[object.level] ? resume_degree_requirement[object.level] : object.level}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mức lương tối thiểu</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {utils.formatNumber(object.min_expected_salary, 0, ".", "đ")}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngành nghề</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {text_job_field}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa điểm làm việc</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {text_job_province}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Số năm kinh nghiệm</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {resume_experience_range[object.experience] ? resume_experience_range[object.experience] : object.experience}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mục tiêu nghề nghiệp</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {object.career_objective}
                        </div>
                    </div>
                    {parseInt(object.resume_type) === Constant.RESUME_NORMAL_FILE && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-4 col-xs-4 padding0">Tải file</div>
                            <div className="col-sm-8 col-xs-8 text-bold">
                                <a target="_blank" rel="noopener noreferrer" href={utils.urlFile(object.cv_file, config.urlCdnFile)}>Tại đây</a>
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span className="text-underline text-primary pointer" onClick={this.btnHistory}>Xem chi tiết</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xs-12">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Người tìm việc</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Họ và tên</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker.name}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker.email}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Điện thoại</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker.mobile}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker.address}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tỉnh/TP</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{text_seeker_province}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Ngày sinh</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{seeker.birthday ? moment.unix(seeker.birthday).format("DD/MM/YYYY") : ""}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Hôn nhân</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            <span>{marital_status[seeker.marital_status]}</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 mt15">
                    {keyPress.includes("1") && (
                        <a className="el-button el-button-primary el-button-small" href={url} target="_blank" rel="noopener noreferrer">
                            <span>Chỉnh sửa</span>
                        </a>
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
