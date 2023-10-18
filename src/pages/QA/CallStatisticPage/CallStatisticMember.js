import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class CallStatisticMember extends Component {
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
        params['team_id'] = this.props.team_id;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_STATISTIC_MEMBER_LIST, params, delay);
        });
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_STATISTIC_MEMBER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_CALL_STATISTIC_MEMBER_LIST];
            if (response.info?.args?.team_id === this.props.team_id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_STATISTIC_MEMBER_LIST);
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
        let params = queryString.parse(window.location.search);
        Object.keys(params).forEach((item) => {
            if (item.indexOf("staff_id") >= 0){
                delete params[item];
            }
        });
        let url_history = this.props.is_qa ? Constant.BASE_URL_QA_CALL_HISTORY : Constant.BASE_URL_CALL_HISTORY;
        return(
            <React.Fragment>
                {data_list.map((item, key) => {
                    params['staff_id[0]'] = item.staff_id;
                    let url = url_history + "?" + queryString.stringify(params);
                    let data = {
                        line: item?.line,
                        success_call_quantity: utils.formatNumber(item.success_call_quantity, 0, ".", ""),
                        success_call_duration: item.success_call_duration,
                        not_answered_call_quantity: utils.formatNumber(item.not_answered_call_quantity, 0, ".", ""),
                        total_contract: utils.formatNumber(item.total_contract, 0, ".", ""),
                        incoming_call_quantity: utils.formatNumber(item.incoming_call_quantity, 0, ".", ""),
                        incoming_call_duration: item.incoming_call_duration,
                    };
                    return (
                        <tr key={key} className="active">
                            <td>
                                <div className="cell" title={item.staff_name}>{item.staff_name}</div>
                            </td>
                            {Object.keys(data).map((name, key) => {
                                return(
                                    <td key={key}>
                                        <div className="cell text-right" title={data[name]}>{data[name]}</div>
                                    </td>
                                )
                            })}
                            <td>
                                <div className="cell">
                                    <a href={url} target="_blank" rel="noopener noreferrer">Xem chi tiết</a>
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
        api: state.api,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(CallStatisticMember);
