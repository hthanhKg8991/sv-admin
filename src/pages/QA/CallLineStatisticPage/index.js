import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/QA/CallLineStatisticPage/List";
import History from "pages/QA/CallLineStatisticPage/History";
import EditContainer from "pages/QA/CallLineStatisticPage/EditContainer";

class index extends Component {
    render() {
        const {ActiveAction} = this.props;
        return <ActiveAction {...this.props} />
    }
}

export default withRouteAction(index, {
    defaultAction: 'list',
    actions: [
        {action: 'list', component: List},
        {action: 'edit', component: EditContainer},
        {action: 'history', component: History},
    ]
});
