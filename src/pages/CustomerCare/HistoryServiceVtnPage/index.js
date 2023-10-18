import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import Detail from "./DetailContainer";

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
    ]
});
