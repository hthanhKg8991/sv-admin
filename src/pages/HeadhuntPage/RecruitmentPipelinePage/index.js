import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import Pipeline from "pages/HeadhuntPage/RecruitmentPipelinePage/Pipeline";

class index extends Component {

    render() {
        const {ActiveAction} = this.props;

        return <ActiveAction {...this.props}/>
    }
}

export default withRouteAction(index, {
    defaultAction: 'list',
    actions: [
        {action: 'list', component: Pipeline},
    ]
});
