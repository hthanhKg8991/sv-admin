import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "./List";
import Report from "./Report";
import EditContainer from "pages/HeadhuntPage/CampaignPage/EditContainer";

class index extends Component {
    render() {
        const {ActiveAction} = this.props;
        return <ActiveAction {...this.props}/>
    }
}

export default withRouteAction(index, {
    defaultAction: 'list',
    actions: [
        {action: 'list', component: List},
        {action: 'edit', component: EditContainer},
        {action: 'report', component: Report},
    ]
});