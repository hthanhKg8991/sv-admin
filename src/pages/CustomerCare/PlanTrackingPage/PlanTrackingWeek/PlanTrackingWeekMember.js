import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import classnames from 'classnames';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanTrackingWeekMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list:[],
        };
        this.refreshList = this._refreshList.bind(this);
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['team_id'] = this.props.team_id;
        params['week_year'] = this.props.week_year;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TRACKING_WEEK_MEMBER_LIST, params, delay);
        });
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_TRACKING_WEEK_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TRACKING_WEEK_MEMBER_LIST];
            if (response.info?.args?.team_id === this.props.team_id && response.info?.args?.week_year === this.props.week_year) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TRACKING_WEEK_MEMBER_LIST);
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
                {data_list.map((item,key)=> {
                    let data = {
                        total_target: utils.formatNumber(item.result.total_target, 0, ".", "đ"),
                        total_progress: utils.formatNumber(item.result.total_progress, 0, ".", "đ"),
                        percent_completed: utils.formatNumber(item.result.percent_completed, 0, ".", "%"),
                        Mon: utils.formatNumber(item.result.week.Mon, 0, ".", "đ"),
                        Tue: utils.formatNumber(item.result.week.Tue, 0, ".", "đ"),
                        Wed: utils.formatNumber(item.result.week.Wed, 0, ".", "đ"),
                        Thu: utils.formatNumber(item.result.week.Thu, 0, ".", "đ"),
                        Fri: utils.formatNumber(item.result.week.Fri, 0, ".", "đ"),
                        Sat: utils.formatNumber(item.result.week.Sat, 0, ".", "đ"),
                        Sun: utils.formatNumber(item.result.week.Sun, 0, ".", "đ"),
                    };
                    return(
                        <tr key={key}>
                            <td>
                                <div className="cell" title={item.email}>{item.email}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_target}>{data.total_target}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_progress}>{data.total_progress}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.percent_completed}>{data.percent_completed}</div>
                            </td>
                            <td>
                                <div className={classnames("cell text-right",item.result.week.Mon === null ? "lineThrough" : "")} title={data.Mon}>
                                    {data.Mon}
                                </div>
                            </td>
                            <td>
                                <div className={classnames("cell text-right",item.result.week.Tue === null ? "lineThrough" : "")} title={data.Tue}>
                                    {data.Tue}
                                </div>
                            </td>
                            <td>
                                <div className={classnames("cell text-right",item.result.week.Wed === null ? "lineThrough" : "")} title={data.Wed}>
                                    {data.Wed}
                                </div>
                            </td>
                            <td>
                                <div className={classnames("cell text-right",item.result.week.Thu === null ? "lineThrough" : "")} title={data.Thu}>
                                    {data.Thu}
                                </div>
                            </td>
                            <td>
                                <div className={classnames("cell text-right",item.result.week.Fri === null ? "lineThrough" : "")} title={data.Fri}>
                                    {data.Fri}
                                </div>
                            </td>
                            <td>
                                <div className={classnames("cell text-right",item.result.week.Sat === null ? "lineThrough" : "")} title={data.Sat}>
                                    {data.Sat}
                                </div>
                            </td>
                            <td>
                                <div className={classnames("cell text-right",item.result.week.Sun === null ? "lineThrough" : "")} title={data.Sun}>
                                    {data.Sun}
                                </div>
                            </td>
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
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanTrackingWeekMember);
