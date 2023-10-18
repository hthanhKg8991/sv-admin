import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {CanRender, Gird,SpanCommon, WrapFilter} from "components/Common/Ui";
import Default from "components/Layout/Page/Default";

import {
	approveGroupCampaign,
	getListGroupCampaign,
	rejectGroupCampaign
} from "api/saleOrder";

import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";

import PopupGroupCampaign from "./Popup/PopupGroupCampaign";
import ComponentFilter from "./ComponentFilter";

const idKey = "GroupCampaignPageList";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: "ID",
					width: 80,
					cell: row => <span>{row?.id}</span>
				},
				{
					title: "Tên",
					width: 80,
					cell: row => <span>{row?.name}</span>
				},
				{
					title: "Division code",
					width: 80,
					cell: row => <span>{row?.division_code?.join(", ")}</span>
				},
				{
					title: "Trạng thái",
					width: 50,
					cell: row => <div className="text-center">
						<SpanCommon idKey={Constant.COMMON_DATA_KEY_group_campaign_status} value={row?.status}/>
					</div>
				},
				{
					title: "Hành Động",
					width: 150,
					cell: row => (
						<>
							<CanRender actionCode={ROLES.accountant_group_campaign_update}>
								{[Constant.STATUS_INACTIVED,Constant.STATUS_ACTIVED].includes(row?.status) && <span className="pointer text-bold text-primary" onClick={()=>{this.onEdit(row?.id,row?.status)}}>
                                    Chỉnh sửa
								</span>}
							</CanRender>
                            
							{[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(row?.status) && (
								<CanRender actionCode={ROLES.accountant_group_campaign_change_status}>
                                    &nbsp;&nbsp;
									<span className="pointer text-bold text-success" onClick={()=>{this.onApprove(row?.id)}}>Hoạt động</span>
								</CanRender>
							)}
                            
							{[Constant.STATUS_ACTIVED].includes(row?.status) && (
								<CanRender actionCode={ROLES.accountant_group_campaign_change_status}>
                                    &nbsp;&nbsp;
									<span className="pointer text-bold text-warning" onClick={()=>{this.onStop(row?.id)}}>Ngưng hoạt động</span>
								</CanRender>
							)}
						</>
					)
				},
			],
			loading: false,
		};

		this.onEdit = this._onEdit.bind(this);
		this.onCreate = this._onCreate.bind(this);
		this.onStop = this._onStop.bind(this);
		this.onApprove = this._onApprove.bind(this)
	}

	_onEdit(id,status){
		const isEditable = (!status || [Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(status)))
		this.props.uiAction.createPopup(PopupGroupCampaign, (isEditable ? "Chỉnh sửa" : "Xem chi tiết"), {
			id: id,
			idKey: idKey,
			service_type: this.props.service_type,
			status: status
		});
	}

	_onCreate(id){
		this.props.uiAction.createPopup(PopupGroupCampaign, "Thêm Mới", {
			id: id,
			idKey: idKey,
			service_type: this.props.service_type
		});
	}

	async _onStop(id) {
		const {uiAction} = this.props
		uiAction.SmartMessageBox({
			title: `Bạn có chắc muốn dừng hoạt động Group Campaign ID: ${id} này`,
			buttons: ["Hủy", "Xác nhận"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Xác nhận") {
				const res = await rejectGroupCampaign({id});
				if (res) {
					uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, idKey);
				}
			}
			uiAction.hideSmartMessageBox();
		});
	}
	async _onApprove(id) {
		const {uiAction} = this.props
		uiAction.SmartMessageBox({
			title: `Bạn có chắc muốn cho hoạt động Group Campaign ID: ${id} này`,
			buttons: ["Hủy", "Xác nhận"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Xác nhận") {
				const res = await approveGroupCampaign({id});
				if (res) {
					uiAction.putToastSuccess("Thao tác thành công!");
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
				title="Danh Sách Quản Lý Group Campaign"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
				buttons={(
					<div className="left btnCreateNTD">
						<CanRender actionCode={ROLES.accountant_group_campaign_create}>
							<button type="button" className="el-button el-button-primary el-button-small"
								onClick={this.onCreate}>
								<span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
							</button>
						</CanRender>
					</div>
				)}>
				<Gird idKey={idKey}
					fetchApi={getListGroupCampaign}
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
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
