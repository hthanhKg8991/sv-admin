import React, { Component } from "react";
import { connect } from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import { bindActionCreators } from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as uiAction from "actions/uiAction";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as apiFn from "api";
import config from "config";
import * as ConstantURL from "utils/ConstantURL";
import * as apiAction from "actions/apiAction";

class ComponentFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      staff_list: [],
    };
    this.getCustomerCare = this._getCustomerCare.bind(this);
  }

  _getCustomerCare() {
    let division_code = this.props.user ? this.props.user.division_code : "";
    let args = { status: Constant.STATUS_ACTIVED, execute: Constant.STATUS_ACTIVED };
    args["division_code[0]"] = Constant.DIVISION_TYPE_seeker_care_member;
    if (division_code !== Constant.DIVISION_TYPE_seeker_care_member) {
      args["division_code[1]"] = Constant.DIVISION_TYPE_seeker_care_leader;
    }
    this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
  }

  componentDidMount() {
    this.getCustomerCare();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]) {
      let response = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
      if (response.code === Constant.CODE_SUCCESS) {
        this.setState({ staff_list: response.data });
      }
      this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
    }
  }

  componentWillMount() {
    this.props.uiAction.refreshList("ResumeHistoryPage");
  }

  render() {
    const { staff_list } = this.state;
    let resume_history_status = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_resume_history_status
    );
    const seeker_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_seeker_status);
    let seeker_has_assigned_staff = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_seeker_has_assigned_staff
    );
    resume_history_status = resume_history_status.filter((c) => parseInt(c.value) !== Constant.STATUS_DELETED);
    let province = this.props.sys.province.items;
    const { query, menuCode, idKey } = this.props;
    return (
      <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
        <SearchField type="input" label="Tiêu đề, Mã hồ sơ" name="q" timeOut={1000} />
        <SearchField type="input" label="ID NTV, tên NTV, email" name="seeker_q" timeOut={1000} />
        <SearchField type="dropbox" label="Trạng thái hồ sơ" name="status" data={resume_history_status} />
        <SearchField type="dropbox" label="Trạng thái NTV" name="seeker_status" data={seeker_status} />
        <SearchField
          type="dropboxmulti"
          label="CSKH NTV"
          name="staff_q"
          data={staff_list}
          key_value="id"
          key_title="login_name"
        />
        <SearchField type="dropbox" label="Chăm sóc" name="has_assigned_staff_id" data={seeker_has_assigned_staff} />
        <SearchField type="dropboxmulti" label="Tỉnh thành" name="province_ids" key_value="id" key_title="name" data={province} />
        {/*Old_channel_code */}
        <SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at" />
        <SearchField type="datetimerangepicker" label="Ngày làm cập nhật" name="updated_at" />
        <SearchField
          type="dropbox"
          label="Sắp xếp thời gian cập nhật"
          name="order_by[updated_at]"
          data={Constant.ORDER_BY_CONFIG}
        />
        <SearchField
          type="dropbox"
          label="Sắp xếp thời gian tạo"
          name="order_by[created_at]"
          data={Constant.ORDER_BY_CONFIG}
        />
      </FilterLeft>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    sys: state.sys,
    branch: state.branch,
    province: state.province,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch),
    apiAction: bindActionCreators(apiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
