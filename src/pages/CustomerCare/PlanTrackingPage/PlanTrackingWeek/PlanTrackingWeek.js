import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import classnames from 'classnames';
import moment from "moment";
import PlanTrackingWeekMember from "./PlanTrackingWeekMember"
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanTrackingWeek extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list:[],
            itemActive: {},
        };
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['team_id'] = this.props.id;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TRACKING_WEEK_TEAM_LIST, params, delay);
        });
    }
    _activeItem(key){
        let weekActive = Object.assign({},this.state.weekActive);
        weekActive[key] = !weekActive[key];
        this.setState({weekActive: weekActive});
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        this.setState({itemActive: newProps.itemActive});
        if (newProps.api[ConstantURL.API_URL_PLAN_TRACKING_WEEK_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TRACKING_WEEK_TEAM_LIST];
            if (response.info?.args?.team_id === this.props.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TRACKING_WEEK_TEAM_LIST);
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
        let params = queryString.parse(window.location.search);
        let month = parseInt(params['month_year'].split("/")[0]);
        let weeks = utils.getListWeekInMonth(month - 1);

        return(
            <React.Fragment>
                {this.state.data_list.map((item, key)=> {
                    let week = weeks.filter(c => c.value === item.week);
                    let title = week.length ? week[0].title : "";
                    let week_year = item.week+"/"+moment().format("YYYY");
                    let data = {
                        total_target: utils.formatNumber(item.total_target, 0, ".", "đ"),
                        total_progress: utils.formatNumber(item.total_progress, 0, ".", "đ"),
                        percent_completed: utils.formatNumber(item.percent_completed, 0, ".", "%"),
                        Mon: utils.formatNumber(item.days.Mon, 0, ".", "đ"),
                        Tue: utils.formatNumber(item.days.Tue, 0, ".", "đ"),
                        Wed: utils.formatNumber(item.days.Wed, 0, ".", "đ"),
                        Thu: utils.formatNumber(item.days.Thu, 0, ".", "đ"),
                        Fri: utils.formatNumber(item.days.Fri, 0, ".", "đ"),
                        Sat: utils.formatNumber(item.days.Sat, 0, ".", "đ"),
                        Sun: utils.formatNumber(item.days.Sun, 0, ".", "đ"),
                    };
                    return(
                        <React.Fragment key={key}>
                            <tr className="tr-body el-table-row text-bold el-table-row-lv2 pointer" onClick={()=>{this.props.activeItem(item.week)}}>
                                <td>
                                    <div className="cell" title={"Tuần " + week_year + " " + title}>Tuần {week_year} {title}</div>
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
                                    <div className={classnames("cell text-right",item.days.Mon === null ? "lineThrough" : "")} title={data.Mon}>
                                        {data.Mon}
                                    </div>
                                </td>
                                <td>
                                    <div className={classnames("cell text-right",item.days.Tue === null ? "lineThrough" : "")} title={data.Tue}>
                                        {data.Tue}
                                    </div>
                                </td>
                                <td>
                                    <div className={classnames("cell text-right",item.days.Wed === null ? "lineThrough" : "")} title={data.Wed}>
                                        {data.Wed}
                                    </div>
                                </td>
                                <td>
                                    <div className={classnames("cell text-right",item.days.Thu === null ? "lineThrough" : "")} title={data.Thu}>
                                        {data.Thu}
                                    </div>
                                </td>
                                <td>
                                    <div className={classnames("cell text-right",item.days.Fri === null ? "lineThrough" : "")} title={data.Fri}>
                                        {data.Fri}
                                    </div>
                                </td>
                                <td>
                                    <div className={classnames("cell text-right",item.days.Sat === null ? "lineThrough" : "")} title={data.Sat}>
                                        {data.Sat}
                                    </div>
                                </td>
                                <td>
                                    <div className={classnames("cell text-right",item.days.Sun === null ? "lineThrough" : "")} title={data.Sun}>
                                        {data.Sun}
                                    </div>
                                </td>
                            </tr>
                            {itemActive[item.week] && (
                                <PlanTrackingWeekMember team_id={this.props.id} week_year={week_year} colSpan={11}/>
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
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanTrackingWeek);
