import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import { isDebug } from "utils/utils";

class CanRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkPermission(actionCode, scopes) {
    if (_.includes(scopes, actionCode)) {
      return true;
    }
    const parentPermission = _.slice(_.split(actionCode, "."), 0, -1).join(".");
    return parentPermission
      ? this.checkPermission(parentPermission, scopes)
      : false;
  }

  debug() {
    return isDebug();
  }

  renderDebug(hasPermission) {
    const { actionCode, children } = this.props;
    let style = {
      opacity: "0.8",
    };
    if (!hasPermission) {
      style.opacity = "0.1";
      style.cursor = "not-allowed";
    }
    const title = `[CanRender][${hasPermission}]-[${actionCode}]`;
    return (
      <span title={title} style={style}>
        {children}
      </span>
    );
  }

  render() {
    const { actionCode, user, children } = this.props;
    const scopes = _.get(user, "scopes", {});
    const hasPermission = this.checkPermission(actionCode, scopes);
    const debug = this.debug();
    if (debug) {
      return this.renderDebug(hasPermission);
    }
    if (!hasPermission) {
      return null;
    }
    return <React.Fragment>{children}</React.Fragment>;
  }
}

CanRender.propTypes = {
  actionCode: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(CanRender);
