import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import queryString from 'query-string';
import moment from "moment";
import CallStatisticTeam from "./CallStatisticTeam";
import DragScroll from 'components/Common/Ui/DragScroll';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
import PopupGetCall from "pages/QA/CallStatisticPage/Popup/PopupGetCall";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class CallStatisticPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            data_total: {
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
        this.btnAdd = this._btnAdd.bind(this);

    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_STATISTIC_TEAM_LIST, params, delay);
        this.setState({itemActive: {}});
    }
    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupGetCall, "Get cuộc gọi", {refreshList: this.refreshList});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_STATISTIC_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_CALL_STATISTIC_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let call_total_item = {
                    success_call_quantity:0,
                    success_call_duration:"00:00:00",
                    not_answered_call_quantity:0,
                    total_contract:0,
                    incoming_call_quantity:0,
                    incoming_call_duration:"00:00:00"
                };
                if (response.data.length) {
                    response.data.forEach((item) => {
                        call_total_item['success_call_quantity'] = call_total_item['success_call_quantity'] ? call_total_item['success_call_quantity'] + parseInt(item.success_call_quantity) : parseInt(item.success_call_quantity);
                        call_total_item['not_answered_call_quantity'] = call_total_item['not_answered_call_quantity'] ? call_total_item['not_answered_call_quantity'] + parseInt(item.not_answered_call_quantity) : parseInt(item.not_answered_call_quantity);
                        call_total_item['total_contract'] = call_total_item['total_contract'] ? call_total_item['total_contract'] + parseInt(item.total_contract) : parseInt(item.total_contract);
                        call_total_item['incoming_call_quantity'] = call_total_item['incoming_call_quantity'] ? call_total_item['incoming_call_quantity'] + parseInt(item.incoming_call_quantity) : parseInt(item.incoming_call_quantity);
                        call_total_item['success_call_duration'] = call_total_item['success_call_duration'] ? moment.duration(item.success_call_duration).add(call_total_item['success_call_duration']) : moment.duration(item.success_call_duration);
                        call_total_item['incoming_call_duration'] = call_total_item['incoming_call_duration'] ? moment.duration(item.incoming_call_duration).add(call_total_item['incoming_call_duration']) : moment.duration(item.incoming_call_duration);
                    });
                    call_total_item['success_call_duration'] = Math.floor(call_total_item['success_call_duration'].asHours()) + moment.utc(call_total_item['success_call_duration'].asMilliseconds()).format(":mm:ss");
                    call_total_item['incoming_call_duration'] = Math.floor(call_total_item['incoming_call_duration'].asHours()) + moment.utc(call_total_item['incoming_call_duration'].asMilliseconds()).format(":mm:ss");
                }
                this.setState({data_total: call_total_item});
                this.setState({data_list: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_STATISTIC_TEAM_LIST);
        }
        if (newProps.refresh['CallStatisticPage']){
            let delay = newProps.refresh['CallStatisticPage'].delay ? newProps.refresh['CallStatisticPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('CallStatisticPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data_total, data_list, itemActive} = this.state;
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="CallStatisticPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Thống Kê Cuộc Gọi</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="top-table">
                                <div className="left btnCreateNTD">
                                    <CanRender actionCode={ROLES.qa_call_statistic_get_call}>
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                            <span>Get cuộc gọi <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </CanRender>
                                </div>
                            </div>
                            <div className="body-table el-table">
                                <DragScroll allowSelect={false}>
                                    <table className={classnames("table-default")}>
                                        <tbody>
                                        <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                            <td style={{width:"300px"}}>
                                                <div className="cell"><span>CSKH</span></div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell-custom-big">
                                                    <div>Line</div>
                                                </div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell-custom-big">
                                                    <div>Gọi thành công</div>
                                                    <div>(cuộc)</div>
                                                </div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell-custom-big"><span>Thời lượng gọi thành công</span></div>
                                            </td>
                                            <td style={{width:"130px"}}>
                                                <div className="cell-custom-big">
                                                    <span>KH không nghe máy</span>
                                                    <div>(cuộc)</div>
                                                </div>
                                            </td>
                                            <td style={{width:"130px"}}>
                                                <div className="cell-custom-big"><span>Tổng số cuộc gọi</span></div>
                                            </td>
                                            <td style={{width:"80px"}}>
                                                <div className="cell-custom-big">
                                                    <span>Gọi đến</span>
                                                    <div>(cuộc)</div>
                                                </div>
                                            </td>
                                            <td style={{width:"130px"}}>
                                                <div className="cell-custom-big"><span>Thời lượng gọi đến</span></div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell"><span>Thao tác</span></div>
                                            </td>
                                        </tr>
                                        <tr className="text-bold bgColorBisque ">
                                            <td className="text-center">
                                                <div className="cell"><span>Tổng</span></div>
                                            </td>
                                            <td/>
                                            <td>
                                                <div className="cell text-right">
                                                    <span title={utils.formatNumber(data_total.success_call_quantity, 0, ".", "")}>{utils.formatNumber(data_total.success_call_quantity, 0, ".", "")}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell text-right">
                                                    <span title={data_total.success_call_duration}>{data_total.success_call_duration}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell text-right">
                                                    <span title={utils.formatNumber(data_total.not_answered_call_quantity, 0, ".", "")}>{utils.formatNumber(data_total.not_answered_call_quantity, 0, ".", "")}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell text-right">
                                                    <span title={utils.formatNumber(data_total.total_contract, 0, ".", "")}>{utils.formatNumber(data_total.total_contract, 0, ".", "")}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell text-right">
                                                    <span title={utils.formatNumber(data_total.incoming_call_quantity, 0, ".", "")}>{utils.formatNumber(data_total.incoming_call_quantity, 0, ".", "")}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell text-right">
                                                    <span title={data_total.incoming_call_duration}>{data_total.incoming_call_duration}</span>
                                                </div>
                                            </td>
                                            <td/>
                                        </tr>
                                        {data_list.map((item,key)=> {
                                            return (
                                                <CallStatisticTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem} is_qa={this.props.is_qa}/>
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


export default connect(mapStateToProps,mapDispatchToProps)(CallStatisticPage);
