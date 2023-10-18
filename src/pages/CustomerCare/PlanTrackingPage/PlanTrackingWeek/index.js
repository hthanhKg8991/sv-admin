import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import classnames from 'classnames';
import DragScroll from 'components/Common/Ui/DragScroll';
import PlanTrackingWeekTeam from './PlanTrackingWeekTeam';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            data_total: {},
            show_detail: true,
            itemActive: {},
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }

    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }

    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TRACKING_TEAM_LIST, params, delay);
        });
        this.setState({itemActive: {}});
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_TRACKING_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TRACKING_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let plan_total_item = {
                    total_target:0,
                    total_progress:0,
                    percent_completed:0,
                    Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0,
                };
                if (response.data.length) {
                    response.data.forEach((item) => {
                        plan_total_item['total_target'] = plan_total_item['total_target'] ? plan_total_item['total_target'] + parseInt(item.result.total_target) : parseInt(item.result.total_target);
                        plan_total_item['total_progress'] = plan_total_item['total_progress'] ? plan_total_item['total_progress'] + parseInt(item.result.total_progress) : parseInt(item.result.total_progress);
                        plan_total_item['Mon'] = plan_total_item['Mon'] ? plan_total_item['Mon'] + parseInt(item.result.days.Mon) : parseInt(item.result.days.Mon);
                        plan_total_item['Tue'] = plan_total_item['Tue'] ? plan_total_item['Tue'] + parseInt(item.result.days.Tue) : parseInt(item.result.days.Tue);
                        plan_total_item['Wed'] = plan_total_item['Wed'] ? plan_total_item['Wed'] + parseInt(item.result.days.Wed) : parseInt(item.result.days.Wed);
                        plan_total_item['Thu'] = plan_total_item['Thu'] ? plan_total_item['Thu'] + parseInt(item.result.days.Thu) : parseInt(item.result.days.Thu);
                        plan_total_item['Fri'] = plan_total_item['Fri'] ? plan_total_item['Fri'] + parseInt(item.result.days.Fri) : parseInt(item.result.days.Fri);
                        plan_total_item['Sat'] = plan_total_item['Sat'] ? plan_total_item['Sat'] + parseInt(item.result.days.Sat) : parseInt(item.result.days.Sat);
                        plan_total_item['Sun'] = plan_total_item['Sun'] ? plan_total_item['Sun'] + parseInt(item.result.days.Sun) : parseInt(item.result.days.Sun);
                    });
                    plan_total_item['percent_completed'] = 0;
                    if (plan_total_item['total_target'] || plan_total_item['total_progress']){
                        plan_total_item['percent_completed'] = plan_total_item['total_progress'] / plan_total_item['total_target'] * 100;
                    }
                }
                this.setState({data_total: plan_total_item});
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TRACKING_TEAM_LIST);
        }
        if (newProps.refresh['PlanTrackingWeek']){
            let delay = newProps.refresh['PlanTrackingWeek'].delay ? newProps.refresh['PlanTrackingWeek'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('PlanTrackingWeek');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let params = queryString.parse(window.location.search);
        if (this.state.loading){
            return(
                <div>
                    <div className="sub-title-form crm-section inline-block">
                        <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                            Theo dõi tiến độ trong tuần của tháng tháng {params['month_year']}
                            <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                        </div>
                    </div>
                    <Collapse in={this.state.show_detail}>
                        <div className="text-center">
                            <LoadingSmall />
                        </div>
                    </Collapse>
                </div>
            )
        }
        let days = utils.getDayInWeek();
        let {data_list, data_total, itemActive} = this.state;
        data_total = {
            total_target: utils.formatNumber(this.state.data_total.total_target, 0, ".", "đ"),
            total_progress: utils.formatNumber(this.state.data_total.total_progress, 0, ".", "đ"),
            percent_completed: utils.formatNumber(this.state.data_total.percent_completed, 0, ".", "%"),
            Mon: utils.formatNumber(this.state.data_total.Mon, 0, ".", "đ"),
            Tue: utils.formatNumber(this.state.data_total.Tue, 0, ".", "đ"),
            Wed: utils.formatNumber(this.state.data_total.Wed, 0, ".", "đ"),
            Thu: utils.formatNumber(this.state.data_total.Thu, 0, ".", "đ"),
            Fri: utils.formatNumber(this.state.data_total.Fri, 0, ".", "đ"),
            Sat: utils.formatNumber(this.state.data_total.Sat, 0, ".", "đ"),
            Sun: utils.formatNumber(this.state.data_total.Sun, 0, ".", "đ"),
        };
        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                        Theo dõi tiến độ trong tuần của tháng tháng {params['month_year']}
                        <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="body-table el-table crm-section">
                            <DragScroll allowSelect={false}>
                                <table className={classnames("table-default")}>
                                    <tbody>
                                    <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                        <td style={{width:"300px"}}>
                                            <div className="cell">CSKH</div>
                                        </td>
                                        <td style={{width:"120px"}}>
                                            <div className="cell">Mục tiêu</div>
                                        </td>
                                        <td style={{width:"120px"}}>
                                            <div className="cell">Đã đạt</div>
                                        </td>
                                        <td style={{width:"120px"}}>
                                            <div className="cell">% Hoàn thành</div>
                                        </td>
                                        {days.map((item,key)=>{
                                            return(
                                                <td style={{width:"120px"}} key={key}>
                                                    <div className="cell">
                                                        <div>{item.title}</div>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    <tr className="text-bold bgColorBisque">
                                        <td className="text-center">
                                            <div className="cell"><span>Tổng</span></div>
                                        </td>
                                        {Object.keys(data_total).map((name, key) => {
                                            return(
                                                <td key={key}>
                                                    <div className="cell text-right" title={data_total[name]}>{data_total[name]}</div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    {data_list.map((item,key)=> {
                                        return(
                                            <PlanTrackingWeekTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem}/>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </DragScroll>
                        </div>
                    </div>
                </Collapse>
            </div>
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


export default connect(mapStateToProps,mapDispatchToProps)(index);
