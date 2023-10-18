import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";

class ComponentFilter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { query, menuCode, idKey } = this.props;
    return (
      <div className={"row mt5"}>
        <Filter idKey={idKey} query={query} menuCode={menuCode} >
          <SearchField   className={"col-md-3"} type="datetimerangepicker" label="Ngày duyệt phiếu" name="sales_order_approved_at" />
          <SearchField  className={"col-md-3"} type="datetimerangepicker" label="Ngày ghi nhận" name="revenue_at" />
        </Filter>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    sys: state.sys,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch),
    apiAction: bindActionCreators(apiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
