import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/Survey/SurveyJsPage/List";
import DetailContainer from "pages/Survey/SurveyJsPage/DetailContainer";
import EditContainer from "pages/Survey/SurveyJsPage/EditContainer";
import ResultContainer from "pages/Survey/SurveyJsPage/ResultContainer";

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
        {action: 'result', component: ResultContainer},
    ]
});
