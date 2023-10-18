import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import {approvePackageGiftConfig,deletePackageGiftConfig,getListPackageGiftConfig, pausePackageGiftConfig} from "api/saleOrder";

import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";

import ComponentFilter from "pages/Accountant/ConfigGiftServicePackagePage/ComponentFilter";

const idKey = "ConfigGiftServicePackagePage";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: "Tên cấu hình",
					width: 200,
					accessor: "name"
				},
				{
					title: "Trạng thái",
					width: 80,
					cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_service_package_status} value={row?.status}/>
				},
				{
					title: "Hành động",
					width: 80,
					cell: row => (
						row?.status !== Constant.FREEMIUM_CONFIG_STATUS_DELETED &&
                        <>
                        	{row?.status !== Constant?.FREEMIUM_CONFIG_STATUS_APPROVED && <CanRender actionCode={ROLES.accountant_accountant_config_gift_service_package_edit}>
                        		<span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>Chỉnh sửa</span>
                        	</CanRender>}
                        	{"  "}
                        	{row?.status == Constant.FREEMIUM_CONFIG_STATUS_NEW || row?.status == Constant.FREEMIUM_CONFIG_STATUS_PAUSED 
                        		? <CanRender actionCode={ROLES.accountant_accountant_config_gift_service_package_on}>
                        			<span className="text-link text-red font-bold"
                        				onClick={() => this.onTurnOn(row?.id)}>Bật</span>
                        		</CanRender> 
                        		: <CanRender actionCode={ROLES.accountant_accountant_config_gift_service_package_off}>
                        			<span className="text-link text-red font-bold"
                        				onClick={() => this.onTurnOff(row?.id)}>Tắt</span>
                        		</CanRender> 
                        	}
                        	{"  "}
                        	{row?.status !== Constant?.FREEMIUM_CONFIG_STATUS_APPROVED && <CanRender actionCode={ROLES.accountant_accountant_config_gift_service_package_delete}>
                        		<span className="text-link text-warning font-bold"
                        			onClick={() => this.onDelete(row?.id)}>Xoá</span>
                        	</CanRender>}
                        </>
					)
				},
			],
			loading: false,
		};

		this.onClickAdd = this._onClickAdd.bind(this);
		this.onEdit = this._onEdit.bind(this);
		this.onDelete = this._onDelete.bind(this);
		this.onTurnOn = this._onTurnOn.bind(this);
		this.onTurnOff = this._onTurnOff.bind(this);
	}

	_onClickAdd() {
		const {history} = this.props;
		history.push({
			pathname: Constant.BASE_URL_CONFIG_GIFT_SERVICE_PACKAGE_PAGE,
			search: "?action=edit&id=0"
		});
	}

	_onEdit(id) {
		const {history} = this.props;
		history.push({
			pathname: Constant.BASE_URL_CONFIG_GIFT_SERVICE_PACKAGE_PAGE,
			search: "?action=edit&id=" + id
		});
	}

	_onDelete(id) {
		const {actions} = this.props;
		actions.SmartMessageBox({
			title: "Bạn có chắc muốn xóa ID: " + id,
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await deletePackageGiftConfig({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công");
					publish(".refresh", {}, idKey);
				}
				actions.hideSmartMessageBox();
				publish(".refresh", {}, idKey)
			}
		});
	}

	_onTurnOff(id) {
		const {actions} = this.props;
		actions.SmartMessageBox({
			title: "Bạn có chắc muốn tắt ID: " + id,
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await pausePackageGiftConfig({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công");
					publish(".refresh", {}, idKey);
				}
				actions.hideSmartMessageBox();
				publish(".refresh", {}, idKey)
			}
		});
	}

	_onTurnOn(id) {
		const {actions} = this.props;
		actions.SmartMessageBox({
			title: "Bạn có chắc muốn bật ID: " + id,
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await approvePackageGiftConfig({id});
				if (res) {
					actions.putToastSuccess("Thao tác thành công");
					publish(".refresh", {}, idKey);
				}
				actions.hideSmartMessageBox();
				publish(".refresh", {}, idKey)
			}
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
				title="Cấu hình tặng gói dịch vụ"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
				buttons={(
					<div className="left btnCreateNTD">
						<CanRender actionCode={ROLES.accountant_accountant_bundle_package_create}>
							<button type="button" className="el-button el-button-primary el-button-small"
								onClick={this.onClickAdd}>
								<span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
							</button>
						</CanRender>
					</div>
				)}>
				<Gird idKey={idKey}
					fetchApi={getListPackageGiftConfig}
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
		actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
