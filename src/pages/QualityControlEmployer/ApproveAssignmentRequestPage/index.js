import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/QualityControlEmployer/ApproveAssignmentRequestPage/List";
import DetailContainer from "pages/QualityControlEmployer/ApproveAssignmentRequestPage/DetailContainer";

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
    ]
});
