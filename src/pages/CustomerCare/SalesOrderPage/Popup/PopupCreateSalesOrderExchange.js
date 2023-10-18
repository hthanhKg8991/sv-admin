import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import Edit from "pages/CustomerCare/SalesOrderPage/Exchange/Edit";

class PopupCreateSalesOrderExchange extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {history, id, idKey} = this.props;
        return (
            <Edit idKey={idKey} id={id} history={history}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupCreateSalesOrderExchange);
