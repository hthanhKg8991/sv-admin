import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";

import {FilterLeft, SearchField} from "components/Common/Ui";

import {getTeamMember} from "api/auth";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			params: {},
			staff_list: []
		};
		this.getCustomerCare = this._getCustomerCare.bind(this);
	}
	async _getCustomerCare(){
		let division_code = this.props.user ? this.props.user.division_code : "";

		const res = await getTeamMember({
			division_code_list: division_code !== Constant.DIVISION_TYPE_customer_care_member
				? [
					Constant.DIVISION_TYPE_customer_care_member,
					Constant.DIVISION_TYPE_customer_care_leader,
				]
				: [
					Constant.DIVISION_TYPE_customer_care_member,
				]
		});

		if (res) {
			this.setState({
				staff_list: res
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(JSON.stringify(nextState) === JSON.stringify(this.state));
	}

	componentDidMount(){
		this.getCustomerCare()
	}

	render () {
		const {query, menuCode, idKey} = this.props;
		let {staff_list} = this.state;
		let invoice_issuance_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_invoice_issuance_method);
		let sales_order_opportunity = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_opportunity);
		const commonSaleStatus = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_status_v2);
		const payment_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_payment_status);
		const payment_debt_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_payment_debt_status);
		const request_approve_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_request_approve_status);
		const type_campaign = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_type_campaign);
		let sales_order_status = commonSaleStatus.filter(_ => _?.value !== Constant.STATUS_DELETED);
		const now = moment();
		const ranges = {
			"Hết hạn trong 3 ngày": [now, moment().add(3-1, "days")],
			"Hết hạn trong 7 ngày": [now, moment().add(7-1, "days")],
			"Hết hạn trong 15 ngày": [now, moment().add(15-1, "days")],
			"Hết hạn trong 30 ngày": [now, moment().add(30-1, "days")],
			"Hết hạn trong 60 ngày": [now, moment().add(60-1, "days")],
			"Hết hạn trong 90 ngày": [now, moment().add(90-1, "days")],
		};
		let division_code = this.props.user ? this.props.user.division_code : "";
		//Bộ lọc PĐK với kế toán công nợ
		if (!query.status && division_code === Constant.DIVISION_TYPE_accountant_liabilities){
			query.status = Constant.SALES_ORDER_V2_STATUS_SUBMITTED;
			query.confirm_payment_status = Constant.PAYMENT_DEBT_STATUS_SUBMITTED;
		}
		// Bộ lọc PĐK với kế toán duyệt phiếu
		if (!query.status && division_code === Constant.DIVISION_TYPE_accountant_service_control){
			query.status = Constant.SALES_ORDER_V2_STATUS_CONFIRMED;
		}

		return (
			<FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
				<SearchField type="input" label="Mã phiếu, ID/Email NTD" name="q" timeOut={1000}/>
				<SearchField type="dropbox" label="Trạng thái phiếu" name="status" data={sales_order_status}/>
				<SearchField type="dropbox" label="Trạng thái thanh toán" name="payment_status" data={payment_status}/>
				<SearchField type="dropbox" label="Trạng thái công nợ" name="payment_debt_status" data={payment_debt_status}/>
				<SearchField type="dropbox" label="Yêu cầu chờ duyệt" name="request_approve_status" data={request_approve_status}/>
				<SearchField type="dropbox" label="Loại phiếu" name="type_campaign" data={type_campaign}/>
				<SearchField type="datetimerangepicker" label="Ngày duyệt phiếu" name="approved_at" />
				<SearchField type="datetimerangepicker" label="Ngày tạo phiếu" name="created_at" />
				<SearchField type="datetimerangepicker" label="Ngày hết hạn" name="expired_at" ranges={ranges}/>
				<SearchField type="dropbox" label="Xuất hóa đơn" name="invoice_issuance_method" data={invoice_issuance_method}/>
				<SearchField type="dropbox" label="Opportunity" name="sales_order_opportunity" data={sales_order_opportunity}/>
				<SearchField type="dropboxmulti" label="CSKH" name="assigned_staff_id" key_value="id" key_title="login_name" data={staff_list}/>
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
