import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import CanAction from "components/Common/Ui/CanAction";
import CanRender from "components/Common/Ui/CanRender";

import {approveCustomerAccountant, deleteCustomerAccountant} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import * as utils from "utils/utils";
import {publish} from "utils/event";

import PopupCustomer from "../Popup/PopupCustomer";
import PopupRejectCustomer from "../Popup/PopupRejectCustomer";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: props.object
		};
		this.btnEdit = this._btnEdit.bind(this);
		this.btnApprove = this._btnApprove.bind(this);
		this.btnReject = this._btnReject.bind(this);
		this.btnDelete = this._btnDelete.bind(this);
		this.showPopup = this._showPopup.bind(this);
	}

	_btnEdit() {
		const {uiAction, history, idKey} = this.props;
		uiAction.createPopup(PopupCustomer, "Chỉnh Sửa Khách Hàng Kế Toán", {object: this.state.object, idKey:idKey});
		const query = queryString.parse(window.location.search);
		query.action_active = "edit";
		history.push(`?${queryString.stringify(query)}`);
	}

	_btnApprove() {
		const {uiAction, idKey} = this.props;
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn duyệt KHKT ?",
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				uiAction.showLoading();
				const res = await approveCustomerAccountant({id: this.state.object.id});
				if(res){
					uiAction.hideSmartMessageBox();
					uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey)
				}
				uiAction.hideLoading();
			}
		});
	}

	_btnReject() {
		const {uiAction, idKey} = this.props;
		const title = "Không duyệt KHKT";
		uiAction.createPopup(PopupRejectCustomer, title, {object: this.state.object, idKey: idKey});
	}

	_btnDelete() {
		const {uiAction, idKey} = this.props;
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn xóa KHKT ?",
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				uiAction.showLoading();
				const res = await deleteCustomerAccountant({id: this.state.object.id});
				if(res){
					uiAction.hideSmartMessageBox();
					uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey)
				}
				uiAction.hideLoading();
			}
		});
	}

	_showPopup() {
		let query = queryString.parse(window.location.search);
		if (query.action_active) {
			switch (query.action_active) {
			case "edit":
				this.btnEdit();
				break;
			default:
				break;
			}
		}
	}

	componentDidMount() {
		this.showPopup();
	}

	render() {
		let {object} = this.state;
		let status = parseInt(object.status);

		let keyPress = [];
		if (status) {
			if (![Constant.STATUS_DELETED].includes(status)) {
				keyPress.push("1");
				keyPress.push("4");
			}
			if ([Constant.STATUS_INACTIVED].includes(status)) {
				keyPress.push("2");
				keyPress.push("3");
			}
		}

		return (
			<div className="content-box">
				<div className="row mt10">
					<div className="col-sm-5 col-xs-5">
						<div className="col-sm-12 col-xs-12 row-content row-title padding0">
							<span>Thông tin KHKT</span>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Thuế xuất</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{utils.formatNumber(object.vat_percent, 0, ".", "%")}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Loại KHKT</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{parseInt(object.internal) === 1 ? "Nội bộ" : "Khách hàng"}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Lý do không duyệt</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{object.reason_cancel} &nbsp;
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Email nhận hóa đơn</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{object.email_e_invoices.join(", ")} &nbsp;
							</div>
						</div>
					</div>
					<div className="col-sm-12 col-xs-12 mt15">
						{keyPress.includes("1") && (
							<CanAction actionCode={ROLES.accountant_accountant_customer_update}>
								<button type="button" className="el-button el-button-primary el-button-small"
									onClick={this.btnEdit}>
									<span>Chỉnh sửa</span>
								</button>
							</CanAction>
						)}
						<CanRender actionCode={ROLES.accountant_accountant_customer_change_status}>
							{keyPress.includes("2") && (
								<button type="button" className="el-button el-button-success el-button-small"
									onClick={this.btnApprove}>
									<span>Duyệt</span>
								</button>
							)}
							{keyPress.includes("3") && (
								<button type="button" className="el-button el-button-bricky el-button-small"
									onClick={this.btnReject}>
									<span>Không duyệt</span>
								</button>
							)}
						</CanRender>
						<CanRender actionCode={ROLES.accountant_accountant_customer_delete}>
							{keyPress.includes("4") && (
								<button type="button" className="el-button el-button-bricky el-button-small"
									onClick={this.btnDelete}>
									<span>Xóa</span>
								</button>
							)}
						</CanRender>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		sys: state.sys,
		api: state.api,
		refresh: state.refresh,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(index);
