import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";

import List from "pages/CustomerCare/JobPage/List";
import DetailContainer from "pages/CustomerCare/JobPage/DetailContainer";
import EditContainer from "pages/CustomerCare/JobPage/EditContainer";
import HistoryChanged from "pages/CustomerCare/JobPage/Detail/HistoryChanged";

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
    defaultAction: 'list',
    actions: [
        {action: 'list', component: List},
        {action: 'detail', component: DetailContainer},
        {action: 'edit', component: EditContainer},
        {action: 'history_changed', component: HistoryChanged},
        {action: 'resume_applied_history', component: EditContainer},
    ]
});
