import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import EvaluateToMarkGroup from "./EvaluateToMarkGroup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as apiFn from 'api';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            scoring_list: {},
            total_score: 0,
            total_qa_score: 0,
            total_self_score: 0,
            show_detail: true,
            groupActive: {},
            info: props.info
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.activeGroup = this._activeGroup.bind(this);
    }
    _activeGroup(name) {
        let groupActive = Object.assign({}, this.state.groupActive);
        groupActive[name] = !groupActive[name];
        this.setState({groupActive: groupActive});
    }
    _showDetail() {
        this.setState({show_detail: !this.state.show_detail});
    }
    _refreshList(delay = 0) {
        let params = queryString.parse(window.location.search);
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_SCORED_DETAIL, params, delay);
        });
    }
    componentWillMount() {
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({scoring_list: response.data.list_score});
                this.setState({total_score: response.data.total_score});
                this.setState({total_qa_score: response.data.total_qa_score});
                this.setState({total_self_score: response.data.total_self_score});
            }
            if (response.code === Constant.CODE_ACCESS_DENY){
                this.props.history.push(Constant.BASE_URL);
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_SCORED_DETAIL);
        }
        if (newProps.refresh['EvaluateToMark']){
            let delay = newProps.refresh['EvaluateToMark'].delay ? newProps.refresh['EvaluateToMark'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('EvaluateToMark');
        }
        this.setState({info: newProps.info})
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        const {scoring_list, total_score, total_self_score, total_qa_score, info} = this.state;
        return (
            <div>
                <div className="sub-title-form crm-section display-inline">
                    <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Chấm điểm <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight: "15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div className="relative">
                        {this.state.loading && (
                            <div className="dialog-wrapper-loading2">
                                <LoadingSmall />
                            </div>
                        )}
                        <div className="body-table el-table">
                            <div className="mark_detail crm-section">
                                <table className=" w100">
                                    <thead className="table-header">
                                    <tr className="tr-center text-bold bgColorHeadLV2">
                                        <th style={{width: "400px"}}><div className="cell">Chỉ Tiêu</div></th>
                                        <th style={{width: "120px"}}><div className="cell">Điểm Chuẩn</div></th>
                                        <th style={{width: "120px"}}><div className="cell">Điểm CSKH Chấm</div></th>
                                        <th style={{width: "150px"}}><div className="cell">CSKH Ghi Chú</div></th>
                                        <th style={{width: "120px"}}><div className="cell">Điểm QA Chấm</div></th>
                                        <th style={{width: "150px"}}><div className="cell">QA Ghi Chú</div></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.keys(scoring_list).map((name) => {
                                        return (
                                            <React.Fragment key={name}>
                                                <tr className="text-bold pointer el-table-row" onClick={this.activeGroup.bind(this, name)}>
                                                    <td colSpan={6}>
                                                        <div className="cell"><span>{"+"} {name}</span></div>
                                                    </td>
                                                </tr>
                                                {this.state.groupActive[name] && (
                                                    <EvaluateToMarkGroup list={scoring_list[name]} info={info}/>
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                    <tr className="text-bold">
                                        <td/>
                                        <td>
                                            <div className="cell text-right textRed">
                                                <span>{total_score.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell text-right textRed">
                                                <span>{total_self_score.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td/>
                                        <td>
                                            <div className="cell text-right textRed">
                                                <span>{total_qa_score.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        <td/>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
