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

class PlanMonthWorkMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            input_list: {},
            map: {
                old_customer_quantity: 'Số khách hàng cũ',
                new_customer_quantity: 'Số khách hàng mới',
                old_call_quantity: 'Số cuộc gọi cũ',
                new_call_quantity: 'Số cuộc gọi mới',
                old_email_quantity: 'Số email cũ',
                new_email_quantity: 'Số email mới'
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_GET_PLAN_MONTH_WORKLOAD_MEMBER_LIST, params, delay);
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
            team_id: this.props.id,
            plan_monthly_workload_id: item.result.plan_monthly_workload_id,
            staff_id: id
        };
        Object.keys(this.state.map).forEach((name) => {
            if(input_list.hasOwnProperty(id + name + '_value')) {
                args[name] = input_list[id + name + '_value'];
            }
        });
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_POST_PLAN_MONTH_WORKLOAD_SAVE, args, 0, false);
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_PLAN_MONTH_WORKLOAD_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_PLAN_MONTH_WORKLOAD_MEMBER_LIST];
            if (response.info?.args?.team_id === this.props.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_PLAN_MONTH_WORKLOAD_MEMBER_LIST);
            }
        }
        if (newProps.api[ConstantURL.API_URL_POST_PLAN_MONTH_WORKLOAD_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_POST_PLAN_MONTH_WORKLOAD_SAVE];
            let input_list = Object.assign({}, this.state.input_list);
            let map = this.state.map;
            let staff_id = response.info?.args?.staff_id;
            if (response.code === Constant.CODE_SUCCESS) {
                Object.keys(map).forEach((name) => {
                    input_list[staff_id + name] = false;
                    input_list[staff_id + name + '_error'] = false;
                });
                this.props.uiAction.refreshList('PlanMonthWork',{update: true});
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_PLAN_MONTH_WORKLOAD_SAVE);
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
                    let total = parseInt(item.result.total_call_quantity) + parseInt(item.result.total_customer_quantity) + parseInt(item.result.total_email_quantity);
                    let old_customer_quantity = input_list[staff_id + "old_customer_quantity_value"] ? input_list[staff_id + "old_customer_quantity_value"] : item.result.old_customer_quantity;
                    let new_customer_quantity = input_list[staff_id + "new_customer_quantity_value"] ? input_list[staff_id + "new_customer_quantity_value"] : item.result.new_customer_quantity;
                    let old_call_quantity = input_list[staff_id + "old_call_quantity_value"] ? input_list[staff_id + "old_call_quantity_value"] : item.result.old_call_quantity;
                    let new_call_quantity = input_list[staff_id + "new_call_quantity_value"] ? input_list[staff_id + "new_call_quantity_value"] : item.result.new_call_quantity;
                    let old_email_quantity = input_list[staff_id + "old_email_quantity_value"] ? input_list[staff_id + "old_email_quantity_value"] : item.result.old_email_quantity;
                    let new_email_quantity = input_list[staff_id + "new_email_quantity_value"] ? input_list[staff_id + "new_email_quantity_value"] : item.result.new_email_quantity;
                    let data = {
                        total: utils.formatNumber(total, 0, ".", ""),
                        old_customer_quantity: utils.formatNumber(old_customer_quantity, 0, ".", ""),
                        new_customer_quantity: utils.formatNumber(new_customer_quantity, 0, ".", ""),
                        total_customer_quantity: utils.formatNumber(item.result.total_customer_quantity, 0, ".", ""),
                        old_call_quantity: utils.formatNumber(old_call_quantity, 0, ".", ""),
                        new_call_quantity: utils.formatNumber(new_call_quantity, 0, ".", ""),
                        total_call_quantity: utils.formatNumber(item.result.total_call_quantity, 0, ".", ""),
                        old_email_quantity: utils.formatNumber(old_email_quantity, 0, ".", ""),
                        new_email_quantity: utils.formatNumber(new_email_quantity, 0, ".", ""),
                        total_email_quantity: utils.formatNumber(item.result.total_email_quantity, 0, ".", ""),
                    };
                    return(
                        <tr key={key}>
                            <td colSpan={3}>
                                <div className="cell">
                                    <span title={item.email}>{item.email}</span>
                                </div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total}>{data.total}</div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "old_customer_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "old_customer_quantity"] ? (
                                        <span title={data.old_customer_quantity}>{data.old_customer_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "old_customer_quantity_error"]}
                                                    value={old_customer_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + "old_customer_quantity_value"] = value;
                                                        item.result.old_customer_quantity = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "new_customer_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "new_customer_quantity"] ? (
                                        <span title={data.new_customer_quantity}>{data.new_customer_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "new_customer_quantity_error"]}
                                                    value={new_customer_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + "new_customer_quantity_value"] = value;
                                                        item.result.new_customer_quantity = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_customer_quantity}>{data.total_customer_quantity}</div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id,"old_call_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "old_call_quantity"] ? (
                                        <span title={data.old_call_quantity}>{data.old_call_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "old_call_quantity_error"]}
                                                    value={old_call_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + "old_call_quantity_value"] = value;
                                                        item.result.old_call_quantity = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "new_call_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "new_call_quantity"] ? (
                                        <span title={data.new_call_quantity}>{data.new_call_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "new_call_quantity_error"]}
                                                    value={new_call_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + "new_call_quantity_value"] = value;
                                                        item.result.new_call_quantity = value;
                                                    }}
                                                    onEnter={()=> {
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_call_quantity}>{data.total_call_quantity}</div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "old_email_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "old_email_quantity"] ? (
                                        <span title={data.old_email_quantity}>{data.old_email_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "old_email_quantity_error"]}
                                                    value={old_email_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + "old_email_quantity_value"] = value;
                                                        item.result.old_email_quantity = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "new_email_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "new_email_quantity"] ? (
                                        <span title={data.new_email_quantity}>{data.new_email_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "new_email_quantity_error"]}
                                                    value={new_email_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + "new_email_quantity_value"] = value;
                                                        item.result.new_email_quantity = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list);
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_email_quantity}>{data.total_email_quantity}</div>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanMonthWorkMember);
