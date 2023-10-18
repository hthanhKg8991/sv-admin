import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/Revenue/RevenueConfigStaffPage/List";
import EditContainer from "pages/Revenue/RevenueConfigStaffPage/EditContainer";

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
    ]
});
