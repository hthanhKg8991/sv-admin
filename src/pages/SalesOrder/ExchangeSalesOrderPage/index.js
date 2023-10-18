import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/SalesOrder/ExchangeSalesOrderPage/List";
import ExchangeContainer from "pages/SalesOrder/SalesOrderPage/ExchangeContainer";
import ExchangeDetailContainer from "pages/SalesOrder/SalesOrderPage/ExchangeDetailContainer";

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
        {action: 'exchange', component: ExchangeContainer},
        {action: 'exchange-detail', component: ExchangeDetailContainer},
    ]
});
