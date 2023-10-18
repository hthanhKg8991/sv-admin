import React, {Component} from "react";
import moment from "moment";
import queryString from "query-string";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";
import { getSalesOrderConvertList } from "api/saleOrder";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import ComponentFilter from "./ComponentFilter";
import {Link} from "react-router-dom";
const idKey = "SalesOrderConvertList";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: "ID",
					width: 100,
					cell: row => (
						<Link
							to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
								id: row.id,
								action: "detail"
							})}`}>
							{row.id}
						</Link>
					)
				},
				{
					title: "ID SO gốc",
					width: 100,
					cell: row => (
						<Link
							to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
								id: row.sales_order_original_id,
								action: "detail"
							})}`}>
							{row.sales_order_original_id}
						</Link>
					)
				},
				{
					title: "Nhà tuyển dụng",
					width: 250,
					cell: row => (
						<Link
							to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
								action: "detail",
								id: row.employer_info?.id
							})}`}>
							<span>{row.employer_info?.id} - {row.employer_info?.name}</span>
						</Link>
					)
				},
				{
					title: "Trạng thái",
					width: 100,
					cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status} value={row?.status}/>
				},
				{
					title: "CSKH",
					width: 180,
					cell: row => <span>{row.employer_info?.assigned_staff_email}</span>
				},
				{
					title: "Ngày tạo",
					width: 120,
					cell: row => <span>{moment.unix(row?.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>
				}
			],
			loading : false,
			isImport: true,
		};

	}

	render() {
		const {columns} = this.state;
		const {query, defaultQuery, history} = this.props;

		return (
			<Default
				left={(
					<WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
				)}
				title="Danh Sách Phiếu Đổi Điểm Dịch Vụ"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
				>
				<Gird idKey={idKey}
					fetchApi={getSalesOrderConvertList}
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




export default List;
