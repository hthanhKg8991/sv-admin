import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/System/ShareBasketDetailListPage/List";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room_list: null
        };
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
