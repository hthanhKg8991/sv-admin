import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import PlanDailyRevenueMember from "./PlanDailyRevenueMember"
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanDailyRevenueTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            itemActive: {},
        };
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _refreshList(delay = 0, update = false){
        let params = queryString.parse(window.location.search);
        delete params['date[from]'];
        delete params['date[to]'];
        params['date'] = this.props.date;
        if (!update){
            this.setState({loading: true});
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_TEAM_LIST, params, delay);
    }
    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_TEAM_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_TEAM_LIST];
            if (response.info?.args?.date === this.props.date) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_TEAM_LIST);
            }
        }
        if (newProps.refresh['PlanDailyRevenueTeam']){
            let refresh = newProps.refresh['PlanDailyRevenueTeam'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay, refresh.update);
            this.props.uiAction.deleteRefreshList('PlanDailyRevenueTeam');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <tr>
                    <td colSpan={this.props.colSpan} className="text-center">
                        <LoadingSmall />
                    </td>
                </tr>
            )
        }
        let {data_list, itemActive} = this.state;
        if (!data_list.length){
            return(
                <tr>
                    <td colSpan={this.props.colSpan} className="table-td-empty">
                        <div className="cell"><span>Không có dữ liệu</span></div>
                    </td>
                </tr>
            )
        }

        return(
            <React.Fragment>
                {data_list.map((item,key)=> {
                    let data = {
                        total_achievement: utils.formatNumber(item.total_achievement,0,".",""),
                        total_revenue: utils.formatNumber(item.total_revenue,0,".","")
                    };
                    return (
                        <React.Fragment key={key}>
                            <tr key={key} className="text-bold tr-body el-table-row pointer" onClick={()=>{this.activeItem(item.id)}}>
                                <td>
                                    <div className="cell" title={'Nhóm ' + item.name}>{'Nhóm ' + item.name}</div>
                                </td>
                                <td className="text-right">
                                    <div className="cell" title={data.total_achievement}>{data.total_achievement}</div>
                                </td>
                                <td className="text-right">
                                    <div className="cell" title={data.total_revenue}>{data.total_revenue}</div>
                                </td>
                            </tr>
                            {itemActive[item.id] && (
                                <PlanDailyRevenueMember colSpan={this.props.colSpan} date={this.props.date} team_id={item.id}/>
                            )}
                        </React.Fragment>
                    )}
                )}
            </React.Fragment>
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
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanDailyRevenueTeam);
