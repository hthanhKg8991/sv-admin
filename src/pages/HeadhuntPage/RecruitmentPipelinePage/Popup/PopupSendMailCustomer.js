import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import FormMailCustomer from "pages/HeadhuntPage/RecruitmentPipelinePage/Mail/FormCustomer";


class PopupSendMailCustomer extends Component {
    render() {
        return <FormMailCustomer {...this.props}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupSendMailCustomer);
