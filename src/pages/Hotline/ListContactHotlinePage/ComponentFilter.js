import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import { getStaffHeadhunt, getTeamMember, getListQAMHotline } from "api/auth";
import * as utils from "utils/utils";
class ComponentFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff_list: [],
      qam_list: [],
    };

    this.getCustomerCare = this._getCustomerCare.bind(this);
    this.getCustomerHeadhunt = this._getCustomerHeadhunt.bind(this);
    this.onChangeStatus = this._onChangeStatus.bind(this);
    this.getListQAM = this._getListQAM.bind(this);
  }

  componentDidMount() {
    this.getListQAM();
  }

  _onChangeStatus(value) {
    if (Number(value) === Constant.TYPE_ASSIGNMENT_HEADHUNT) {
      this.getCustomerHeadhunt();
    } else {
      this.getCustomerCare();
    }
  }

  async _getCustomerCare() {
    let division_code = this.props.user ? this.props.user.division_code : "";
    let args = {};
    args["division_code_list[0]"] = Constant.DIVISION_TYPE_customer_care_member;
    if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
      args["division_code_list[1]"] = Constant.DIVISION_TYPE_customer_care_leader;
    }

    const res = await getTeamMember(args);
    if (res) {
      this.setState({ staff_list: res });
    }
  }
  async _getCustomerHeadhunt() {
    const res = await getStaffHeadhunt();
    if (res) {
      this.setState({ staff_list: res });
    }
  }

  async _getListQAM() {
    const res = await getListQAMHotline({
      division_code: "quality_control_employer",
      status: 1,
      execute: 1,
    });
    if (res) {
      this.setState({ qam_list: res });
    }
  }

  render() {
    const { query, menuCode, idKey } = this.props;
    let { staff_list, qam_list } = this.state;

    let ListStaff = utils.convertToDataFilter(staff_list);
    let ListQAM = utils.convertToDataFilter(qam_list);

    let customerDemand = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_CUSTOMER_DEMAND);

    let area = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_area);

    let status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_EMPLOYER_HOTLINE_STATUS);

    let type = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_EMPLOYER_HOTLINE_TYPE);

    return (
      <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
        <SearchField type="datetimerangepicker" label="Ngày tạo hotline" name="created_at" />
        <SearchField type="datetimerangepicker" label="Ngày update thông tin" name="updated_at" />
        <SearchField type="input" label="ID, tên, email, điện thoại" name="q" timeOut={1000} />
        <SearchField type="dropbox" label="QAM tạo thông tin" name="created_by_id" data={ListQAM} />
        <SearchField type="dropbox" label="Loại CSKH" name="assigned_type" data={type} onChangeSearch={this.onChangeStatus} />
        <SearchField type="dropbox" label="Giỏ CSKH" name="assigned_staff_id" data={ListStaff} />
        <SearchField type="dropbox" label="Trạng thái xử lý" name="status" data={status} />
        <SearchField type="dropbox" label="Nhu cầu của khách hàng" name="customer_demand" data={customerDemand} />
        <SearchField type="dropbox" label="Miền" name="area" data={area} />
      </FilterLeft>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    sys: state.sys,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch),
    apiAction: bindActionCreators(apiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
