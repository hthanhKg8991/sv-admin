import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import { bindActionCreators } from "redux";

import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";

import {getTeamMember} from "api/auth";
import {getListBox} from "api/booking";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			params: {},
			box_list: [],
			staff_list: []
		};
		this.getBoxList = this._getBoxList.bind(this);
		this.onSearch = this._onSearch.bind(this);
		this.getCustomerCare = this._getCustomerCare.bind(this);
	}

	async _getBoxList() {
		const res = await getListBox({});
		this.setState({ box_list: res });
	}

	async _getCustomerCare() {

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
	_onSearch(params) {
		if (JSON.stringify(params) !== JSON.stringify(this.state.params)) {
			params.page = 1;
		}
		this.setState({ params: params });
		this.props.history.push(window.location.pathname + "?" + queryString.stringify(params));
		this.props.uiAction.refreshList("AccBookingPage");
	}
	componentDidMount() {
		this.props.uiAction.refreshList("AccBookingPage");
		this.getBoxList();
		this.getCustomerCare();
	}
	
	render() {
		let { box_list, staff_list } = this.state;
		let booking_status = utils.convertArrayValueCommonData(
			this.props.sys.common.items,
			Constant.COMMON_DATA_KEY_booking_status
		);
		let area_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_area);
		area_list = area_list.filter((c) => parseInt(c.value) !== Constant.AREA_ALL);
		return (
			<BoxSearch showQtty={4} onChange={this.onSearch}>
				<SearchField type="input" label="ID đặt chổ, ID NTD, email NTD" name="q" timeOut={1000} />
				<SearchField type="dropbox" label="Trạng thái" name="booking_status" data={booking_status} />
				<SearchField type="dropbox" label="Khu vực hiển thị" name="displayed_area" data={area_list} />
				<SearchField
					type="dropbox"
					label="Gói dịch vụ"
					name="booking_box_id"
					data={box_list}
					key_value="id"
					key_title="name"
				/>
				<SearchField type="datetimerangepicker" label="Ngày đặt chổ" name="created_at" />
				<SearchField
					type="dropboxmulti"
					label="CSKH"
					name="staff_id"
					key_value="id"
					key_title="login_name"
					data={staff_list}
				/>
			</BoxSearch>
		);
	}
}

function mapStateToProps(state) {
	return {
		sys: state.sys,
		api: state.api,
		user: state.user
	};
}
function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
