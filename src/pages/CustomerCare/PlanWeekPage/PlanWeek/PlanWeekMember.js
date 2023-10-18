import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import InputTable from "components/Common/InputValue/InputTable";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanWeekMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            back_month_limit: props.back_month_limit ? props.back_month_limit : [],
            data_list:[],
            input_list: {},
            map: {
                revenue: 'Chỉ tiêu'
            }
        };
        this.refreshList = this._refreshList.bind(this);
        this.onDBClick = this._onDBClick.bind(this);
        this.updatePlan = this._updatePlan.bind(this);
    }

    _refreshList(delay = 0, update = false){
        let params = queryString.parse(window.location.search);
        params['team_id'] = this.props.id;
        if (!update) {
            this.setState({loading: true});
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_GET_PLAN_WEEK_MEMBER_LIST, params, delay);
    }
    _onDBClick(id, key){
        let input_list = Object.assign({}, this.state.input_list);
        input_list[id + key] = true;
        this.setState({input_list: input_list});
    }
    _updatePlan(item, input_list){
        let params = queryString.parse(window.location.search);
        let array = params['week_year'].split("/");
        let id = item.id;
        let args = {
            week_year: parseInt(array[0]) + 1 + "/" + array[1],
            team_id: this.props.id,
            staff_id: id,
        };
        Object.keys(this.state.map).forEach((name) => {
            if(input_list.hasOwnProperty(id + name + '_value')) {
                args[name] = input_list[id + name + '_value'];
            }
        });
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_POST_PLAN_WEEK_MEMBER_SAVE, args, 0, false);
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_PLAN_WEEK_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_PLAN_WEEK_MEMBER_LIST];
            if (response.info?.args?.team_id === this.props.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_PLAN_WEEK_MEMBER_LIST);
            }
        }
        if (newProps.api[ConstantURL.API_URL_POST_PLAN_WEEK_MEMBER_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_POST_PLAN_WEEK_MEMBER_SAVE];
            let input_list = Object.assign({}, this.state.input_list);
            let map = this.state.map;
            let staff_id = response.info?.args?.staff_id;
            if (response.code === Constant.CODE_SUCCESS) {
                Object.keys(map).forEach((name) => {
                    input_list[staff_id + name] = false;
                    input_list[staff_id + name + '_error'] = false;
                });
                this.props.uiAction.refreshList('PlanWeek',{update: true});
                this.refreshList(0, true);
            }else{
                if (response.data) {
                    let msg = response.msg + "\n";
                    Object.keys(response.data).forEach((name) => {
                        input_list[staff_id + name +'_error'] = true;
                        let error = response.data[name].replace(":attr_name", map[name]);
                        msg = msg + error + "\n";
                    });
                    this.props.uiAction.putToastError(msg);
                }
            }
            this.setState({input_list: input_list});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_PLAN_WEEK_MEMBER_SAVE);
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
        let {data_list, input_list, back_month_limit} = this.state;

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
                    let next_total_revenue_target = input_list[item.id + "revenue_value"] ? input_list[item.id + "revenue_value"] : item.result.next.total_revenue_target;
                    let data = {
                        next_total_revenue_target: utils.formatNumber(next_total_revenue_target, 0, ".", "đ"),
                        current_total_revenue_target: utils.formatNumber(item.result.current.total_revenue_target, 0, ".", "đ"),
                        total_revenue_real: utils.formatNumber(item.result.current.total_revenue_real, 0, ".", "đ"),
                        compare_target_current: utils.formatNumber(item.calc.compare_target_current, 0, ".", "%"),
                        compare_target_back_1: utils.formatNumber(item.calc.compare_target_back_1, 0, ".", "%"),
                        compare_target_4_week: utils.formatNumber(item.calc.compare_target_4_week, 0, ".", "%"),
                        avarage_4_week: utils.formatNumber(item.calc.avarage_4_week, 0, ".", "đ")
                    };
                    return (
                        <tr key={key}>
                            <td colSpan={3}>
                                <div className="cell" title={item.email}>{item.email}</div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(item.id, 'revenue')}}>
                                <div className="cell text-right">
                                    {!input_list[item.id + 'revenue'] ? (
                                        <span title={data.next_total_revenue_target}>{data.next_total_revenue_target}</span>
                                    ) : (
                                        <InputTable isNumber suffix=" đ" className="w100 input-number"
                                                    error={input_list[item.id + "revenue_error"]}
                                                    value={next_total_revenue_target}
                                                    onChange={(value)=>{
                                                        input_list[item.id + "revenue_value"] = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.current_total_revenue_target}>{data.current_total_revenue_target}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_revenue_real}>{data.total_revenue_real}</div>
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
                            {back_month_limit.map((value,key) => {
                                let back_total_revenue_real = utils.formatNumber(item.result['back_'+value].total_revenue_real, 0, ".", "đ");
                                return(
                                    <td key={key}>
                                        <div className="cell text-right" title={back_total_revenue_real}>{back_total_revenue_real}</div>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanWeekMember);
