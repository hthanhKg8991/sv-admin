import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import StatisticRemovedEmployerBranch from "./StatisticRemovedEmployerBranch";
import DragScroll from 'components/Common/Ui/DragScroll';
import classnames from 'classnames';
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
            statistic_total:{
                total:0,
                assigned_inventory:0,
                assigned_expired:0,
                assigned_filter:0,
                total_vip:0,
                total_expired_vip:0,
                total_free:0
            },
            itemActive: -1
        };
        this.onRefresh = this._onRefresh.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _onRefresh(){
        this.refreshList();
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiStatisticDomain, ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_BRANCH, params, delay);
        this.props.uiAction.showLoading();
        if (this.state.itemActive !== -1){
            this.props.uiAction.refreshList('StatisticRemovedEmployerTeam');
        }
    }
    _activeItem(key){
        let itemActive = this.state.itemActive;
        itemActive = itemActive === key ? -1 : key;
        this.setState({itemActive: itemActive});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_BRANCH]) {
            let response = newProps.api[ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_BRANCH];
            if (response.code === Constant.CODE_SUCCESS) {
                let statistic_total = {
                    total:0,
                    reason_inventory:0,
                    reason_expired:0,
                    reason_filter:0,
                    total_vip:0,
                    total_expired_vip:0,
                    total_never_vip:0
                };
                if (Array.isArray(response.data)) {
                    response.data.forEach((item) => {
                        statistic_total.reason_inventory = statistic_total.reason_inventory ? statistic_total.reason_inventory + parseInt(item.reason_inventory) : parseInt(item.reason_inventory);
                        statistic_total.reason_expired = statistic_total.reason_expired ? statistic_total.reason_expired + parseInt(item.reason_expired) : parseInt(item.reason_expired);
                        statistic_total.reason_filter = statistic_total.reason_filter ? statistic_total.reason_filter + parseInt(item.reason_filter) : parseInt(item.reason_filter);
                        statistic_total.total_vip = statistic_total.total_vip ? statistic_total.total_vip + parseInt(item.total_vip) : parseInt(item.total_vip);
                        statistic_total.total_expired_vip = statistic_total.total_expired_vip ? statistic_total.total_expired_vip + parseInt(item.total_expired_vip) : parseInt(item.total_expired_vip);
                        statistic_total.total_never_vip = statistic_total.total_never_vip ? statistic_total.total_never_vip + parseInt(item.total_never_vip) : parseInt(item.total_never_vip);
                    });
                    statistic_total.total = statistic_total.reason_inventory + statistic_total.reason_expired + statistic_total.reason_filter;
                }
                this.setState({statistic_total: statistic_total});
                this.setState({data_list: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_BRANCH);
        }
        if (newProps.refresh['StatisticRemovedEmployerPage']){
            let delay = newProps.refresh['StatisticRemovedEmployerPage'].delay ? newProps.refresh['StatisticRemovedEmployerPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('StatisticRemovedEmployerPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data_list, statistic_total, itemActive} = this.state;
        statistic_total = {
            total: utils.formatNumber(statistic_total.total, 0, ".", ""),
            reason_inventory: utils.formatNumber(statistic_total.reason_inventory, 0, ".", ""),
            reason_expired: utils.formatNumber(statistic_total.reason_expired, 0, ".", ""),
            reason_filter: utils.formatNumber(statistic_total.reason_filter, 0, ".", ""),
            total_vip: utils.formatNumber(statistic_total.total_vip, 0, ".", ""),
            total_expired_vip: utils.formatNumber(statistic_total.total_expired_vip, 0, ".", ""),
            total_never_vip: utils.formatNumber(statistic_total.total_never_vip, 0, ".", ""),
        };
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="StatisticRemovedEmployerPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Thống Kê Số Lượng Tài Khoản Bị Xả</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={this.onRefresh}>
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
                                            <td style={{width:"270px"}}>
                                                <div className="cell">CSKH</div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell">
                                                    <div>Tổng số xả</div>
                                                    <div>(1 + 2 + 3)</div>
                                                </div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell">
                                                    <div>Xả do tồn</div>
                                                    <div>(1)</div>
                                                </div>
                                            </td>
                                            <td style={{width:"180px"}}>
                                                <div className="cell">
                                                    <div className="cell">
                                                        <div>Xả do hết hạn chăm sóc</div>
                                                        <div>(2)</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{width:"130px"}}>
                                                <div className="cell">
                                                    <div className="cell">
                                                        <div>Xả do thanh lọc</div>
                                                        <div>(3)</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell">
                                                    <div className="cell">
                                                        <div>Đang VIP</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell">
                                                    <div className="cell">
                                                        <div>Đã từng VIP</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{width:"100px"}}>
                                                <div className="cell">
                                                    <div className="cell">
                                                        <div>Miễn phí</div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="text-bold bgColorBisque">
                                            <td>
                                                <div className="text-center cell" title="Tổng">Tổng</div>
                                            </td>
                                            {Object.keys(statistic_total).map((name, key) => {
                                                return(
                                                    <td key={key}>
                                                        <div className="cell text-right" title={statistic_total[name]}>{statistic_total[name]}</div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                        {data_list.map((item,key)=> {
                                            return(
                                                <StatisticRemovedEmployerBranch key={key} item={item} itemActive={itemActive} activeItem={this.activeItem} />
                                            )})
                                        }
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
