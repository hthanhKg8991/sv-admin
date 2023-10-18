import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import queryString from 'query-string';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupLanguage from "./Popup/PopupLanguage";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import _ from "lodash";

class LanguageInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.LanguageInfo");
        this.state = {
            data_list: [],
            show_detail: true,
            origin_list: [],
            revision_list: [],
            configForm: configForm,
        };
        this.refreshList = this._refreshList.bind(this);
        this.showHide = this._showHide.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
    }

    _showHide() {
        this.setState({ show_detail: !this.state.show_detail });
    }

    _refreshList(delay = 0) {
        this.setState({ loading: true });
        let params = queryString.parse(window.location.search);
        let args = {
            resume_id: params['id']
        };
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiSeekerDomain,
            ConstantURL.API_URL_GET_RESUME_LANGUAGE,
            args,
            delay);
    }

    _btnAdd() {
        this.props.uiAction.createPopup(PopupLanguage, "Thêm Ngoại Ngữ", {
            data_list: this.state.data_list
        });
    }

    _btnEdit(item, key) {
        this.props.uiAction.createPopup(PopupLanguage, "Chỉnh Ngoại Ngữ", {
            data_list: this.state.data_list,
            key_edit: key,
            object: item.object,
            object_revision: item.object_revision
        });
    }

    _btnDelete(delete_key) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa ngoại ngữ ?",
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                let data_arr = [];
                this.state.data_list.forEach((item, key) => {
                    if(key !== delete_key) {
                        data_arr.push(item.object_revision);
                    }else{
                        item.object_revision.status = Constant.STATUS_DELETED;
                        data_arr.push(item.object_revision);
                    }
                });
                let params = queryString.parse(window.location.search);
                let args = {
                    resume_id: params.id,
                    seeker_id: params.seeker_id,
                    data: data_arr
                };
                this.props.apiAction.requestApi(apiFn.fnPost,
                    config.apiSeekerDomain,
                    ConstantURL.API_URL_POST_RESUME_LANGUAGE_DELETE,
                    args);
            }
        });
    }

    componentWillMount() {
        this.refreshList()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_LANGUAGE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_LANGUAGE];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list = [];
                if (Array.isArray(response.data)) {
                    response.data.forEach((item) => {
                        let object = item.old_data ? item.old_data : {};
                        if (item.status) object.status = item.status;
                        delete item.old_data;
                        data_list.push({ object: object, object_revision: item });
                    });
                }
                this.setState({ data_list: data_list });
            }
            this.setState({ loading: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_LANGUAGE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_LANGUAGE_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_LANGUAGE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_LANGUAGE_DELETE);
        }
        if (newProps.refresh['LanguageInfo']) {
            let delay = newProps.refresh['LanguageInfo'].delay ? newProps.refresh['LanguageInfo'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('LanguageInfo');
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let { show_detail, loading, data_list, configForm } = this.state;
        let language_resume = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_resume);
        let language_resume_rate = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_resume_rate);
        const languageLevel = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_level);

        const isLevel = configForm.includes("level");
        const isListenLevel = configForm.includes("listen_level");
        const isSpeakLevel = configForm.includes("speak_level");
        const isReadingLevel = configForm.includes("reading_level");
        const isWritingLevel = configForm.includes("writing_level");

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Ngoại ngữ</span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        <div>
                            <div className="card-body">
                                <div className="top-table">
                                    {this.props.canEdit && (
                                        <div className="left">
                                            {parseInt(this.props.status) !== Constant.STATUS_DELETED && (
                                                <button type="button"
                                                        className="el-button el-button-primary el-button-small"
                                                        onClick={() => this.btnAdd({}, 0, 'add')}>
                                                    <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <div className="right">
                                        <button type="button" className="bt-refresh el-button"
                                                onClick={() => {
                                                    this.refreshList()
                                                }}>
                                            <i className="fa fa-refresh"/>
                                        </button>
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="text-center">
                                        <LoadingSmall/>
                                    </div>
                                ) : (
                                    <div className="body-table el-table">
                                        <TableComponent>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Ngoại ngữ
                                            </TableHeader>
                                            {isLevel && (
                                                <TableHeader tableType="TableHeader" width={150}>
                                                    Trình độ
                                                </TableHeader>
                                            )}
                                            {isListenLevel && (
                                                <TableHeader tableType="TableHeader" width={150}>
                                                    Nghe
                                                </TableHeader>
                                            )}
                                            {isListenLevel && (
                                                <TableHeader tableType="TableHeader" width={150}>
                                                    Nói
                                                </TableHeader>
                                            )}
                                            {isReadingLevel && (
                                                <TableHeader tableType="TableHeader" width={150}>
                                                    Đọc
                                                </TableHeader>
                                            )}
                                            {isWritingLevel && (
                                                <TableHeader tableType="TableHeader" width={150}>
                                                    Viết
                                                </TableHeader>
                                            )}
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                {data_list.map((item, key) => {
                                                    let object = item.object_revision;
                                                    const languageMain = language_resume[object?.language] || "";
                                                    const languageOther = Number(object?.language) === Constant.OTHER_LANGUAGE_VALUE && object?.other_language ? `(${object?.other_language})` : "";
                                                    let data = {
                                                        anguage: `${languageMain} ${languageOther}`,
                                                        level: languageLevel[object.level] ? languageLevel[object.level] : object.level,
                                                        listen_level: language_resume_rate[object.listen_level] ? language_resume_rate[object.listen_level] : object.listen_level,
                                                        speak_level: language_resume_rate[object.speak_level] ? language_resume_rate[object.speak_level] : object.speak_level,
                                                        reading_level: language_resume_rate[object.reading_level] ? language_resume_rate[object.reading_level] : object.reading_level,
                                                        writing_level: language_resume_rate[object.writing_level] ? language_resume_rate[object.writing_level] : object.writing_level,
                                                    };
                                                    const hide_row = object?.status === Constant.STATUS_DELETED;
                                                    return (
                                                        <tr key={key} className={classnames(
                                                            "el-table-row",
                                                            (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                            <td>
                                                                <div className="cell"
                                                                     title={`${languageMain} ${languageOther}`}>
                                                                    {`${languageMain} ${languageOther}`}
                                                                </div>
                                                            </td>
                                                            {isLevel && (
                                                                <td>
                                                                    <div className="cell"
                                                                         title={data.level}>{data.level}</div>
                                                                </td>
                                                            )}
                                                            {isListenLevel && (
                                                                <td>
                                                                    <div className="cell"
                                                                         title={data.listen_level}>{data.listen_level}</div>
                                                                </td>
                                                            )}
                                                            {isSpeakLevel && (
                                                                <td>
                                                                    <div className="cell"
                                                                         title={data.speak_level}>{data.speak_level}</div>
                                                                </td>
                                                            )}
                                                            {isReadingLevel && (
                                                                <td>
                                                                    <div className="cell"
                                                                         title={data.reading_level}>{data.reading_level}</div>
                                                                </td>
                                                            )}
                                                            {isWritingLevel && (
                                                                <td>
                                                                    <div className="cell"
                                                                         title={data.writing_level}>{data.writing_level}</div>
                                                                </td>
                                                            )}
                                                            {this.props.canEdit && (
                                                                <td>
                                                                {parseInt(object.status) !== Constant.STATUS_DELETED && (
                                                                    <div className="cell">
                                                                        <div
                                                                            className="text-underline pointer">
                                                                            <span
                                                                                className="text-bold text-primary"
                                                                                onClick={() => {
                                                                                    this.btnEdit(
                                                                                        item,
                                                                                        key)
                                                                                }}>Chỉnh sửa</span>
                                                                        </div>
                                                                        <div
                                                                            className="text-underline pointer">
                                                                            <span
                                                                                className="text-bold text-danger"
                                                                                onClick={() => {
                                                                                    this.btnDelete(
                                                                                        key)
                                                                                }}>Xóa</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            )}
                                                        </tr>
                                                    )
                                                })}
                                            </TableBody>
                                        </TableComponent>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageInfo);
