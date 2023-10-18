import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import config from "config";
import {bindActionCreators} from "redux";

import LoadingSmall from "components/Common/Ui/LoadingSmall";
import TableComponent from "components/Common/Ui/Table";
import TableBody from "components/Common/Ui/Table/TableBody";
import TableHeader from "components/Common/Ui/Table/TableHeader";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";

class DiscountNonPolicy extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data_list: [],
			show_detail: true,
			sales_order: props.sales_order
		};
		this.refreshList = this._refreshList.bind(this);
		this.btnApprove = this._btnApprove.bind(this);
		this.btnReject = this._btnReject.bind(this);
	}
	_refreshList(delay = 0){
		let args = {
			sales_order_id: this.state.sales_order.id
		};
		this.setState({loading: true});
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALE_LIST, args, delay);
	}
	_btnApprove(object){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn duyệt giảm giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				let args = {
					id: object.id,
					sales_order_id: this.state.sales_order.id
				};
				this.props.uiAction.showLoading();
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_APPROVE, args);
			}
		});
	}
	_btnReject(object){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn không duyệt giảm giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				let args = {
					id: object.id,
					sales_order_id: this.state.sales_order.id
				};
				this.props.uiAction.showLoading();
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_REJECT, args);
			}
		});
	}
	componentDidMount(){
		this.refreshList();
	}
	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_SALE_LIST]){
			let response = newProps.api[ConstantURL.API_URL_GET_SALE_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({data_list: response.data});
			}
			this.setState({loading: false});
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALE_LIST);
		}
		if (newProps.api[ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_APPROVE]){
			let response = newProps.api[ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_APPROVE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.props.uiAction.refreshList("SalesOrderApprovePageDetail",{type: "DiscountNonPolicy"});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_APPROVE);
		}
		if (newProps.api[ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_REJECT]){
			let response = newProps.api[ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_REJECT];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DISCOUNT_RECONTRACT_REJECT);
		}
		if (newProps.refresh["DiscountNonPolicy"]){
			let delay = newProps.refresh["DiscountNonPolicy"].delay ? newProps.refresh["DiscountNonPolicy"].delay : 0;
			this.refreshList(delay);
			this.props.uiAction.deleteRefreshList("DiscountNonPolicy");
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		if (this.state.loading){
			return(
				<div className="text-center">
					<LoadingSmall />
				</div>
			)
		}
		let {data_list} = this.state;
		let status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_status);
		return (
			<div className="body-table el-table crm-section">
				<TableComponent>
					<TableHeader tableType="TableHeader" width={200}>
                        Mô tả
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Tỉ lệ %
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Tiền mặt
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Thành tiền
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Trạng thái
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Người tạo
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Ngày tạo
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Người duyệt
					</TableHeader>
					<TableHeader tableType="TableHeader" width={100}>
                        Thao tác
					</TableHeader>
					<TableBody tableType="TableBody">
						{data_list.map((item, key)=> {
							let total = 0;
							total = item.cash_amount ?  total + parseInt(item.cash_amount) : total;
							total = item.percent_rate ? total + parseInt(parseInt(this.state.sales_order.total_amount) * item.percent_rate / 100) : total;
							return (
								<tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
									<td>
										<div className="cell">{item.description}</div>
									</td>
									<td className="text-right">
										<div className="cell">{utils.formatNumber(item.percent_rate,0,".","%")}</div>
									</td>
									<td className="text-right">
										<div className="cell">{utils.formatNumber(item.cash_amount,0,".","đ")}</div>
									</td>
									<td className="text-right">
										<div className="cell">{utils.formatNumber(total,0,".","đ")}</div>
									</td>
									<td>
										<div className="cell">{status[item.status]}</div>
									</td>
									<td>
										<div className="cell">{item.created_by}</div>
									</td>
									<td>
										<div className="cell">{item.created_at}</div>
									</td>
									<td>
										<div className="cell">{item.approved_by}</div>
									</td>
									<td>
										{[Constant.STATUS_INACTIVED].includes(parseInt(item.status)) && (
											<div className="cell">
												<div className="text-underline pointer">
													<span className="text-bold text-success" onClick={()=>{this.btnApprove(item)}}>Duyệt</span>
												</div>
												<div className="text-underline pointer">
													<span className="text-bold text-danger" onClick={()=>{this.btnReject(item)}}>Không duyệt</span>
												</div>
											</div>
										)}
									</td>
								</tr>
							)
						})}
					</TableBody>
				</TableComponent>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		api: state.api,
		sys: state.sys,
		refresh: state.refresh,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(DiscountNonPolicy);
