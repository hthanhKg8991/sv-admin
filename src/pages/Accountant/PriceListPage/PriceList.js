import React, {Component} from "react";
import {Collapse} from "react-bootstrap";
import {connect} from "react-redux";
import classnames from "classnames";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";
import SpanCommon from "components/Common/Ui/SpanCommon";

import Gird from "components/Common/Ui/Table/Gird";

import {priceListApprove, priceListCopy, priceListDelete,priceListReject} from "api/saleOrder"
import {getPriceList} from "api/saleOrder";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as utils from "utils/utils";

import PopupPrice from "./Popup/PopupPrice/index";

class PriceList extends Component {
	constructor(props) {
		super(props);
		const branch_list = utils.convertArrayToObject(props.branch.branch_list, "code");
		this.state = {
			loading: true,
			show_detail: true,
			data_list: [],
			page: 1,
			per_page: Constant.PER_PAGE_LIMIT,
			idKey: "PriceListAccountant" + this.props.service_type,
			columns: [
				{
					title: "Bảng giá",
					width: 400,
					accessor: "title"
				},
				{
					title: "Chi nhánh",
					width: 150,
					cell: (row) => branch_list[row.branch_code] ? branch_list[row.branch_code].name : row.branch_code
				},
				{
					title: "Thời gian hiệu lực",
					width: 160,
					cell: row => <span>{row?.start_date ? moment.unix(row?.start_date).format("DD/MM/YYYY") : "**/**/****"} - {row?.end_date ? moment.unix(row?.end_date).format("DD/MM/YYYY") : "**/**/****"}</span>
				},
				{
					title: "Trạng thái",
					width: 140,
					cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_price_status} value={row?.status}/>
				},
				{
					title: "Thao tác",
					width: 140,
					cell: row => {
						const status = parseInt(row.status);
						const {sys, service_type, title} = this.props;
						const listService = sys?.service?.items;
						const detailService = listService?.find(_=>_?.service_type === service_type);
						const titleBox = title || detailService?.display_name_frontend || detailService?.display_name_contract;
						return <>
							<div className="text-underline pointer">
								<span className="text-bold text-primary" onClick={()=>{this.btnEdit(row,titleBox)}}>
									{status === Constant.STATUS_INACTIVED ? "Chỉnh sửa" : "Chi tiết"}
								</span>
							</div>
							{[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(status) && (
								<div className="text-underline pointer">
									<span className="text-bold text-success" onClick={()=>{this.btnApprove(row)}}>Hoạt động</span>
								</div>
							)}
							{[Constant.STATUS_ACTIVED].includes(status) && (
								<div className="text-underline pointer">
									<span className="text-bold text-danger" onClick={()=>{this.btnReject(row)}}>Ngưng hoạt động</span>
								</div>
							)}
							<div className="text-underline pointer">
								<span className="text-bold text-primary" onClick={()=>{this.btnCopy(row)}}>Sao chép</span>
							</div>
							{[Constant.STATUS_INACTIVED].includes(status) && (
								<div className="text-underline pointer">
									<span className="text-bold text-danger" onClick={()=>{this.btnDelete(row)}}>Xóa</span>
								</div>
							)}
						</>
					}
				},
			]
		};
		this.showHide = this._showHide.bind(this);
		this.btnAdd = this._btnAdd.bind(this);
		this.btnEdit = this._btnEdit.bind(this);
		this.btnApprove = this._btnApprove.bind(this);
		this.btnReject = this._btnReject.bind(this);
		this.btnCopy = this._btnCopy.bind(this);
		this.btnDelete = this._btnDelete.bind(this);
	}

	_showHide(){
		this.setState({show_detail: !this.state.show_detail});
	}
	_btnAdd(titleBox){
		const {idKey} = this.state
		this.props.uiAction.createPopup(PopupPrice, "Thêm Bảng Giảm Giá " + titleBox, {
			service_type: this.props.service_type,
			idKey
		});
	}
	_btnEdit(object,titleBox){
		const {idKey} = this.state
		this.props.uiAction.createPopup(PopupPrice, "Chi Tiết Bảng Giảm Giá " + titleBox, {
			object: object,
			service_type: this.props.service_type,
			idKey
		});
	}
	_btnApprove(object){
		const {uiAction} = this.props
		const {idKey} = this.state
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn chuyển trạng thái hoạt động cho bảng giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await priceListApprove({id: object.id, service_type: this.props.service_type});
				if (res.code == Constant.CODE_SUCCESS) {
					uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}else{
					uiAction.putToastError(res.msg)
				}
				uiAction.hideSmartMessageBox();
			}
		});
	}
	_btnReject(object){
		const {uiAction} = this.props
		const {idKey} = this.state
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn chuyển trạng thái ngưng hoạt động cho bảng giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await priceListReject({id: object.id, service_type: this.props.service_type});
				if (res.code == Constant.CODE_SUCCESS) {
					uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}else{
					uiAction.putToastError(res.msg)
				}
				uiAction.hideSmartMessageBox();
			}
		});
	}
	_btnCopy(object){
		const {uiAction} = this.props
		const {idKey} = this.state
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn sao chép bảng giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await priceListCopy({id: object.id, service_type: this.props.service_type})
				if(res.code == Constant.CODE_SUCCESS){
					uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}else{
					uiAction.putToastError(res.msg)
				}
				uiAction.hideSmartMessageBox();
			}
		});
	}
	_btnDelete(object){
		const {uiAction} = this.props
		const {idKey} = this.state
		uiAction.SmartMessageBox({
			title: "Bạn có chắc muốn xóa bảng giảm giá ?",
			content: "",
			buttons: ["No","Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await priceListDelete({id: object.id, service_type: this.props.service_type})
				if(res.code == Constant.CODE_SUCCESS){
					uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}else{
					uiAction.putToastError(res.msg)
				}
				uiAction.hideSmartMessageBox();
			}
		});
	}

	render () {
		let {show_detail, columns, idKey} = this.state;
		const {history, defaultQuery, sys, service_type, title} = this.props;
		const listService = sys?.service?.items;
		const detailService = listService?.find(_=>_?.service_type === service_type);
		const titleBox = title || detailService?.display_name_frontend || detailService?.display_name_contract;
		const query = queryString.parse(window.location.search);
		query["page"] = this.state.page;
		query["per_page"] = this.state.per_page;
		query["order_by[id]"] = "DESC";
		query["service_type"] = this.props.service_type;

		return (
			<div className="col-result-full crm-section">
				<div className="box-card box-full">
					<div className="box-card-title pointer card-header" onClick={this.showHide}>
						<span className="title left">{titleBox}</span>
						<div className={classnames("right", show_detail ? "active" : "")}>
							<button type="button" className="bt-refresh el-button">
								<i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
							</button>
						</div>
					</div>
					<Collapse in={show_detail}>
						<div>
							<div className="card-body">
								<div className="crm-section">
									<div className="top-table">
										<div className="left btnCreateNTD">
											<button type="button" className="el-button el-button-primary el-button-small" onClick={()=>this.btnAdd(titleBox)}>
												<span>Thêm bảng giá <i className="glyphicon glyphicon-plus"/></span>
											</button>
										</div>
										<div className="right">
											<button type="button" className="bt-refresh el-button" onClick={()=>{
												publish(".refresh", {}, idKey);
											}}>
												<i className="fa fa-refresh"/>
											</button>
										</div>
									</div>
									<Gird
										idKey={idKey}
										fetchApi={getPriceList}
										query={query}
										columns={columns}
										defaultQuery={defaultQuery}
										history={history}
										isRedirectDetail={false}
										isPushRoute={false}
									/>
								</div>
							</div>
						</div>
					</Collapse>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		branch: state.branch,
		sys: state.sys
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(PriceList);
