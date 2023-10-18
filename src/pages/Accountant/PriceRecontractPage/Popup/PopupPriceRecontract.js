import React,{Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import config from "config";
import moment from "moment";
import {bindActionCreators} from "redux";

import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import Input2 from "components/Common/InputValue/Input2";
import InputArea from "components/Common/InputValue/InputArea";
import InputTable from "components/Common/InputValue/InputTable";
import TableComponent from "components/Common/Ui/Table";
import TableBody from "components/Common/Ui/Table/TableBody";
import TableHeader from "components/Common/Ui/Table/TableHeader";

import * as apiFn from "api";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as utils from "utils/utils";

class PopupPriceRecontract extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object: {},
			object_required: ["title", "start_date", "end_date"],
			object_error: {},
			name_focus: "",
			data_list: [],
			input_list: {},
			map: {
				discount_percent: "Tỉ lệ",
				discount_cash: "Tiền mặt"
			}
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.onDBClick = this._onDBClick.bind(this);
		this.refreshList = this._refreshList.bind(this);
		this.onSaveItem = this._onSaveItem.bind(this);
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
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_RECONTRACK_SAVE, object);
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
	_onDBClick(id, key) {
		if([Constant.STATUS_INACTIVED].includes(parseInt(this.state.object.status))) {
			let input_list = Object.assign({}, this.state.input_list);
			input_list[id + key] = true;
			this.setState({input_list: input_list});
		}
	}
	_refreshList(delay = 0){
		this.props.uiAction.showLoading();
		let object = this.props.object ? this.props.object : {};
		let args = {
			id: this.state.object.id ? this.state.object.id : object.id
		};
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_RECONTRACK_DETAIL, args, delay);
	}
	_onSaveItem(item, input_list){
		this.props.uiAction.showLoading();
		let id = item.id;
		let args = {
			id: id
		};
		Object.keys(this.state.map).forEach((name) => {
			if(input_list.hasOwnProperty(id + name + "_value")) {
				args[name] = input_list[id + name + "_value"];
			}
		});
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_RECONTRACK_DETAIL_SAVE, args);
	}
	componentWillMount(){
		if(this.props.object){
			this.refreshList();
		}
	}
	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_POST_RECONTRACK_SAVE]){
			let response = newProps.api[ConstantURL.API_URL_POST_RECONTRACK_SAVE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				let object = this.state.object;
				if(!object.id) {
					this.setState({object: response.data},()=>{
						this.refreshList();
					});
				}
				this.props.uiAction.refreshList("PriceRecontractPage");
			}else{
				this.setState({object_error: Object.assign({},response.data)});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RECONTRACK_SAVE);
		}
		if (newProps.api[ConstantURL.API_URL_GET_RECONTRACK_DETAIL]) {
			let response = newProps.api[ConstantURL.API_URL_GET_RECONTRACK_DETAIL];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({object: response.data.info});
				this.setState({data_list: response.data.details});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RECONTRACK_DETAIL);
		}
		if (newProps.api[ConstantURL.API_URL_POST_RECONTRACK_DETAIL_SAVE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_RECONTRACK_DETAIL_SAVE];
			let id = response.info?.args?.id;
			let input_list = Object.assign({}, this.state.input_list);
			let map = this.state.map;
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				Object.keys(map).forEach((name) => {
					input_list[id + name] = false;
					input_list[id + name + "_error"] = false;
				});
				this.refreshList();
			}else{
				if (response.data) {
					// let msg = response.msg + "\n";
					// Object.keys(response.data).forEach((name) => {
					//     input_list[id + name +'_error'] = true;
					//     let error = response.data[name].replace(":attr_name", map[name]);
					//     msg = msg + error + "\n";
					// });
					// this.props.uiAction.putToastError(msg);
				}
			}
			this.setState({input_list: input_list});
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RECONTRACK_DETAIL_SAVE);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		let {object, object_error, object_required, name_focus, data_list, input_list} = this.state;
		let minDate = object.start_date ? moment.unix(object.start_date) : moment();
		return (
			<form onSubmit={(event)=>{event.preventDefault();}}>
				<div className="dialog-popup-body">
					<div className="popupContainer">
						<div className="form-container">
							<div className="crm-section row">
								<div className="col-sm-12 col-xs-12 mb10">
									<Input2 type="text" name="title" label="Tên bảng giá" required={object_required.includes("title")}
										error={object_error.title} value={object.title} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								<div className="col-sm-12 col-xs-12 padding0">
									<div className="col-sm-6 col-xs-12 mb10">
										<DateTimePicker name="start_date" label="Ngày bắt đầu" minDate={moment()} required={object_required.includes("start_date")}
											error={object_error.start_date} value={object.start_date} nameFocus={name_focus}
											onChange={this.onChange}
										/>
									</div>
									<div className="col-sm-6 col-xs-12 mb10">
										<DateTimePicker name="end_date" label="Ngày kết thúc" minDate={minDate} required={object_required.includes("end_date")}
											error={object_error.end_date}  value={object.end_date} nameFocus={name_focus}
											onChange={this.onChange}
										/>
									</div>
								</div>
								<div className="col-sm-12 col-xs-12 mb10">
									<InputArea name="note" label="Ghi chú" required={object_required.includes("note")}
										style={{height:"100px", minHeight:"100px"}} nameFocus={name_focus}
										value={object.note} error={object_error.note}
										onChange={this.onChange}
									/>
								</div>
								{(!object.status || [Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(object.status))) && (
									<div className="col-sm-12 col-xs-12">
										<button type="button" className="el-button el-button-success el-button-small" onClick={this.onSave}>
											<span>Lưu</span>
										</button>
									</div>
								)}
							</div>
							{object.id && (
								<div className="crm-section row">
									<div className="col-sm-12 col-xs-12 mb10">
										<span className="sub-title-form">Bảng giá và khuyến mãi/chiết khấu chi tiết</span>
										<span className="ml10 end-date pull-right">* Sau khi nhập xong bấm Enter để lưu lại</span>
									</div>
									<div className="col-sm-12 col-xs-12">
										<div className="body-table el-table">
											<TableComponent>
												<TableHeader tableType="TableHeader" width={250}>
                                                    Mô tả
												</TableHeader>
												<TableHeader tableType="TableHeader" width={125}>
                                                    Thành tiền nhỏ nhất
												</TableHeader>
												<TableHeader tableType="TableHeader" width={125}>
                                                    Thành tiền lớn nhất
												</TableHeader>
												<TableHeader tableType="TableHeader" width={100}>
                                                    % Tỉ lệ
												</TableHeader>
												<TableHeader tableType="TableHeader" width={150}>
                                                    Tiền mặt
												</TableHeader>
												<TableBody tableType="TableBody">
													{data_list.map((item, key)=> {
														let id = item.id;
														let discount_percent_value = input_list[id + "discount_percent_value"] ? input_list[id + "discount_percent_value"] : item.discount_percent;
														let discount_cash_value = input_list[id + "discount_cash_value"] ? input_list[id + "discount_cash_value"] : item.discount_cash;
														let data = {
															description: item.description,
															from_amount: utils.formatNumber(item.from_amount, 0, ".", "đ"),
															to_amount: utils.formatNumber(item.to_amount, 0, ".", "đ"),
															discount_percent: utils.formatNumber(discount_percent_value, 0, ".", "%"),
															discount_cash: utils.formatNumber(discount_cash_value, 0, ".", "đ")
														};
														return(
															<tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
																<td>
																	<div className="cell" title={data.description}>{data.description}</div>
																</td>
																<td>
																	<div className="cell text-right" title={data.from_amount}>{data.from_amount}</div>
																</td>
																<td>
																	<div className="cell text-right" title={data.to_amount}>{data.to_amount}</div>
																</td>
																<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "discount_percent")}}>
																	<div className="cell text-right" title={data.discount_percent}>
																		{!input_list[id + "discount_percent"] ? (
																			<span>{data.discount_percent}</span>
																		) : (
																			<InputTable className="w100 input-number" isNumber suffix=" %"
																				error={input_list[id + "discount_percent_error"]}
																				value={discount_percent_value ? discount_percent_value : "0"}
																				onChange={(value) => {
																					input_list[id + "discount_percent_value"] = value;
																					item.discount_percent = value;
																					this.setState({input_list: input_list});
																				}}
																				onEnter={() => {
																					this.onSaveItem(item, input_list);
																				}}
																			/>
																		)}
																	</div>
																</td>
																<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "discount_cash")}}>
																	<div className="cell text-right" title={data.discount_cash}>
																		{!input_list[id + "discount_cash"] ? (
																			<span>{data.discount_cash}</span>
																		) : (
																			<InputTable className="w100 input-number" isNumber suffix=" đ"
																				error={input_list[id + "discount_cash_error"]}
																				value={discount_cash_value ? discount_cash_value : "0"}
																				onChange={(value) => {
																					input_list[id + "discount_cash_value"] = value;
																					item.discount_cash = value;
																					this.setState({input_list: input_list});
																				}}
																				onEnter={() => {
																					this.onSaveItem(item, input_list);
																				}}
																			/>
																		)}
																	</div>
																</td>
															</tr>
														)
													})}
												</TableBody>
											</TableComponent>
										</div>
									</div>
								</div>
							)}
						</div>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupPriceRecontract);
