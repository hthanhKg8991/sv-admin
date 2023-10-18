import React, {Component} from "react";
import {Collapse} from "react-bootstrap";
import {connect} from "react-redux";
import classnames from "classnames";
import config from "config";
import _ from "lodash";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import LoadingSmall from "components/Common/Ui/LoadingSmall";
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

import PopupDeleteRegisCancel from "./Popup/PopupRejectRegisCancel";

class ListEffect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			show_detail: false,
			data_list:[],
			page:1,
			per_page:Constant.PER_PAGE_LIMIT,
			pagination_data:{},
			total: 0,
			employer_list: {}
		};
		this.refreshList = this._refreshList.bind(this);
		this.showHide = this._showHide.bind(this);
		this.changePage = this._changePage.bind(this);
		this.changePerPage = this._changePerPage.bind(this);
		this.getListEmployer = this._getListEmployer.bind(this);
		this.btnPreview = this._btnPreview.bind(this);
		// this.btnApprove = this._btnApprove.bind(this);
		this.btnReject = this._btnReject.bind(this);
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
	_refreshList(delay = 0){
		this.setState({loading: true});
		let params = queryString.parse(window.location.search);
		params["page"] = this.state.page;
		params["per_page"] = this.state.per_page;
		params["status"] = Constant.STATUS_INACTIVED;
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNT_REGIS_CANCEL_EFFECT_LIST, params, delay);
	}
	_showHide(){
		this.setState({show_detail: !this.state.show_detail});
	}
	_getListEmployer(data_list){
		let list_id_tamp = {};
		let params = {
			per_page: 1000,
			service_type: Constant.SERVICE_TYPE_EFFECT,
		};
		let i = 0;
		data_list.forEach((item)=>{
			if(!list_id_tamp[item.employer_id]){
				params["employer_ids["+i+"]"] = item.employer_id;
				i++;
			}
			list_id_tamp[item.employer_id] = item.employer_id;
		});
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_EMPLOYER_LIST, params);
	}
	_btnPreview(sales_order_id){
		this.props.uiAction.showLoading();
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW, {id: sales_order_id});
	}
	// _btnApprove(item){
	//     this.props.uiAction.SmartMessageBox({
	//         title: "Bạn có chắc muốn duyệt gói hiệu ứng ?",
	//         content: "",
	//         buttons: ['No','Yes']
	//     }, (ButtonPressed) => {
	//         if (ButtonPressed === "Yes") {
	//             this.props.uiAction.showLoading();
	//             this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_EFFECT_APPROVE, {
	//                 drop_registration_id: item.SalesOrderRequestDropRegistration_id
	//             });
	//         }
	//     });
	// }
	_btnReject(item){
		this.props.uiAction.createPopup(PopupDeleteRegisCancel, "Không Duyệt Gói Hiệu Ứng", {
			object: {
				drop_registration_id: item.SalesOrderRequestDropRegistration_id
			},
			refresh_page: "ListEffect",
			url_reject: ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_EFFECT_REJECT,
		});
	}

	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_ACCOUNT_REGIS_CANCEL_EFFECT_LIST]){
			let response = newProps.api[ConstantURL.API_URL_GET_ACCOUNT_REGIS_CANCEL_EFFECT_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				let total = response.data.items.length;
				this.setState({data_list: response.data.items});
				this.setState({pagination_data: response.data});
				this.setState({total: total});
				this.setState({show_detail: !!total});
				if(total){
					this.getListEmployer(response.data.items);
				}
			}
			this.setState({loading: false});
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ACCOUNT_REGIS_CANCEL_EFFECT_LIST);
		}
		if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST]){
			let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST];
			if(response.info?.args?.service_type === Constant.SERVICE_TYPE_EFFECT) {
				if (response.code === Constant.CODE_SUCCESS) {
					let employer_list = Object.assign({},this.state.employer_list);
					response.data.items.forEach((item) => {
						employer_list[item.id] = item;
					});
					this.setState({employer_list: employer_list});
				}
				this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_LIST);
			}
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
		if (newProps.api[ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_EFFECT_APPROVE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_EFFECT_APPROVE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.hideSmartMessageBox();
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				this.refreshList();
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_EFFECT_APPROVE);
		}
		if (newProps.refresh["ListEffect"]){
			let delay = newProps.refresh["ListEffect"].delay ? newProps.refresh["ListEffect"].delay : 0;
			this.refreshList(delay);
			this.props.uiAction.deleteRefreshList("ListEffect");
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		let {data_list, total, show_detail, loading, employer_list} = this.state;

		let request_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_request_status);
		let license_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_business_license_status);
		let service_list = utils.convertArrayToObject(this.props.sys.service.items, "code");
		let effect_list = utils.convertArrayToObject(this.props.sys.effect.items, "code");

		return (
			<div className="col-result-full crm-section">
				<div className="box-card box-full">
					<div className="box-card-title pointer card-header" onClick={this.showHide}>
						<span className="title left">Yêu Cầu Hạ Hiệu Ứng ({total})</span>
						<div className={classnames("right", show_detail ? "active" : "")}>
							<button type="button" className="bt-refresh el-button">
								<i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
							</button>
						</div>
					</div>
					<Collapse in={show_detail}>
						<div>
							{loading ? (
								<div className="card-body">
									<div className="text-center">
										<LoadingSmall />
									</div>
								</div>
							) : (
								<div className="card-body">
									<div className="right">
										<button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
											<i className="fa fa-refresh"/>
										</button>
									</div>
									<div className="crm-section">
										<div className="body-table el-table">
											<TableComponent className="table-custom">
												<TableHeader tableType="TableHeader" width={350}>
                                                    Thông tin đăng ký
												</TableHeader>
												<TableHeader tableType="TableHeader" width={350}>
                                                    Thông tin hiệu ứng
												</TableHeader>
												<TableHeader tableType="TableHeader" width={300}>
                                                    Thông tin phiếu
												</TableHeader>
												<TableHeader tableType="TableHeader" width={150}>
                                                    Lý do
												</TableHeader>
												<TableHeader tableType="TableHeader" width={120}>
                                                    Thao tác
												</TableHeader>
												<TableBody tableType="TableBody">
													{data_list.map((item, key)=> {
														let effect_name = "";
														_.forEach(item.RegistrationEffect_detail_part, function(item, key){
															let effect = effect_list[item.trim()];
															if(effect){
																effect_name += key === 0 ? effect.name : ", " + effect.name;
															}
														});
														let data = {
															id: item.id,
															created_at: moment.unix(item.created_at).format("DD/MM/YYYY"),
															service: service_list[item.RegistrationEffect_jobbox_service_code] ? service_list[item.RegistrationEffect_jobbox_service_code] : {},
															employer: employer_list[item.employer_id] ? employer_list[item.employer_id] : null,
															effect_name: effect_name,
															registration_status: parseInt(item.RegistrationEffect_status),
															registration_id: item.RegistrationEffect_id,
															registration_total_day_quantity: item.RegistrationEffect_total_day_quantity,
															registration_start_date: moment.unix(item.RegistrationEffect_start_date).format("DD/MM/YYYY"),
															registration_end_date: moment.unix(item.RegistrationEffect_end_date).format("DD/MM/YYYY"),
															job_id: item.RegistrationEffect_job_id,
															cache_job_title: item.RegistrationEffect_cache_job_title,
															registration_created_by: item.RegistrationEffect_created_by,
															registration_created_at: moment.unix(item.RegistrationEffect_created_at).format("DD/MM/YYYY"),
															rejected_note: item.SalesOrderRequestDropRegistration_rejected_note
														};
														return(
															<tr key={key} className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
																<td>
																	<div className="cell-custom">
																		<div>Mã đăng ký: <span className="text-bold">{data.registration_id}</span></div>
																		<div>Trạng thái: <span className="text-bold">{request_status[data.registration_status] ? request_status[data.registration_status] : data.registration_status}</span></div>
																		<div>Gói dịch vụ: <span className="text-bold">{data.service.name}</span></div>
																		<div>Hiệu ứng: <span className="text-bold">{data.effect_name}</span></div>
																		<div>Thời gian hiệu lực:
																			<span className="text-bold">
																				{data.registration_total_day_quantity} ngày ({data.registration_start_date} - {data.registration_end_date})
																			</span>
																		</div>
																		<div>Tin tuyển dụng: <span className="text-bold">{data.job_id} - {data.cache_job_title}</span></div>
																		<div>Đăng ký: <span className="text-bold">{data.registration_created_by} - {data.registration_created_at}</span></div>
																	</div>
																</td>
																<td>
																	<div className="cell-custom">
																		<div>Mã phiếu: <span className="text-bold">{data.id}</span></div>
																		<div>Tạo phiếu: <span className="text-bold">{data.created_at}</span></div>
																		{data.employer && (
																			<React.Fragment>
																				<div>NTD: <span className="text-bold">{data.employer.id} - {data.employer.name}</span></div>
																				<div>Email NTD: <span className="text-bold">{data.employer.email}</span></div>
																				<div>GPKD: <span className="text-bold">{license_status[data.employer.business_license_status] ? license_status[data.employer.business_license_status] : "Chưa có"}</span></div>
																			</React.Fragment>
																		)}
																	</div>
																</td>
																<td>
																	<div className="cell-custom" title={data.rejected_note}>
																		{data.rejected_note}
																	</div>
																</td>
																<td>
																	<div className="cell-custom text-underline">
																		<div className="text-underline pointer">
																			<span className="text-bold text-success" onClick={()=>{this.btnApprove(item)}}>
                                                                                Duyệt
																			</span>
																		</div>
																		<div className="text-underline pointer">
																			<span className="text-bold text-danger" onClick={()=>{this.btnReject(item)}}>
                                                                                Không Duyệt
																			</span>
																		</div>
																		<div className="text-underline pointer">
																			<span className="text-bold text-primary" onClick={()=>{this.btnPreview({id: data.id, })}}>
                                                                                In phiếu
																			</span>
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
										<Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false}/>
									</div>
								</div>
							)}
						</div>
					</Collapse>
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
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(ListEffect);
