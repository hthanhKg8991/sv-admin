import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createPopup } from "actions/uiAction";

class BtnPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this._onClick.bind(this);
  }

  _onClick() {
    const { actions, Component, title, params } = this.props;

    actions.createPopup(Component, title, params);
  }

  render() {
    const { label, className, icon = null } = this.props;

    return (
      <button
        type="button"
        className={`el-button el-button-small ${className}`}
        onClick={this.onClick}
      >
        {icon && <i className={`${icon} mr5`}></i>}
        <span>{label}</span>
      </button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ createPopup }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(BtnPopup);
