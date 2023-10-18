import React, {Component} from "react";
import {connect} from "react-redux";
import config from "config";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
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
	}
	_onSearch(params){
		if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
			params.page = 1;
		}
		this.setState({params: params});
		this.props.history.push(window.location.pathname + "?" + queryString.stringify(params));
		this.props.uiAction.refreshList("SalesOrderRequestPage");
	}
	_getCustomerCare(){
		let division_code = this.props.user ? this.props.user.division_code : "";
		let args = {};
		args["division_code_list[0]"] = Constant.DIVISION_TYPE_customer_care_member;
		if(division_code !== Constant.DIVISION_TYPE_customer_care_member) {
			args["division_code_list[1]"] = Constant.DIVISION_TYPE_customer_care_leader;
		}
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_TEAM_MEMBER_LIST, args);
	}
	componentWillMount(){
		let params = queryString.parse(window.location.search);
		params["status"] = params["status"] ? params["status"] : Constant.STATUS_INACTIVED;
		this.props.history.push(window.location.pathname + "?" + queryString.stringify(params));
		this.setState({params: params});
		this.getCustomerCare();
		this.props.uiAction.refreshList("SalesOrderRequestPage");
	}
	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]){
			let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({staff_list: response.data});
			}
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		let {staff_list} = this.state;
		return (
			<BoxSearch showQtty={4} onChange={this.onSearch}>
				<SearchField type="input" label="Mã phiếu, mã - tên NTD" name="q" timeOut={1000}/>
				<SearchField type="datetimerangepicker" label="Ngày đăng ký" name="created_at" />
				<SearchField type="datetimerangepicker" label="Ngày duyệt" name="approve_at" />
				<SearchField type="dropboxmulti" label="CSKH" name="staff_id" key_value="id" key_title="login_name" data={staff_list}/>
			</BoxSearch>
		)
	}
}

function mapStateToProps(state) {
	return {
		api: state.api,
		sys: state.sys,
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
