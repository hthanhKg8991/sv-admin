import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Checkbox} from "@material-ui/core";
import CanRender from "components/Common/Ui/CanRender";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {
	approveExchangeSalesOrderV2,
	createExchangeDetailSalesOrderV2,
	deleteExchangeDetailSalesOrderV2, deleteExchangeSalesOrderV2, getDetailExchangeSalesOrderV2,
	getListByExchangeDetailSalesOrderV2, rejectExchangeSalesOrderV2, submitExchangeSalesOrderV2
} from "api/saleOrderV2";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish, subscribe} from "utils/event";
import * as utils from "utils/utils";

const idKey = "ListByExchange";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			exchange_object: null,
			list_by_exchange: [],
			credit_total: 0,
		};
		this.getExchangeDetail = this._getExchangeDetail.bind(this);
		this.getListByExchange = this._getListByExchange.bind(this);
		this.onSubmit = this._onSubmit.bind(this);
		this.onCancel = this._onCancel.bind(this);
		this.onApprove = this._onApprove.bind(this);
		this.onReject = this._onReject.bind(this);
		this.onSelected = this._onSelected.bind(this);
		this.onDelete = this._onDelete.bind(this);

		this.subscribers = [];
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this.getExchangeDetail();
			});
		}, props.idKey));
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this.getListByExchange();
			});
		}, idKey));
	}

	async _getExchangeDetail() {
		const res = await getDetailExchangeSalesOrderV2({id: this.props.id});
		if (res) {
			this.setState({exchange_object: res});
		}
		this.setState({loading: false});
	}

	async _getListByExchange() {
		const res = await getListByExchangeDetailSalesOrderV2({exchange_id: this.props.id});
		if (res) {
			this.setState({list_by_exchange: res});
		}
		this.setState({loading: false});
	}

	async _onSubmit() {
		const {uiAction} = this.props;
		const res = await submitExchangeSalesOrderV2({id: this.props.id});
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, this.props.idKey);
		}
	}

	async _onSelected(sales_order_item_sub_id) {
		const {uiAction, id} = this.props;
		const res = await createExchangeDetailSalesOrderV2({sales_order_item_sub_id, exchange_id: id});
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, idKey);
			publish(".refresh", {}, this.props.idKey);
		}
	}

	async _onDelete(id) {
		const {uiAction} = this.props;

		const res = await deleteExchangeDetailSalesOrderV2({id});
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, idKey);
			publish(".refresh", {}, this.props.idKey);
		}
	}


	async _onCancel() {
		const {uiAction,history} = this.props;
		const res = await deleteExchangeSalesOrderV2({id: this.props.id});
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công");
			history.push({
				pathname: Constant.BASE_URL_EXCHANGE_SALES_ORDER_V2
			});
		}
	}

	async _onApprove() {
		const {uiAction} = this.props;
		const res = await approveExchangeSalesOrderV2({id: this.props.id});
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, this.props.idKey);
		}
	}

	async _onReject() {
		const {uiAction} = this.props;
		const res = await rejectExchangeSalesOrderV2({id: this.props.id});
		if (res) {
			uiAction.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, this.props.idKey);
		}
	}

	componentDidMount() {
		this.getExchangeDetail();
		this.getListByExchange();
	}

	render() {
		const {exchange_object, loading, list_by_exchange} = this.state;

		const total_so_old = list_by_exchange?.reduce((c,i)=>{
			c.amount_total_due += i.amount_total_due;
			c.earned += i.earned;
			c.unearned += i.unearned;
			return c;
		},{amount_total_due: 0,earned:0,unearned:0});

		const remaining_value = total_so_old.amount_total_due - (exchange_object?.amount_total_credit || 0) > 0 ? total_so_old.amount_total_due - (exchange_object?.amount_total_credit || 0) : 0;

		return (
			<>
				{loading && <LoadingSmall className="form-loading"/>}
				<div>
					<div className="font-bold text-primary mb15">Bước 1: Chọn gói dịch vụ muốn quy đổi</div>
					<div className="body-table table-exchange el-table crm-section">
						<div className="body-table el-table">
							<table className="table-default">
								<tbody>
									<tr className="tr-header tr-center text-bold bgColorHeadLV2">
										<td className="width80">
											<div className="cell">#</div>
										</td>
										<td className="width150">
											<div className="cell">Mã phiếu</div>
										</td>
										<td className="width150">
											<div className="cell">ID item</div>
										</td>
										<td className="w-30">
											<div className="cell">Tên sản phẩm</div>
										</td>
										<td>
											<div className="cell">Net sales</div>
										</td>
										<td>
											<div className="cell">Earned</div>
										</td>
										<td>
											<div className="cell">UnEarned</div>
										</td>
									</tr>
									{
										list_by_exchange?.map((item, key) => {
											return (
												<tr className="text-bold tr-body el-table-row no-bg pointer"
													key={key.toString()}>
													<td>
														<div className="cell">
															<Checkbox
																color="primary"
																classes={{root: "custom-checkbox-root"}}
																inputProps={{"aria-label": "secondary checkbox"}}
																value={item?.id}
																disabled={Number(item.is_disable) === 1}
																checked={Number(item.id) > 0}
																onChange={(e) => {
																	if (e.target.checked) {
																		this.onSelected(item.sales_order_item_sub_id)
																	} else {
																		this.onDelete(item.id)
																	}
																}}
															/>
														</div>
													</td>
													<td>
														<div className="cell">
															{item?.sales_order_id}
														</div>
													</td>
													<td>
														<div className="cell">
															{item?.sales_order_item_id}
														</div>
													</td>
													<td>
														<div className="cell">

															{`ID subitem:${item.sales_order_item_sub_id} - ${item?.sku_info?.name}`}
														</div>
													</td>
													<td>
														<div className="cell">
															{utils.formatNumber(item.amount_total_due, 0, ",", "đ")}
														</div>
													</td>
													<td>
														<div className="cell">
															{utils.formatNumber(item.earned, 0, ",", "đ")}
														</div>
													</td>
													<td>
														<div className="cell">
															{utils.formatNumber(item.unearned, 0, ",", "đ")}
														</div>
													</td>
												</tr>
											)
										})}
									<tr className="font-bold textBlack text-right">
										<td colSpan={4} className="no-border">
                                        Tổng
										</td>
										<td className="no-border">{utils.formatNumber(total_so_old.amount_total_due, 0, ",", "đ")}</td>
										<td className="no-border">{utils.formatNumber(total_so_old.earned, 0, ",", "đ")}</td>
										<td className="no-border">{utils.formatNumber(total_so_old.unearned, 0, ",", "đ")}</td>
									</tr>
									<tr className="font-bold textBlack text-right">
										<td colSpan={4} className="no-border">
                                        Giá trị quy đổi
										</td>
										<td colSpan={3} className="no-border text-red">{utils.formatNumber(exchange_object?.amount_total_credit, 0, ",", "đ")}</td>
									</tr>
									<tr className="font-bold textBlack text-right">
										<td colSpan={4} className="no-border">
                                        Giá trị đơn hàng còn lại
										</td>
										<td colSpan={3} className="no-border">{utils.formatNumber(remaining_value, 0, ",", "đ")}</td>
									</tr>
								</tbody>
							</table>
						</div>

					</div>
				</div>
				<div className="step-confirm">
					<div className="font-bold text-primary mb15">Bước 2: Xác nhận credit sau khi thay đổi</div>
					<div className="body-table table-exchange el-table crm-section">
						<div className="body-table el-table">
							<table className="table-default">
								<tbody>
									<tr className="tr-header tr-center text-bold bgColorHeadLV2">
										<td>
											<div className="cell">Mã phiếu</div>
										</td>
										{/*<td>*/}
										{/*    <div className="cell">Giá trị đơn hàng</div>*/}
										{/*</td>*/}
										<td>
											<div className="cell">Giá trị quy đổi áp dụng</div>
										</td>
										<td>
											<div className="cell">Khách hàng phải thanh toán</div>
										</td>
									</tr>
									{exchange_object && (
										<tr className="text-bold tr-body el-table-row no-bg pointer">
											<td>
												<div className="cell">{exchange_object?.sales_order_info?.id}</div>
											</td>
											{/*<td>*/}
											{/*    <div className="cell">*/}
											{/*        {exchange_object?.sales_order_info?.amount_total_due > 0 ? utils.formatNumber(exchange_object?.sales_order_info?.amount_total_due, 0, ",", "đ") : "0đ" }*/}

											{/*    </div>*/}
											{/*</td>*/}
											<td>
												<div className="cell">
													{exchange_object?.amount_total_credit > 0 ? utils.formatNumber(exchange_object?.amount_total_credit, 0, ",", "đ") : "0đ"}
												</div>
											</td>
											<td>
												<div className="cell">
													{exchange_object?.amount_total_due > 0 ? utils.formatNumber(exchange_object?.amount_total_due, 0, ",", "đ") : "0đ"}
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
						<div className="mt30 text-center">
							{[
								Constant.EXCHANGE_V2_STATUS_NEW,
							].includes(parseInt(exchange_object?.status)) && (
								<>
									<CanRender actionCode={ROLES.customer_care_sales_order_exchange_submit}>
										<button type="button" className="el-button el-button-primary el-button-small"
											onClick={this.onSubmit}>
											<span>Xác nhận và gửi yêu cầu quy đổi</span>
										</button>
									</CanRender>
								</>
							)}
							{[Constant.EXCHANGE_V2_STATUS_SUBMITTED].includes(parseInt(exchange_object?.status)) && (
								<>
									<CanRender actionCode={ROLES.customer_care_sales_order_exchange_approve}>
										<button type="button" className="el-button el-button-primary el-button-small"
											onClick={this.onApprove}>
											<span>Duyệt yêu cầu quy đổi</span>
										</button>
									</CanRender>
									<CanRender actionCode={ROLES.customer_care_sales_order_exchange_reject}>
										<button type="button" className="el-button el-button-warning el-button-small"
											onClick={this.onReject}>
											<span>Không duyệt</span>
										</button>
									</CanRender>
								</>
							)}
							{[Constant.EXCHANGE_V2_STATUS_NEW].includes(parseInt(exchange_object?.status)) && (
								<CanRender actionCode={ROLES.customer_care_sales_order_exchange_cancel}>
									<button type="button" className="el-button el-button-bricky el-button-small"
										onClick={this.onCancel}>
										<span>Hủy yêu cầu</span>
									</button>
								</CanRender>
							)}
						</div>
					</div>
				</div>
			</>
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

export default connect(mapStateToProps, mapDispatchToProps)(index);
