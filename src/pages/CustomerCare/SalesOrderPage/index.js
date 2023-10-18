import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/CustomerCare/SalesOrderPage/List";
import DetailContainer from "pages/CustomerCare/SalesOrderPage/DetailContainer";
import ExchangeContainer from "pages/CustomerCare/SalesOrderPage/ExchangeContainer";
import ExchangeDetailContainer from "pages/CustomerCare/SalesOrderPage/ExchangeDetailContainer";

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
        {action: 'exchange', component: ExchangeContainer},
        {action: 'exchange-detail', component: ExchangeDetailContainer},
    ]
});
