import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import StepContainer from "pages/CustomerCare/ToolTransferEmployerAssignmentPage/StepContainer";

class index extends Component {
    render() {
        const {ActiveAction} = this.props;
        return <ActiveAction {...this.props} />
    }
}

export default withRouteAction(index, {
    defaultAction: 'step',
    actions: [
        {action: 'step', component: StepContainer},
    ]
});
