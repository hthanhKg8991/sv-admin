import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import {isDebug} from "utils/utils";

class CanAction extends React.Component {
    checkPermission(actionCode, scopes) {
        if (_.includes(scopes, actionCode)) {
            return true;
        }
        const parentPermission = _.slice(_.split(actionCode, '.'), 0, -1).join('.');
        return parentPermission ? this.checkPermission(parentPermission, scopes) : false;
    }

    debug() {
        return isDebug();
    }

    renderDebug(hasPermission) {
        const {actionCode, children} = this.props;
        let style = {
            opacity: "0.8",
        };
        if (!hasPermission) {
            style.cursor = "not-allowed";
            style.opacity = "0.2";
        }
        const title = `[CanAction][${hasPermission}]-[${actionCode}]`;
        return <div title={title} style={style}>
            <div style={{pointerEvents: "none"}}>
                {children}
            </div>
        </div>
    }

    render() {
        const {actionCode, user, children, isDisabled} = this.props;
        const scopes = _.get(user, 'scopes', {});
        const hasPermission = this.checkPermission(actionCode, scopes);
        if (this.debug()) {
            this.renderDebug(hasPermission);
        }

        return (
            <div title={actionCode} style={(!hasPermission && isDisabled) ? {cursor: "not-allowed"} : null}>
                <div style={(!hasPermission && isDisabled) ? {pointerEvents: "none"} : null}>
                    {children}
                </div>
            </div>
        )
    }
}

CanAction.defaultProps = {
    isDisabled: true,
};


CanAction.propTypes = {
    actionCode: PropTypes.string,
    isDisabled: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps, null)(CanAction);