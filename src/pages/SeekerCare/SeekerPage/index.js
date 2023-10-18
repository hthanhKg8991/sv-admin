import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/SeekerCare/SeekerPage/List";
import JobApply from "pages/SeekerCare/SeekerPage/JobApply";
import DetailContainer from "pages/SeekerCare/SeekerPage/DetailContainer";
import EditContainer from "pages/SeekerCare/SeekerPage/EditContainer";
import HistoryChanged from "pages/SeekerCare/SeekerPage/DetailNew/HistoryChanged";
import ChangePasswordContainer from "pages/SeekerCare/SeekerPage/ChangePasswordContainer";
import HistoryVerifyContainer from "pages/SeekerCare/SeekerPage/HistoryEmailContainer";
import CvContainer from "pages/SeekerCare/SeekerPage/Cv";

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
        {action: 'change_password', component: ChangePasswordContainer},
        {action: 'history_changed', component: HistoryChanged},
        {action: 'job_apply', component: JobApply},
        {action: 'history_verify', component: HistoryVerifyContainer},
        {action: 'cv', component: CvContainer},
    ]
});
