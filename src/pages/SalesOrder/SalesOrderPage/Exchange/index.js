import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import {Checkbox} from "@material-ui/core";
import {CanRender, LoadingSmall, SpanCommon} from "components/Common/Ui/LoadingSmall";

import {createExchangeSalesOrder, getExchangeSalesOrder} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {subscribe} from "utils/event";
import {formatNumber} from "utils/utils";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			object: null,
			total_select: 0,
			total_remain: 0,
			ids_select: [],
		};
		this.getExchange = this._getExchange.bind(this);
		this.onSelected = this._onSelected.bind(this);
		this.onCreate = this._onCreate.bind(this);

		this.subscribers = [];
		this.subscribers.push(subscribe(".refresh", () => {
			this.setState({loading: true}, () => {
				this.getExchange();
			});
		}, props.idKey));
	}

	_onSelected(e) {
		const {ids_select, object} = this.state;
		const value = e.target.value;
		const checked = e.target.checked;
		let newIds = ids_select;
		if (checked) {
			newIds.push(parseInt(value));
		} else {
			newIds = newIds.filter(item => parseInt(item) !== parseInt(value));
		}
		const idsSelect = [...new Set(newIds)];
		this.setState({ids_select: idsSelect});

		// total select & remain unearned
		const items = object?.sales_order_items_sub;
		let totalSelect = 0;
		let totalRemain = 0;
		items.forEach((item) => {
			if (idsSelect.includes(parseInt(item?.sales_order_items_sub_id))) {
				totalSelect += parseInt(item?.unearned);
			} else {
				totalRemain += parseInt(item?.unearned);
			}
		});
		this.setState({
			total_select: totalSelect,
			total_remain: totalRemain,
		});
	}

	async _onCreate() {
		const {uiAction, history} = this.props;
		const {ids_select} = this.state;

		if (ids_select.length === 0) {
			uiAction.putToastError("Vui chọn gói dịch vụ quy đổi!");
			return false;
		}

		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn quy đổi?",
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			uiAction.hideSmartMessageBox();
			if (ButtonPressed === "Yes") {
				const res = await createExchangeSalesOrder({
					sales_order_id: this.props.id,
					sales_order_items_sub: ids_select
				});
				if (res) {
					uiAction.putToastSuccess("Thao tác thành công");
					history.push({
						pathname: Constant.BASE_URL_SALES_ORDER,
						search: "?" + queryString.stringify({action: "exchange-detail", id: res?.id})
					});
				}
			}
		});
	}

	async _getExchange() {
		const res = await getExchangeSalesOrder({sales_order_id: this.props.id});
		if (res) {
			this.setState({object: res});
		}
		this.setState({loading: false});
	}

	componentDidMount() {
		this.getExchange();
	}

	render() {
		const {object, total_select, total_remain, loading} = this.state;
		const items = object?.sales_order_items_sub;
		let totalNetSales = 0;
		let totalEarned = 0;
		let totalUnearned = 0;

		return (
			<>
				{loading && <LoadingSmall className="form-loading"/>}
				<div className="font-bold text-primary mb10">Bước 1: Chọn gói dịch vụ muốn quy đổi</div>
				<div className="body-table el-table crm-section">
					<div className="body-table el-table">
						<table className="table-default">
							<tbody>
								<tr className="tr-header tr-center text-bold bgColorHeadLV2">
									<td style={{width: "60px"}}>
										<div className="cell">#</div>
									</td>
									<td style={{width: "300px"}}>
										<div className="cell">Tên sản phẩm</div>
									</td>
									<td>
										<div className="cell">Số lượng</div>
									</td>
									<td>
										<div className="cell">Trạng thái</div>
									</td>
									<td>
										<div className="cell">Ghi chú</div>
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
								{items && items.map((item, key) => {
									totalNetSales += parseInt(item?.net_sales);
									totalEarned += parseInt(item?.earned);
									totalUnearned += parseInt(item?.unearned);
									const unit = [
										Constant.SERVICE_TYPE_FILTER_RESUME,
										Constant.SERVICE_TYPE_FILTER_RESUME_2018
									].includes(item?.service_type) ? "điểm" : "ngày";
									return (
										<tr className="text-bold tr-body el-table-row no-bg pointer"
											key={key.toString()}>
											<td>
												<div className="cell">
													{(
														[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(item?.status) &&
                                                    parseInt(item?.unearned) > 0
													) ? (
															<Checkbox
																color="primary"
																classes={{root: "custom-checkbox-root"}}
																inputProps={{"aria-label": "secondary checkbox"}}
																value={item?.sales_order_items_sub_id}
																onChange={this.onSelected}
															/>
														) : ""}
												</div>
											</td>
											<td>
												<div
													className="cell">{item?.sales_order_items_sub_id} - {item?.cache_service_name}</div>
											</td>
											<td>
												<div
													className="cell">{`${item?.quantity} ${unit.toLowerCase()}`}</div>
											</td>
											<td>
												<div className="cell">
													<SpanCommon
														idKey={Constant.COMMON_DATA_KEY_sales_order_items_sub_status}
														value={item?.status}/>
												</div>
											</td>
											<td>
												<div className="cell">
													{`Còn lại ${item?.remaining} ${unit.toLowerCase()}`}
												</div>
											</td>
											<td>
												<div className="cell text-right">
													{formatNumber(item?.net_sales, 0, ".", "đ")}
												</div>
											</td>
											<td>
												<div className="cell text-right">
													{formatNumber(item?.earned, 0, ".", "đ")}
												</div>
											</td>
											<td>
												<div className="cell text-right">
													{formatNumber(item?.unearned, 0, ".", "đ")}
												</div>
											</td>
										</tr>
									)
								})}
								<tr className="no-border">
									<td colSpan={5}>
										<div
											className="cell text-right font-weight-bold font-italic">
											<b><i>Tổng</i></b>
										</div>
									</td>
									<td>
										<div
											className="cell text-right">
											<b>{formatNumber(totalNetSales, 0, ".", "đ")}</b>
										</div>
									</td>
									<td>
										<div
											className="cell text-right">
											<b>{formatNumber(totalEarned, 0, ".", "đ")}</b>
										</div>
									</td>
									<td>
										<div
											className="cell text-right">
											<b>{formatNumber(totalUnearned, 0, ".", "đ")}</b>
										</div>
									</td>
								</tr>
								<tr className="no-border">
									<td colSpan={5}>
										<div
											className="cell text-right">
											<b><i>Giá trị quy đổi</i></b>
										</div>
									</td>
									<td colSpan={3}>
										<div
											className="cell text-right text-red">
											{formatNumber(total_select, 0, ".", "đ")}
										</div>
									</td>
								</tr>
								<tr className="no-border">
									<td colSpan={5}>
										<div
											className="cell text-right">
											<b><i>Giá trị đơn hàng còn lại</i></b>
										</div>
									</td>
									<td colSpan={3}>
										<div
											className="cell text-right">
											{formatNumber(total_remain, 0, ".", "đ")}
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<div className="text-right mt20">
							<CanRender actionCode={ROLES.customer_care_sales_order_exchange_create}>
								<button type="button" className="el-button el-button-primary el-button-small"
									onClick={this.onCreate}>
									<span>Xác nhận và chuyển sang bước 2</span>
								</button>
							</CanRender>
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
