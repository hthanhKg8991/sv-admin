import React from 'react'
import {connect} from 'react-redux';
import * as uiAction from 'actions/uiAction'
import {bindActionCreators} from "redux";


class ResetWidgets extends React.Component{
    render () {
        return (
            <span id="refresh" className="btn btn-ribbon" onClick={this.props.uiAction.factoryReset}>
                <i className="fa fa-refresh" />
            </span>
        )
    }
}


function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ResetWidgets)
