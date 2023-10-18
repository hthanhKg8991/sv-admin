import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import {getListSalesOrderV2} from "api/saleOrderV2";

import {createPopup,hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";
import * as utils from "utils/utils";

import ComponentFilter from "pages/SalesOrder/SalesOrderPage/ComponentFilter";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			idKey: "SalesOrder",
			columns: [
				{
					title: "Mã phiếu",
					width: 90,
					onClick: () => {
					},
					cell: row => (
						<Link
							to={`${Constant.BASE_URL_SALES_ORDER_V2}?${queryString.stringify({
								id: row.id,
								action: "detail"
							})}`}>
							<span className={"text-link"}>{row.id}</span>
						</Link>
					)
				},
				{
					title: "Tên NTD",
					width: 200,
					onClick: () => {
					},
					cell: row => (
						<Link
							to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
								action: "detail",
								id: row?.employer_info?.id
							})}`}>
							<span>{row?.employer_info?.id} - {row?.employer_info?.name}</span>
						</Link>
					)
				},
				{
					title: "Ngày tạo",
					width: 140,
					cell: row => {
						return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
					}
				},
				{
					title: "Ngày duyệt",
					width: 140,
					cell: row => {
						return <>{row?.approved_at && moment.unix(row?.approved_at).format("DD-MM-YYYY hh:mm:ss")}</>;
					}
				},
				{
					title: "Trạng thái",
					width: 100,
					cell: row => {
						return <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status_v2} value={row?.status} notStyle/>;
					}
				},
				{
					title: "Loại phiếu",
					width: 100,
					cell: row => {
						return <SpanCommon idKey={Constant.COMMON_DATA_KEY_type_campaign} value={row?.type_campaign}/>;
					}
				},
				{
					title: "Trạng thái thanh toán",
					width: 100,
					cell: row => {
						return (
							<>
								<SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status}
									value={row?.payment_status}/>
								{row?.request_approve_status &&
                                <>
                                	<br/>
                                	<SpanCommon idKey={Constant.COMMON_DATA_KEY_request_approve_status}
                                    	value={row?.request_approve_status}/>
                                </>
								}
								<br/>
								<SpanCommon idKey={Constant.COMMON_DATA_KEY_confirm_payment_status}
									value={row?.confirm_payment_status}/>
							</>
						);
					}
				},
				{
					title: "Tổng tiền",
					width: 100,
					cell: row => {
						return <>{utils.formatNumber(row?.amount_subtotal, 0, ".", "đ")}</>;
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
			],
			loading: false,
		};

		this.onClickAdd = this._onClickAdd.bind(this);
	}

	_onClickAdd() {
		const {history} = this.props;
		history.push({
			pathname: Constant.BASE_URL_ADD_SALES_ORDER_V2,
		});
	}

	render() {
		const {columns, idKey} = this.state;
		const {query, defaultQuery, history} = this.props;

		return (
			<Default
				left={(
					<WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
				)}
				title="Danh sách Phiếu Đăng Ký"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
				buttons={
					<>
						<CanRender actionCode={ROLES.customer_care_sales_order_create}>
							<div className="left btnCreateNTD">
								<button type="button"
									className="el-button el-button-primary el-button-small"
									onClick={this.onClickAdd}>
									<span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
								</button>
							</div>
						</CanRender>
					</>
				}
			>
				<Gird idKey={idKey}
					fetchApi={getListSalesOrderV2}
					query={query}
					columns={columns}
					defaultQuery={defaultQuery}
					history={history}
					isReplaceRoute
				/>
			</Default>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup}, dispatch)
	};
}

export default connect(null, mapDispatchToProps)(List);
