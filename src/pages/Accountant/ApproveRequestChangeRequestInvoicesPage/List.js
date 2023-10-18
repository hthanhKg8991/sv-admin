import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';

import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";
import { Link } from 'react-router-dom';

import {getListSalesOrderRequestInvoices} from "api/saleOrder";
import {getListConfig} from "api/system";

import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";

import ComponentFilter from "pages/Accountant/ApproveRequestChangeRequestInvoicesPage/ComponentFilter";

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			idKey: "SalesOrderApproveList",
			columns: [
				{
					title: "ID",
					width: 60,
					accessor: "id",
				},
				{
					title: "Mã phiếu",
					width: 100,
					cell: row => (
                        <Link
							target="_blank"
							onClick={(e) => e.stopPropagation()}
                            to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
                                id: row.sales_order_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
				},
				{
					title: "Trạng thái",
					width: 100,
					cell: row => {
						return <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_invoices_status} value={row?.status}/>;
					}
				},
				{
					title: "Ngày tạo",
					width: 160,
					time: true,
                    accessor: "created_at",
				},
				{
					title: "Tạo bởi",
					width: 100,
					accessor: "created_by",
				},
			],
			loading: false,
			isLoadData: false,
		};
	}

	async _getConfig() {
		const res = await getListConfig({code: Constant.CONFIG_FLAG_QRCODE_CODE});
		if (res && res?.items?.length > 0) {
			const [config] = res?.items;
			this.setState({
				flagQrCode: Number(config?.value) === Constant.CONFIG_FLAG_QRCODE_LOAD,
			});
		}
		this.setState({isLoadData: true});
	}

	componentDidMount() {
		this._getConfig();
	}

	render() {
		const {columns, idKey, isLoadData} = this.state;
		const {query, defaultQuery, history} = this.props;
		return (
			<Default
				left={(
					<WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
				)}
				title="Danh Sách Yêu Cầu"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
			>
				{isLoadData && (
					<Gird idKey={idKey}
						fetchApi={getListSalesOrderRequestInvoices}
						query={query}
						columns={columns}
						defaultQuery={defaultQuery}
						history={history}
						isReplaceRoute
						// isRedirectDetail={false}
					/>
				)}
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
