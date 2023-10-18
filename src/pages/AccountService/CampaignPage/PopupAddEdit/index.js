import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Dropbox from "components/Common/InputValue/Dropbox";
import config from 'config';
import Input2 from "components/Common/InputValue/Input2";
import { publish } from "utils/event";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment";

import { createAccountServiceCampaign, updateAccountServiceCampaign } from "api/mix";
class PopupPostFreemium extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: {},
			object_required: ['name', 'employer_id', 'registration_account_service_id', 'job_id', 'start_at', 'end_at'],
			object_error: {},
			name_focus: "",
			employer_list: [],
			job_list: []
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.getListEmployer = this._getListEmployer.bind(this);
		this.getListRegAccountService = this._getListRegAccountService.bind(this);
	}

	async _onSave(data) {
		this.setState({ object_error: {}, loading: true, name_focus: "" });
		let object = Object.assign({}, data);
		let object_required = this.state.object_required;

		let check = utils.checkOnSaveRequired(object, object_required);
		if (check.error || (object?.name?.length || 0) < 5) {
			if (object?.name?.length < 5) {
				check.fields.name = Constant.MSG_MIN_CHARATER_5;
			}
			this.setState({ name_focus: check.field, loading: false, object_error: check.fields });
			return;
		}
		const fnApi = this.props.detail ? updateAccountServiceCampaign : createAccountServiceCampaign;
		const res = await fnApi(object);
		if (res) {
			this.props.uiAction.putToastSuccess("Thao tác thành công!");
			this.props.uiAction.deletePopup();
			publish(".refresh", {}, Constant.IDKEY_ACCOUNT_SERVICE_CAMPAIGN_LIST);
		} else {
			this.setState({ object_error: Object.assign({}, res), loading: false });
		}
	}

	_onChange(value, name) {
		let object_error = this.state.object_error;
		this.setState({ object_error: object_error });
		this.setState({ name_focus: "" });
		let object = Object.assign({}, this.state.object);
		if (name === "name") {
			if (value?.length < 5) {
				object_error.name = Constant.MSG_MIN_CHARATER_5;
			}
			else {
				delete object_error[name];
			}
		}
		else if (name === "employer_id") {
			this.getListRegAccountService(value);
		}
		else if (name === "registration_account_service_id") {
			const { reg_account_service_list } = this.state;
			const find = reg_account_service_list.find(item => item.value == value);
			if (find) {
				object["registration_account_service_name"] = value + "-" + Constant.NAME_ACCOUNT_SERVICE;
				object["job_id"] = find?.job_id;
				object["job_name"] = find?.job_name;
				object["start_at"] = find.start_at;
				object["end_at"] = find.end_at;
			}
		}
		object[name] = value;
		this.setState({ object: object });
	}

	_getListEmployer(value) {
		this.setState({ loading_getEmployer: true });
		let args = {
			q: value,
			status_not: [Constant.STATUS_DISABLED, Constant.STATUS_LOCKED, Constant.STATUS_DELETED],
			per_page: 10,
			page: 1,
		};
		this.setState({ loading: false });
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, args);
	}

	_getListRegAccountService(employer_id) {
		const prams = {
			employer_id,
			status: Constant.STATUS_ACTIVED,
			page: 1,
			per_page: 1000
		}
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_LIST_REG_ACCOUNT_SERVICE, prams);
	}
	componentDidMount() {
		const { detail } = this.props;
		if (detail) {
			if (detail?.employer_id) {
				this.getListEmployer(detail?.employer_id);
				this.getListRegAccountService(detail?.employer_id);
			}
			this.setState({
				object: {
					id: detail?.id,
					name: detail?.name,
					job_id: detail?.job_id,
					job_name: detail?.job_name,
					employer_id: detail?.employer_id,
					start_at: detail.start_at,
					end_at: detail.end_at,
					registration_account_service_id: detail.registration_account_service_id,
					note: detail.note,

				}
			})
		}
	}

	UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST]) {
			let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				let employer_list = [];
				response.data.items.forEach((item) => {
					employer_list.push({
						value: item.id,
						title: item.id + " - " + item.name,
						item: item
					});
				});
				this.setState({ employer_list: employer_list });
			}
			this.setState({ loading_getEmployer: false });
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_LIST);
		}
		if (newProps.api[ConstantURL.API_URL_GET_LIST_REG_ACCOUNT_SERVICE]) {
			let response = newProps.api[ConstantURL.API_URL_GET_LIST_REG_ACCOUNT_SERVICE];
			if (response.code === Constant.CODE_SUCCESS) {
				let reg_account_service_list = [];
				response.data.items.forEach((item) => {
					reg_account_service_list.push({
						value: item.id,
						title: item.id + " - " + Constant.NAME_ACCOUNT_SERVICE,
						job_id: item.job_id,
						job_name: item.cache_job_title,
						start_at: item.start_date,
						end_at: item.end_date
					});
				});
				this.setState({ reg_account_service_list: reg_account_service_list });
			}
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_REG_ACCOUNT_SERVICE);
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
		const { object, object_required, object_error, employer_list, reg_account_service_list, name_focus, loading_getEmployer } = this.state;
		return (
			<form onSubmit={(event) => {
				event.preventDefault();
				this.onSave(object);
			}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container row">
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2
									type="text"
									name="name"
									label="Tên Campaign"
									required={object_required.includes('name')}
									error={object_error.name} value={object.name}
									nameFocus={name_focus}
									onChange={this.onChange}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Dropbox
									name="employer_id"
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
								<Dropbox
									name="registration_account_service_id"
									label="Chọn gói Account Service"
									data={reg_account_service_list}
									required={object_required.includes('registration_account_service_id')}
									error={object_error.registration_account_service_id}
									value={object.registration_account_service_id}
									nameFocus={name_focus}
									onChange={this.onChange}
									timeOut={1000}
									onChangeTimeOut={this.getListEmployer}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2
									type="text"
									name="job_id"
									label="Tin tuyển dụng"
									required={object_required.includes('job_id')}
									error={object_error.job_id} value={object.job_id && (object.job_id + "-" + object.job_name)}
									nameFocus={name_focus}
									onChange={this.onChange}
									readOnly
								/>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2
									type="text"
									name="start_at"
									label="Thời gian bắt đầu"
									required={object_required.includes('start_at')}
									error={object_error.start_at} value={object.start_at && (isNaN(object.start_at) ? moment(object.start_at).format("DD-MM-YYYY") : moment.unix(object.start_at).format("DD-MM-YYYY"))}
									nameFocus={name_focus}
									onChange={this.onChange}
									readOnly
								/>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2
									type="text"
									name="end_at"
									label="Thời gian kết thúc"
									required={object_required.includes('end_at')}
									error={object_error.end_at} value={object.end_at && (isNaN(object.end_at) ? moment(object.end_at).format("DD-MM-YYYY") : moment.unix(object.end_at).format("DD-MM-YYYY"))}
									nameFocus={name_focus}
									onChange={this.onChange}
									readOnly
								/>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2
									type="text"
									name="note"
									label="Ghi chú"
									required={object_required.includes('note')}
									error={object_error.note} value={object.note}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupPostFreemium);
