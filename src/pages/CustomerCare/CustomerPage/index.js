import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import {getVsic} from "api/system";
import {getListRoom} from "api/auth";
import List from "pages/CustomerCare/CustomerPage/List";
import DetailContainer from "pages/CustomerCare/CustomerPage/DetailContainer";
import EditContainer from "pages/CustomerCare/CustomerPage/EditContainer";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vsics: null,
            listRoom: null
        };
    }

    async _getListVsic() {
        const res = await getVsic();
        if(res) {
            this.setState({
                vsics: res || []
            })
        }
    }

    async _getListRoom() {
        const res = await getListRoom();
        if(res && res?.items) {
            this.setState({
                listRoom: res?.items || []
            })
        }
    }

    componentDidMount() {
        this._getListVsic();
        this._getListRoom();
    }

    render() {
        const {ActiveAction} = this.props;
        const {vsics, listRoom} = this.state;
        return (
            vsics && listRoom &&
            <ActiveAction {...this.props} vsics={vsics} listRoom={listRoom}/>
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
