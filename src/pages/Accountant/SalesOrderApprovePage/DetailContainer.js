import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import queryString from "query-string";

import Default from "components/Layout/Page/Default";

import { getDetailSalesOrder } from "api/saleOrder";

import * as Constant from "utils/Constant";
import { publish } from "utils/event";

import Detail from "pages/Accountant/SalesOrderApprovePage/Detail";

class DetailContainer extends Component {
	constructor(props) {
		super(props);

		const searchParam = _.get(props, ["location", "search"]);
		const queryParsed = queryString.parse(searchParam);

		this.state = {
			id: _.get(queryParsed, "id")
		};
	}

	async _getDetalSalesOrder() {
		const {id} = this.state;
		return await getDetailSalesOrder({ id, type: Constant.SALES_ORDER_TYPE });
	}

	componentDidMount() {
		const resDetail = this._getDetalSalesOrder();
		resDetail.then((data) => {
			this.setState({
				saleOrder: data
			})
		});
	}

	render() {
		const {history} = this.props;
		const {id, saleOrder} = this.state;
		const idKey = "SalesOrderApproveDetail";

		return (
			<Default
				title={"Chi Tiết Phiếu Đăng Ký"}
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}>
				{saleOrder && <Detail idKey={idKey} id={id} history={history} sales_order={saleOrder}/>}
			</Default>
		)
	}
}

export default connect(null, null)(DetailContainer);
