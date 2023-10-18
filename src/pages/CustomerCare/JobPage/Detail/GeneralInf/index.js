import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PopupJob from '../../Popup/PopupJob';
import PopupHistory from "../../Popup/PopupHistory";
import moment from 'moment-timezone';
import config from 'config';
import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import PopupDeleteJob from '../../Popup/PopupDeleteJob';
import IsSearchAllowed from './IsSearchAllowed';


moment.tz.setDefault("Asia/Ho_Chi_Minh");

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employer: {},
            object: {},
            object_revision: {},
            loading: true
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnHistory = this._btnHistory.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.getEmployer = this._getEmployer.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }

    _refreshList(delay = 0) {
        this.setState({ loading: true }, () => {
            this.props.apiAction.requestApi(apiFn.fnGet,
                config.apiEmployerDomain,
                ConstantURL.API_URL_GET_DETAIL_JOB,
                { id: this.props.id, list: true },
                delay);
        });
    }

    _getEmployer() {
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiEmployerDomain,
            ConstantURL.API_URL_GET_DETAIL_EMPLOYER,
            { id: this.props.employer_id });
    }

    _btnEdit() {
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let job_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_job_status);
        let title = "Chỉnh Sửa TTD: " + object.id + " - " + job_status[status];
        this.props.uiAction.createPopup(PopupJob, title, { object: object });

        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    _btnApprove() {
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let job_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_job_status);
        let title = "Duyệt TTD: " + object.id + " - " + job_status[status];
        this.props.uiAction.createPopup(PopupHistory, title, { object: object, approve: true });
    }

    _btnReject() {
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let job_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_job_status);
        let title = "Không Duyệt TTD: " + object.id + " - " + job_status[status];
        this.props.uiAction.createPopup(PopupHistory, title, { object: object, reject: true });
    }

    _btnDelete() {
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let job_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_job_status);
        let title = "Xóa TTD: " + object.id + " - " + job_status[status];
        this.props.uiAction.createPopup(PopupDeleteJob, title, { object: object });
    }

    _btnHistory() {
        let object = this.state.object;
        let status = utils.parseStatus(object.status, object.last_revision_status);
        let job_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_job_status);
        let title = "Lịch Sử Thay Đổi TTD: " + object.id + " - " + job_status[status];
        this.props.uiAction.createPopup(PopupHistory, title, { object: object });

        let query = queryString.parse(window.location.search);
        query.action_active = 'history';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    _showPopup() {
        let query = queryString.parse(window.location.search);
        if (query.action_active) {
            switch (query.action_active) {
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
        this.props.uiAction.deleteRefreshList('JobGeneralInf');
        this.refreshList();
        this.getEmployer();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB];
            if (response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    if (parseInt(response.data.last_revision_status) === Constant.STATUS_DISABLED) {
                        this.props.apiAction.requestApi(apiFn.fnGet,
                            config.apiEmployerDomain,
                            ConstantURL.API_URL_GET_DETAIL_JOB_REVISION,
                            { job_id: this.props.id, list: true });
                    }
                    this.setState({ object: response.data }, () => {
                        this.showPopup();
                    });
                    this.setState({ loading: false });
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_JOB);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB_REVISION]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB_REVISION];
            if (response.info?.args?.list) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({ object_revision: response.data });
                }
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_JOB_REVISION);
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ employer: response.data });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER);
        }
        if (newProps.api[ConstantURL.API_URL_POST_JOB_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('JobPage', { delay: Constant.DELAY_LOAD_LIST_2S });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_DELETE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="row content-box">
                    <div className="relative card-body text-center">
                        <LoadingSmall/>
                    </div>
                </div>
            )
        }
        let { object, object_revision, employer } = this.state;

        let job_field_list = this.props.sys.jobField.items;
        let province_list = this.props.sys.province.items;

        let field_main = object.field_ids_main ? job_field_list.filter(c => object.field_ids_main === c.id) : '';
        let field_sub = object.field_ids_sub ? job_field_list.filter(c => object.field_ids_sub.includes(
            parseInt(c.id))) : [];
        let province = object.province_ids ? province_list.filter(c => object.province_ids.includes(
            parseInt(c.id))) : [];

        let employer_premium_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_employer_premium_status);
        let employer_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_employer_status);
        let job_status = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_job_status);
        let job_rejected_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_job_rejected_reason);

        let status = parseInt(object.status);
        let last_revision_status = parseInt(object.last_revision_status);

        let keyPress = [];
        if (last_revision_status) {
            if (![Constant.STATUS_DELETED].includes(status)) {
                keyPress.push("1");
                keyPress.push("4");
                if ([Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(
                    last_revision_status)) {
                    keyPress.push("2");
                }
                if ([Constant.STATUS_INACTIVED].includes(last_revision_status)) {
                    keyPress.push("3");
                }
            }
        }
        return (
            <div className="row">
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin
                        chung
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Mã</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.id}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Tiêu đề</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.title}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Trạng thái</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{job_status[utils.parseStatus(status,
                                last_revision_status)]}</span>
                        </div>
                    </div>
                    {last_revision_status === Constant.STATUS_DISABLED && (
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Lý do</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {Array.isArray(object_revision.rejected_reason) && object_revision.rejected_reason.map(
                                    reason => {
                                        return (
                                            <div
                                                key={reason}>- {job_rejected_reason[reason] ? job_rejected_reason[reason] : reason}</div>
                                        )
                                    })}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Ngành chính</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            {field_main.map((item, key) => {
                                return (
                                    <span
                                        key={key}>{key === 0 ? item.name : ', ' + item.name}</span>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Ngành phụ</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            {field_sub.map((item, key) => {
                                return (
                                    <span
                                        key={key}>{key === 0 ? item.name : ', ' + item.name}</span>
                                )
                            })}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Tỉnh thành làm việc</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            {province.map((item, key) => {
                                return (
                                    <span
                                        key={key}>{key === 0 ? item.name : ', ' + item.name}</span>
                                )
                            })}
                        </div>
                    </div>

                    <IsSearchAllowed {...object} />

                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Lượt xem</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{utils.formatNumber(object.total_views, 0, ".", "")}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Ngày tạo</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{moment.unix(object.created_at)
                            .format("DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Nguồn tạo</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{object.created_source}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Lịch sử thay đổi</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span className="text-underline text-primary pointer"
                                  onClick={this.btnHistory}>Xem chi tiết</span>
                        </div>
                    </div>
                </div>
                <div className="col-sm-4 col-xs-4">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Nhà tuyển
                        dụng
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Tên NDT</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{employer.name}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Email đăng nhập</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{employer.email}</span>
                        </div>
                    </div>
                    {/*<div className="col-sm-12 col-xs-12 row-content padding0">*/}
                    {/*<div className="col-sm-5 col-xs-5 padding0">Điện thoại liên hệ</div>*/}
                    {/*<div className="col-sm-7 col-xs-7 text-bold">*/}
                    {/*<span>{employer.contact_phone}</span>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Loại tài khoản</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span className="mr5">{employer_premium_status[employer.premium_status]} </span>
                            {parseInt(employer.premium_status) === Constant.EMPLOYER_PREMIUM ?
                                <span>{`${moment.unix(employer.premium_renewed_at).format(
                                    "DD/MM/YYYY")} - ${moment.unix(employer.premium_end_at).format(
                                    "DD/MM/YYYY")}`}
                                </span>
                            : <></>}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Trạng thái tài khoản</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{employer_status[utils.parseStatus(employer.status,
                                employer.last_revision_status)]}</span>
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-5 col-xs-5 padding0">Ngày đăng ký</div>
                        <div className="col-sm-7 col-xs-7 text-bold">
                            <span>{moment.unix(employer.created_at)
                            .format("DD/MM/YYYY HH:mm:ss")}</span>
                        </div>
                    </div>
                    {employer.last_logged_in_at && (
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
                    {keyPress.includes("1") && (
                        <button type="button"
                                className="el-button el-button-primary el-button-small"
                                onClick={this.btnEdit}>
                            <span>Chỉnh sửa</span>
                        </button>
                    )}
                    {keyPress.includes("2") && (
                        <button type="button"
                                className="el-button el-button-success el-button-small"
                                onClick={this.btnApprove}>
                            <span>Duyệt</span>
                        </button>
                    )}
                    {keyPress.includes("3") && (
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.btnReject}>
                            <span>Không duyệt</span>
                        </button>
                    )}
                    {keyPress.includes("4") && (
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.btnDelete}>
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
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
