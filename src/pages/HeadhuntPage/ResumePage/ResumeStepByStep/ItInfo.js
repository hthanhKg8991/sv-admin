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

class ItInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ItInfo");
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
            ConstantURL.API_URL_GET_RESUME_IT,
            args,
            delay);
    }

    componentWillMount() {
        this.asyncData()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_IT]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_IT];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_IT);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let {loading, data_list, configForm} = this.state;
        let language_resume_rate = utils.convertObjectValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_resume_rate);

        const isSpecialAchieve = configForm.includes("special_achieve");

        return (
            <div className="col-sm-12 col-md-12 mt30">
                {loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <>
                        <p><b>Tin học văn phòng</b></p>
                        <div className="body-table el-table">
                            <TableComponent isOrderBy={false} allowDragScroll={false}>
                                <TableHeader tableType="TableHeader" width={150}>
                                    World
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Excel
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Powerpoint
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Outlook
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Khác
                                </TableHeader>
                                {isSpecialAchieve && (
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Thành tích nổi bật
                                    </TableHeader>
                                )}
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key) => {
                                        let object = item.object_revision;
                                        let data = {
                                            word_level: language_resume_rate[object.word_level] ? language_resume_rate[object.word_level] : object.word_level,
                                            excel_level: language_resume_rate[object.excel_level] ? language_resume_rate[object.excel_level] : object.excel_level,
                                            powerpoint_level: language_resume_rate[object.powerpoint_level] ? language_resume_rate[object.powerpoint_level] : object.powerpoint_level,
                                            outlook_level: language_resume_rate[object.outlook_level] ? language_resume_rate[object.outlook_level] : object.outlook_level,
                                            orther_skill: object.orther_skill,
                                            orther_skill_html: object.orther_skill_html,
                                            special_achieve: object.special_achieve,
                                        };
                                        const hide_row = object?.status === Constant.STATUS_DELETED;
                                        return (
                                            <tr key={key} className={classnames(
                                                "el-table-row",
                                                (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                <td>
                                                    <div className="cell"
                                                         title={data.word_level}>{data.word_level}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"
                                                         title={data.excel_level}>{data.excel_level}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"
                                                         title={data.powerpoint_level}>{data.powerpoint_level}</div>
                                                </td>
                                                <td>
                                                    <div className="cell"
                                                         title={data.outlook_level}>{data.outlook_level}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={data.orther_skill}>
                                                        <div
                                                            dangerouslySetInnerHTML={{__html: data.orther_skill_html}}/>
                                                    </div>
                                                </td>
                                                {isSpecialAchieve && (
                                                    <td>
                                                        <div className="cell"
                                                             title={data.special_achieve}>{data.special_achieve}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ItInfo);
