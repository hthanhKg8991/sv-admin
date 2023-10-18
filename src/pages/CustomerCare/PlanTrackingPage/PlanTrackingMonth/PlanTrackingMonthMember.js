import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanTrackingMonthMember extends Component {
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
        params['team_id'] = this.props.id;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TRACKING_MONTH_MEMBER_LIST, params, delay);
        });
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_TRACKING_MONTH_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TRACKING_MONTH_MEMBER_LIST];
            if (response.info?.args?.team_id === this.props.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TRACKING_MONTH_MEMBER_LIST);
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
                    let data = {
                        email: item.email,
                        target: utils.formatNumber(item.result.target, 0, ".", "đ"),
                        percent_completed: utils.formatNumber(item.result.percent_completed, 0, ".", "đ"),
                        total_progress: utils.formatNumber(item.result.total_progress, 0, ".", "đ"),
                        weeks: item.result.weeks ? item.result.weeks : {}
                    };
                    return (
                        <tr key={key}>
                            <td>
                                <div className="cell" title={item.email}> {item.email}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.target}>{data.target}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.percent_completed}>{data.percent_completed}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_progress}>{data.total_progress}</div>
                            </td>
                            {Object.keys(data.weeks).map((name, key_td) => {
                                return (
                                    <td key={key_td}>
                                        <div className="cell text-right" title={utils.formatNumber(data.weeks[name], 0, ".", "đ")}>
                                            {utils.formatNumber(data.weeks[name], 0, ".", "đ")}
                                        </div>
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
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanTrackingMonthMember);
