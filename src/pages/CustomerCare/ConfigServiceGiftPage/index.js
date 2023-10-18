import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/CustomerCare/ConfigServiceGiftPage/List";
import EditContainer from "pages/CustomerCare/ConfigServiceGiftPage/EditContainer";
import DetailContainer from "pages/CustomerCare/ConfigServiceGiftPage/DetailContainer";

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
        {action: 'edit', component: EditContainer},
        {action: 'detail', component: DetailContainer},
    ]
});
