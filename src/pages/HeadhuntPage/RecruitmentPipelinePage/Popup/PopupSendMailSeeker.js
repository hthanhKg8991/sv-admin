import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import FormMailSeeker from "pages/HeadhuntPage/RecruitmentPipelinePage/Mail/FormSeeker";


class PopupSendMailSeeker extends Component {
    render() {
        return <FormMailSeeker {...this.props}/>
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupSendMailSeeker);
