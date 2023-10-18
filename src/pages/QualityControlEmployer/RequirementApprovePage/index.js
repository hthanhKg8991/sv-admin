import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import Detail from "./DetailContainer";
import EditContainer from "pages/QualityControlEmployer/RequirementApprovePage/EditEmployerContainer";
import EditRequestContainer from "pages/QualityControlEmployer/RequirementApprovePage/EditRequestContainer";
import EditJobContainer from "pages/QualityControlEmployer/RequirementApprovePage/EditJobRequestContainer";

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
        {action: 'list', component: Detail},
        {action: 'edit', component: EditContainer},
        {action: 'editJob', component: EditJobContainer},
        {action: 'detail', component: EditRequestContainer},
    ]
});
