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
    const status = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_bundle_display
    );

    const positonKey = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_banner_type
    );

    return (
      <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
        <SearchField
          type="input"
          label="ID, Tên, Người cập nhật"
          name="q"
          timeOut={1000}
        />
        <SearchField
          type="dropbox"
          label="Trạng thái"
          name="is_display"
          data={status}
        />
        <SearchField
          type="dropbox"
          label="Vị trí trang đăng"
          name="position_key"
          data={positonKey}
        />
        <SearchField
          type="datetimerangepicker"
          label="Thời gian bắt đầu Hiển thị"
          name="available_from_date"
        />
        <SearchField
          type="datetimerangepicker"
          label="Thời gian hạ banner"
          name="available_to_date"
        />
        <SearchField
          type="datetimerangepicker"
          label="Ngày cập nhật"
          name="updated_at"
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
