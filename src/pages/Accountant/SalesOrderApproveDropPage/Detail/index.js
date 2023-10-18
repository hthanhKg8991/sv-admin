import React,{Component} from "react";
import {connect} from "react-redux";
import config from "config";
import _ from "lodash";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import LoadingSmall from "components/Common/Ui/LoadingSmall";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import {subscribe} from "utils/event";
import * as utils from "utils/utils";

import PopupSalesOrderReject from "../Popup/PopupSalesOrderReject";

import DiscountNonPolicy from "./DiscountNonPolicy";

class index  extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			object: {},
			accountant_customer: {}
		};
		this.subscribers = [];
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this._refreshList();
			});
		}, props.idKey));

		this.getSalesOrder = this._getSalesOrder.bind(this);
		this.getCustomer = this._getCustomer.bind(this);
		this.btnPreview = this._btnPreview.bind(this);
		this.btnApprove = this._btnApprove.bind(this);
		this.btnReject = this._btnReject.bind(this);
		this.goBack = this._goBack.bind(this);
	}
	_getSalesOrder(id){
		this.setState({loading: true});
		let args = {
			id: id,
			type: Constant.SALES_ORDER_TYPE
		};
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_DETAIL, args);
	}
	_getCustomer(id){
		let args = {
			id: id
		};
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL, args);
	}
	_btnPreview(){
		this.props.uiAction.showLoading();
		let args = {
			id: this.props.sales_order.id
		};
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW, args);
	}
	_btnApprove(){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn duyệt yêu cầu hủy phiếu đăng ký ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				let args = {
					sale_order_id: this.props.sales_order.id,
				};
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALES_ORDER_REQUEST_DROP_APPROVE, args);
			}
		});
	}
	_btnReject(){
		this.props.uiAction.createPopup(PopupSalesOrderReject,"Không Duyệt Yêu Cầu Hủy Phiếu Đăng Ký",{sales_order: this.props.sales_order});
	}
	_goBack() {
		const {history} = this.props;
		if (_.get(history, "action") === "POP") {
			history.push({
				pathname: Constant.BASE_URL_SALES_ORDER_APPROVE_DROP,
				search: "?action=list"
			});

			return true;
		}

		if (_.get(history, "action") === "PUSH") {
			const search = queryString.parse(_.get(history, ["location", "search"]));
			delete search["action"];
			delete search["id"];

			history.push({
				pathname: Constant.BASE_URL_SALES_ORDER_APPROVE_DROP,
				search: "?" + queryString.stringify(search)
			});

			return true;
		}
	}

	_refreshList(){
		const {sales_order} = this.props;
		this.getSalesOrder(sales_order?.id);
		if(sales_order?.accountant_customer_id){
			this.getCustomer(sales_order?.accountant_customer_id);
		}
	}

	componentWillMount(){
		this._refreshList();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_DETAIL]){
			let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_DETAIL];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({object: response.data});
			}
			this.setState({loading: false});
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_DETAIL);
		}
		if (newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL]){
			let response = newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({accountant_customer: response.data});
			}
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL);
		}
		if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW]) {
			let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW];
			if (response.code === Constant.CODE_SUCCESS) {
				if (response.data.url) {
					window.open(response.data.url, "_blank");
				}
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW);
		}
		if (newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_REQUEST_DROP_APPROVE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_REQUEST_DROP_APPROVE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.props.uiAction.refreshList("SalesOrderApproveDropPage");
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALES_ORDER_REQUEST_DROP_APPROVE);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		if (this.state.loading){
			return(
				<div className="row content-box">
					<div className="relative card-body text-center">
						<LoadingSmall />
					</div>
				</div>
			)
		}
		let {object, accountant_customer} = this.state;
		let status = parseInt(object.status);

		let keyPress = [];
		if (status) {
			if ([Constant.STATUS_ACTIVED].includes(status)) {
				keyPress.push("1");
				keyPress.push("2");
				keyPress.push("3");
			}
		}
		let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
		let payment_term_method = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_payment_term_method);
		return (
			<div className="content-box">
				<div className="row mt10">
					<div className="col-xs-12 col-sm-12">
						<div className="col-sm-12 col-xs-12 row-content row-title padding0">
							<span>Lý do</span>
						</div>
						<div className="col-sm-5 col-xs-5 padding0">{this.props.sales_order.SalesOrderRequestCancel_description}</div>
					</div>
					<div className="col-sm-4 col-xs-4">
						<div className="col-sm-12 col-xs-12 row-content row-title padding0">
							<span>Thông tin KHKT</span>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Mã số thuế</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{accountant_customer.tax_code}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Tên công ty</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{accountant_customer.name}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Địa chỉ</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{accountant_customer.address}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Trạng thái</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{seeker_status[accountant_customer.status] ? seeker_status[accountant_customer.status] : accountant_customer.status}
							</div>
						</div>
					</div>
					<div className="col-sm-4 col-xs-4">
						<div className="col-sm-12 col-xs-12 row-content row-title padding0">
							<span>Thông tin phiếu</span>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Ngày tạo phiếu</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{moment.unix(object.created_at).format("DD/MM/YYYY")}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Ngày ghi nhận</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{moment.unix(object.ordered_on).format("DD/MM/YYYY")}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Tái ký</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{parseInt(object.recontract_status) === Constant.RECONTRACT_STATUS_ACTIVE ? <span className="text-bold">Có</span> : <span className="text-bold textRed">Không</span>}
							</div>
						</div>
						{object.payment_method === Constant.PAYMENT_TERM_METHOD_TM && (
							<div className="col-sm-12 col-xs-12 row-content padding0">
								<div className="col-sm-5 col-xs-5 padding0">Địa chỉ thu tiền mặt</div>
								<div className="col-sm-7 col-xs-7 text-bold">
									{object.payment_info}
								</div>
							</div>
						)}
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Hạn thanh toán</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{payment_term_method[object.payment_term_method] ? payment_term_method[object.payment_term_method] : object.payment_term_method}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Ghi chú</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{object.note}
							</div>
						</div>
					</div>
					<div className="col-sm-4 col-xs-4">
						<div className="col-sm-12 col-xs-12 row-content row-title padding0">
							<span>Thành tiền ({object.total_amount_unit ? utils.formatNumber(object.total_amount_unit,0,".","đ") : "Không có"})</span>
						</div>
						{object.total_amount_info && (
							<React.Fragment>
								{object.total_amount_info && Object.keys(object.total_amount_info).map((item, key) => {
									if (!["discount_non_policy_info","recontract_info"].includes(item)) {
										return (
											<div className="col-sm-12 col-xs-12 row-content padding0" key={key}>
												<div className="col-sm-6 col-xs-6 padding0">
													<span>{object.total_amount_info[item].cache_service_name}</span>
												</div>
												<div className="col-sm-6 col-xs-6 number-money">
													<span>{utils.formatNumber(object.total_amount_info[item].total_amount, 0, ".", "đ")}</span>
												</div>
											</div>
										)
									}else{
										return <React.Fragment key={key}/>
									}
								})}
								{parseInt(object.recontract_discount_amount) > 0 && (
									<div className="col-sm-12 col-xs-12 row-content padding0">
										<div className="col-sm-6 col-xs-6 padding0">Giảm giá tái ký</div>
										<div className="col-sm-6 col-xs-6 number-money textRed">
											<span>- {utils.formatNumber(object.recontract_discount_amount,0,".","đ")}</span>
										</div>
									</div>
								)}
								{parseInt(object.non_policy_discount_amount) > 0 && (
									<div className="col-sm-12 col-xs-12 row-content padding0">
										<div className="col-sm-6 col-xs-6 padding0">GGNCS</div>
										<div className="col-sm-6 col-xs-5 number-money textRed">
											<span>- {utils.formatNumber(object.non_policy_discount_amount,0,".","đ")}</span>
										</div>
									</div>
								)}
								<div className="col-sm-12 col-xs-12 row-content padding0">
									<div className="col-sm-6 col-xs-6 text-bold padding0">Tổng</div>
									<div className="col-sm-6 col-xs-6 number-money last">
										<span>{utils.formatNumber(object.total_amount_unit,0,".","đ")}</span>
									</div>
								</div>
							</React.Fragment>
						)}
					</div>
					<div className="col-sm-12 col-xs-12">
						<div className="col-sm-12 col-xs-12 row-content row-title padding0">
							<span>Giảm giá ngoài chính sách</span>
						</div>
						<div className="col-sm-12 col-xs-12 padding0">
							<DiscountNonPolicy sales_order={this.props.sales_order}/>
						</div>
					</div>
					<div className="col-sm-12 col-xs-12 mb15">
						{keyPress.includes("1") && (
							<button type="button" className="el-button el-button-success el-button-small" onClick={this.btnApprove}>
								<span>Duyệt</span>
							</button>
						)}
						{keyPress.includes("2") && (
							<button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnReject}>
								<span>Không duyệt</span>
							</button>
						)}
						{keyPress.includes("3") && (
							<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnPreview}>
								<span>In phiếu</span>
							</button>
						)}
						<button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
							<span>Quay lại</span>
						</button>
					</div>
				</div>
			</div>
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


export default connect(mapStateToProps,mapDispatchToProps)(index);
