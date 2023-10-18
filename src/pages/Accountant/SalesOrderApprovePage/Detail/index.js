import React, {Component} from "react";
import {connect} from "react-redux";
import config from "config";
import _ from "lodash";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import CanRender from "components/Common/Ui/CanRender";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SpanCommon from "components/Common/Ui/SpanCommon";

import * as apiFn from "api";
import {getPromotionProgramAppliedsBySalesOrder} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import * as ConstantURL from "utils/ConstantURL";
import {subscribe} from "utils/event";
import * as utils from "utils/utils";

import PopupCustomer from "pages/Accountant/CustomerPage/Popup/PopupCustomer";

import PopupSalesOrderReject from "../Popup/PopupSalesOrderReject";
import PopupSalesOrderRejectBySalesOps from "../Popup/PopupSalesOrderRejectBySalesOps";

import DiscountNonPolicy from "./DiscountNonPolicy";

class index  extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			object: {},
			accountant_customer: {},
			applied: [],
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
		this.btnSalesOpsApprove = this._btnSalesOpsApprove.bind(this);
		this.btnSalesOpsReject = this._btnSalesOpsReject.bind(this);
		this.btnEditCustomer = this._btnEditCustomer.bind(this);
		this.goBack = this._goBack.bind(this);
		this.getAppliedPromotions = this._getAppliedPromotions.bind(this);
		this.btnConfirmPayment = this._btnConfirmPayment.bind(this);
		this.btnRejectConfirmPayment = this._btnRejectConfirmPayment.bind(this);
	}
	_getSalesOrder(id){
		this.setState({loading: true});
		let args = {
			id: id,
			type: Constant.SALES_ORDER_TYPE
		};
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_DETAIL, args);
		this.getAppliedPromotions(id);
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
		const {uiAction} = this.props;
		const {object} = this.state;
		if(!object?.revenue_by_staff_code) {
			uiAction.putToastError("PĐK chưa cập nhật CSKH ghi nhận doanh thu");
			return false;
		}
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn duyệt phiếu đăng ký ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				uiAction.SmartMessageBox({
					title: `Xác nhận CSKH ${object?.revenue_by_staff_code} - ${object?.revenue_by_staff_name} được ghi nhận doanh thu.`,
					content: "",
					buttons: ["No","Yes"]
				}, (ButtonPressed) => {
					uiAction.hideSmartMessageBox();
					if (ButtonPressed === "Yes") {
						this.props.uiAction.showLoading();
						let args = {
							sale_order_id: this.props.sales_order.id,
						};
						this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALES_ORDER_APPROVE, args);
					}
				});
			}
		});
	}

	_btnSalesOpsApprove(){
		const {uiAction} = this.props;
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn duyệt phiếu đăng ký ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			uiAction.hideSmartMessageBox();
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				let args = {
					sale_order_id: this.props.sales_order.id,
				};
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALES_OPS_APPROVE_SALES_ORDER, args);
			}
		});
	}

	_btnSalesOpsReject(){
		this.props.uiAction.createPopup(PopupSalesOrderRejectBySalesOps,"Sales Ops Không duyệt phiếu đăng ký",{
			sales_order: this.props.sales_order,
			idKey: this.props.idKey
		});
	}

	_btnConfirmPayment(){
		const {uiAction} = this.props;
		const {object} = this.state;
		if(!object?.revenue_by_staff_code) {
			uiAction.putToastError("PĐK chưa cập nhật CSKH ghi nhận doanh thu");
			return false;
		}
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn xác nhận chờ thanh toán cho phiếu đăng ký?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				let args = {
					sales_order_id: this.props.sales_order.id,
				};
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_CONFIRM_PAYMENT, args);
			}
		});
	}

	_btnRejectConfirmPayment() {
		const {uiAction} = this.props;
		const {object} = this.state;
		if(!object?.revenue_by_staff_code) {
			uiAction.putToastError("PĐK chưa cập nhật CSKH ghi nhận doanh thu");
			return false;
		}
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn từ chối xác nhận chờ thanh toán?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				let args = {
					sales_order_id: this.props.sales_order.id,
				};
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REJECT_CONFIRM_PAYMENT, args);
			}
		});
	}

	_btnReject(){
		this.props.uiAction.createPopup(PopupSalesOrderReject,"Không duyệt phiếu đăng ký",{
			sales_order: this.props.sales_order,
			idKey: this.props.idKey
		});
	}
	_btnEditCustomer(){
		this.props.uiAction.createPopup(PopupCustomer,"Chỉnh Sửa Khách Hàng Kế Toán",{
			object: this.state.accountant_customer,
			sales_order: this.state.object,
			changeCustomer: (accountant_customer)=>{this.setState({accountant_customer: accountant_customer})},
			isApprove: true,
			isChange: true,
			refresh_page: "SalesOrderApprovePage"
		});
	}
	_goBack() {
		const {history} = this.props;
		if (_.get(history, "action") === "POP") {
			history.push({
				pathname: Constant.BASE_URL_ACCOUNTANT_SALES_ORDER,
				search: "?action=list"
			});

			return true;
		}

		if (_.get(history, "action") === "PUSH") {
			const search = queryString.parse(_.get(history, ["location", "search"]));
			delete search["action"];
			delete search["id"];

			history.push({
				pathname: Constant.BASE_URL_ACCOUNTANT_SALES_ORDER,
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

	async _getAppliedPromotions(id) {
		const res = await getPromotionProgramAppliedsBySalesOrder({sales_order_id: id});
		if(res) {
			this.setState({applied: res});
		}
	}

	componentDidMount(){
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
		if (newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_APPROVE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_APPROVE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this._refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALES_ORDER_APPROVE);
		}

		if (newProps.api[ConstantURL.API_URL_POST_SALES_OPS_APPROVE_SALES_ORDER]) {
			let response = newProps.api[ConstantURL.API_URL_POST_SALES_OPS_APPROVE_SALES_ORDER];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this._refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALES_OPS_APPROVE_SALES_ORDER);
		}

		if (newProps.api[ConstantURL.API_URL_POST_CONFIRM_PAYMENT]) {
			let response = newProps.api[ConstantURL.API_URL_POST_CONFIRM_PAYMENT];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this._refreshList();
			}
			this.props.uiAction.hideSmartMessageBox();
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CONFIRM_PAYMENT);
		}
		if (newProps.api[ConstantURL.API_URL_POST_REJECT_CONFIRM_PAYMENT]) {
			let response = newProps.api[ConstantURL.API_URL_POST_REJECT_CONFIRM_PAYMENT];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this._refreshList();
			}
			this.props.uiAction.hideSmartMessageBox();
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REJECT_CONFIRM_PAYMENT);
		}
		if (newProps.refresh["SalesOrderApprovePageDetail"]){
			let refresh = newProps.refresh["SalesOrderApprovePageDetail"];
			if (refresh.type === "DiscountNonPolicy") {
				this.getSalesOrder(this.props.sales_order.id);
			}
			this.props.uiAction.deleteRefreshList("SalesOrderApprovePageDetail");
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !(JSON.stringify(nextState) === JSON.stringify(this.state));
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
		let {object, accountant_customer, applied} = this.state;
		let status = parseInt(object.status);
		const salesOpsApproveStatus = object.sales_ops_approve_status ? Number(object.sales_ops_approve_status) :  object.sales_ops_approve_status;

		let keyPress = [];
		if (status) {
			if ([Constant.STATUS_COMPLETE].includes(status)) {
				keyPress.push("1");
				keyPress.push("2");
				keyPress.push("3");
				keyPress.push("4");
			}
		}
		let seeker_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
		let payment_term_method = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_payment_term_method);
		
		const taxRate = (100 + Number(object.vat_percent))/100;
        const totalAmount =  object.is_include_tax === true ?  object.total_amount_unit/taxRate : object.total_amount_unit;
        const totalAmountIncludedTax = object.is_include_tax === true ? object.total_amount_unit : object.total_amount_unit*taxRate;
        const totalTax = totalAmountIncludedTax - totalAmount;
		return (
			<div className="content-box">
				<div className="row mt10">
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
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">QR Code</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{object?.qr_code}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Trạng thái thanh toán</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								<SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status} value={object?.payment_status}/>
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Yêu cầu xác nhận chờ thanh toán</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								<SpanCommon idKey={Constant.COMMON_DATA_KEY_confirm_payment_status} value={object?.confirm_payment_status}/>
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Yêu cầu duyệt phiếu</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								<SpanCommon idKey={Constant.COMMON_DATA_KEY_request_approve_status} value={object?.request_approve_status}/>
							</div>
						</div>
					</div>
					<div className="col-sm-4 col-xs-4">
						<div className="col-sm-12 col-xs-12 row-content row-title padding0">
							<span>Thông tin phiếu</span>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Email NTD</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{object?.employer_info?.email}
							</div>
						</div>
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">Ngày tạo phiếu</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{moment.unix(object.created_at).format("DD/MM/YYYY")}
							</div>
						</div>
						{object?.approved_at && (
							<div className="col-sm-12 col-xs-12 row-content padding0">
								<div className="col-sm-5 col-xs-5 padding0">Ngày duyệt</div>
								<div className="col-sm-7 col-xs-7 text-bold">
									{moment.unix(object?.approved_at).format("DD/MM/YYYY")}
								</div>
							</div>
						)}
						{object?.registration_expired_at ? (
							<div className="col-sm-12 col-xs-12 row-content padding0">
								<div className="col-sm-5 col-xs-5 padding0">Ngày hết hạn kích hoạt</div>
								<div className="col-sm-7 col-xs-7 text-bold">
									{moment.unix(object.registration_expired_at).format("DD/MM/YYYY")}
								</div>
							</div>
						) : <></>}
						<div className="col-sm-12 col-xs-12 row-content padding0">
							<div className="col-sm-5 col-xs-5 padding0">CSKH ghi nhận doanh thu</div>
							<div className="col-sm-7 col-xs-7 text-bold">
								{object?.revenue_by_staff_code} - {object?.revenue_by_staff_name}
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
							<span>Thành tiền ({object.total_amount_unit ? utils.formatNumber(Math.round(totalAmountIncludedTax),0,".","đ") : "Không có"})</span>
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
								{applied.map((a, idx) => (
									<div className="col-sm-12 col-xs-12 row-content padding0" key={idx.toString()}>
										<div className="col-sm-6 col-xs-6 padding0">
											<span>{a?.title}</span>
										</div>
										<div className="col-sm-6 col-xs-6 number-money textRed">
											<span>- {utils.formatNumber(a?.discount_amount, 0, ".", "đ")}</span>
										</div>
									</div>
								))}
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
								{object.is_include_tax === false && <>
									<div className="col-sm-12 col-xs-12 row-content padding0 mb10">
										<div className="col-sm-6 col-xs-6 px-0 pt-10">Tiền trước thuế</div>
										<div className="col-sm-6 col-xs-6 number-money last pt-10">
											<span>{utils.formatNumber(totalAmount, 0, ".", "đ")}</span>
										</div>
									</div>
									<div className="col-sm-12 col-xs-12 row-content padding0 mb10">
										<div className="col-sm-6 col-xs-6 padding0">Thuế VAT</div>
										<div className="col-sm-6 col-xs-6 number-money">
											<span>{utils.formatNumber(Math.round(totalTax) ,0,".","đ")}</span>
										</div>
									</div>
								</>}
								
								<div className="col-sm-12 col-xs-12 row-content padding0 mb10">
									<div className="col-sm-6 col-xs-6 text-bold px-0 pt-10">Tổng tiền {object.is_include_tax === false && 'sau thuế'}</div>
									<div className="col-sm-6 col-xs-6 number-money last pt-10">
										<span>{utils.formatNumber(Math.round(totalAmountIncludedTax), 0, ".", "đ")}</span>
									</div>
								</div>
								
								{/* Credit áp dụng */}
								{object?.credit_apply ? (
									<div className="col-sm-12 col-xs-12 row-content padding0 mb10">
										<div className="col-sm-6 col-xs-6 padding0">Credit áp dụng</div>
										<div className="col-sm-6 col-xs-6 number-money">
											<span className="text-red">- {utils.formatNumber(object.credit_apply, 0, ".", "đ")}</span>
										</div>
									</div>
								): null}
								{/* Tổng tiền sau credit*/}
								{object?.credit_apply ? (
									<div className="col-sm-12 col-xs-12 row-content padding0 mb10">
										<div className="col-sm-6 col-xs-6 text-bold padding0">Phải thanh toán</div>
										<div className="col-sm-6 col-xs-6 number-money last">
											<span>{utils.formatNumber(object.total_amount_credit_apply, 0, ".", "đ")}</span>
										</div>
									</div>
								): null}
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
						<a target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_EDIT_SALES_ORDER + "?id=" + object.id} className="el-button el-button-primary el-button-small">
							<span>Chi tiết</span>
						</a>
						{salesOpsApproveStatus && salesOpsApproveStatus === Constant.SALES_OPS_APPROVE_STATUS_YES && 
						<>
							{keyPress.includes("1") && (
								<CanRender actionCode={ROLES.accountant_sales_order_approval_sales_order}>
									<button type="button" className="el-button el-button-success el-button-small" onClick={this.btnApprove}>
										<span>Duyệt</span>
									</button>
								</CanRender>
							)}
							{keyPress.includes("2") && (
								<CanRender actionCode={ROLES.accountant_sales_order_approval_sales_order}>
									<button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnReject}>
										<span>Không duyệt</span>
									</button>
								</CanRender>
							)}
						</>
						}


						{[Constant.STATUS_COMPLETE].includes(status) && salesOpsApproveStatus && salesOpsApproveStatus === Constant.SALES_OPS_APPROVE_STATUS_WAITING && 
						<>
						<CanRender actionCode={ROLES.customer_care_sales_ops_approve_sales_order}>
							<button type="button" className="el-button el-button-success el-button-small" onClick={this.btnSalesOpsApprove}>
								<span>Sales Ops Duyệt</span>
							</button>
						</CanRender>
					
						<CanRender actionCode={ROLES.customer_care_sales_ops_reject_sales_order}>
							<button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnSalesOpsReject}>
								<span>Sales Ops Không duyệt</span>
							</button>
						</CanRender>
						</>
						}
						{object?.confirm_payment_status === Constant.CONFIRM_PAYMENT_STATUS_SENT_MAIL_AND_WAITING_CONFIRM && 
                            (
                            	<CanRender actionCode={ROLES.accountant_sales_order_accountant_liabilities_confirm_payment}>
                            		<button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnConfirmPayment}>
                            			<span>Xác nhận chờ thanh toán</span>
                            		</button>
                            	</CanRender>
                            )
						}
						{object?.confirm_payment_status === Constant.CONFIRM_PAYMENT_STATUS_SENT_MAIL_AND_WAITING_CONFIRM && 
                            (
                            	<CanRender actionCode={ROLES.accountant_sales_order_accountant_liabilities_reject_confirm_payment}>
                            		<button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnRejectConfirmPayment}>
                            			<span>Từ chối xác nhận chờ thanh toán</span>
                            		</button>
                            	</CanRender>
                            )
						}
						{keyPress.includes("3") && (
							<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnPreview}>
								<span>In phiếu</span>
							</button>
						)}
						{keyPress.includes("4") && (
							<CanRender actionCode={ROLES.accountant_sales_order_accountant_customer_care_manage}>
								<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnEditCustomer}>
									<span>Cập nhật KHKT</span>
								</button>
							</CanRender>
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
		api: state.api,
		refresh: state.refresh,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
