/* eslint-disable react/no-deprecated */
//[UNUSED] MENU Đã OFF NOTE LẠI NẾU CONFIRM THÌ XÓA
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

import PopupBookingBanner from "./Popup/PopupBookingBanner";
import ComponentFilter from "./ComponentFilter";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data_list: [],
			staff_info: {},
			page:1,
			per_page:Constant.PER_PAGE_LIMIT,
		};
		this.refreshList = this._refreshList.bind(this);
		this.changePage = this._changePage.bind(this);
		this.changePerPage = this._changePerPage.bind(this);
		this.btnAdd = this._btnAdd.bind(this);
		this.btnDelete = this._btnDelete.bind(this);
	}
	_refreshList(delay = 0){
		let params = queryString.parse(window.location.search);
		params["page"] = params["page"] ? params["page"] : this.state.page;
		params["per_page"] = params["per_page"] ? params["per_page"] : this.state.per_page;
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING_BANNER, params, delay);
		this.props.uiAction.showLoading();
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
		this.props.uiAction.createPopup(PopupBookingBanner, "Thêm Đặt chổ");
	}
	_btnDelete(item){
		this.props.uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn xóa gói booking ?",
			content: "",
			buttons: ["No","Yes"]
		}, (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				this.props.uiAction.showLoading();
				this.props.apiAction.requestApi(apiFn.fnPost, config.apiBookingDomain, ConstantURL.API_URL_POST_BOOKING_BANNER_DELETE, {code: item.code});
			}
		});
	}
	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BANNER]){
			let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING_BANNER];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({data_list: response.data.items});
				this.setState({pagination_data: response.data});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOOKING_BANNER);
		}
		if (newProps.api[ConstantURL.API_URL_GET_LIST_BOX_BANNER]) {
			let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOX_BANNER];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({box_list: response.data});
			}
		}
		if (newProps.api[ConstantURL.API_URL_POST_BOOKING_BANNER_DELETE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_BOOKING_BANNER_DELETE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.refreshList();
			}
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_BOOKING_BANNER_DELETE);
		}
		if (newProps.refresh["AccBookingBannerPage"]){
			let delay = newProps.refresh["AccBookingBannerPage"].delay ? newProps.refresh["AccBookingBannerPage"].delay : 0;
			this.refreshList(delay);
			this.props.uiAction.deleteRefreshList("AccBookingBannerPage");
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
		let {data_list, box_list} = this.state;
		let booking_canceled_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_booking_canceled_reason);
		let booking_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_booking_status);
		let box_code_list = utils.convertArrayToObject(box_list, "id");
		return (
			<div className="row-body">
				<div className="col-search">
					<CustomFilter name="AccBookingBannerPage" />
					<ComponentFilter history={this.props.history}/>
				</div>
				<div className="col-result">
					<div className="box-card">
						<div className="box-card-title">
							<span className="title left">Danh Sách Đặt Chổ Quảng bá thương hiệu</span>
							<div className="right">
								<button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
									<i className="fa fa-refresh"/>
								</button>
							</div>
						</div>
						<div className="card-body">
							<div className="crm-section">
								<div className="top-table">
									<div className="left">
										<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
											<span>Đăng ký đặt chổ <i className="glyphicon glyphicon-plus"/></span>
										</button>
									</div>
								</div>
								<div className="body-table el-table">
									<TableComponent>
										<TableHeader tableType="TableHeader" width={140}>
                                            Mã đặt chổ
										</TableHeader>
										<TableHeader tableType="TableHeader" width={200}>
                                            Nhà tuyển dụng
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            Email NTD
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            gói dịch vụ
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            Trạng thái
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            Tình trạng
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            Ngày đặt chổ
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            Ngày hết hạn
										</TableHeader>
										<TableHeader tableType="TableHeader" width={130}>
                                            CSKH đặt chổ
										</TableHeader>
										<TableHeader tableType="TableHeader" width={100}>
                                            Thao tác
										</TableHeader>
										<TableBody tableType="TableBody">
											{data_list.map((item,key)=> {
												let data = {
													code: item.code,
													employer_name: item.employer_name,
													employer_email: item.employer_email,
													booking_box_id: box_code_list[item.booking_box_id] ? box_code_list[item.booking_box_id].name : item.booking_box_id,
													booking_status: booking_status[item.booking_status] ? booking_status[item.booking_status] : item.booking_status,
													cancelled_reason: booking_canceled_reason[item.cancelled_reason] ? booking_canceled_reason[item.cancelled_reason]: item.cancelled_reason,
													from_date: moment.unix(item.from_date).format("DD/MM/YYYY"),
													to_date: moment.unix(item.to_date).format("DD/MM/YYYY"),
													staff_email: item.staff_email
												};
												return (
													<tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
														{Object.keys(data).map((name) => {
															return(
																<td key={name}>
																	<div className="cell" title={data[name]}>{data[name]}</div>
																</td>
															)
														})}
														<td>
															<div className="cell">
																<div className="text-underline pointer">
																	<span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
																</div>
															</div>
														</td>
													</tr>
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
		branch: state.branch,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch),
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
