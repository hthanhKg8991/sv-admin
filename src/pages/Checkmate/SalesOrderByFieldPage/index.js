import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/Checkmate/SalesOrderByFieldPage/List";
import DetailContainer from "pages/Checkmate/SalesOrderByFieldPage/DetailContainer";
import EditContainer from "pages/Checkmate/SalesOrderByFieldPage/EditContainer";

class index extends Component {
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
    ]
});
