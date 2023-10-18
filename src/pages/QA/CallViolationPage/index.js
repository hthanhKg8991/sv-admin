import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import queryString from 'query-string';
import CallViolationTeam from "./CallViolationTeam";
import DragScroll from 'components/Common/Ui/DragScroll';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            call_total: {
                success_call_quantity:0,
                success_call_duration:"00:00:00",
                not_answered_call_quantity:0,
                total_contract:0,
                incoming_call_quantity:0,
                incoming_call_duration:"00:00:00"
            },
            itemActive: {}
        };
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _refreshList(delay = 0){
        this.setState({itemActive: {}});
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_GET_CALL_VIOLATION_LIST_TEAM, params, delay);
        this.props.uiAction.showLoading();
    }
    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_CALL_VIOLATION_LIST_TEAM]) {
            let response = newProps.api[ConstantURL.API_URL_GET_CALL_VIOLATION_LIST_TEAM];
            if (response.code === Constant.CODE_SUCCESS) {
                let call_total_item = {
                    late_user_feedback_to_QA:0,
                    outbound_duration:0,
                    outbound_quantity:0,
                    time_frame_count:0,
                };
                if (response.data.length) {
                    response.data.forEach((item) => {
                        call_total_item['late_user_feedback_to_QA'] = call_total_item['late_user_feedback_to_QA'] ? call_total_item['late_user_feedback_to_QA'] + parseInt(item.late_user_feedback_to_QA) : parseInt(item.late_user_feedback_to_QA);
                        call_total_item['outbound_duration'] = call_total_item['outbound_duration'] ? call_total_item['outbound_duration'] + parseInt(item.outbound_duration) : parseInt(item.outbound_duration);
                        call_total_item['outbound_quantity'] = call_total_item['outbound_quantity'] ? call_total_item['outbound_quantity'] + parseInt(item.outbound_quantity) : parseInt(item.outbound_quantity);
                        call_total_item['time_frame_count'] = call_total_item['time_frame_count'] ? call_total_item['time_frame_count'] + parseInt(item.time_frame_count) : parseInt(item.time_frame_count);
                    });
                }
                this.setState({call_total: call_total_item});
                this.setState({data_list: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_CALL_VIOLATION_LIST_TEAM);
        }
        if (newProps.refresh['CallViolationPage']){
            let delay = newProps.refresh['CallViolationPage'].delay ? newProps.refresh['CallViolationPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('CallViolationPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data_list, call_total, itemActive} = this.state;
        let data = {
            time_frame_count: utils.formatNumber(call_total.time_frame_count, 0, ".", ""),
            outbound_duration: utils.formatNumber(call_total.outbound_duration, 0, ".", ""),
            outbound_quantity: utils.formatNumber(call_total.outbound_quantity, 0, ".", ""),
            late_user_feedback_to_QA: utils.formatNumber(call_total.late_user_feedback_to_QA, 0, ".", ""),
        };
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="CallViolationPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Thống Kê Cuộc Gọi Vi Phạm</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="body-table el-table">
                                <DragScroll allowSelect={false}>
                                    <table className={classnames("table-default")}>
                                        <tbody>
                                        <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                            <td style={{width:"300px"}}>
                                                <div className="cell">CSKH</div>
                                            </td>
                                            <td style={{width:"130px"}}>
                                                <div className="cell-custom-big">Số lần bị nhắc danh sách đen</div>
                                            </td>
                                            <td style={{width:"130px"}}>
                                                <div className="cell-custom-big">Số lần gọi dưới 60 cuộc/ngày</div>
                                            </td>
                                            <td style={{width:"130px"}}>
                                                <div className="cell-custom-big">Số lần gọi dưới 1h45'/ngày</div>
                                            </td>
                                            <td style={{width:"120px"}}>
                                                <div className="cell-custom-big">Số lần chậm phản hồi chấm điểm QA</div>
                                            </td>
                                        </tr>
                                        <tr className="text-bold bgColorBisque ">
                                            <td className="text-center">
                                                <div className="cell"><span>Tổng</span></div>
                                            </td>
                                            <td>
                                                <div className="cell text-right" title={data.time_frame_count}>{data.time_frame_count}</div>
                                            </td>
                                            <td>
                                                <div className="cell text-right" title={data.outbound_duration}>{data.outbound_duration}</div>
                                            </td>
                                            <td>
                                                <div className="cell text-right" title={data.outbound_quantity}>{data.outbound_quantity}</div>
                                            </td>
                                            <td>
                                                <div className="cell text-right" title={data.late_user_feedback_to_QA}>{data.late_user_feedback_to_QA}</div>
                                            </td>
                                        </tr>
                                        {data_list.map((item,key)=> {
                                            return (
                                                <CallViolationTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem}/>
                                            )}
                                        )}
                                        </tbody>
                                    </table>
                                </DragScroll>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
