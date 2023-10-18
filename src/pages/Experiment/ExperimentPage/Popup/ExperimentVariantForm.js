import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import moment from 'moment-timezone';
import Edit from "pages/Experiment/ExperimentVariantPage/Edit";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupExperimentVariantForm extends Component {
    render() {
        const {id, experiment_id} = this.props;
        const idKey = "ExperimentVariantEdit";
        return (
            <Edit idKey={idKey} id={id} experiment_id={experiment_id}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupExperimentVariantForm);
