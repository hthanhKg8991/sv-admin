import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/SalesOrder/PromotionProgramPage/List";
import DetailContainer from "pages/SalesOrder/PromotionProgramPage/DetailContainer";
import EditContainer from "pages/SalesOrder/PromotionProgramPage/EditContainer";

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
        {action: 'detail', component: DetailContainer},
        {action: 'edit', component: EditContainer},
    ]
});
