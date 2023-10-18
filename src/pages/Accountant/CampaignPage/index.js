import React, {Component} from "react";

import {withRouteAction} from "components/Layout/Action/RouteAction";

import EditContainer from "pages/Accountant/CampaignPage/EditContainer";
import List from "pages/Accountant/CampaignPage/List";

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
		{action: "edit", component: EditContainer},
	]
});
