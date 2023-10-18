import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
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
            origin_list: [],
            revision_list: [],
            configForm: configForm,
        };
        this.asyncData = this._asyncData.bind(this);
    }

    _asyncData(delay = 0) {
        this.setState({loading: true});
        let args = {
            resume_id: this.props.resume_id
        };
        this.props.apiAction.requestApi(apiFn.fnGet,
            config.apiSeekerDomain,
            ConstantURL.API_URL_GET_RESUME_LANGUAGE,
            args,
            delay);
    }

    componentWillMount() {
        this.asyncData()
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
                        data_list.push({object: object, object_revision: item});
                    });
                }
                this.setState({data_list: data_list});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_LANGUAGE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let {loading, data_list, configForm} = this.state;
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
            <div className="col-sm-12 col-md-12 mt30">
                {loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <>
                        <p><b>Ngôn ngữ</b></p>
                        <div className="body-table el-table">
                            <TableComponent isOrderBy={false} allowDragScroll={false}>
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
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                        </div>
                    </>
                )}
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
