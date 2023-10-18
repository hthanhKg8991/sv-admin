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

class SkillInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.SkillInfo");
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_SKILL, args, delay);
    }

    componentWillMount() {
        this.asyncData()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_SKILL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_SKILL];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_SKILL);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        const {loading, data_list, configForm} = this.state;
        const type_skill_forte = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_skill_forte);
        const isInteresting = configForm.includes("interesting");

        return (
            <div className="col-sm-12 col-md-12 mt30">
                {loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <>
                        <p><b>Kỹ năng sở trường</b></p>
                        <div className="body-table el-table">
                            <TableComponent isOrderBy={false} allowDragScroll={false}>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Kỹ năng chính
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Kỹ năng khác
                                </TableHeader>
                                {isInteresting && (
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Sở thich
                                    </TableHeader>
                                )}
                                <TableBody tableType="TableBody">
                                    {data_list.map((item, key) => {
                                        let object = item.object_revision;
                                        let data = {
                                            special_skill: object?.special_skill_html,
                                            interesting: object?.interesting_html,
                                        };
                                        const hide_row = object?.status === Constant.STATUS_DELETED;
                                        return (
                                            <tr key={key}
                                                className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                <td>
                                                    <div className="cell" title={data.special_skill}>
                                                        <div
                                                            dangerouslySetInnerHTML={{__html: data.special_skill}}/>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell-custom">
                                                        {Array.isArray(object.skills) && object.skills.map((i, k) => {
                                                            return (
                                                                <div
                                                                    key={k}>- {type_skill_forte[i] ? type_skill_forte[i] : i}</div>
                                                            )
                                                        })}
                                                    </div>
                                                </td>
                                                {isInteresting && (
                                                    <td>
                                                        <div className="cell" title={data.interesting}>
                                                            <div
                                                                dangerouslySetInnerHTML={{__html: data.interesting}}/>
                                                        </div>
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
        refresh: state.refresh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillInfo);
