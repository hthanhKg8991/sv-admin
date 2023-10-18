import React,{Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import config from "config";
import _ from "lodash";
import moment from "moment";
import {bindActionCreators} from "redux";

import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import Dropbox from "components/Common/InputValue/Dropbox";
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
import {publish} from "utils/event";

import PricePromotion from "./PricePromotion";

const nonPricePromotion = [
	Constant.SERVICE_TYPE_EFFECT
];

class index extends Component {
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
				based_price: "Giá dịch vụ",
				point_convert_industry: "Điểm dịch vụ trang ngành",
				point_convert_home: "Điểm dịch vụ trang chủ",
				point_convert_refresh: "Điểm dịch vụ hiệu ứng làm mới",
			}
		};
		this.onSave = this._onSave.bind(this);
		this.onChange = this._onChange.bind(this);
		this.onDBClick = this._onDBClick.bind(this);
		this.onDBClick2 = this._onDBClick.bind(this);
		this.refreshList = this._refreshList.bind(this);
		this.onSaveItem = this._onSaveItem.bind(this);
		this.onSaveStatus = this._onSaveStatus.bind(this);
		this.activeItem = this._activeItem.bind(this);
	}
	_onSave(object_input, object_required){
		this.setState({object_error: {}});
		this.setState({name_focus: ""});

		let object = Object.assign({}, object_input);
		let check = utils.checkOnSaveRequired(object, object_required);
		if (check.error) {
			this.setState({name_focus: check.field});
			this.setState({object_error: check.fields});
			return;
		}
		object.service_type = this.props.service_type;
		this.props.uiAction.showLoading(); 
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_PRICE_SAVE, object);
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
		if([Constant.STATUS_INACTIVED].includes(parseInt(this.state.object.status))){
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
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_PRICE_DETAIL, args, delay);
	}

	_onSaveItem(item, input_list){
		this.props.uiAction.showLoading();
		let id = item.id;
		let args = {
			id: id
		};
		const mapObject = this.state.map;
		Object.keys(mapObject).forEach((name) => {
			if(input_list.hasOwnProperty(id + name + "_value")) {
				args[name] = input_list[id + name + "_value"];
			}
		});
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_PRICE_DETAIL_UPDATE, args);
	}

	
	_onSaveStatus(item, status){
		this.props.uiAction.showLoading();
		let args = {
			id: item.id,
			status: status
		};
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_PRICE_DETAIL_UPDATE, args);
	}
	_activeItem(key){
		let itemActive = this.state.itemActive;
		itemActive = itemActive === key ? -1 : key;
		this.setState({itemActive: itemActive});
	}
	componentDidMount(){
		if(this.props.object){
			this.refreshList();
		}
	}
	componentWillReceiveProps(newProps) {
		const {idKey} = this.props
		if (newProps.api[ConstantURL.API_URL_POST_PRICE_SAVE]){
			let response = newProps.api[ConstantURL.API_URL_POST_PRICE_SAVE];
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				let object = this.state.object;
				if(!object.id) {
					this.setState({object: response.data},()=>{
						this.refreshList();
					});
				}
				publish(".refresh", {}, idKey);
			}else{
				this.setState({object_error: Object.assign({},response.data)});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_PRICE_SAVE);
		}
		if (newProps.api[ConstantURL.API_URL_GET_PRICE_DETAIL]) {
			let response = newProps.api[ConstantURL.API_URL_GET_PRICE_DETAIL];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({object: response.data.info});
				this.setState({data_list: response.data.details});
			}
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_PRICE_DETAIL);
		}

		
		if (newProps.api[ConstantURL.API_URL_POST_PRICE_DETAIL_UPDATE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_PRICE_DETAIL_UPDATE];
			
			let args = response.info.args;
			if(args.status){
				if (response.code === Constant.CODE_SUCCESS) {
					this.refreshList();
				}
			}else{
				let input_list = Object.assign({}, this.state.input_list);
				let map = this.state.map;
				if (response.code === Constant.CODE_SUCCESS) {
					this.props.uiAction.putToastSuccess("Thao tác thành công!");
					Object.keys(map).forEach((name) => {
						input_list[args.id + name] = false;
						input_list[args.id + name + "_error"] = false;
					});
					this.refreshList();
				}
				this.setState({input_list: input_list});
			}

			this.props.uiAction.hideLoading();
			
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_PRICE_DETAIL_UPDATE);
		}

		if (newProps.api[ConstantURL.API_URL_POST_PRICE_PROMOTION_UPDATE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_PRICE_PROMOTION_UPDATE];
			
			let args = response.info.args;
			if(args.status){
				if (response.code === Constant.CODE_SUCCESS) {
					this.refreshList();
				}
			}else{
				let input_list = Object.assign({}, this.state.input_list);
				let map = this.state.map;
				if (response.code === Constant.CODE_SUCCESS) {
					this.props.uiAction.putToastSuccess("Thao tác thành công!");
					Object.keys(map).forEach((name) => {
						input_list[args.id + name] = false;
						input_list[args.id + name + "_error"] = false;
					});
					this.refreshList();
				}
				this.setState({input_list: input_list});
			}

			this.props.uiAction.hideLoading();
			
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_PRICE_PROMOTION_UPDATE);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !(JSON.stringify(nextState) === JSON.stringify(this.state));
	}
	render () {
		const {branch} = this.props;
		let {object, object_error, object_required, name_focus, data_list, input_list, itemActive} = this.state;
		let minDate = object.start_date ? moment.unix(object.start_date) : moment();
		let branch_list = this.props.branch.branch_list.filter(c => c.channel_code === this.props.branch.currentBranch.channel_code);
		// #CONFIG_BRANCH
		const {channel_code} = branch.currentBranch;
		const isMW = channel_code === Constant.CHANNEL_CODE_MW;
		/* MW bỏ options chọn chi nhánh --> BE xử lý chổ chi nhánh */
		if (!isMW) {
			if ([Constant.SERVICE_TYPE_JOB_FREEMIUM, Constant.SERVICE_TYPE_ACCOUNT_SERVICE, Constant.SERVICE_TYPE_JOB_BASIC, Constant.SERVICE_TYPE_EFFECT, Constant.SERVICE_TYPE_FILTER_MINISITE, Constant.SERVICE_TYPE_FILTER_RESUME_2018, Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME, Constant.SERVICE_TYPE_SERVICE_POINT].includes(this.props.service_type)) {
				branch_list = [];
				object_required = object_required.filter(c => c !== "branch_code");
			} else {
				object_required.push("branch_code");
			}
		}

		return (
			<div className="dialog-popup-body">
				<div className="popupContainer">
					<div className="form-container">
						<form onSubmit={(event)=>{
							event.preventDefault();
							this.onSave(object, object_required);
						}}>
							<div className="crm-section row">
								<div className="col-sm-12 col-xs-12 mb10">
									<Input2 type="text" name="title" label="Tên bảng giá" required={object_required.includes("title")}
										error={object_error.title} value={object.title} nameFocus={name_focus}
										onChange={this.onChange}
									/>
								</div>
								{(!isMW) && (
									branch_list.length > 0 && (
										<div className="col-sm-12 col-xs-12 mb10">
											<Dropbox name="branch_code" label="Chi nhánh" data={branch_list}
												required={object_required.includes("branch_code")}
												key_value="code" key_title="name"
												value={object.branch_code} error={object_error.branch_code}
												nameFocus={name_focus}
												onChange={this.onChange}
											/>
										</div>
									)
								)}
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
									<InputArea name="description" label="Ghi chú" required={object_required.includes("description")}
										style={{height:"100px", minHeight:"100px"}} nameFocus={name_focus}
										value={object.description} error={object_error.description}
										onChange={this.onChange}
									/>
								</div>
								{(!object.status || [Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(object.status))) && (
									<div className="col-sm-12 col-xs-12">
										<button type="submit" className="el-button el-button-success el-button-small">
											<span>Lưu</span>
										</button>
									</div>
								)}
							</div>
						</form>
						{object.id && (
							<div className="crm-section row">
								<div className="col-sm-12 col-xs-12 mb10">
									<span className="sub-title-form">Bảng giá và khuyến mãi/chiết khấu chi tiết</span>
									<span className="ml10 end-date pull-right">* Sau khi nhập xong bấm Enter để lưu lại</span>
								</div>
								<div className="col-sm-12 col-xs-12">
									<div className="body-table el-table">
										<TableComponent DragScroll={false}>
											<TableHeader tableType="TableHeader" width={250}>
                                                Tên dịch vụ
											</TableHeader>

											{!_.includes(nonPricePromotion, object.service_type) && (
												<TableHeader tableType="TableHeader" width={125}>
                                                    Giá dịch vụ {(this.props.service_type === Constant.SERVICE_TYPE_FILTER_RESUME_2018 || this.props.service_type === Constant.SERVICE_TYPE_SERVICE_POINT) ? "(giá/100 điểm)" : 
														this.props.service_type === Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME?"(giá/30CVs)":""}
												</TableHeader>
											)}
											{_.includes(nonPricePromotion, object.service_type) && (
												<TableHeader tableType="TableHeader" width={125}>
													{isMW ? "Giá dịch vụ" : "Đơn giá (% theo gói dịch vụ chính)"}
												</TableHeader>
											)}

											<TableHeader tableType="TableHeader" width={100}>
                                                Cho phép bán
											</TableHeader>
											{(this.props.service_type === Constant.SERVICE_TYPE_EFFECT)  && (
												<TableHeader tableType="TableHeader" width={100}>
                                                	Điểm dịch vụ Trang chủ
												</TableHeader>
											)}
											{(this.props.service_type === Constant.SERVICE_TYPE_EFFECT)  && (
												<TableHeader tableType="TableHeader" width={100}>
                                                	Điểm dịch vụ Trang ngành
												</TableHeader>
											)}
											
											<TableBody tableType="TableBody">
												{data_list.map((item, key)=> {
													let id = item.id;
													let based_price_value = input_list[id + "based_price_value"] ? input_list[id + "based_price_value"] : item.based_price;
													let point_convert_home_value = input_list[id + "point_convert_home_value"] ? input_list[id + "point_convert_home_value"] : item.point_convert_home;
													let point_convert_industry_value = input_list[id + "point_convert_industry_value"] ? input_list[id + "point_convert_industry_value"] : item.point_convert_industry;
													let point_convert_refresh_value = input_list[id + "point_convert_refresh_value"] ? input_list[id + "point_convert_refresh_value"] : item.point_convert_refresh;
													let priceSuffix = _.includes(nonPricePromotion, object.service_type) && !isMW ? " %" : " đ";
													let data = {
														service_code: item.service_code,
														service_name: item.service_name,
														based_price: utils.formatNumber(based_price_value, 0, ".", priceSuffix),
														point_convert_industry: utils.formatNumber(point_convert_industry_value, 0),
														point_convert_home: utils.formatNumber(point_convert_home_value, 0),
														point_convert_refresh: utils.formatNumber(point_convert_refresh_value, 0),
														checked: parseInt(item.status) === Constant.STATUS_ACTIVED
													};
													return(
														<React.Fragment key={key}>
															{!_.includes(nonPricePromotion, object.service_type) && (
																<tr className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""), (itemActive === id ? "active" : ""))}>
																	<td onClick={()=>{this.activeItem(id)}}>
																		<div className="cell" title={data.service_name}>{data.service_name}</div>
																	</td>
																	<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "based_price")}}>
																		<div className="cell text-right" title={data.based_price}>
																			{!input_list[id + "based_price"] ? (
																				<span>{data.based_price}</span>
																			) : (
																				<InputTable className="w100 input-number" isNumber suffix={priceSuffix}
																					error={input_list[id + "based_price_error"]}
																					value={based_price_value ? based_price_value : "0"}
																					onChange={(value) => {
																						input_list[id + "based_price_value"] = value;
																						item.based_price = value;
																						this.setState({input_list: input_list});
																					}}
																					onEnter={() => {
																						this.onSaveItem(item, input_list);
																					}}
																				/>
																			)}
																		</div>
																	</td>
																	<td>
																		<div className="cell text-center">
																			<Checkbox checked={data.checked} color="primary"
																				icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
																				checkedIcon={<CheckBoxIcon fontSize="large" />}
																				onChange={()=>{
																					if([Constant.STATUS_INACTIVED].includes(parseInt(object.status))) {
																						let status = data.checked ? Constant.STATUS_INACTIVED : Constant.STATUS_ACTIVED;
																						this.onSaveStatus(item, status);
																					}
																				}}
																			/>
																		</div>
																	</td>
																</tr>
															)}

															{_.includes(nonPricePromotion, object.service_type) && (
																<tr className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
																	<td>
																		<div className="cell" title={data.service_name}>{data.service_name}</div>
																	</td>
																	<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "based_price")}}>
																		<div className="cell text-right" title={data.based_price}>
																			{!input_list[id + "based_price"] ? (
																				<span>{data.based_price}</span>
																			) : (
																				<InputTable className="w100 input-number" isNumber suffix={priceSuffix}
																					error={input_list[id + "based_price_error"]}
																					value={based_price_value ? based_price_value : "0"}
																					onChange={(value) => {
																						input_list[id + "based_price_value"] = value;
																						item.based_price = value;
																						this.setState({input_list: input_list});
																					}}
																					onEnter={() => {
																						this.onSaveItem(item, input_list);
																					}}
																				/>
																			)}
																		</div>
																	</td>
																	<td>
																		<div className="cell text-center">
																			<Checkbox checked={data.checked} color="primary"
																				icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
																				checkedIcon={<CheckBoxIcon fontSize="large" />}
																				onChange={()=>{
																					if([Constant.STATUS_INACTIVED].includes(parseInt(object.status))) {
																						let status = data.checked ? Constant.STATUS_INACTIVED : Constant.STATUS_ACTIVED;
																						this.onSaveStatus(item, status);
																					}
																				}}
																			/>
																		</div>
																	</td>
																	{(this.props.service_type === Constant.SERVICE_TYPE_EFFECT)  && !['vl24h.refresh_day','vl24h.refresh_hour'].includes(data.service_code) && (
																		<>
																			<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "point_convert_home")}}>
																			<div className="cell text-right" title={data.point_convert_home}>
																				{!input_list[id + "point_convert_home"] ? (
																					<span>{data.point_convert_home}</span>
																				) : (
																					<InputTable className="w100 input-number" isNumber
																						error={input_list[id + "point_convert_home_error"]}
																						value={point_convert_home_value ? point_convert_home_value : "0"}
																						onChange={(value) => {
																							input_list[id + "point_convert_home_value"] = value;
																							item.point_convert_home = value;
																							this.setState({input_list: input_list});
																						}}
																						onEnter={() => {
																							this.onSaveItem(item, input_list);
																						}}
																					/>
																				)}
																			</div>
																		</td>
																		<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "point_convert_industry")}}>
																		<div className="cell text-right" title={data.point_convert_industry}>
																			{!input_list[id + "point_convert_industry"] ? (
																				<span>{data.point_convert_industry}</span>
																			) : (
																				<InputTable className="w100 input-number" isNumber
																					error={input_list[id + "point_convert_industry_error"]}
																					value={point_convert_industry_value ? point_convert_industry_value : "0"}
																					onChange={(value) => {
																						input_list[id + "point_convert_industry_value"] = value;
																						item.point_convert_industry = value;
																						this.setState({input_list: input_list});
																					}}
																					onEnter={() => {
																						this.onSaveItem(item, input_list);
																					}}
																				/>
																			)}
																		</div>
																	</td>
																		</>
																	)}
																	{(this.props.service_type === Constant.SERVICE_TYPE_EFFECT)  && ['vl24h.refresh_day','vl24h.refresh_hour'].includes(data.service_code) && (
																		<>
																		<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "point_convert_refresh")}}>
																			<div className="cell text-right" title={data.point_convert}>
																				{!input_list[id + "point_convert_refresh"] ? (
																					<span>{data.point_convert_refresh}</span>
																				) : (
																					<InputTable className="w100 input-number" isNumber
																						error={input_list[id + "point_convert_refresh_error"]}
																						value={point_convert_refresh_value ? point_convert_refresh_value : "0"}
																						onChange={(value) => {
																							input_list[id + "point_convert_refresh_value"] = value;
																							item.point_convert_refresh = value;
																							this.setState({input_list: input_list});
																						}}
																						onEnter={() => {
																							this.onSaveItem(item, input_list);
																						}}
																					/>
																				)}
																			</div>
																		</td>
																		<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "point_convert_refresh")}}>
																			<div className="cell text-right" title={data.point_convert_refresh}>
																				{!input_list[id + "point_convert_refresh"] ? (
																					<span>{data.point_convert_refresh}</span>
																				) : (
																					<InputTable className="w100 input-number" isNumber
																						error={input_list[id + "point_convert_refresh_error"]}
																						value={point_convert_refresh_value ? point_convert_refresh_value : "0"}
																						onChange={(value) => {
																							input_list[id + "point_convert_refresh_value"] = value;
																							item.point_convert_refresh = value;
																							this.setState({input_list: input_list});
																						}}
																						onEnter={() => {
																							this.onSaveItem(item, input_list);
																						}}
																					/>
																				)}
																			</div>
																		</td>
																		</>
																	)}
																</tr>
															)}

															{itemActive === id && (
																<tr className="el-table-item">
																	<td colSpan={3}>
																		<PricePromotion service_code={item.service_code} service_type={this.props.service_type} object={object}/>
																	</td>
																</tr>
															)}
														</React.Fragment>
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
		)
	}
}
function mapStateToProps(state) {
	return {
		sys: state.sys,
		api: state.api,
		branch: state.branch,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		apiAction: bindActionCreators(apiAction, dispatch),
		uiAction: bindActionCreators(uiAction, dispatch)
	};
}
export default connect(mapStateToProps,mapDispatchToProps)(index);
