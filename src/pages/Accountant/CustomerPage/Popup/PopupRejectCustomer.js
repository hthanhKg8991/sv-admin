import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import InputArea from "components/Common/InputValue/InputArea";

import {rejectCustomerAccountant} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import {publish} from "utils/event";
import * as utils from "utils/utils";

class PopupRejectCustomer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			objectLock: {},
			objectLock_error: {},
			objectLock_required: ["reason_cancel"],
			name_focus: ""
		};
		this.onChange = this._onChange.bind(this);
		this.onSave = this._onSave.bind(this);
	}
	_onChange(value, name){
		let objectLock_error = this.state.objectLock_error;
		delete objectLock_error[name];
		this.setState({objectLock_error: objectLock_error});
		this.setState({name_focus: ""});
		let objectLock = Object.assign({},this.state.objectLock);
		objectLock[name] = value;
		this.setState({objectLock: objectLock});
	}
	async _onSave(event){
		const {idKey} = this.props
		event.preventDefault();
		this.setState({objectLock_error: {}});
		this.setState({name_focus: ""});
		let objectLock = this.state.objectLock;
		let check = utils.checkOnSaveRequired(objectLock, this.state.objectLock_required);
		if (check.error) {
			this.setState({name_focus: check.field});
			this.setState({object_error: check.fields});
			return;
		}
		objectLock.id = this.props.object.id;
		uiAction.showLoading();
		const res = await rejectCustomerAccountant(objectLock);
		if(res){
			this.props.uiAction.putToastSuccess("Thao tác thành công!");
			this.props.uiAction.deletePopup();
			publish(".refresh", {}, idKey)
		}
		uiAction.hideLoading();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(JSON.stringify(nextState) === JSON.stringify(this.state));
	}
	render () {
		let {objectLock, objectLock_error, objectLock_required, name_focus} = this.state;
		return (
			<div className="dialog-popup-body">
				<div className="popupContainer">
					<div className="row form-container">
						<div className="col-sm-12 col-xs-12 mb15 mt10">
							<InputArea name="reason_cancel"
								label="Lý do không duyệt"
								required={objectLock_required.includes("reason_cancel")}
								nameFocus={name_focus}
								style={{ minHeight: "102px" }}
								value={objectLock.reason_cancel}
								error={objectLock_error.reason_cancel}
								onChange={this.onChange}
							/>
						</div>
					</div>
				</div>
				<hr className="v-divider margin0" />
				<div className="v-card-action">
					<button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onSave}>
						<span>Không duyệt</span>
					</button>
					<button type="button" className="el-button el-button-primary el-button-small" onClick={this.hidePopup}>
						<span>Đóng</span>
					</button>
				</div>
			</div>
		)
	}
}
function mapStateToProps(state) {
	return {
		api: state.api
	};
}
function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupRejectCustomer);
