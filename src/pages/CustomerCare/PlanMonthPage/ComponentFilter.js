import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import config from 'config';
import moment from "moment";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

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
        this.props.uiAction.refreshList('PlanMonthPage');
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
        params['month_year'] = params['month_year'] ? params['month_year'] : moment().format("MM/YYYY");
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
        this.setState({params: params});
        this.getCustomerCare();
        this.getTeamCustomerCare();
        this.props.uiAction.refreshList('PlanMonthPage');
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
    render () {
        let {params, team_list, staff_list} = this.state;
        staff_list = staff_list.filter(c => String(c.team_id) === String(params.team_id));
        let months = utils.getListMonthInYear();
        return (
            <BoxSearch showQtty={4} onChange={this.onSearch}>
                <SearchField type="dropbox" label="Nhóm CSKH" name="team_id" key_value="id" key_title="name" data={team_list}/>
                <SearchField type="dropboxmulti" label="CSKH" name="staff_id" key_value="id" key_title="login_name" data={staff_list}/>
                <SearchField type="dropbox" label="Tháng" name="month_year" data={months} noDelete/>
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
