import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createPopup} from "actions/uiAction";

class SpanPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onClick = this._onClick.bind(this);
    }

    _onClick() {
        const {actions, Component, title, params} = this.props;

        actions.createPopup(Component, title, params);
    }

    render() {
        const {label} = this.props;

        return (
            <span className={"text-underline text-primary pointer"} onClick={this.onClick}>
                {label}
            </span>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SpanPopup);
