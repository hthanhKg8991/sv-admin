import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import config from "config";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from "api";
import moment from "moment/moment";
import classnames from "classnames";
import Input2 from "components/Common/InputValue/Input2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import { publish } from "utils/event";
import { getStaffHeadhunt, getTeamMember } from "api/auth";

class PopupChangeBasket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_list: [],
      page: 1,
      per_page: 5,
      pagination_data: {},
      staff_list: [],
      basket: {},
      basket_error: {},
      basket_required: ["assigned_staff_id", "reason_other", "type"],
      name_focus: "",
    };
    this.changePage = this._changePage.bind(this);
    this.changePerPage = this._changePerPage.bind(this);
    this.hidePopup = this._hidePopup.bind(this);
    this.refreshList = this._refreshList.bind(this);
    this.onChange = this._onChange.bind(this);
    this.getCustomerCare = this._getCustomerCare.bind(this);
    this.getCustomerHeadhunt = this._getCustomerHeadhunt.bind(this);
    this.onSave = this._onSave.bind(this);
  }
  _changePage(newpage) {
    this.setState({ page: newpage }, () => {
      this.refreshList();
    });
  }
  _changePerPage(newperpage) {
    this.setState({ page: 1 });
    this.setState({ per_page: newperpage }, () => {
      this.refreshList();
    });
  }
  _refreshList(delay = 0) {
    let args = {
      id: this.props.object.id,
      per_page: this.state.per_page,
      page: this.state.page,
    };
    this.props.apiAction.requestApi(
      apiFn.fnGet,
      config.apiEmployerDomain,
      ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_CHANGE_BASKET,
      args,
      delay
    );
  }
  _hidePopup() {
    this.props.uiAction.deletePopup();
  }
  _onChange(value, name) {
    let basket_error = this.state.basket_error;
    delete basket_error[name];
    this.setState({ basket_error: basket_error });
    this.setState({ name_focus: "" });
    let basket = Object.assign({}, this.state.basket);
    basket[name] = value;
    this.setState({ basket: basket });
    if (name === "type") {
      if (Number(value) === Constant.TYPE_ASSIGNMENT_HEADHUNT) {
        this.getCustomerHeadhunt();
      } else {
        this.getCustomerCare();
      }
    }
  }
  async _getCustomerCare() {
    let division_code = this.props.user ? this.props.user.division_code : "";
    let args = {};
    args["division_code_list[0]"] = Constant.DIVISION_TYPE_customer_care_member;
    if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
      args["division_code_list[1]"] =
        Constant.DIVISION_TYPE_customer_care_leader;
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
  _onSave(event) {
    event.preventDefault();
    this.setState({ basket_error: {} });
    this.setState({ name_focus: "" });
    let basket = this.state.basket;
    let check = utils.checkOnSaveRequired(basket, this.state.basket_required);
    if (check.error) {
      this.setState({ name_focus: check.field });
      this.setState({ object_error: check.fields });
      return;
    }
    this.props.uiAction.showLoading();
    basket.employer_id = this.props.object.id;
    basket.reason = [Constant.EMPLOYER_DISCARD_REASON_EXPIRED_CARE];
    this.props.apiAction.requestApi(
      apiFn.fnPost,
      config.apiEmployerDomain,
      ConstantURL.API_URL_POST_CHANGE_BASKED_EMPLOYER,
      basket
    );
  }
  componentWillMount() {
    this.refreshList();
  }
  componentWillReceiveProps(newProps) {
    if (
      newProps.api[ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_CHANGE_BASKET]
    ) {
      let response =
        newProps.api[
          ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_CHANGE_BASKET
        ];
      if (response.code === Constant.CODE_SUCCESS) {
        this.setState({ data_list: response.data.items });
        this.setState({ pagination_data: response.data });
      }
      this.props.apiAction.deleteRequestApi(
        ConstantURL.API_URL_GET_LIST_EMPLOYER_HISTORY_CHANGE_BASKET
      );
    }
    if (newProps.api[ConstantURL.API_URL_POST_CHANGE_BASKED_EMPLOYER]) {
      let response =
        newProps.api[ConstantURL.API_URL_POST_CHANGE_BASKED_EMPLOYER];
      if (response.code === Constant.CODE_SUCCESS) {
        this.setState({ basket: {} });
        this.props.uiAction.putToastSuccess("Thao tác thành công!");
        this.refreshList();
        publish(".refresh", {}, "EmployerDetail");
      } else {
        this.setState({ basket_error: response.data });
      }
      this.props.uiAction.hideLoading();
      this.props.apiAction.deleteRequestApi(
        ConstantURL.API_URL_POST_CHANGE_BASKED_EMPLOYER
      );
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(JSON.stringify(nextState) === JSON.stringify(this.state));
  }
  render() {
    let {
      basket,
      basket_error,
      basket_required,
      name_focus,
      staff_list,
      data_list,
    } = this.state;
    let employer_discharged_reason = utils.convertObjectValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_employer_discharged_reason
    );

    return (
      <div className="dialog-popup-body">
        <div className="relative form-container">
          <div className="popupContainer">
            {/* <div className="form-container row">
              <form onSubmit={this.onSave}>
                <div className="col-sm-12 sub-title-form mb15">
                  <span>Chuyển giỏ</span>
                </div>
                <div className="col-sm-12 col-xs-12 mb15">
                  <Dropbox
                    name="type"
                    label="Chọn loại CSKH"
                    data={Constant.TYPE_ASSIGNMENT_LIST}
                    required={basket_required.includes("type")}
                    nameFocus={name_focus}
                    value={basket.type}
                    error={basket_error.type}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col-sm-6 col-xs-12 mb15">
                  <Dropbox
                    name="assigned_staff_id"
                    label="CSKH"
                    data={staff_list}
                    key_value="id"
                    key_title="login_name"
                    required={basket_required.includes("assigned_staff_id")}
                    nameFocus={name_focus}
                    value={basket.assigned_staff_id}
                    error={basket_error.assigned_staff_id}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col-sm-6 col-xs-12 mb15">
                  <Input2
                    type="text"
                    name="reason_other"
                    label="Lý do chuyển"
                    required={basket_required.includes("reason_other")}
                    error={basket_error.reason_other}
                    nameFocus={name_focus}
                    onChange={this.onChange}
                  />
                </div>
                <CanRender
                  actionCode={
                    ROLES.customer_care_employer_change_assignment_manage
                  }
                >
                  <div className="col-sm-12 col-xs-12 mb15">
                    <button
                      type="submit"
                      className="el-button el-button-success el-button-small"
                    >
                      <span>Chuyển</span>
                    </button>
                  </div>
                </CanRender>
              </form>
            </div> */}
            <div className="body-table el-table crm-section">
              <TableComponent>
                <TableHeader tableType="TableHeader" width={250}>
                  CSKH bị rút
                </TableHeader>
                <TableHeader tableType="TableHeader" width={250}>
                  CSKH
                </TableHeader>
                <TableHeader tableType="TableHeader" width={160}>
                  Ngày chuyển
                </TableHeader>
                <TableHeader
                  tableType="TableHeader"
                  width={200}
                  dataField="created_by"
                >
                  Người duyệt
                </TableHeader>
                <TableHeader tableType="TableHeader" width={200}>
                  Lý do
                </TableHeader>
                <TableHeader tableType="TableHeader" width={200}>
                  Ghi chú
                </TableHeader>
                <TableBody tableType="TableBody">
                  {data_list.map((item, key) => {
                    let from_staff_username = item.from_staff_username
                      ? item.from_staff_username
                      : "";
                    let to_staff_username = item.to_staff_username
                      ? item.to_staff_username
                      : "";
                    let reason = "";
                    if (item.reason_other) {
                      reason = item.reason_other;
                    } else {
                      const reasons = Array.isArray(item.reason)
                        ? item.reason
                        : [];
                      reasons.forEach((r, k) => {
                        r = employer_discharged_reason[r]
                          ? employer_discharged_reason[r]
                          : r;
                        reason += k === 0 ? r : ", " + r;
                      });
                    }
                    let data = {
                      staff_username_from: "-> " + from_staff_username,
                      staff_username_to: "-> " + to_staff_username,
                      created_at: moment
                        .unix(item.created_at)
                        .format("DD/MM/YYYY HH:mm:ss"),
                      created_by: item.created_by,
                      reason: reason,
                      note: item.note,
                    };
                    return (
                      <tr
                        key={key}
                        className={classnames(
                          "el-table-row pointer",
                          key % 2 !== 0 ? "tr-background" : ""
                        )}
                      >
                        {Object.keys(data).map((name, k) => {
                          return (
                            <td key={k}>
                              <div className="cell" title={data[name]}>
                                {data[name]}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </TableBody>
              </TableComponent>
            </div>
            <div className="crm-section">
              <Pagination
                per_page={this.state.per_page}
                page={this.state.page}
                data={this.state.pagination_data}
                changePage={this.changePage}
                changePerPage={this.changePerPage}
                changeURL={false}
              />
            </div>
          </div>
          <hr className="v-divider margin0" />
          <div className="v-card-action">
            <button
              type="button"
              className="el-button el-button-primary el-button-small"
              onClick={this.hidePopup}
            >
              <span>Đóng</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    sys: state.sys,
    api: state.api,
    user: state.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    apiAction: bindActionCreators(apiAction, dispatch),
    uiAction: bindActionCreators(uiAction, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PopupChangeBasket);