import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import moment from 'moment-timezone';
import InputTable from "components/Common/InputValue/InputTable";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PlanTomorrowMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            input_list: {},
            map: {
                absolute_quantity: 'Số lượng chắc chắn có',
                absolute_value: 'Giá trị chắc chắn có',
                potential_quantity: 'Số lượng tiềm năng',
                potential_value: 'Giá trị tiềm năng',
                full_attempt_quantity: 'Số lượng nổ lực',
                full_attempt_value: 'Giá trị nổ lực',
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TOMORROW_DETAIL, params, delay);
    }
    _onDBClick(id, key){
        let input_list = Object.assign({}, this.state.input_list);
        input_list[id + key] = true;
        this.setState({input_list: input_list});
    }

    _updatePlan(item, object, key){
        let args = {
            sale_target_id: item.target[key].sale_target_id ? item.target[key].sale_target_id : 0,
            team_id: this.props.id,
            staff_id: item.id,
            master_kpi_code: key,
            date: moment().add(1, 'days').unix(),
            value: object[item.id + key + '_value_value'],
            quantity: object[item.id + key + '_quantity_value'],
        };
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TOMORROW_SAVE, args, 0, false);
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_TOMORROW_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TOMORROW_DETAIL];
            if (response.info?.args?.team_id === this.props.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TOMORROW_DETAIL);
            }
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_TOMORROW_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TOMORROW_SAVE];
            let input_list = Object.assign({}, this.state.input_list);
            let map = this.state.map;
            let {staff_id, master_kpi_code} = response.info.args;
            if (response.code === Constant.CODE_SUCCESS) {
                input_list[staff_id + master_kpi_code + '_value'] = false;
                input_list[staff_id + master_kpi_code + '_value_error'] = false;
                input_list[staff_id + master_kpi_code + '_quantity'] = false;
                input_list[staff_id + master_kpi_code + '_quantity_error'] = false;
                this.props.uiAction.refreshList('PlanTomorrow',{update: true});
                this.refreshList(0, true);
            }else{
                if (response.data) {
                    let msg = response.msg + "\n";
                    Object.keys(response.data).forEach((name) => {
                        input_list[staff_id + name + master_kpi_code +'_error'] = true;
                        let error = response.data[name].replace(":attr_name", map[master_kpi_code + '_' + name]);
                        msg = msg + error + "\n";
                    });
                    this.props.uiAction.putToastError(msg);
                }
            }
            this.setState({input_list: input_list});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TOMORROW_SAVE);
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
                    let staff_id = item.id;
                    let absolute_quantity = input_list[staff_id + 'absolute_quantity_value'] ? input_list[staff_id + 'absolute_quantity_value'] : item.target.absolute.quantity;
                    let absolute_value = input_list[staff_id + 'absolute_value_value'] ? input_list[staff_id + 'absolute_value_value'] : item.target.absolute.value;
                    let potential_quantity = input_list[staff_id + 'potential_quantity_value'] ? input_list[staff_id + 'potential_quantity_value'] : item.target.potential.quantity;
                    let potential_value = input_list[staff_id + 'potential_value_value'] ? input_list[staff_id + 'potential_value_value'] : item.target.potential.value;
                    let full_attempt_quantity = input_list[staff_id + 'full_attempt_quantity_value'] ? input_list[staff_id + 'full_attempt_quantity_value'] : item.target.full_attempt.quantity;
                    let full_attempt_value = input_list[staff_id + 'full_attempt_value_value'] ? input_list[staff_id + 'full_attempt_value_value'] : item.target.full_attempt.value;
                    let data = {
                        total_quantity: utils.formatNumber(item.target.total.quantity, 0, ".", ""),
                        total_value: utils.formatNumber(item.target.total.value, 0, ".", "đ"),
                        absolute_quantity: utils.formatNumber(absolute_quantity, 0, ".", ""),
                        absolute_value: utils.formatNumber(absolute_value, 0, ".", "đ"),
                        potential_quantity: utils.formatNumber(potential_quantity, 0, ".", ""),
                        potential_value: utils.formatNumber(potential_value, 0, ".", "đ"),
                        full_attempt_quantity: utils.formatNumber(full_attempt_quantity, 0, ".", ""),
                        full_attempt_value: utils.formatNumber(full_attempt_value, 0, ".", "đ"),
                    };
                    return(
                        <tr key={key}>
                            <td colSpan={3}>
                                <div className="cell" title={item.email}>{item.email}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_quantity}>{data.total_quantity}</div>
                            </td>
                            <td>
                                <div className="cell text-right" title={data.total_value}>{data.total_value}</div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "absolute_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "absolute_quantity"] ? (
                                        <span title={data.absolute_quantity}>{data.absolute_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "absolute_quantity_error"]}
                                                    value={absolute_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + 'absolute_quantity_value'] = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list, 'absolute');
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "absolute_value")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "absolute_value"] ? (
                                        <span title={data.absolute_value}>{data.absolute_value}</span>
                                    ) : (
                                        <InputTable isNumber suffix=" đ" className="w100 input-number"
                                                    error={input_list[staff_id + "absolute_value_error"]}
                                                    value={absolute_value}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + 'absolute_value_value'] = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list, 'absolute');
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id,"potential_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "potential_quantity"] ? (
                                        <span title={data.potential_quantity}>{data.potential_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "potential_quantity_error"]}
                                                    value={potential_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + 'potential_quantity_value'] = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list, 'potential');
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "potential_value")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "potential_value"] ? (
                                        <span title={data.potential_value}>{data.potential_value}</span>
                                    ) : (
                                        <InputTable isNumber suffix=" đ" className="w100 input-number"
                                                    error={input_list[staff_id + "potential_value_error"]}
                                                    value={potential_value}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + 'potential_value_value'] = value;
                                                    }}
                                                    onEnter={()=> {
                                                        this.updatePlan(item, input_list, 'potential');
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "full_attempt_quantity")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "full_attempt_quantity"] ? (
                                        <span title={data.full_attempt_quantity}>{data.full_attempt_quantity}</span>
                                    ) : (
                                        <InputTable isNumber className="w100 input-number"
                                                    error={input_list[staff_id + "full_attempt_quantity_error"]}
                                                    value={full_attempt_quantity}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + 'full_attempt_quantity_value'] = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list, 'full_attempt');
                                                    }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className="td-input" onDoubleClick={()=>{this.onDBClick(staff_id, "full_attempt_value")}}>
                                <div className="cell text-right">
                                    {!input_list[staff_id + "full_attempt_value"] ? (
                                        <span title={data.full_attempt_value}>{data.full_attempt_value}</span>
                                    ) : (
                                        <InputTable isNumber suffix=" đ" className="w100 input-number"
                                                    error={input_list[staff_id + "full_attempt_value_error"]}
                                                    value={full_attempt_value}
                                                    onChange={(value)=>{
                                                        input_list[staff_id + 'full_attempt_value_value'] = value;
                                                    }}
                                                    onEnter={()=>{
                                                        this.updatePlan(item, input_list, 'full_attempt');
                                                    }}
                                        />
                                    )}
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
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanTomorrowMember);
