import React, {Component} from "react";

import {withRouteAction} from "components/Layout/Action/RouteAction";

import EditContainer from "pages/Accountant/ComboPostingPackagePage/EditContainer";
import List from "pages/Accountant/ComboPostingPackagePage/List";

class index extends Component {
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
