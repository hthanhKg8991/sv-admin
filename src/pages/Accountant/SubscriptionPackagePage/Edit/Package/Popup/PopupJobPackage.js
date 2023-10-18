import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment-timezone";
import {bindActionCreators} from "redux";

import Dropbox from "components/Common/InputValue/Dropbox";
import Input2 from "components/Common/InputValue/Input2";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {createSubscriptionItem, getListPriceRunning} from "api/saleOrder";
import {getDetailSKU} from "api/system";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupJobPackage extends Component {
	constructor(props) {
		super(props);
		const {channel_code} = props.branch.currentBranch;
		const configForm = getConfigForm(channel_code, "CustomerCare.SalesOrderEditPage.Popup");
		this.state = {
			object: {},
			object_required: ["service_code", "quantity", "displayed_area", "displayed_method", "week_quantity", "sku_code", "type_campaign"],
			object_error: {},
			name_focus: "",
			package_running: [],
			configForm: configForm,
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.onChangeService = this._onChangeService.bind(this);
	}

	async _onSave(data) {
		const {uiAction} = this.props;
		this.setState({object_error: {}});
		this.setState({name_focus: ""});

		let object = Object.assign({}, data);
		let object_required = this.state.object_required;
		if (object.effect_code) {
			object_required = object_required.concat(["effect_week_quantity"]);
		}

		let check = utils.checkOnSaveRequired(object, object_required);
		if (check.error) {
			this.setState({name_focus: check.field});
			this.setState({object_error: check.fields});

			if (check.fields.sku_code) {
				uiAction.putToastError("Mã SKU tin là thông tin bắt buộc")
			}

			if (check.fields.sku_code_effect) {
				uiAction.putToastError("Mã SKU hiệu ứng là thông tin bắt buộc")
			}

			return;
		}
		let error = {};
		if (parseInt(object.quantity) <= 0) {
			error["quantity"] = ":attr_name không hợp lệ.";
		}

		if (!(Object.entries(error).length === 0)) {
			this.setState({object_error: error});
			return;
		}

		object.combo_id = this.props.id;
		// object.type_campaign = this.props.type_campaign;
		object.service_type = Constant.SERVICE_TYPE_JOB_BOX;
		this.props.uiAction.showLoading();
		const res = await createSubscriptionItem(object);
		if (res) {
			this.props.uiAction.deletePopup();
			uiAction.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, Constant.IDKEY_JOB_PACKAGE);
		}
		this.props.uiAction.hideLoading();
	}

	_onChange(value, name) {
		let object_error = this.state.object_error;
		delete object_error[name];
		this.setState({object_error: object_error});
		this.setState({name_focus: ""});
		let object = Object.assign({}, this.state.object);
		if (name === "effect_code" && !value) {
			delete object.effect_code;
			delete object.effect_start_date;
			delete object.effect_week_quantity;
			delete object.effect_day_quantity;
		} else {
			object[name] = value;
		}
		this.setState({object: object});
	}

	async _onChangeService(value, name) {
		const {object} = this.state;
		if (value) {
			// sku_code
			const resService = await getDetailSKU({service_code: value});
			this.setState({
				object: {
					...object,
					sku_code: resService?.sku_code,
				}
			});
		} else {
			object.sku_code = null;
			this.setState({object: object});
		}
		this.onChange(value, name);
	}

	async _getPackageRunning() {
		const res = await getListPriceRunning({service_type: [Constant.SERVICE_TYPE_JOB_BOX]});
		if (res && Array.isArray(res)) {
			const packages = res.map(p => p?.service_code);
			this.setState({package_running: packages});
		}
	}

	componentDidMount() {
		this._getPackageRunning();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
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
		const {
			object,
			object_error,
			object_required,
			name_focus,
			package_running,
		} = this.state;
		const channel_code = this.props.branch.currentBranch.channel_code;
		const box_code_list = this.props.sys.service.items.filter(c =>
			c.channel_code === channel_code &&
            c.service_type === Constant.SERVICE_TYPE_JOB_BOX &&
            package_running.includes(c.code) // kiểm tra các gói đang chạy trong bảng giá
		);

		const area = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_area);
		const display_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_display_method);
		const bundles_type_campaign = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_BUNDLES_TYPE_CAMPAIGN);

		return (
			<form onSubmit={(event) => {
				event.preventDefault();
				this.onSave(object);
			}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container row">
							<div className="col-sm-12 col-xs-12 sub-title-form mb10">
								<span>Tin tính phí</span>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Dropbox name="service_code" label="Gói dịch vụ" data={box_code_list}
									required={object_required.includes("service_code")}
									key_value="code" key_title="name"
									error={object_error.service_code} value={object.service_code}
									nameFocus={name_focus}
									onChange={this.onChangeService}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-4 col-xs-12 mb10">
									<Input2 type="text" name="quantity" label="Số tin" isNumber
										required={object_required.includes("quantity")}
										error={object_error.quantity} value={object.quantity}
										nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-4 col-xs-12 mb10">
									<Dropbox name="displayed_area" label="Khu vực hiển thị" data={area}
										required={object_required.includes("displayed_area")}
										error={object_error.displayed_area} value={object.displayed_area}
										nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-4 col-xs-12 mb10">
									<Dropbox name="displayed_method" label="Hình thức hiển thị" data={display_method}
										required={object_required.includes("displayed_method")}
										error={object_error.displayed_method} value={object.displayed_method}
										nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-6 col-xs-12 mb10">
									<Input2 type="text" name="week_quantity" label="TG DV (tuần)" isNumber
										required={object_required.includes("week_quantity")}
										error={object_error.week_quantity} value={object.week_quantity}
										nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-6 col-xs-12 mb10">
									<Input2 type="text" name="sku_code" label="Mã SKU"
										required={object_required.includes("sku_code")}
										value={object.sku_code} readOnly/>
								</div>
								<div className="col-sm-12 col-xs-12 padding0">
									<div className="col-sm-6 col-xs-12 mb10">
										<Input2 type="text" name="discount_rate" label="Chiết Khấu (%)" isNumber
											suffix=" %"
											error={object_error.discount_rate} value={object.discount_rate}
											required={object_required.includes("discount_rate")}
											nameFocus={name_focus}
											onChange={this.onChange}
										/>
									</div>
									<div className="col-sm-6 col-xs-12 mb10">
										<Input2 type="text" name="promotion_rate" label="Khuyến mãi (%)" isNumber
											suffix=" %"
											error={object_error.promotion_rate} value={object.promotion_rate}
											required={object_required.includes("promotion_rate")}
											nameFocus={name_focus}
											onChange={this.onChange}
										/>
									</div>
									<div className="col-sm-4 col-xs-12 mb10">
										<Dropbox name="type_campaign" label="Loại gói" data={bundles_type_campaign}
											required={object_required.includes("type_campaign")}
											error={object_error.type_campaign} value={object.type_campaign}
											nameFocus={name_focus}
											onChange={this.onChange}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr className="v-divider margin0"/>
					<div className="v-card-action">
						<button type="submit" className="el-button el-button-success el-button-small">
							<span>Lưu</span>
						</button>
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
		branch: state.branch
	};
}

function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupJobPackage);
