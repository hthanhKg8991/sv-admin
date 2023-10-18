import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class StatisticEmployerMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list:[]
        };
        this.refreshList = this._refreshList.bind(this);
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['team_id'] = this.props.team_id;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiStatisticDomain, ConstantURL.API_URL_STATISTIC_EMPLOYER_MEMBER, params, delay);
        });
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_STATISTIC_EMPLOYER_MEMBER]) {
            let response = newProps.api[ConstantURL.API_URL_STATISTIC_EMPLOYER_MEMBER];
            if (response.info?.args?.team_id === this.props.team_id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_STATISTIC_EMPLOYER_MEMBER);
            }
        }
        if (newProps.refresh['StatisticEmployerMember']){
            this.refreshList();
            this.props.uiAction.deleteRefreshList('StatisticEmployerMember');
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
        let {data_list} = this.state;
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
                {data_list.map((item, key) => {
                    let total_vip = parseInt(item.total_vip);
                    let total_reserve = parseInt(item.total_reserve);
                    let total_expired = parseInt(item.total_expired_vip);
                    let total_available = parseInt(item.total_never_vip);
                    let data = {
                        total_emp: utils.formatNumber(total_vip + total_expired + total_reserve + total_available, 0, ".", ""),
                        total_vip: utils.formatNumber(total_vip, 0, ".", ""),
                        total_reserve: utils.formatNumber(total_reserve, 0, ".", ""),
                        expired_total: utils.formatNumber(total_expired, 0, ".", ""),
                        expired_total_admin_no_verify: utils.formatNumber(item.total_expired_vip_admin_no_verify, 0, ".", ""),
                        expired_total_admin_verify: utils.formatNumber(item.total_expired_vip_admin_verify, 0, ".", ""),
                        expired_total_web_no_verify: utils.formatNumber(item.total_expired_vip_web_no_verify, 0, ".", ""),
                        expired_total_web_verify: utils.formatNumber(item.total_expired_vip_web_verify, 0, ".", ""),
                        available_total: utils.formatNumber(total_available, 0, ".", ""),
                        available_total_admin_no_verify: utils.formatNumber(item.total_never_vip_admin_no_verify, 0, ".", ""),
                        available_total_admin_verify: utils.formatNumber(item.total_never_vip_admin_verify, 0, ".", ""),
                        available_total_web_no_verify: utils.formatNumber(item.total_never_vip_web_no_verify, 0, ".", ""),
                        available_total_web_verify: utils.formatNumber(item.total_never_vip_web_verify, 0, ".", ""),
                    };
                    return (
                        <tr key={key}>
                            <td>
                                <div className="cell" title={item.staff_email}>{item.staff_email}</div>
                            </td>
                            {Object.keys(data).map((name, key) => {
                                return(
                                    <td key={key}>
                                        <div className="cell text-right" title={data[name]}>{data[name]}</div>
                                    </td>
                                )
                            })}
                        </tr>
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

export default connect(mapStateToProps,mapDispatchToProps)(StatisticEmployerMember);
