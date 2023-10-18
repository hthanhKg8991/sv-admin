import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import InputTable from "components/Common/InputValue/InputTable";
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as apiFn from 'api';

class EvaluateToMarkGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: props.list ? props.list : {},
            groupActive: {},
            input_list: {},
        };
        this.activeGroup = this._activeGroup.bind(this);
        this.onDBClick = this._onDBClick.bind(this);
        this.onChangeScore = this._onChangeScore.bind(this);
        this.onQaChangeScore = this._onQaChangeScore.bind(this);
    }
    _activeGroup(key) {
        let groupActive = Object.assign({}, this.state.groupActive);
        groupActive[key] = !groupActive[key];
        this.setState({groupActive: groupActive});
    }
    _onDBClick(id, key) {
        let input_list = Object.assign({}, this.state.input_list);
        input_list[id + key] = true;
        this.setState({input_list: input_list});
    }
    _onChangeScore(item, id) {
        let {scoring_id, call_qa_evaluation_score_id, self_score, self_note, xlite_call_id} = item;
        let data = {scoring_id, call_qa_evaluation_score_id, self_score, self_note, xlite_call_id, req_id: id};
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_SCORED_CSKH_SAVE, data);
    }
    _onQaChangeScore(item, id) {
        let {scoring_id, call_qa_evaluation_score_id, qa_score, qa_note, xlite_call_id} = item;
        let data = {scoring_id, call_qa_evaluation_score_id, qa_score, qa_note, xlite_call_id, req_id: id};
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_SCORED_QA_SAVE, data);
    }
    componentWillMount() {

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED_CSKH_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED_CSKH_SAVE];
            let input_list = Object.assign({}, this.state.input_list);
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                input_list[response.info?.args?.scoring_id + 'self_score'] = false;
                input_list[response.info?.args?.scoring_id + 'self_note'] = false;
                input_list[response.info?.args?.scoring_id + 'self_score_error'] = false;
                input_list[response.info?.args?.scoring_id + 'self_note_error'] = false;
                this.props.uiAction.refreshList('EvaluateToMark');
            }else{
                if (response.data) {
                    Object.keys(response.data).forEach((name) => {
                        input_list[response.info?.args?.scoring_id + name +'_error'] = true;
                    });
                }
            }
            this.setState({input_list: input_list});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_SCORED_CSKH_SAVE);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED_QA_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED_QA_SAVE];
            let input_list = Object.assign({}, this.state.input_list);
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                input_list[response.info?.args?.scoring_id + 'qa_score'] = false;
                input_list[response.info?.args?.scoring_id + 'qa_note'] = false;
                input_list[response.info?.args?.scoring_id + 'qa_score_error'] = false;
                input_list[response.info?.args?.scoring_id + 'qa_note_error'] = false;
                this.props.uiAction.refreshList('EvaluateToMark');
            }else{
                if (response.data) {
                    Object.keys(response.data).forEach((name) => {
                        input_list[response.info?.args?.scoring_id + name +'_error'] = true;
                    });
                }
            }
            this.setState({input_list: input_list});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_SCORED_QA_SAVE);
        }
        if (newProps.refresh['EvaluateToMarkGroup']){
            this.setState({input_list: {}});
            this.props.uiAction.deleteRefreshList('EvaluateToMarkGroup');
        }
        this.setState({data_list: newProps.list});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        let {data_list, input_list} = this.state;
        let is_qa = ['call_quality_assurance', 'admin'].includes(this.props.user.division_code);
        let is_staff = String(this.props.user.id) === String(this.props.info.staff_id);
        return (
            <React.Fragment>
            {Object.keys(data_list).map((name) => {
                return (
                    <React.Fragment key={name}>
                        <tr className="text-bold pointer el-table-row" onClick={this.activeGroup.bind(this, name)}>
                            <td colSpan={6}>
                                <div className="cell paddingLeft30">
                                    <span>{"- "} {name}</span>
                                </div>
                            </td>
                        </tr>
                        {this.state.groupActive[name] && Object.keys(data_list[name]).map((name2) => {
                            let item = data_list[name][name2];
                            let scoring_id = item.result.scoring_id;
                            let self_score_value = input_list[scoring_id + "self_score_value"] ? input_list[scoring_id + "self_score_value"] : item.result.self_score;
                            let self_note_value = input_list[scoring_id + "self_note_value"] ? input_list[scoring_id + "self_note_value"] : item.result.self_note;
                            let qa_score_value = input_list[scoring_id + "qa_score_value"] ? input_list[scoring_id + "qa_score_value"] : item.result.qa_score;
                            let qa_note_value = input_list[scoring_id + "qa_note_value"] ? input_list[scoring_id + "qa_note_value"] : item.result.qa_note;
                            return(
                                <tr key={name2}>
                                    <td>
                                        <div className="cell paddingLeft60">{item.content}</div>
                                    </td>
                                    <td>
                                        <div className="cell text-right">{item.target_score}</div>
                                    </td>
                                    <td className={is_staff ? 'td-input' : ''} onDoubleClick={()=>{this.onDBClick(scoring_id, 'self_score')}}>
                                        <div className="cell text-right" title={item.result.self_score}>
                                            {!input_list[scoring_id + "self_score"] || !is_staff ? (
                                                <span>{self_score_value ? self_score_value : '0.00'}</span>
                                            ) : (
                                                <InputTable isNumber decimalScale={2} className="w100" error={input_list[scoring_id + "self_score_error"]} value={self_score_value ? self_score_value : '0.00'}
                                                            onChange={(value) => {
                                                                input_list[scoring_id + "self_score_value"] = value;
                                                                item.result.self_score = value;
                                                                this.setState({input_list: input_list});
                                                            }}
                                                            onEnter={() => {
                                                                this.onChangeScore(item.result);
                                                            }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className={is_staff ? 'td-input' : ''} onDoubleClick={()=>{this.onDBClick(scoring_id, 'self_note')}}>
                                        <div className="cell text-right" title={item.result.self_note}>
                                            {!input_list[scoring_id + "self_note"] || !is_staff ? (
                                                <span>{self_note_value}</span>
                                            ) : (
                                                <InputTable className="w100" error={input_list[scoring_id + "self_note_error"]} value={self_note_value}
                                                            onChange={(value) => {
                                                                input_list[scoring_id + "self_note_value"] = value;
                                                                item.result.self_note = value;
                                                                this.setState({input_list: input_list})
                                                            }}
                                                            onEnter={() => {
                                                                this.onChangeScore(item.result);
                                                            }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className={is_qa ? 'td-input' : ''} onDoubleClick={()=>{this.onDBClick(scoring_id, 'qa_score')}}>
                                        <div className="cell text-right" title={item.result.qa_score}>
                                            {!input_list[scoring_id + "qa_score"] || !is_qa ? (
                                                <span>{qa_score_value ? qa_score_value : '0.00'}</span>
                                            ) : (
                                                <InputTable isNumber decimalScale={2} className="w100" error={input_list[scoring_id + "qa_score_error"]} value={qa_score_value ? qa_score_value : '0.00'}
                                                            onChange={(value) => {
                                                                input_list[scoring_id + "qa_score_value"] = value;
                                                                item.result.qa_score = value;
                                                                this.setState({input_list: input_list})
                                                            }}
                                                            onEnter={() => {
                                                                this.onQaChangeScore(item.result);
                                                            }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className={is_qa ? 'td-input' : ''} onDoubleClick={()=>{this.onDBClick(scoring_id, 'qa_note')}}>
                                        <div className="cell text-right" title={item.result.qa_note}>
                                            {!input_list[scoring_id + "qa_note"] || !is_qa ? (
                                                <span>{qa_note_value}</span>
                                            ) : (
                                                <InputTable className="w100" error={input_list[scoring_id + "qa_note_error"]} value={qa_note_value}
                                                            onChange={(value) => {
                                                                input_list[scoring_id + "qa_note_value"] = value;
                                                                item.result.qa_note = value;
                                                                this.setState({input_list: input_list})
                                                            }}
                                                            onEnter={() => {
                                                                this.onQaChangeScore(item.result);
                                                            }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </React.Fragment>
                )
            })}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateToMarkGroup);
