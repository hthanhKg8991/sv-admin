import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";

import List from "pages/SeekerCare/ResumeTemplatePage/List";
import DetailContainer from "pages/SeekerCare/ResumeTemplatePage/DetailContainer";
import EditContainer from "pages/SeekerCare/ResumeTemplatePage/EditContainer";

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
    ]
});
