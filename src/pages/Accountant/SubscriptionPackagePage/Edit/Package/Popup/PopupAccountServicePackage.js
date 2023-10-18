import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {bindActionCreators} from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {getListPriceRunning} from "api/saleOrder";
import { createSubscriptionItem } from "api/saleOrder";
import {getDetailSKU} from "api/system";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as utils from "utils/utils";

import FormComponent from "./FormComponentAccountServicePackage";

class PopupBuyRecruiterAssistant extends Component {
	constructor(props) {
		super(props);
		const {branch} = props;
		const {channel_code} = branch.currentBranch;
		const code = channel_code === Constant.CHANNEL_CODE_TVN ? 
			Constant.Service_Code_Account_Service_TVN : 
			Constant.Service_Code_Account_Service;
		const defaultItem = {
			service_code: code,
			quantity:this.props.item?.quantity,
			start_date:this.props.item?.start_date,
			week_quantity: 4,
		};
		this.state = {
			item: defaultItem,
			initialForm: {
				service_code: "service_code",
				quantity: "quantity",
				week_quantity: "week_quantity",
				sku_code: "sku_code",
				type_campaign: "type_campaign",
				discount_rate: "discount_rate",
				promotion_rate: "promotion_rate"
			},
			items_groups: [],
			package_running: [],
			code: code
		};
        
		this.onSubmit = this._onSubmit.bind(this);
	}

	async _getPackageRunning() {
		const res = await getListPriceRunning();
		if (res && Array.isArray(res)) {
			const packages = res.map(p => p?.service_code);
			this.setState({package_running: packages});
		}
	}
	async _getSKUCode() {
		const {item, code} = this.state;
		const resSKU = await getDetailSKU({service_code: code});
		this.setState({item: {...item,sku_code: resSKU?.sku_code}});
	}

	componentDidMount() {
		this._getPackageRunning();
		this._getSKUCode();
	}

	async submitData(dataForm) {
		const {uiAction} = this.props;
		const res = await createSubscriptionItem({
			...dataForm,
			combo_id: this.props.id,
			service_type: Constant.SERVICE_TYPE_ACCOUNT_SERVICE,
		});
		if (res) {
			uiAction.deletePopup();
			publish(".refresh", {}, Constant.IDKEY_ACCOUNT_SERVICE_PACKAGE);
			uiAction.putToastSuccess("Thao tác thành công!");
		}
        
		this.setState({loading: false});
	}

	_onSubmit(data, action) {
		const {setErrors} = action;
		const dataSumbit = _.pickBy(data, (item) => {
			return !_.isUndefined(item);
		});
		this.setState({loading: true}, () => {
			this.submitData(dataSumbit, setErrors);
		});
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
		const {initialForm, item} = this.state;
		const fieldWarnings = []
		const validationSchema = Yup.object().shape({
			service_code: Yup.string().required(Constant.MSG_REQUIRED),
			quantity: Yup.number().typeError(Constant.MSG_NUMBER_ONLY).positive(Constant.MSG_POSITIVE_ONLY).required(Constant.MSG_REQUIRED),
			week_quantity: Yup.number().typeError(Constant.MSG_NUMBER_ONLY).positive(Constant.MSG_POSITIVE_ONLY).required(Constant.MSG_REQUIRED),
			sku_code: Yup.string().required(Constant.MSG_REQUIRED),
		});

		return (
			<div className="form-container">
				<FormBase onSubmit={this.onSubmit}
					initialValues={item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm)}
					validationSchema={validationSchema}
					fieldWarnings={fieldWarnings}
					FormComponent={FormComponent}>
					<div className={"row mt15"}>
						<div className="col-sm-12">
							<button type="submit" className="el-button el-button-success el-button-small">
								<span>Lưu</span>
							</button>
						</div>
					</div>
				</FormBase>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupBuyRecruiterAssistant);
