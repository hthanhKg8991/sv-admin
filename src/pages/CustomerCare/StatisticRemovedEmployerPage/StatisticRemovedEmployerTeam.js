import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import StatisticRemovedEmployerMember from './StatisticRemovedEmployerMember';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class StatisticRemovedEmployerTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemActive: -1,
            loading: true,
            data_list:[]
        };
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['branch_code'] = this.props.branch_code;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiStatisticDomain, ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_TEAM, params, delay);
        });
    }
    _activeItem(key){
        let itemActive = this.state.itemActive;
        itemActive = itemActive === key ? -1 : key;
        this.setState({itemActive: itemActive});
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_TEAM]) {
            let response = newProps.api[ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_TEAM];
            if (response.info?.args?.branch_code === this.props.branch_code) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_TEAM);
            }
        }
        if (newProps.refresh['StatisticRemovedEmployerTeam']){
            this.refreshList();
            this.props.uiAction.deleteRefreshList('StatisticRemovedEmployerTeam');
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
        let {itemActive, data_list} = this.state;
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
                    let total = parseInt(item.reason_inventory) + parseInt(item.reason_expired) + parseInt(item.reason_filter);
                    let data = {
                        total: utils.formatNumber(total, 0, ".", ""),
                        reason_inventory: utils.formatNumber(item.reason_inventory, 0, ".", ""),
                        reason_expired: utils.formatNumber(item.reason_expired, 0, ".", ""),
                        reason_filter: utils.formatNumber(item.reason_filter, 0, ".", ""),
                        total_vip: utils.formatNumber(item.total_vip, 0, ".", ""),
                        total_expired_vip: utils.formatNumber(item.total_expired_vip, 0, ".", ""),
                        total_never_vip: utils.formatNumber(item.total_never_vip, 0, ".", ""),
                    };
                    return(
                    <React.Fragment key={key}>
                        <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.activeItem(item.team_id)}}>
                            <td>
                                <div className="cell" title={"Nhóm " + item.team_name}>{"Nhóm " + item.team_name}</div>
                            </td>
                            {Object.keys(data).map((name, key) => {
                                return(
                                    <td key={key}>
                                        <div className="cell text-right" title={data[name]}>{data[name]}</div>
                                    </td>
                                )
                            })}
                        </tr>
                        {itemActive === item.team_id && (
                            <StatisticRemovedEmployerMember colSpan={this.props.colSpan} {...item} branch_code={this.props.branch_code}/>
                        )}
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(StatisticRemovedEmployerTeam);
