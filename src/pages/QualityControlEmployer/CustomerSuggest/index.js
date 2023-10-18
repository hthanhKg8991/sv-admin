import React, {Component} from "react";
import {withRouteAction} from "components/Layout/Action/RouteAction";
import {getVsic} from "api/system";
import List from "pages/QualityControlEmployer/CustomerSuggest/List";
import EditContainer from "pages/QualityControlEmployer/CustomerSuggest/EditContainer";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vsics: null
        };
    }

    async _getListVsic() {
        const res = await getVsic();
        if(res) {
            this.setState({
                vsics: res
            })
        }
    }

    componentDidMount() {
        this._getListVsic();
    }

    render() {
        const {ActiveAction} = this.props;
        const {vsics} = this.state;
        return (
            vsics &&
            <ActiveAction {...this.props} vsics={vsics}/>
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
