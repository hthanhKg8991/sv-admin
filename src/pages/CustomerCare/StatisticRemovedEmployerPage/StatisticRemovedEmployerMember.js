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

class StatisticRemovedEmployerMember extends Component {
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
        params['branch_code'] = this.props.branch_code;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiStatisticDomain, ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_MEMBER, params, delay);
        });
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_MEMBER]) {
            let response = newProps.api[ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_MEMBER];
            if (response.info?.args?.team_id === this.props.team_id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_STATISTIC_GET_REMOVED_EMPLOYER_LIST_MEMBER);
            }
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
                    let total = parseInt(item.reason_inventory) + parseInt(item.reason_expired) + parseInt(item.reason_filter);
                    let params = queryString.parse(window.location.search);
                    let URL = Constant.BASE_URL_STATISTIC_EMPLOYER_BY_STAFF + "?staff_id=" + item.staff_id + "&assigned[from]="+params['assigned[from]']+"&assigned[to]="+params['assigned[to]'];
                    let data = {
                        total: utils.formatNumber(total, 0, ".", ""),
                        reason_inventory: utils.formatNumber(item.reason_inventory, 0, ".", ""),
                        reason_expired: utils.formatNumber(item.reason_expired, 0, ".", ""),
                        reason_filter: utils.formatNumber(item.reason_filter, 0, ".", ""),
                        total_vip: utils.formatNumber(item.total_vip, 0, ".", ""),
                        total_expired_vip: utils.formatNumber(item.total_expired_vip, 0, ".", ""),
                        total_never_vip: utils.formatNumber(item.total_never_vip, 0, ".", ""),
                    };
                    return (
                        <tr key={key}>
                            <td>
                                <div className="cell">
                                    <a href={URL} target="_blank" rel="noopener noreferrer"><span title={item.staff_email}>{item.staff_email}</span></a>
                                </div>
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
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(StatisticRemovedEmployerMember);
