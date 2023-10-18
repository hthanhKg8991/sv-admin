import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import classnames from 'classnames';
import DragScroll from 'components/Common/Ui/DragScroll';
import PlanWeekTeam from './PlanWeekTeam';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import moment from 'moment-timezone';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            back_month_limit: [1,2,3,4],
            data_list: [],
            data_total: {
                next_total_target:0,
                current_total_target:0,
                current_total_real:0,
                compare_target_current:0,
                compare_target_back_1:0,
                compare_target_4_week:0,
                avarage_4_week:0,
                back:[]
            },
            show_detail: true,
            itemActive: {},
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.sendReport = this._sendReport.bind(this);
    }

    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }

    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(delay = 0, update = false){
        let params = queryString.parse(window.location.search);
        if (!update){
            this.setState({itemActive: {}});
            this.setState({loading: true});
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_WEEK_TEAM_LIST, params, delay);

    }

    _sendReport(){
        let params = queryString.parse(window.location.search);
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_WEEK_REPORT, params, 0);
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_WEEK_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_WEEK_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let plan_total_item = {
                    next_total_target:0,
                    current_total_target:0,
                    current_total_real:0,
                    compare_target_current:0,
                    compare_target_back_1:0,
                    compare_target_4_week:0,
                    avarage_4_week:0,
                    back:[]
                };
                this.state.back_month_limit.forEach((i) => {
                    plan_total_item['back'][i] = {total_target:0,total_real:0};
                });
                if (response.data.length){
                    response.data.forEach((item) => {
                        plan_total_item['next_total_target'] = plan_total_item['next_total_target'] + parseInt(item.result.next.total_revenue_target);
                        plan_total_item['current_total_target'] = plan_total_item['current_total_target'] + parseInt(item.result.current.total_revenue_target);
                        plan_total_item['current_total_real'] = plan_total_item['current_total_real'] + parseInt(item.result.current.total_revenue_real);
                        plan_total_item['compare_target_current'] = plan_total_item['compare_target_current'] + parseInt(item.calc.compare_target_current);
                        plan_total_item['compare_target_back_1'] = plan_total_item['compare_target_back_1'] + parseInt(item.calc.compare_target_back_1);
                        plan_total_item['compare_target_4_week'] = plan_total_item['compare_target_4_week'] + parseInt(item.calc.compare_target_4_week);
                        plan_total_item['avarage_4_week'] = plan_total_item['avarage_4_week'] + parseInt(item.calc.avarage_4_week);
                        if (!plan_total_item['back']){
                            plan_total_item['back'] = [];
                        }
                        this.state.back_month_limit.forEach((i) => {
                            plan_total_item['back'][i]['total_target'] =  plan_total_item['back'][i]['total_target'] ? plan_total_item['back'][i]['total_target'] + parseInt(item.result['back_'+(i)].total_revenue_target) : parseInt(item.result['back_'+(i)].total_revenue_target);
                            plan_total_item['back'][i]['total_real'] = plan_total_item['back'][i]['total_real'] ? plan_total_item['back'][i]['total_real'] + parseInt(item.result['back_'+(i)].total_revenue_real) : parseInt(item.result['back_'+(i)].total_revenue_real);
                        });
                    });
                }
                this.setState({data_total: plan_total_item});
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_WEEK_TEAM_LIST);
        }else if(newProps.api[ConstantURL.API_URL_PLAN_WEEK_REPORT]){
            const response = newProps.api[ConstantURL.API_URL_PLAN_WEEK_REPORT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }else{
                this.props.uiAction.putToastSuccess("Thao tác thất bại!");
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_WEEK_REPORT);
        }
        if (newProps.refresh['PlanWeek']){
            let refresh = newProps.refresh['PlanWeek'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay, refresh.update);
            this.props.uiAction.deleteRefreshList('PlanWeek');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div>
                    <div className="sub-title-form crm-section inline-block">
                        <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                            Mục tiêu tuần <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
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
        let params = queryString.parse(window.location.search);
        let array = params['week_year'].split("/");
        let weeknumber = parseInt(array[0]);
        let year = parseInt(array[1]);
        let {data_list, back_month_limit, data_total, itemActive} = this.state;
        let last_week = [];

        back_month_limit.forEach((value) => {
            let week = weeknumber - value;
            //nếu là tuần 1 thì ngày bắt đầu là 01/01
            if (moment().week(week).week() === 1){
                last_week.push({
                    week: moment().week(week).week(),
                    date: "(" + moment().startOf('year').format("DD/MM") + " - " + moment().week(week).isoWeekday(7).format("DD/MM/YYYY") + ")"
                });
            }else{
                let firstDay = moment().week(week).startOf('year');
                let endDay = moment().week(week).endOf('year');
                let last_numberWeek = parseInt((endDay.diff(firstDay,"days") + 1)/7);
                //nếu là tuần cuối thì ngày kết thúc là ngày kết thúc n
                if (moment().week(week).week() === last_numberWeek){
                    last_week.push({
                        week: moment().week(week).week(),
                        date: "(" + moment().week(week).isoWeekday(1).format("DD/MM") + " - " + moment(endDay).format("DD/MM/YYYY") + ")"
                    });
                }else{
                    last_week.push({
                        week: moment().week(week).week(),
                        date: "(" + moment().week(week).isoWeekday(1).format("DD/MM") + " - " + moment().week(week).isoWeekday(7).format("DD/MM/YYYY") + ")"
                    });
                }
            }
        });
        let data = {
            next_total_target: utils.formatNumber(data_total.next_total_target, 0, ".", "đ"),
            current_total_target: utils.formatNumber(data_total.current_total_target, 0, ".", "đ"),
            current_total_real: utils.formatNumber(data_total.current_total_real, 0, ".", "đ"),
            compare_target_current: utils.formatNumber(data_total.compare_target_current, 0, ".", "%"),
            compare_target_back_1: utils.formatNumber(data_total.compare_target_back_1, 0, ".", "%"),
            compare_target_4_week: utils.formatNumber(data_total.compare_target_4_week, 0, ".", "%"),
            avarage_4_week: utils.formatNumber(data_total.avarage_4_week, 0, ".", "đ"),
        };
        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                        Mục tiêu tuần <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="top-table">
                            <div className="left">
                                <button type="button" className={classnames("el-button el-button-primary el-button-small",this.state.callingApiSendMail ? "active" : "")} onClick={this.sendReport}>
                                    <span>Gửi báo cáo</span>
                                </button>
                            </div>
                        </div>
                        <div className="body-table el-table crm-section">
                            <DragScroll allowSelect={false}>
                                <table className={classnames("table-default")}>
                                    <tbody>
                                    <tr className="tr-center text-bold">
                                        <td colSpan={4} style={{width:"430px"}} />
                                        <td colSpan={5} style={{width:"600px"}} className="bgColorBisque">
                                            <div className="cell">Doanh thu tuần {weeknumber}/{year}</div>
                                        </td>
                                        <td colSpan={5} style={{width:"600px"}} className="bgColorBisque">
                                            <div className="cell">Doanh thu 4 tuần trước</div>
                                        </td>
                                    </tr>
                                    <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                        <td colSpan={3}>
                                            <div className="cell-custom-big">CSKH</div>
                                        </td>
                                        <td>
                                            <div className="cell-custom-big">Chỉ tiêu tuần {moment().week(weeknumber+1).week()}/{moment().week(weeknumber+1).isoWeekday(7).format("YYYY")}</div>
                                        </td>
                                        <td>
                                            <div className="cell-custom-big">Chỉ tiêu tuần {weeknumber}/{year}</div>
                                        </td>
                                        <td>
                                            <div className="cell-custom-big">Đạt được tuần {weeknumber}/{year}</div>
                                        </td>
                                        <td>
                                            <div className="cell-custom-big">% Hoàn thành tuần {weeknumber}/{year}</div>
                                        </td>
                                        <td>
                                            <div className="cell-custom-big">% Doanh thu tăng/giảm so với tuần {moment().week(weeknumber-1).week()}/{moment().week(weeknumber-1).format("YYYY")}</div>
                                        </td>
                                        <td>
                                            <div className="cell-custom-big">% Doanh thu tăng/giảm so với TB 4 tuần trước</div>
                                        </td>
                                        <td>
                                            <div className="cell-custom-big">Doanh thu TB 4 tuần trước</div>
                                        </td>
                                        {last_week.map((item,key) => {
                                            return (
                                                <td key={key}>
                                                    <div className="cell-custom-big">
                                                        Tuần {item.week}<br/>{item.date}
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    <tr className="bgColorBisque text-bold">
                                        <td colSpan={3} className="text-bold text-center">
                                            <div className="cell"><span>Tổng</span></div>
                                        </td>
                                        <td>
                                            <div className="cell text-right" title={data.next_total_target}>{data.next_total_target}</div>
                                        </td>
                                        <td>
                                            <div className="cell text-right" title={data.current_total_target}>{data.current_total_target}</div>
                                        </td>
                                        <td>
                                            <div className="cell text-right" title={data.current_total_real}>{data.current_total_real}</div>
                                        </td>
                                        <td>
                                            <div className="cell text-right" title={data.compare_target_current}>{data.compare_target_current}</div>
                                        </td>
                                        <td>
                                            <div className="cell text-right" title={data.compare_target_back_1}>{data.compare_target_back_1}</div>
                                        </td>
                                        <td>
                                            <div className="cell text-right" title={data.compare_target_4_week}>{data.compare_target_4_week}</div>
                                        </td>
                                        <td>
                                            <div className="cell text-right" title={data.avarage_4_week}>{data.avarage_4_week}</div>
                                        </td>
                                        {data_total.back.map((item,key) => {
                                            let total_real = utils.formatNumber(item.total_real, 0, ".", "đ");
                                            return(
                                                <td key={key}>
                                                    <div className="cell text-right" title={total_real}>
                                                        <span>{total_real}</span>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    {data_list.map((item, key)=> {
                                        return(
                                            <PlanWeekTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem} back_month_limit={back_month_limit}/>
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
