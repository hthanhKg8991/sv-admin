import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import { getListRoom } from "api/auth";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
  constructor() {
    super();
    this.state = {
      queryResult: [
        { title: "Đúng", value: 1 },
        { title: "Sai", value: 0 },
      ],
    };
  }

  render() {
    const { query, menuCode, idKey } = this.props;
    const { queryResult } = this.state;

    return (
      <div className={"row mt5"}>
        <Filter idKey={idKey} query={query} menuCode={menuCode}>
          <SearchField
            className={"col-md-4"}
            type="dropbox"
            label="Kết quả"
            name="result"
            data={queryResult}
          />
        </Filter>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    sys: state.sys,
    province: state.province,
    user: state.user,
    branch: state.branch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch),
    apiAction: bindActionCreators(apiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
