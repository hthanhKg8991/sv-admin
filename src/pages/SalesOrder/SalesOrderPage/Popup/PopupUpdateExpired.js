import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";

import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import Dropbox from "components/Common/InputValue/Dropbox";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SpanCommon from "components/Common/Ui/SpanCommon";

import {updateExpiredSalesOrder} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as utils from "utils/utils";

class PopupUpdateExpired extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			object: {},
			object_required: ["status"],
			object_error: {},
			name_focus: "",
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.onClose = this._onClose.bind(this);
	}

	async _onSave(data) {
		const {item, idKey, uiAction} = this.props;
		const {object_required} = this.state;
		const object = Object.assign({}, data);
		if (object) {
			const check = utils.checkOnSaveRequired(object, object_required);
			if (check.error) {
				this.setState({name_focus: check.field});
				this.setState({object_error: check.fields});
				return;
			}
			uiAction.showLoading();
			const res = await updateExpiredSalesOrder({...object, id: item.id});
			if (res) {
				publish(".refresh", {}, idKey);
				uiAction.deletePopup();
				uiAction.putToastSuccess("Cập nhật thành công!");
			}
			this.setState({object_error: {}});
			this.setState({name_focus: ""});
			uiAction.hideLoading();
		}
	}

	_onChange(value, name) {
		const {object_error} = this.state;
		delete object_error[name];
		this.setState({object_error: object_error});
		this.setState({name_focus: ""});
		const object = Object.assign({}, this.state.object);
		object[name] = value;
		this.setState({object: object});
	}

	_onClose() {
		const {uiAction} = this.props;
		uiAction.deletePopup();
	}

	render() {
		if (this.state.loading) {
			return (
				<div className="dialog-popup-body">
					<div className="form-container">
						<div className="popupContainer text-center">
							<LoadingSmall/>
						</div>
					</div>
				</div>
			)
		}
		const {item} = this.props;
		const {object, object_error, object_required, name_focus} = this.state;
		const salesOrderStatus = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_status_v2);
		return (
			<form onSubmit={(event) => {
				event.preventDefault();
				this.onSave(object);
			}}>
				<div className="dialog-popup-body">
					<div className="row">
						<div className="col-xs-8 col-xs-offset-2 col-md-6 col-md-offset-3">
							<div className="popupContainer">
								<div className="form-container">
									<div className="row d-flex align-items-center mb10">
										<div className="col-md-3"/>
										<div className="col-md-4"><b>Hiện tại</b></div>
										<div className="col-md-5"><b>Điều chỉnh</b></div>
									</div>
									<div className="row d-flex align-items-center mb10">
										<div className="col-md-3">Trạng thái phiếu</div>
										<div className="col-md-4">
											<SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status_v2}
												value={item?.status} notStyle/>
										</div>
										<div className="col-md-5">
											<Dropbox name="status" label="Trạng thái" data={salesOrderStatus}
												required={object_required.includes("status")}
												value={object.status}
												error={object_error.status}
												nameFocus={name_focus}
												onChange={this.onChange}
											/>
										</div>
									</div>
									<div className="row d-flex align-items-center mb10">
										<div className="col-md-3">Hạn sử dụng</div>
										<div className="col-md-4">
											{item?.expired_at && moment.unix(item.expired_at).format("DD/MM/YYYY")}
										</div>
										<div className="col-md-5">
											<DateTimePicker name="expired_at" label="Ngày hạn hết"
												minDate={moment()}
												error={object_error.expired_at}
												value={object.expired_at}
												nameFocus={name_focus}
												onChange={this.onChange}
												required={object_required.includes("expired_at")}
											/>
										</div>
									</div>
								</div>
							</div>
							<hr className="v-divider margin0"/>
							<div className="v-card-action text-center">
								<button type="submit" className="el-button el-button-success el-button-small mr5">
									<span>Xác nhận</span>
								</button>
								<button type="button" className="el-button el-button-primary el-button-small ml5"
									onClick={this.onClose}>
									<span>Đóng</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		)
	}
}

function mapStateToProps(state) {
	return {
		sys: state.sys,
		api: state.api,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupUpdateExpired);
