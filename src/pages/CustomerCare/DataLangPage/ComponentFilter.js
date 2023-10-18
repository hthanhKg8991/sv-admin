import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
  render() {
    const { query, menuCode, idKey } = this.props;
    const lang = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_SYSTEM_LANG_LIST
    );

    const type = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_system_lang_type
    );

    return (
      <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
        <SearchField
          type="input"
          label="ID, Tên, Key, Người cập nhật"
          name="q"
          timeOut={1000}
        />
        <SearchField
          type="dropbox"
          label="Trạng thái"
          name="lang"
          data={lang}
        />
      <SearchField
          type="dropbox"
          label="Loại hiển thị"
          name="type"
          data={type}
      />
      </FilterLeft>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    sys: state.sys,
    province: state.province,
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
