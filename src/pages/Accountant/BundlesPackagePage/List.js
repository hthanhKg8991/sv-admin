import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";

import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import {deleteBundle, getListBundle, updateBundle} from "api/saleOrder";

import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";

import ComponentFilter from "pages/Accountant/ProductGroupPage/ComponentFilter";

const idKey = "ProductGroupList";

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: "ID",
					width: 60,
					accessor: "id"
				},
				{
					title: "Mã bundles",
					width: 120,
					accessor: "code"
				},
				{
					title: "Tên bundles",
					width: 100,
					accessor: "name"
				},
				{
					title: "Thời gian bắt đầu",
					width: 100,
					cell: row => moment.unix(row?.available_from_date).format("DD-MM-YYYY")
				},
				{
					title: "Thời gian kết thúc",
					width: 100,
					cell: row => moment.unix(row?.available_to_date).format("DD-MM-YYYY")
				},
				{
					title: "Trạng thái",
					width: 80,
					cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_items_group_status} value={row?.status}/>
				},
				{
					title: "Hành động",
					width: 80,
					cell: row => (
						row?.status !== Constant.STATUS_DELETED &&
                        <>
                        	<CanRender actionCode={ROLES.accountant_accountant_bundle_package_update}>
                        		<span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>Chỉnh sửa</span>
                        	</CanRender> <br/>
                        	{
                        		row?.status === Constant.STATUS_ACTIVED ?
                        			<CanRender actionCode={ROLES.accountant_accountant_bundle_package_change_status}>
                        				<span className="text-link text-warning font-bold"
                        					onClick={() => this.onChangeStatus(row?.id, row?.status)}>
                                            Ngưng hoạt động
                        				</span>
                        			</CanRender>
                        			:
                        			<CanRender actionCode={ROLES.accountant_accountant_bundle_package_change_status}>
                        				<span className="text-link text-warning font-bold"
                        					onClick={() => this.onChangeStatus(row?.id, row?.status)}>
                                            Hoạt động
                        				</span>
                        			</CanRender>
                        	}
                        	<br/>
                        	{
                        		row?.status !== Constant.STATUS_ACTIVED &&
                                <CanRender actionCode={ROLES.accountant_accountant_bundle_package_delete}>
                                	<span className="text-link text-red font-bold"
                                		onClick={() => this.onDelete(row?.id)}>Xóa</span>
                                </CanRender>
                        	}
                        </>
					)
				},
			],
			loading: false,
		};

		this.onClickAdd = this._onClickAdd.bind(this);
		this.onEdit = this._onEdit.bind(this);
		this.onChangeStatus = this._onChangeStatus.bind(this);
		this.onDelete = this._onDelete.bind(this);
	}

	_onClickAdd() {
		const {history} = this.props;
		history.push({
			pathname: Constant.BASE_URL_BUNDLES_PACKAGE_PAGE,
			search: "?action=edit&id=0"
		});
	}

	_onEdit(id) {
		const {history} = this.props;
		history.push({
			pathname: Constant.BASE_URL_BUNDLES_PACKAGE_PAGE,
			search: "?action=edit&id=" + id
		});
	}

	async _onChangeStatus(id, status) {
		const {actions} = this.props;
		const statusChange = status === Constant.STATUS_ACTIVED ? Constant.STATUS_INACTIVED : Constant.STATUS_ACTIVED;
		this.setState({loading: true});
		const res = await updateBundle({
			status: statusChange,
			id
		});
		if (res) {
			actions.putToastSuccess("Thao tác thành công");
			publish(".refresh", {}, idKey);
		}
		this.setState({loading: false});
	}


	_onDelete(id) {
		const {actions} = this.props;
		actions.SmartMessageBox({
			title: "Bạn có chắc muốn xóa ID: " + id,
			content: "",
			buttons: ["No", "Yes"]
		}, async (ButtonPressed) => {
			if (ButtonPressed === "Yes") {
				const res = await deleteBundle({id});
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
				title="Danh Sách Các Gói Bundle"
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
					fetchApi={getListBundle}
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
		actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
