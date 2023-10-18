import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanTargetInWeekMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
        };
        this.refreshList = this._refreshList.bind(this);
    }
    _refreshList(delay = 0, update = false){
        let params = queryString.parse(window.location.search);
        params['team_id'] = this.props.id;
        params['week'] = moment().week();
        if (!update) {
            this.setState({loading: true});
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_WEEK_DETAIL, params, delay);
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_WEEK_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_WEEK_DETAIL];
            if (response.info?.args?.team_id === this.props.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_WEEK_DETAIL);
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
                        total_quantity: utils.formatNumber(item.total_quantity, 0, ".", ""),
                        total_value: utils.formatNumber(item.total_value, 0, ".", "đ"),
                        absolute_quantity: utils.formatNumber(item.absolute_quantity, 0, ".", ""),
                        absolute_value: utils.formatNumber(item.absolute_value, 0, ".", "đ"),
                        potential_quantity: utils.formatNumber(item.potential_quantity, 0, ".", ""),
                        potential_value: utils.formatNumber(item.potential_value, 0, ".", "đ"),
                        full_attempt_quantity: utils.formatNumber(item.full_attempt_quantity, 0, ".", ""),
                        full_attempt_value: utils.formatNumber(item.full_attempt_value, 0, ".", "đ"),
                    };
                    return(
                        <tr key={key}>
                            <td colSpan={3}>
                                <div className="cell" title={moment.unix(item.date).format("DD/MM/YYYY")}>{moment.unix(item.date).format("DD/MM/YYYY")}</div>
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
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanTargetInWeekMember);
