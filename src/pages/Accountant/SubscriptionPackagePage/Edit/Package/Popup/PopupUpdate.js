import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment-timezone";
import {bindActionCreators} from "redux";

import Input2 from "components/Common/InputValue/Input2";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {updateSubscriptionItem} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import * as utils from "utils/utils";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupUpdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: props.object,
			object_required: ["name", "ordering"],
			object_error: {},
			name_focus: "",
		};

		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
	}

	async _onSave(data) {
		const {uiAction, idKey} = this.props;
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
			return;
		}

		if(Number(object.ordering) < 0) {
			uiAction.putToastError("Gái trị Sắp xếp lớn hơn bằng 0!");
			return;
		}
		uiAction.showLoading();
		const res = await updateSubscriptionItem({
			id: object.id,
			name: object.name,
			ordering: object.ordering,
		});
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, idKey);
		}
		uiAction.deletePopup();
		this.props.uiAction.hideLoading();
	}

	_onChange(value, name) {
		const {object_error} = this.state;
		delete object_error[name];
		this.setState({object_error: object_error});
		this.setState({name_focus: ""});
		let object = Object.assign({}, this.state.object);
		object[name] = value;
		this.setState({object: object});
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
		const {object, object_error, object_required, name_focus} = this.state;

		return (
			<form onSubmit={(event) => {
				event.preventDefault();
				this.onSave(object);
			}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container row">
							<div className="col-sm-12 col-xs-12 sub-title-form mb10">
								<span>Thay đổi tiêu đề</span>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2 type="text" name="name" label="Tiêu đề"
									required={object_required.includes("name")}
									error={object_error.name} value={object.name}
									nameFocus={name_focus}
									onChange={this.onChange}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2 type="text" name="ordering" label="Sắp xếp" isNumber
									required={object_required.includes("ordering")}
									error={object_error.ordering} value={object.ordering}
									nameFocus={name_focus}
									onChange={this.onChange}
								/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupUpdate);
