import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Dropbox from "components/Common/InputValue/Dropbox";
import Input2 from "components/Common/InputValue/Input2";
import InputTags from "components/Common/InputValue/InputTags";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {getDetailAccountantCustomer, saveAccountantCustomer} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import {publish} from "utils/event";

import PopupChangeCustomer from "pages/CustomerCare/SalesOrderPage/Popup/PopupChangeCustomer";

class PopupCustomer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: {
				email_e_invoices: [],
			},
			object_required: ["name", "tax_code"],
			object_error: {},
			name_focus: ""
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.getDetail = this._getDetail.bind(this);
		this.btnChange = this._btnChange.bind(this);
	}
	async _onSave(save_approve = false){
		const {idKey} = this.props
		this.setState({object_error: {}});
		this.setState({name_focus: ""});

		let object = Object.assign({}, this.state.object);
		let object_required = this.state.object_required;
		let check = utils.checkOnSaveRequired(object, object_required);
		if (check.error) {
			this.setState({name_focus: check.field});
			this.setState({object_error: check.fields});
			return;
		}
		// check regex
		const regex = /^(\d)((?!.*-.*-)[0-9-]{6,12})(\d)$/;
		if (!regex.test(object.tax_code)) {
			this.setState({name_focus: "tax_code"});
			this.setState({object_error: {"tax_code": "Mã số thuế từ 8 đến 14 ký tự, chỉ bao gồm số hoặc ký tự “-”, tối đa 1 ký tự “-”"}});
			return;
		}
		this.props.uiAction.showLoading();
		if(save_approve){
			object.save_approve = Constant.STATUS_ACTIVED;
		}

		const res = await saveAccountantCustomer(object);
		this.props.uiAction.hideLoading();
		if(res){
			this.props.uiAction.putToastSuccess("Thao tác thành công!");
			this.props.uiAction.deletePopup();
			if (this.props.changeCustomer){
				this.props.changeCustomer(res);
			}else{
				publish(".refresh", {}, idKey)
			}
		}

	}
	_onChange(value, name){
		let object_error = this.state.object_error;
		delete object_error[name];
		this.setState({object_error: object_error});
		this.setState({name_focus: ""});
		let object = Object.assign({},this.state.object);
		object[name] = value;
		if (name === "province_id"){
			object.district_id = null;
		}
		this.setState({object: object});
	}
	async _getDetail(id){
		let args = {
			id: id
		};
		this.setState({loading: true});

		const res = await getDetailAccountantCustomer(args);

		if(res){
			this.setState({object: res});
		}

		this.setState({loading: false});
	}
	_btnChange(){
		this.props.uiAction.createPopup(PopupChangeCustomer, "Đổi Khách Hàng Kế Toán", {
			sales_order: this.props.sales_order,
			refresh_page: this.props.refresh_page
		});
	}
	componentDidMount(){
		let {object} = this.props;
		if (object?.id){
			this.getDetail(object.id);
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
		let {object, object_error, object_required, name_focus} = this.state;
		let province_list = this.props.sys.provinceInForm.items;
		let district_list = [];
		let province = province_list.filter(c => c.id === object.province_id);
		if (province.length) {
			district_list = this.props.sys.district.items.filter(c => c.province_code === province[0].code);
		}

		return (
			<form onSubmit={(event)=>{event.preventDefault();}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container row">
							<div className="col-sm-12 col-xs-12 sub-title-form mb10">
								<span>Thông tin chung</span>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2 type="text" name="name" label="Tên khách hàng" required={object_required.includes("name")}
									error={object_error.name} value={object.name} nameFocus={name_focus}
									onChange={this.onChange}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 sub-title-form mb10">
								<span>Thông tin liên hệ</span>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-6 col-xs-12 mb10">
									<Dropbox name="province_id" label="Tỉnh/Thành phố" data={province_list} required={object_required.includes("province_id")}
										key_value="id" key_title="name"
										value={object.province_id} error={object_error.province_id} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-6 col-xs-12 mb10">
									<Dropbox name="district_id" label="Quận/Huyện" data={district_list} required={object_required.includes("district_id")}
										key_value="id" key_title="name"
										value={object.district_id} error={object_error.district_id} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
							</div>
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2 type="text" name="address" label="Địa chỉ" required={object_required.includes("address")}
									error={object_error.address} value={object.address} nameFocus={name_focus}
									onChange={this.onChange}
								/>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-6 col-xs-12 mb10">
									<Input2 type="text" name="tax_code" label="Mã số thuế" required={object_required.includes("tax_code")}
										error={object_error.tax_code} value={object.tax_code} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-6 col-xs-12 mb10">
									<Input2 type="text" name="vat_percent" label="Thuế xuất" isNumber suffix=" %" required={object_required.includes("vat_percent")}
										error={object_error.vat_percent} value={object.vat_percent} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
							</div>
							<div className="col-sm-12 col-xs-12 padding0">
								<div className="col-sm-12 col-xs-12 mb10">
									<InputTags type="text"
										name="email_e_invoices"
										label="Email nhận hóa đơn"
										required={object_required.includes('email_e_invoices')}
										keyPress={[',', 'Enter', 'Tab']}
										nameFocus={name_focus}
										value={object.email_e_invoices}
										error={object_error.email_e_invoices}
										onChange={this.onChange}
										isEmail
									/>
								</div>
							</div>
							<div className="col-sm-12 col-xs-12">
								<FormControlLabel control={
									<Checkbox checked={parseInt(object.internal) === 1} color="primary"
										icon={<CheckBoxOutlineBlankIcon fontSize="large"/>}
										checkedIcon={<CheckBoxIcon fontSize="large"/>}
										onChange={() => {
											let internal = parseInt(object.internal) === 1 ? 2 : 1;
											this.onChange(internal, "internal");
										}}/>
								}
								label={<label className="v-label">Nội bộ</label>}
								/>
							</div>
						</div>
					</div>
					<hr className="v-divider margin0" />
					<div className="v-card-action">
						{this.props.isApprove && [Constant.STATUS_INACTIVED].includes(parseInt(object.status)) && (
							<button type="button" className="el-button el-button-success el-button-small" onClick={()=>{this.onSave(true)}}>
								<span>Lưu và duyệt</span>
							</button>
						)}
						{![Constant.STATUS_DELETED].includes(parseInt(object.status)) && (
							<button type="button" className="el-button el-button-success el-button-small" onClick={()=>{this.onSave(false)}}>
								<span>{this.props.isSelect ? "Lưu và chọn" : "Lưu"}</span>
							</button>
						)}
						{this.props.isChange && (
							<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnChange}>
								<span>Đổi KHKT</span>
							</button>
						)}
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupCustomer);
