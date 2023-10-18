import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import BoxSearchRow from "components/Common/Ui/BoxSearch/Row";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import queryString from 'query-string';
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";

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
        this.props.uiAction.refreshList('StatisticEmployerCompanySizePage');
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
        this.getCustomerCare();
        this.getTeamCustomerCare();
        this.props.uiAction.refreshList('StatisticEmployerCompanySizePage');
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
        let {team_list} = this.state;
        return (
            <BoxSearchRow showQtty={4} onChange={this.onSearch}>
                <SearchField type="dropbox" label="Nhóm CSKH" name="team_id" key_value="id" key_title="name" data={team_list}/>
            </BoxSearchRow>
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
