import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import { bindActionCreators } from "redux";

import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import {getListSalesOrderRequestDrop} from "api/saleOrder";

import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {publish} from "utils/event";
import * as utils from "utils/utils";

import ComponentFilter from "pages/Accountant/SalesOrderApproveDropPage/ComponentFilter";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			idKey: "SalesOrderApproveDropList",
			columns: [
				{
					title: "Mã phiếu",
					width: 80,
					accessor: "id",
				},
				{
					title: "Tên NTD",
					width: 200,
					accessor: "cache_employer_name",
				},
				{
					title: "Ngày tạo",
					width: 160,
					cell: row => {
						return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
					}
				},
				{
					title: "Tổng tiền",
					width: 160,
					cell: row => {
						return <>{utils.formatNumber(row?.total_amount, 0, ".", "đ")}</>;
					}
				},
				{
					title: "CSKH",
					width: 160,
					cell: row => {
						const {employer_info} = row;
						return <>{employer_info?.assigned_staff_username}</>
					}
				},
				{
					title: "Người Yêu Cầu",
					width: 160,
					cell: row => {
						const {SalesOrderRequestCancel_created_by} = row;
						return <>{SalesOrderRequestCancel_created_by}</>
					}
				},
				{
					title: "Thời Gian",
					width: 160,
					cell: row => {
						const {SalesOrderRequestCancel_created_at} = row;
						return <>{moment.unix(SalesOrderRequestCancel_created_at).format("DD/MM/YYYY HH:mm:ss")}</>
					}
				},
				{
					title: "Yêu Cầu",
					width: 160,
					cell: row => {
						const {SalesOrderRequestCancel_rejected_note} = row;
						return <>{SalesOrderRequestCancel_rejected_note}</>
					}
				},
			],
			loading : false,
		};
	}

	render() {
		const {columns, idKey} = this.state;
		const {query, defaultQuery, history} = this.props;

		return (
			<Default
				left={(
					<WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
				)}
				title="Danh sách Yêu Cầu Hạ Phiếu Đăng Ký"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
			>
				<Gird idKey={idKey}
					fetchApi={getListSalesOrderRequestDrop}
					query={query}
					columns={columns}
					defaultQuery={defaultQuery}
					history={history}
				/>
			</Default>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
	};
}

export default connect(null, mapDispatchToProps)(List);
