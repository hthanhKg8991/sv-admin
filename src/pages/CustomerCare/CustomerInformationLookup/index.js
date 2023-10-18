import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/CustomerCare/CustomerInformationLookup/List";

class index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {ActiveAction} = this.props;
        return (
            <ActiveAction {...this.props}/>
        )
    }
}

export default withRouteAction(index, {
    defaultAction: 'list',
    actions: [
        {action: 'list', component: List},
    ]
});
