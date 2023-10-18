import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import config from "config";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import CustomFilter from "components/Common/Ui/CustomFilter";
import Pagination from "components/Common/Ui/Pagination";
import TableComponent from "components/Common/Ui/Table";
import TableBody from "components/Common/Ui/Table/TableBody";
import TableHeader from "components/Common/Ui/Table/TableHeader";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";

import PopupPriceRecontract from "./Popup/PopupPriceRecontract";
import ComponentFilter from "./ComponentFilter";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data_list: [],
			page:1,
			per_page:Constant.PER_PAGE_LIMIT
		};
		this.refreshList = this._refreshList.bind(this);
		this.changePage = this._changePage.bind(this);
		this.changePerPage = this._changePerPage.bind(this);
		this.btnAdd = this._btnAdd.bind(this);
		this.btnEdit = this._btnEdit.bind(this);
		this.btnApprove = this._btnApprove.bind(this);
		this.btnReject = this._btnReject.bind(this);
		this.btnCopy = this._btnCopy.bind(this);
		this.btnDelete = this._btnDelete.bind(this);
	}

	_refreshList(delay = 0){
		let params = queryString.parse(window.location.search);
		params["page"] = params["page"] ? params["page"] : this.state.page;
		params["per_page"] = params["per_page"] ? params["per_page"] : this.state.per_page;
		params["order_by[id]"] = "DESC";
		this.props.uiAction.showLoading();
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_RECONTRACK_LIST, params, delay);
	}
	_changePage(newpage){
		this.setState({page: newpage},()=>{
			this.refreshList();
		});
	}
	_changePerPage(newperpage){
		this.setState({page: 1});
		this.setState({per_page: newperpage},()=>{
			this.refreshList();
		});
	}
	_btnAdd(){
		this.props.uiAction.createPopup(PopupPriceRecontract, "Thêm Bảng Giảm Giá Tái Ký");
	}
	_btnEdit(object){
		this.props.uiAction.createPopup(PopupPriceRecontract, "Chi Tiết Bảng Giảm Giá Tái Ký", {
			object: object
		});
	}
	_btnApprove(object){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn chuyển trạng thái hoạt động cho bản giảm giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_RECONTRACK_APPROVE, {id: object.id});
			}
		});
	}
	_btnReject(object){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn chuyển trạng thái ngưng hoạt động cho bản giảm giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_RECONTRACK_REJECT, {id: object.id});
			}
		});
	}
	_btnCopy(object){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn sao chép bảng giảm giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_RECONTRACK_COPPY, {id: object.id});
			}
		});
	}
	_btnDelete(object){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn xóa bản giảm giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_RECONTRACK_DELETE, {id: object.id});
			}
		});
	}
	
	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_RECONTRACK_LIST]){
			let response = newProps.api[ConstantURL.API_URL_GET_RECONTRACK_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({data_list: response.data.items});
				this.setState({pagination_data: response.data});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RECONTRACK_LIST);
		}
		if (newProps.api[ConstantURL.API_URL_POST_RECONTRACK_APPROVE]){
			let response = newProps.api[ConstantURL.API_URL_POST_RECONTRACK_APPROVE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RECONTRACK_APPROVE);
		}
		if (newProps.api[ConstantURL.API_URL_POST_RECONTRACK_REJECT]){
			let response = newProps.api[ConstantURL.API_URL_POST_RECONTRACK_REJECT];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RECONTRACK_REJECT);
		}
		if (newProps.api[ConstantURL.API_URL_POST_RECONTRACK_COPPY]){
			let response = newProps.api[ConstantURL.API_URL_POST_RECONTRACK_COPPY];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RECONTRACK_COPPY);
		}
		if (newProps.api[ConstantURL.API_URL_POST_RECONTRACK_DELETE]){
			let response = newProps.api[ConstantURL.API_URL_POST_RECONTRACK_DELETE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RECONTRACK_DELETE);
		}
		if (newProps.refresh["PriceRecontractPage"]){
			let delay = newProps.refresh["PriceRecontractPage"].delay ? newProps.refresh["PriceRecontractPage"].delay : 0;
			this.refreshList(delay);
			this.props.uiAction.deleteRefreshList("PriceRecontractPage");
		}
		if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
			this.refreshList();
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		let price_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_price_status);
		let branch_list = utils.convertArrayToObject(this.props.branch.branch_list, "code");
		return (
			<div className="row-body">
				<div className="col-search">
					<CustomFilter name="PriceRecontractPage"/>
					<ComponentFilter history={this.props.history}/>
				</div>
				<div className="col-result">
					<div className="box-card">
						<div className="box-card-title">
							<span className="title left">Danh Sách Giảm Giá Tái Ký</span>
							<div className="right">
								<button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
									<i className="fa fa-refresh"/>
								</button>
							</div>
						</div>
						<div className="card-body">
							<div className="crm-section">
								<div className="top-table">
									<div className="left btnCreateNTD">
										<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
											<span>Thêm bảng giá <i className="glyphicon glyphicon-plus"/></span>
										</button>
									</div>
								</div>
								<div className="body-table el-table">
									<TableComponent>
										<TableHeader tableType="TableHeader" width={400}>
                                            Bảng giá
										</TableHeader>
										<TableHeader tableType="TableHeader" width={150}>
                                            Chi nhánh
										</TableHeader>
										<TableHeader tableType="TableHeader" width={160}>
                                            Thời gian hiệu lực
										</TableHeader>
										<TableHeader tableType="TableHeader" width={120}>
                                            Trạng thái
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            Thao tác
										</TableHeader>
										<TableBody tableType="TableBody">
											{this.state.data_list.map((item, key)=> {
												let status = parseInt(item.status);
												let data = {
													title: item.id + " - " + item.title,
													branch_name: branch_list[item.branch_code] ? branch_list[item.branch_code].name : item.branch_code,
													start_date: item.start_date ? moment.unix(item.start_date).format("DD/MM/YYYY") : "**/**/****",
													end_date: item.end_date ? moment.unix(item.end_date).format("DD/MM/YYYY") : "**/**/****",
													status: price_status[status] ? price_status[status] : status,
												};
												return(
													<React.Fragment key={key}>
														<tr className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
															<td>
																<div className="cell" title={data.title}>{data.title}</div>
															</td>
															<td>
																<div className="cell" title={data.branch_name}>{data.branch_name}</div>
															</td>
															<td>
																<div className="cell" title={data.start_date + " - " + data.end_date}>{data.start_date + " - " + data.end_date}</div>
															</td>
															<td>
																<div className="cell" title={data.status}>{data.status}</div>
															</td>
															<td>
																<div className="cell">
																	<div className="text-underline pointer">
																		<span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>
																			{status === Constant.STATUS_INACTIVED ? "Chỉnh sửa" : "Chi tiết"}
																		</span>
																	</div>
																	{[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(status) && (
																		<div className="text-underline pointer">
																			<span className="text-bold text-success" onClick={()=>{this.btnApprove(item)}}>Hoạt động</span>
																		</div>
																	)}
																	{[Constant.STATUS_ACTIVED].includes(status) && (
																		<div className="text-underline pointer">
																			<span className="text-bold text-danger" onClick={()=>{this.btnReject(item)}}>Ngưng hoạt động</span>
																		</div>
																	)}
																	<div className="text-underline pointer">
																		<span className="text-bold text-primary" onClick={()=>{this.btnCopy(item)}}>Sao chép</span>
																	</div>
																	{[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(status) && (
																		<div className="text-underline pointer">
																			<span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
																		</div>
																	)}
																</div>
															</td>
														</tr>
													</React.Fragment>
												)
											})}
										</TableBody>
									</TableComponent>
								</div>
							</div>
							<div className="crm-section">
								<Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={true}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		api: state.api,
		refresh: state.refresh,
		sys: state.sys,
		branch: state.branch
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
