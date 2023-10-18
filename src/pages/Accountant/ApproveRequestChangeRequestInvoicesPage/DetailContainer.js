import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import queryString from "query-string";

import Default from "components/Layout/Page/Default";

import { publish } from "utils/event";

import Detail from "pages/Accountant/ApproveRequestChangeRequestInvoicesPage/Detail";

class DetailContainer extends Component {
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
		const {id, detailRequestInvoices} = this.state;
		const idKey = "SalesOrderApproveDetail";

		return (
			<Default
				title={"Chi Tiết Yêu Cầu"}
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}>
				<Detail idKey={idKey} history={history} id={id}/>
			</Default>
		)
	}
}

export default connect(null, null)(DetailContainer);
