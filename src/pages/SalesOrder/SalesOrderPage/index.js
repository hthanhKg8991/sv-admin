import React, {Component} from "react";

import {withRouteAction} from "components/Layout/Action/RouteAction";

import DetailContainer from "pages/SalesOrder/SalesOrderPage/DetailContainer";
import List from "pages/SalesOrder/SalesOrderPage/List";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const {ActiveAction} = this.props;
		return (
			<ActiveAction {...this.props} />
		)
	}
}

export default withRouteAction(index, {
	defaultAction: "list",
	actions: [
		{action: "list", component: List},
		{action: "detail", component: DetailContainer},
	]
});