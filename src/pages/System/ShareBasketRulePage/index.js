import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import List from "pages/System/ShareBasketRulePage/List";
import EditContainer from "pages/System/ShareBasketRulePage/EditContainer";
import {getListRoom} from "api/auth";
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room_list: null
        };
    }

    async _getRoom() {
        const res = await getListRoom({status: Constant.STATUS_ACTIVED});
        if(res) {
            this.setState({
                room_list: res?.items || []
            })
        }
    }

    componentDidMount() {
        this._getRoom();
    }

    render() {
        const {ActiveAction} = this.props;
        const {room_list} = this.state;
        return (
            room_list && <ActiveAction {...this.props} room_list={room_list} />
        )
    }
}
export default withRouteAction(index, {
    defaultAction: 'list',
    actions: [
        {action: 'list', component: List},
        {action: 'edit', component: EditContainer},
    ]
});
