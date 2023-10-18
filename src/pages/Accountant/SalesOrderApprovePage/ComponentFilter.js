import React, {Component} from "react";
import {connect} from "react-redux";
import config from "config";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			params: {},
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
		this.props.uiAction.refreshList("SalesOrderApprovePage");
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
	componentDidMount(){
		this.props.uiAction.refreshList("SalesOrderApprovePage");
		this.getCustomerCare();
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

	render () {
		const {query, menuCode, idKey} = this.props;
		let {staff_list} = this.state;
		let invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_invoice_issuance_method);
		const commonSaleStatus = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_status);
		const sales_order_status = commonSaleStatus.filter(_ => _?.value !== Constant.STATUS_DELETED);
		const payment_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_payment_status);
		const request_approve_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_request_approve_status);
		const confirm_payment_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_confirm_payment_status);
		const sales_ops_approve_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_ops_approve_sales_order_status);

		return (
			<FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={5}>
				<SearchField type="input" label="Mã phiếu, ID/Email NTD" name="q" timeOut={1000}/>
				<SearchField type="dropbox" label="Trạng thái phiếu" name="status" data={sales_order_status}/>
				<SearchField type="dropbox" label="Trạng thái thanh toán" name="payment_status" data={payment_status}/>
				<SearchField type="dropbox" label="Yêu cầu chờ duyệt" name="request_approve_status" data={request_approve_status}/>
				<SearchField type="datetimerangepicker" label="Ngày tạo phiếu" name="created_at" />
				<SearchField type="dropbox" label="Yêu cầu chờ xác nhận thanh toán" name="confirm_payment_status" data={confirm_payment_status}/>
				<SearchField type="datetimerangepicker" label="Ngày duyệt phiếu" name="approved_at" />
				<SearchField type="dropbox" label="Xuất hóa đơn" name="invoice_issuance_method" data={invoice_issuance_method}/>
				<SearchField type="dropbox" label="CSKH" name="created_by" key_value="login_name" key_title="login_name" data={staff_list}/>
				<SearchField type="dropbox" label="Trạng thái Sales Ops duyệt phiếu" name="sales_ops_approve_status" data={sales_ops_approve_status}/>
			</FilterLeft>
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
