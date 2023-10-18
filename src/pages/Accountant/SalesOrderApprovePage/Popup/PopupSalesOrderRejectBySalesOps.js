import React,{Component} from "react";
import {connect} from "react-redux";
import config from "config";
import {bindActionCreators} from "redux";

import Input2 from "components/Common/InputValue/Input2";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import {publish} from "utils/event";
import * as utils from "utils/utils";

class PopupSalesOrderRejectBySalesOps extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: {},
			object_required: ["rejected_note"],
			object_error: {},
			name_focus: ""
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
	}
	_onSave(){
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
		this.props.uiAction.showLoading();
		object.sale_order_id = this.props.sales_order.id;
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_OPS_REJECT_SALES_ORDER, object);
	}
	_onChange(value, name){
		let object_error = this.state.object_error;
		delete object_error[name];
		this.setState({object_error: object_error});
		this.setState({name_focus: ""});
		let object = Object.assign({},this.state.object);
		object[name] = value;
		this.setState({object: object});
	}

	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_POST_OPS_REJECT_SALES_ORDER]){
			let response = newProps.api[ConstantURL.API_URL_POST_OPS_REJECT_SALES_ORDER];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.props.uiAction.deletePopup();
				publish(".refresh", {}, this.props.idKey);
			}else{
				this.setState({object_error: Object.assign({},response.data)});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_OPS_REJECT_SALES_ORDER);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		let {object, object_error, object_required, name_focus} = this.state;

		return (
			<form onSubmit={(event)=>{event.preventDefault();}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container row">
							<div className="col-sm-12 col-xs-12 mb10">
								<Input2 type="text" name="rejected_note" label="Lý do không duyệt" required={object_required.includes("rejected_note")}
									error={object_error.rejected_note} value={object.rejected_note} nameFocus={name_focus}
									onChange={this.onChange} />
							</div>
						</div>
					</div>
					<hr className="v-divider margin0" />
					<div className="v-card-action">
						<button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onSave}>
							<span>Không duyệt</span>
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
		api: state.api
	};
}
function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupSalesOrderRejectBySalesOps);
