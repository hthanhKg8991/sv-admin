import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import queryString from "query-string";

import Default from "components/Layout/Page/Default";

import {publish} from "utils/event";

import Exchange from "pages/CustomerCare/SalesOrderPage/Exchange";

class ExchangeDetailContainer extends Component {
	constructor(props) {
		super(props);

		const searchParam = _.get(props, ["location", "search"]);
		const queryParsed = queryString.parse(searchParam);

		this.state = {
			id: _.get(queryParsed, "id")
		};
	}

	render() {
		const {history} = this.props;
		const {id} = this.state;
		const idKey = "SalesOrderExchange";

		return (
			<Default
				title="Quy đổi đơn hàng"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}>
				<Exchange idKey={idKey} id={id} history={history}/>
			</Default>
		)
	}
}

export default connect(null, null)(ExchangeDetailContainer);
