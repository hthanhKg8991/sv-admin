import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from "classnames";
import config from "config";
import {bindActionCreators} from "redux";

import InputTable from "components/Common/InputValue/InputTable";
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
import {SERVICE_TYPE_JOB_BASIC} from "utils/Constant";

class PricePromotion extends Component {
	constructor(props) {
		console.log(props, "name: props.lg")
		super(props);
		this.state = {
			loading: true,
			data_list: [],
			input_list: {},
			map: {
				week_quantity: "Số tuần",
				based_quantity: "Số tin",
				promotion_rate: "Khuyến mãi",
				discount_rate: "Chiết khấu",
				point_convert: "Điểm dịch vụ",
			}
		};
		this.onDBClick = this._onDBClick.bind(this);
		this.refreshList = this._refreshList.bind(this);
		this.onSaveItem = this._onSaveItem.bind(this);
	}
	_onDBClick(id, key) {
		if([Constant.STATUS_INACTIVED].includes(parseInt(this.props.object.status))) {
			let input_list = Object.assign({}, this.state.input_list);
			input_list[id + key] = true;
			this.setState({input_list: input_list});
		}
	}
	_refreshList(delay = 0, loading = true){
		this.setState({loading: loading});
		let args = {
			price_list_id: this.props.object.id,
			service_code: this.props.service_code
		};
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_PRICE_PROMOTION_LIST, args, delay);
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
		this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_PRICE_PROMOTION_UPDATE, args);
	}
	componentDidMount(){
		this.refreshList();
	}
	componentWillReceiveProps(newProps) {
		if (newProps.api[ConstantURL.API_URL_GET_PRICE_PROMOTION_LIST]) {
			let response = newProps.api[ConstantURL.API_URL_GET_PRICE_PROMOTION_LIST];
			if (response.code === Constant.CODE_SUCCESS) {
				this.setState({data_list: response.data});
			}
			this.setState({loading: false});
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_PRICE_PROMOTION_LIST);
		}
		if (newProps.api[ConstantURL.API_URL_POST_PRICE_PROMOTION_UPDATE]) {
			let response = newProps.api[ConstantURL.API_URL_POST_PRICE_PROMOTION_UPDATE];
			let args = response.info.args;
			let input_list = Object.assign({}, this.state.input_list);
			let map = this.state.map;
			if (response.code === Constant.CODE_SUCCESS) {
				this.props.uiAction.putToastSuccess("Thao tác thành công!");
				Object.keys(map).forEach((name) => {
					input_list[args.id + name] = false;
					input_list[args.id + name + "_error"] = false;
				});
				this.refreshList(0, false);
			}else{
				// if (Array.isArray(response.data)) {
				//     let msg = response.msg + "\n";
				//     Object.keys(response.data).forEach((name) => {
				//         input_list[args.id + name +'_error'] = true;
				//         let error = response.data[name].replace(":attr_name", map[name]);
				//         msg = msg + error + "\n";
				//     });
				//     this.props.uiAction.putToastError(msg);
				// }
			}
			this.setState({input_list: input_list});
			this.props.uiAction.hideLoading();
			this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_PRICE_PROMOTION_UPDATE);
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return !(JSON.stringify(nextState) === JSON.stringify(this.state));
	}
	render () {
		if(this.state.loading){
			return(
				<div className="text-center">
					<LoadingSmall />
				</div>
			)
		}
		const {service_type} = this.props;
		const isJobJox = service_type === Constant.SERVICE_TYPE_JOB_BOX;
		const isJobJoxBasic = service_type === Constant.SERVICE_TYPE_JOB_BASIC;
		let {data_list, input_list} = this.state;

		let titleColumnOne = "Số lượng";
		let titleColumnTwo = "Số lượng";
		if (service_type === Constant.SERVICE_TYPE_FILTER_RESUME_2018 || service_type === Constant.SERVICE_TYPE_SERVICE_POINT) {
			titleColumnOne = "Số tuần";
			titleColumnTwo = "Điểm";
		} else if (service_type === Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME){
			titleColumnOne = "Số tuần";
			titleColumnTwo = "Số lượng CVs";
		}

		return (
			<div className="card-body">
				<div className="body-table el-table">
					<TableComponent allowDragScroll={false}>
						{isJobJox && (
							<TableHeader tableType="TableHeader" width={100}>
                                Số tuần
							</TableHeader>
						)}
						{(this.props.service_type === Constant.SERVICE_TYPE_FILTER_RESUME_2018 || this.props.service_type === Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME || this.props.service_type === Constant.SERVICE_TYPE_SERVICE_POINT) && (
							<TableHeader tableType="TableHeader" width={100}>
								{titleColumnOne}
							</TableHeader>
						)}
						<TableHeader tableType="TableHeader" width={100}>
							{titleColumnTwo}
						</TableHeader>
						<TableHeader tableType="TableHeader" width={100}>
                            Khuyến mãi
						</TableHeader>
						<TableHeader tableType="TableHeader" width={100}>
                            Chiết khấu
						</TableHeader>
						<TableHeader tableType="TableHeader" width={100}>
                            Điểm dịch vụ
						</TableHeader>
						<TableBody tableType="TableBody">
							{data_list.map((item, key)=> {
								let type = "tin";
								let qtty = item.based_quantity;
								if ([Constant.UNIT_TYPE_POIN, Constant.UNIT_TYPE_WEEK, Constant.UNIT_TYPE_CV, Constant.UNIT_TYPE_POINT_NEW].includes(item.unit_type)){
									type = "tuần";
								}
								if ([Constant.SERVICE_TYPE_FILTER_RESUME_2018, Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME, Constant.SERVICE_TYPE_SERVICE_POINT].includes(this.props.service_type)){
									qtty = item.point_week_quantity;
								}
								let id = item.id;
								let promotion_rate_value = input_list[id + "promotion_rate_value"] ? input_list[id + "promotion_rate_value"] : item.promotion_rate;
								let discount_rate_value = input_list[id + "discount_rate_value"] ? input_list[id + "discount_rate_value"] : item.discount_rate;
								let point_convert_value = input_list[id + "point_convert_value"] ? input_list[id + "point_convert_value"] : item.point_convert;
								let week_quantity_value = input_list[id + "week_quantity_value"] ? input_list[id + "week_quantity_value"] : item.week_quantity;
								let based_quantity_value = input_list[id + "based_quantity_value"] ? input_list[id + "based_quantity_value"] : item.based_quantity;
								let data = {
									id: item.id,
									qtty: utils.formatNumber(qtty, 0, ".", type),
									based_quantity: utils.formatNumber(item.based_quantity, 0, ".", ""),
									promotion_rate: utils.formatNumber(promotion_rate_value, 0, ".", "%"),
									discount_rate: utils.formatNumberWithDecimal(discount_rate_value, 1, ".", "%"),
									point_convert: utils.formatNumber(point_convert_value, 0),
									week_quantity: utils.formatNumber(week_quantity_value, 0, ".", " tuần"),
								};
								return(
									<tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
										{isJobJox && (
											<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "week_quantity")}}>
												<div className="cell text-right" title={data.week_quantity}>
													{!input_list[id + "week_quantity"] ? (
														<span>{data.week_quantity}</span>
													) : (
														<InputTable className="w100 input-number" isNumber suffix=" tuần"
															error={input_list[id + "week_quantity_error"]}
															value={week_quantity_value ? week_quantity_value : "0"}
															onChange={(value) => {
																input_list[id + "week_quantity_value"] = value;
																item.week_quantity = value;
																this.setState({input_list: input_list});
															}}
															onEnter={() => {
																this.onSaveItem(item, input_list);
															}}
														/>
													)}
												</div>
											</td>
										)}
										{this.props.service_type === Constant.SERVICE_TYPE_JOB_BOX || isJobJoxBasic ?
											(
												<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "based_quantity")}}>
													<div className="cell text-right" title={data.qtty}>
														{!input_list[id + "based_quantity"] ? (
															<span>{data.qtty}</span>
														) : (
															<InputTable className="w100 input-number" isNumber suffix=" tin"
																error={input_list[id + "based_quantity_error"]}
																value={based_quantity_value ? based_quantity_value : "0"}
																onChange={(value) => {
																	input_list[id + "based_quantity_value"] = value;
																	item.based_quantity = value;
																	this.setState({input_list: input_list});
																}}
																onEnter={() => {
																	this.onSaveItem(item, input_list);
																}}
															/>
														)}
													</div>
												</td>
											) : (
												<td>
													<div className="cell" title={data.qtty}>{data.qtty}</div>
												</td>
											)
										}
										{(this.props.service_type === Constant.SERVICE_TYPE_FILTER_RESUME_2018 || this.props.service_type === Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME || this.props.service_type === Constant.SERVICE_TYPE_SERVICE_POINT) && (
											<td>
												<div className="cell" title={data.based_quantity}>{data.based_quantity}</div>
											</td>
										)}
										<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "promotion_rate")}}>
											<div className="cell text-right" title={data.promotion_rate}>
												{!input_list[id + "promotion_rate"] ? (
													<span>{data.promotion_rate}</span>
												) : (
													<InputTable className="w100 input-number" isNumber suffix=" %"
														error={input_list[id + "promotion_rate_error"]}
														value={promotion_rate_value ? promotion_rate_value : "0"}
														onChange={(value) => {
															input_list[id + "promotion_rate_value"] = value;
															item.promotion_rate = value;
															this.setState({input_list: input_list});
														}}
														onEnter={() => {
															this.onSaveItem(item, input_list);
														}}
													/>
												)}
											</div>
										</td>
										<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "discount_rate")}}>
											<div className="cell text-right" title={data.discount_rate}>
												{!input_list[id + "discount_rate"] ? (
													<span>{data.discount_rate}</span>
												) : (
													<InputTable className="w100 input-number" isNumber decimalScale={1} suffix=" %"
														error={input_list[id + "discount_rate_error"]}
														value={discount_rate_value ? discount_rate_value : "0"}
														onChange={(value) => {
															input_list[id + "discount_rate_value"] = value;
															item.discount_rate = value;
															this.setState({input_list: input_list});
														}}
														onEnter={() => {
															this.onSaveItem(item, input_list);
														}}
													/>
												)}
											</div>
										</td>
										<td className='td-input' onDoubleClick={()=>{this.onDBClick(id, "point_convert")}}>
											<div className="cell text-right" title={data.point_convert}>
												{!input_list[id + "point_convert"] ? (
													<span>{data.point_convert}</span>
												) : (
													<InputTable className="w100 input-number" isNumber
														error={input_list[id + "point_convert_error"]}
														value={point_convert_value ? point_convert_value : "0"}
														onChange={(value) => {
															input_list[id + "point_convert_value"] = value;
															item.point_convert = value;
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
export default connect(mapStateToProps,mapDispatchToProps)(PricePromotion);
