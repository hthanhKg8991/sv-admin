import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/System/ConfigPage/List";
import DetailContainer from "pages/System/ConfigPage/DetailContainer";
import EditContainer from "pages/System/ConfigPage/EditContainer";

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
