import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import config from 'config';
import moment from 'moment-timezone';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {},
            team_list: [],
            staff_list: []
        };
        this.onSearch = this._onSearch.bind(this);
        this.getCustomerCare = this._getCustomerCare.bind(this);
        this.getTeamCustomerCare = this._getTeamCustomerCare.bind(this);
    }
    _onSearch(params){
        if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
            params.page = 1;
        }
        this.setState({params: params});
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.props.uiAction.refreshList('PlanDailyRevenuePage');
    }
    _getCustomerCare(){
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {};
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if(division_code !== Constant.DIVISION_TYPE_customer_care_member) {
            args['division_code_list[1]'] = Constant.DIVISION_TYPE_customer_care_leader;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_TEAM_MEMBER_LIST, args);
    }
    _getTeamCustomerCare(){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_TEAM_LIST);
    }
    componentWillMount(){
        let params = queryString.parse(window.location.search);
        params['date[from]'] = params['date[from]'] ? params['date[from]'] : moment().unix();
        params['date[to]'] = params['date[to]'] ? params['date[to]'] : moment().unix();
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.setState({params: params});
        this.getCustomerCare();
        this.getTeamCustomerCare();
        this.props.uiAction.refreshList('PlanDailyRevenuePage');
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({team_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_LIST);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {params, team_list, staff_list} = this.state;
        staff_list = staff_list.filter(c => String(c.team_id) === String(params.team_id));
        let now = moment();
        let last = moment().subtract(1, 'days');
        let ranges = {
            'Hôm nay': [now, now],
            'Hôm qua': [last, last],
            '7 Ngày': [moment().subtract(6, 'days'), now],
            '1 Tháng': [moment().subtract(30, 'days'), now],
            '3 Tháng': [moment().subtract(90, 'days'), now],
            '6 Tháng': [moment().subtract(180, 'days'), now],
        };
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="dropbox" label="Nhóm CSKH" name="team_id" key_value="id" key_title="name" data={team_list}/>
                <SearchField type="dropboxmulti" label="CSKH" name="staff_id" key_value="id" key_title="login_name" data={staff_list}/>
                <SearchField type="datetimerangepicker" label="Ngày" name="date" ranges={ranges}/>
            </BoxSearch>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        user: state.user
    };
}
function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
