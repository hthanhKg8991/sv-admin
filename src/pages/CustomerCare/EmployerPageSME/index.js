import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/CustomerCare/EmployerPageSME/List";
import DetailContainer from "pages/CustomerCare/EmployerPage/DetailContainer";
import EditContainer from "pages/CustomerCare/EmployerPage/EditContainer";
import HistoryChanged from "pages/CustomerCare/EmployerPage/DetailNew/HistoryChanged.js";
import ChangePasswordContainer from "pages/CustomerCare/EmployerPage/ChangePasswordContainer";
import HistoryImageContainer from "pages/CustomerCare/EmployerPage/HistoryImageContainer";
import HistoryEmailVerifyContainer from "pages/CustomerCare/EmployerPage/HistoryEmailVerifyContainer";
import EmailMarketingContainer from "pages/CustomerCare/EmployerPage/EmailMarketingContainer";
import ChangeCustomerContainer from "pages/CustomerCare/EmployerPage/ChangeCustomerContainer";

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
        {action: 'history_changed', component: HistoryChanged},
        {action: 'change_password', component: ChangePasswordContainer},
        {action: 'email_marketing', component: EmailMarketingContainer},
        {action: 'history_image', component: HistoryImageContainer},
        {action: 'history_verify_email', component: HistoryEmailVerifyContainer},
        {action: 'change_customer', component: ChangeCustomerContainer},
    ]
});
