import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Dropbox from "components/Common/InputValue/Dropbox";
import config from 'config';
import Input2 from "components/Common/InputValue/Input2";
import { publish } from "utils/event";
import { createEmployerFreemium } from "api/employer";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
class PopupAddEmployerFreemium extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: {},
			object_required: ['employer_id', 'reason'],
			object_error: {},
			name_focus: "",
			employer_list: []
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.getListEmployer = this._getListEmployer.bind(this);
	}

	async _onSave(data) {
		this.setState({ object_error: {}, loading: true, name_focus: "" });
		let object = Object.assign({}, data);
		let object_required = this.state.object_required;

		let check = utils.checkOnSaveRequired(object, object_required);
		if (check.error || (object?.reason?.length || 0) < 5) {
			if (object?.reason?.length < 5) {
				check.fields.reason = Constant.MSG_MIN_CHARATER_5
			}
			this.setState({ name_focus: check.field, loading: false, object_error: check.fields });
			return;
		}

		const fnApi = createEmployerFreemium;
		const res = await fnApi(object);
		if (res) {
			this.props.uiAction.putToastSuccess("Thao tác thành công!");
			this.props.uiAction.deletePopup();
			publish(".refresh", {}, Constant.IDKEY_EMPLOYER_FREEMIUM_LIST);
		} else {
			this.setState({ object_error: Object.assign({}, res), loading: false });
		}
	}

	_onChange(value, name) {
		let object_error = this.state.object_error;
		if (name === "reason" && value?.length < 5) {
			object_error.reason = Constant.MSG_MIN_CHARATER_5
		} else {
			delete object_error[name];
		}
		this.setState({ object_error: object_error });
		this.setState({ name_focus: "" });
		let object = Object.assign({}, this.state.object);
		object[name] = value;
		this.setState({ object: object });
	}

	_getListEmployer(value) {
		this.setState({ loading_getEmployer: true });
		let args = {
			q: value,
			status_not: Constant.STATUS_DELETED,
			per_page: 10,
			page: 1
		};
		this.setState({ loading: false });
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, args);
	}

	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST]) {
			let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				let employer_list = [];
				response.data.items.forEach((item) => {
					employer_list.push({
						value: item.id,
						title: item.id + ' - ' + item.email + " - " + item.name,
						item: item
					});
				});
				this.setState({ employer_list: employer_list });
			}
			this.setState({ loading_getEmployer: false });
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_LIST);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(JSON.stringify(nextState) === JSON.stringify(this.state));
	}

	render() {
		if (this.state.loading) {
			return (
				<div className="dialog-popup-body">
					<div className="form-container">
						<div className="popupContainer text-center">
							<LoadingSmall />
						</div>
					</div>
				</div>
			)
		}
		const { object, object_required, object_error, employer_list, name_focus, loading_getEmployer } = this.state;

		return (
			<form onSubmit={(event) => {
				event.preventDefault();
				this.onSave(object);
			}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container row">
							<div className="col-sm-12 col-xs-12 mb10">
								<Dropbox name="employer_id"
									label="Nhà tuyển dụng"
									data={employer_list}
									required={object_required.includes('employer_id')}
									error={object_error.employer_id}
									value={object.employer_id}
									nameFocus={name_focus}
									onChange={this.onChange}
									timeOut={1000} loading={loading_getEmployer}
									onChangeTimeOut={this.getListEmployer}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2 type="text" name="reason" label="Lý do"
									required={object_required.includes('reason')}
									error={object_error.reason} value={object.reason}
									nameFocus={name_focus}
									onChange={this.onChange}
								/>
							</div>
						</div>
					</div>
					<hr className="v-divider margin0" />
					<div className="v-card-action">
						<button type="submit" className="el-button el-button-success el-button-small">
							<span>Lưu</span>
						</button>
						<button type="button" className="el-button el-button-primary el-button-small" onClick={() => this.props.uiAction.deletePopup()}>
							<span>Đóng</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddEmployerFreemium);
