import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {store} from "store";
import {push} from "connected-react-router";
import AdminStorage from "utils/storage";
import Loading from "components/Common/Ui/Loading";

class LayoutAuth extends Component {
    componentDidMount() {
        let token_FE = AdminStorage.getItem('token_FE');
        if (token_FE) {
            store.dispatch(push(Constant.BASE_URL));
        }
    }
    render () {
        return (
            <React.Fragment>
                <div className="layout-auth">
                    <Loading />
                    {this.props.children}
                </div>
            </React.Fragment>
        )
    }
}

export default LayoutAuth;
