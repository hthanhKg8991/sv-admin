import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import ContactForm from "pages/HeadhuntPage/CustomerPage/ContactForm";

class PopupGroupForm extends Component {
    render() {
        return <ContactForm {...this.props}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupGroupForm);
