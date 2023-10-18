import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import moment from 'moment-timezone';
import Edit from "pages/Checkmate/SalesOrderByFieldPage/Package/Popup/PopupRegistrationJobBox/Edit";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupRegistrationJobBox extends Component {
    render() {
        const idKey = "PopupRegistrationJobBox";
        return (
            <Edit idKey={idKey} {...this.props}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupRegistrationJobBox);
