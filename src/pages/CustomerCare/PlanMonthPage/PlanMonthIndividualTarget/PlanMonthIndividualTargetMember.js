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

class PlanMonthIndividualTargetMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            input_list: {},
            map: {
                expected_revenue: 'Doanh thu thực hiện'
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_LIST, params, delay);
    }
    _onDBClick(id, key){
        let input_list = Object.assign({}, this.state.input_list);
        input_list[id + key] = true;
        this.setState({input_list: input_list});
    }

    _updatePlan(item, input_list){
        let params = queryString.parse(window.location.search);
        let id = item.result.staff_id;
        let args = {
            month_year: params['month_year'],
            team_id: item.result.team_id,
            staff_id: id,
            plan_monthly_earning_target_id: item.result.plan_monthly_earning_target_id
        };
        Object.keys(this.state.map).forEach((name) => {
            if(input_list.hasOwnProperty(id + name + '_value')) {
                args[name] = input_list[id + name + '_value'];
            }
        });
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_SAVE, args, 0, false);
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_LIST];
            if (response.info?.args?.team_id === this.props.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_LIST);
            }
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_SAVE];
            let input_list = Object.assign({}, this.state.input_list);
            let map = this.state.map;
            let staff_id = response.info?.args?.staff_id;
            if (response.code === Constant.CODE_SUCCESS) {
                Object.keys(map).forEach((name) => {
                    input_list[staff_id + name] = false;
                    input_list[staff_id + name + '_error'] = false;
                });
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_INDIVIDUAL_TARGET_MEMBER_SAVE);
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
        let {data_list, input_list} = this.state;
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
                    let staff_id = item.result.staff_id;
                    let expected_revenue = input_list[staff_id + "expected_revenue_value"] ? input_list[staff_id + "expected_revenue_value"] : item.result.expected_revenue;
                    let data = {
                        email: item.email,
                        experience_month: item.result.experience_month,
                        expected_revenue: utils.formatNumber(expected_revenue, 0, ".", "đ"),
                        total_salary: utils.formatNumber(item.result.total_salary, 0, ".", "đ")
                    };
                    return(
                        <tr key={key}>
                            <td>
                                <div className="cell" title={data.email}>{data.email}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.experience_month}>{data.experience_month}</div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "expected_revenue")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "expected_revenue"] ? (
                                        <span title={data.expected_revenue}>{data.expected_revenue}</span>
                                    ) : (
                                        <InputTable isNumber suffix=" đ" className="w100 input-number"
                                                    error={input_list[staff_id + "expected_revenue_error"]}
                                                    value={expected_revenue}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + "expected_revenue_value"] = value;
                                                        item.result.expected_revenue = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_salary}>{data.total_salary}</div>
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
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanMonthIndividualTargetMember);
