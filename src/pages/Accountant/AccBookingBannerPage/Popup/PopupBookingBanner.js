/* eslint-disable react/no-deprecated */
//[UNUSED] MENU Đã OFF NOTE LẠI NẾU CONFIRM THÌ XÓA
import React,{Component} from "react";
import {connect} from "react-redux";
import config from "config";
import moment from "moment";
import {bindActionCreators} from "redux";

import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import Dropbox from "components/Common/InputValue/Dropbox";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";

class PopupBookingBanner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: {},
			object_required: ["service_code", "from_date", "to_date", "display_method","displayed_area", "staff_id", "employer_id"],
			object_error: {},
			name_focus: "",
			box_list:[],
			staff_list: [],
			employer_list: []
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.getBoxList = this._getBoxList.bind(this);
		this.getCustomerCare = this._getCustomerCare.bind(this);
		this.getListEmployer = this._getListEmployer.bind(this);
	}
	_onSave(object_input, object_required){
		this.setState({object_error: {}});
		this.setState({name_focus: ""});

		let object = Object.assign({}, object_input);
		let check = utils.checkOnSaveRequired(object, object_required);
		if (check.error) {
			this.setState({name_focus: check.field});
			this.setState({object_error: check.fields});
			return;
		}
		this.props.uiAction.showLoading();
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_BANNER_CREATE, object);
	}
	_onChange(value, name){
		let object_error = this.state.object_error;
		delete object_error[name];
		this.setState({object_error: object_error});
		this.setState({name_focus: ""});
		let object = Object.assign({},this.state.object);
		object[name] = value;
		if (name === "staff_id"){
			let customer = this.state.staff_list.filter(c => parseInt(c.id) === parseInt(value));
			if(customer.length) {
				object.staff_email = customer[0].email;
				object.staff_name = customer[0].login_name;
			}
		}
		if (name === "employer_id"){
			let employer = this.state.employer_list.filter(c => parseInt(c.value) === parseInt(value));
			if(employer.length) {
				object.employer_email = employer[0].item.email;
				object.employer_name = employer[0].item.name;
			}
		}
		this.setState({object: object});
	}
	_getBoxList(){
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOX_BANNER, {});
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
	_getListEmployer(value){
		this.setState({loading_getEmployer: true});
		let args = {
			q: value,
			status_not: Constant.STATUS_DELETED,
			per_page: 10,
			page: 1
		};
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, args);
	}
	componentWillMount(){
		this.getBoxList();
		this.getCustomerCare();
	}
	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_LIST_BOX_BANNER]) {
			let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOX_BANNER];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({box_list: response.data});
			}
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOX_BANNER);
		}
		if (newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST]){
			let response = newProps.api[ConstantURL.API_URL_GET_TEAM_MEMBER_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({staff_list: response.data});
			}
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEAM_MEMBER_LIST);
		}
		if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST]){
			let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				let employer_list = [];
				response.data.items.forEach((item) => {
					employer_list.push({
						value: item.id,
						title: item.id + " - " + item.email + " - " + item.name,
						item: item
					});
				});
				this.setState({employer_list: employer_list});
			}
			this.setState({loading_getEmployer: false});
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_LIST);
		}
		if (newProps.api[ConstantURL.API_URL_POST_BOOKING_BANNER_CREATE]){
			let response = newProps.api[ConstantURL.API_URL_POST_BOOKING_BANNER_CREATE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.deletePopup();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.props.uiAction.refreshList("AccBookingBannerPage");
			}else{
				this.setState({object_error: Object.assign({},response.data)});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_BOOKING_BANNER_CREATE);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		if (this.state.loading){
			return(
				<div className="dialog-popup-body">
					<div className="form-container">
						<div className="popupContainer text-center">
							<LoadingSmall />
						</div>
					</div>
				</div>
			)
		}
		let {object, object_error, object_required, name_focus, box_list, staff_list, loading_getEmployer, employer_list} = this.state;

		let display_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_display_method);
		let area = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_area);
		if(parseInt(object.page_type_id) === Constant.SERVICE_PAGE_TYPE_FIELD){
			object_required.push("job_field_id");
		}else{
			object_required = object_required.filter(c => c !== "job_field_id");
		}

		return (
			<form onSubmit={(event)=>{
				event.preventDefault();
				this.onSave(object, object_required);
			}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container row">
							<div className="col-sm-12 col-xs-12 mb10">
								<Dropbox name="service_code" label="Box" data={box_list} required={object_required.includes("service_code")}
									key_value="service_code" key_title="name"
									value={object.service_code} error={object_error.service_code} nameFocus={name_focus}
									onChange={this.onChange}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-6 col-xs-12 mb10">
									<Dropbox name="displayed_area" label="Khu vực hiển thị" data={area} required={object_required.includes("displayed_area")}
										error={object_error.displayed_area} value={object.displayed_area} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-6 col-xs-12 mb10">
									<Dropbox name="display_method" label="Hình thức hiển thị" data={display_method} required={object_required.includes("display_method")}
										error={object_error.display_method} value={object.display_method} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-6 col-xs-12 mb10">
									<DateTimePicker name="from_date" label="Ngày bắt đầu" required={object_required.includes("from_date")} minDate={moment()}
										error={object_error.from_date} value={object.from_date} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-6 col-xs-12 mb10">
									<DateTimePicker name="to_date" label="Ngày kết thúc" required={object_required.includes("to_date")} minDate={moment()}
										error={object_error.to_date} value={object.to_date} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-6 col-xs-12 mb10">
									<Dropbox name="staff_id" label="CSKH" data={staff_list} required={object_required.includes("staff_id")}
										key_value="id" key_title="login_name"
										error={object_error.staff_id} value={object.staff_id} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-6 col-xs-12 mb10">
									<Dropbox name="employer_id" label="Nhà tuyển dụng" data={employer_list} required={object_required.includes("employer_id")}
										error={object_error.employer_id} value={object.employer_id} nameFocus={name_focus}
										onChange={this.onChange}
										timeOut={1000} loading={loading_getEmployer}
										onChangeTimeOut={this.getListEmployer}
									/>
								</div>
							</div>
						</div>
					</div>
					<hr className="v-divider margin0" />
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
		branch: state.branch,
		user: state.user
	};
}
function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupBookingBanner);
