import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import moment from 'moment-timezone';
import Edit from "pages/Experiment/FeatureFlagUserPage/Edit";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupFeatureFlagUserForm extends Component {
    render() {
        const {id, feature_flag_id} = this.props;
        const idKey = "FeatureFlagUserEdit";
        return (
            <Edit idKey={idKey} id={id} feature_flag_id={feature_flag_id}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupFeatureFlagUserForm);
