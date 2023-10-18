import React, { Component } from "react";
import { withRouteAction } from "components/Layout/Action/RouteAction";
import List from "./List";
import Detail from "./Detail";


class index extends Component {

    render() {
        const { ActiveAction } = this.props;

        return <ActiveAction {...this.props} />
    }
}

export default withRouteAction(index, {
    defaultAction: 'list',
    actions: [
        { action: 'list', component: List },
        { action: 'detail', component: Detail },
    ]
});
