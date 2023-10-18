import React from "react";

import {withRouteAction} from "components/Layout/Action/RouteAction";

import EditContainer from "pages/Accountant/BundlesPackagePage/EditContainer";
import List from "pages/Accountant/BundlesPackagePage/List";

class index extends React.Component {
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
