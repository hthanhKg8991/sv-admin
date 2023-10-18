import React, {Component} from "react";

import {withRouteAction} from "components/Layout/Action/RouteAction";

import DetailContainer from "pages/Accountant/PromotionProgramsPage/DetailContainer";
import EditContainer from "pages/Accountant/PromotionProgramsPage/EditContainer";
import List from "pages/Accountant/PromotionProgramsPage/List";

class index extends Component {
	render() {
		const {ActiveAction} = this.props;
		return <ActiveAction {...this.props}/>
	}
}

export default withRouteAction(index, {
	defaultAction: "list",
	actions: [
		{action: "list", component: List},
		{action: "detail", component: DetailContainer},
		{action: "edit", component: EditContainer},
	]
});
