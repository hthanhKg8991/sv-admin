import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";

import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import {approveOrderIncreasingConfig,copyOrderIncreasingConfig,deleteOrderIncreasingConfig,getListOrderIncreasingConfig,rejectOrderIncreasingConfig} from "api/saleOrder";

import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";

import PopupPrice from "./Popup/PopupPrice";
import ComponentFilter from "./ComponentFilter";

const idKey = "OfferIncreasingConfigPageList";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: "Bảng % tăng trưởng",
					width: 140,
					cell: row => <span>{row?.id} - {row?.name}</span>
				},
				{
					title: "Gói Subscription",
					width: 80,
					cell: row => <span>{row?.combo_id} - {row?.combo_name}</span>
				},
				{
					title: "Thời gian hiệu lực",
					width: 80,
					cell: row => <span>{moment.unix(row?.available_from_date).format("DD-MM-YYYY")} - {moment.unix(row?.available_to_date).format("DD-MM-YYYY")}</span>
				},
				{
					title: "Trạng thái",
					width: 50,
					cell: row => <div className="text-center">
						<SpanCommon idKey={Constant.COMMON_DATA_KEY_price_status} value={row?.status}/>
					</div>
				},
				{
					title: "Thao tác",
					width: 50,
					cell: row => (
						<div className="cell">
							<div className="text-underline pointer">
								<CanRender actionCode={ROLES.accountant_offer_increasing_config_update}>
									{[Constant.STATUS_INACTIVED,Constant.STATUS_DISABLED].includes(row?.status) && <span className="text-bold text-primary" onClick={()=>{this.onEdit(row?.id,row?.status)}}>
                                        Chỉnh sửa
									</span>}
								</CanRender>
								{
									![Constant.STATUS_INACTIVED,Constant.STATUS_DISABLED].includes(row?.status) && 
                                    <span className="text-bold text-primary" onClick={()=>{this.onEdit(row?.id,row?.status)}}>
                                        Chi tiết
                                    </span>
								}
							</div>
							{[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(row?.status) && (
								<CanRender actionCode={ROLES.accountant_offer_increasing_config_approve}>
									<div className="text-underline pointer">
										<span className="text-bold text-success" onClick={()=>{this.onApprove(row?.id)}}>Hoạt động</span>
									</div>
								</CanRender>
							)}
							{[Constant.STATUS_ACTIVED].includes(row?.status) && (
								<CanRender actionCode={ROLES.accountant_offer_increasing_config_reject}>
									<div className="text-underline pointer">
										<span className="text-bold text-danger" onClick={()=>{this.onStop(row?.id)}}>Ngưng hoạt động</span>
									</div>
								</CanRender>
							)}
							<div className="text-underline pointer">
								<CanRender actionCode={ROLES.accountant_offer_increasing_config_create}>
									<span className="text-bold text-primary" onClick={()=>{this.onCopy(row?.id)}}>Sao chép</span>
								</CanRender>
							</div>
							{[Constant.STATUS_INACTIVED,Constant.STATUS_DISABLED].includes(row?.status) && (
								<CanRender actionCode={ROLES.accountant_offer_increasing_config_delete}>
									<div className="text-underline pointer">
										<span className="text-bold text-danger" onClick={()=>{this.onDelete(row?.id)}}>Xóa</span>
									</div>
								</CanRender>
							)}
						</div>
					)
				},
			],
			loading: false,
		};

		this.onEdit = this._onEdit.bind(this);
		this.onCreate = this._onCreate.bind(this);
		this.onStop = this._onStop.bind(this);
		this.onDelete = this._onDelete.bind(this);
		this.onCopy = this._onCopy.bind(this);
		this.onApprove = this._onApprove.bind(this)
	}

	_onEdit(id,status){
		const isEditable = (!status || [Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(status)))
		this.props.uiAction.createPopup(PopupPrice, (isEditable ? "Chỉnh sửa" : "Xem chi tiết") + " bảng tăng trưởng net sales và tăng trưởng SL tin Offer", {
			id: id,
			idKey: idKey,
			service_type: this.props.service_type,
			status: status
		});
	}

	_onCreate(id){
		this.props.uiAction.createPopup(PopupPrice, "Tạo bảng tăng trưởng net sales và tăng trưởng SL tin Offer", {
			id: id,
			idKey: idKey,
			service_type: this.props.service_type
		});
	}

	async _onStop(id) {
		const {actions} = this.props
		this.props.uiAction.SmartMessageBox({
			title: `Bạn có chắc muốn dừng hoạt động bảng % tăng trưởng ID: ${id} này`,
			buttons: ["Hủy", "Xác nhận"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Xác nhận") {
				const res = await rejectOrderIncreasingConfig({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}
			}
			this.props.uiAction.hideSmartMessageBox();
		});
	}
	async _onApprove(id) {
		const {actions} = this.props
		this.props.uiAction.SmartMessageBox({
			title: `Bạn có chắc muốn hoạt động bảng % tăng trưởng ID: ${id} này`,
			buttons: ["Hủy", "Xác nhận"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Xác nhận") {
				const res = await approveOrderIncreasingConfig({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}
			}
			this.props.uiAction.hideSmartMessageBox();
		});
	}

	async _onDelete(id) {
		const {actions} = this.props
		this.props.uiAction.SmartMessageBox({
			title: `Bạn có chắc muốn xoá bảng % tăng trưởng ID: ${id} này`,
			buttons: ["Hủy", "Xác nhận"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Xác nhận") {
				const res = await deleteOrderIncreasingConfig({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}
			}
			this.props.uiAction.hideSmartMessageBox();
		});
	}

	async _onCopy(id) {
		const {actions} = this.props
		this.props.uiAction.SmartMessageBox({
			title: `Bạn có chắc muốn copy bảng % tăng trưởng ID: ${id} này`,
			buttons: ["Hủy", "Xác nhận"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Xác nhận") {
				const res = await copyOrderIncreasingConfig({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}
			}
			this.props.uiAction.hideSmartMessageBox();
		});
	}

	render() {
		const {columns} = this.state;
		const {query, defaultQuery, history} = this.props;

		return (
			<Default
				left={(
					<WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
				)}
				title="Mức tăng trưởng net sales và tăng trưởng SL tin offer"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
				buttons={(
					<div className="left btnCreateNTD">
						<CanRender actionCode={ROLES.accountant_offer_increasing_config_create}>
							<button type="button" className="el-button el-button-primary el-button-small"
								onClick={this.onCreate}>
								<span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
							</button>
						</CanRender>
					</div>
				)}>
				<Gird idKey={idKey}
					fetchApi={getListOrderIncreasingConfig}
					query={query}
					columns={columns}
					defaultQuery={defaultQuery}
					history={history}
					isRedirectDetail={false}
				/>
			</Default>
		)
	}
}

function mapStateToProps(state) {
	return {
		branch: state.branch
	}
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
