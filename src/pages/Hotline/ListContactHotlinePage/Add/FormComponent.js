import React from "react";
import { connect } from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { getStaffHeadhunt, getTeamMember } from "api/auth";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MyCloneField from "components/Common/Ui/Form/MyCloneField";
import MyTextField from "components/Common/Ui/Form/MyTextField";
import CanAction from "components/Common/Ui/CanAction";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0,
    };
    this.onChangeStatus = this._onChangeStatus.bind(this);
    this.getCustomerCareArgs = this._getCustomerCareArgs.bind(this);
  }

  _onChangeStatus(value) {
    this.setState({ type: value });
  }

  _getCustomerCareArgs() {
    let division_code = this.props.user ? this.props.user.division_code : "";
    let args = {};
    args["division_code_list[0]"] = Constant.DIVISION_TYPE_customer_care_member;
    if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
      args["division_code_list[1]"] = Constant.DIVISION_TYPE_customer_care_leader;
    }
    return args;
  }

  render() {
    let { type } = this.state;
    const { isEdit } = this.props;
    const { values, errors, setFieldError } = this.props;

    let finalType = type;

    if (isEdit) {
      finalType = type || values.assigned_type;
    }

    return (
      <React.Fragment>
        <div className={"row"}>
          <div className="col-sm-12 sub-title-form mb20">
            <span>Thông tin cuộc gọi</span>
          </div>
        </div>
        <div className={"row"}>
          <div className="col-sm-6 mb10 paddingLeft0">
            <div className="col-sm-12 mb10">
              <CanAction isDisabled={isEdit}>
                <MyField name={"employer_id"} label={"ID Nhà tuyển dụng"} />
              </CanAction>
            </div>
            <div className="col-sm-12 mb10">
              <MyField name={"name"} label={"Tên Nhà tuyển dụng"} showLabelRequired />
            </div>

            <div className="col-sm-12 mb10">
              <MyField name={"tax_code"} label={"Mã số thuế"} />
            </div>

            <div className="col-sm-12 mb10">
              <MyField name={"address"} label={"Địa chỉ"} />
            </div>

            <div className="col-sm-12 mb10">
              <MyField name={"contact_name"} label={"Tên Người liên hệ"} />
            </div>
            <div className="col-sm-12 mb10">
              <MySelectSystem
                name={"area"}
                label={"Miền"}
                type={"common"}
                valueField={"value"}
                idKey={Constant.COMMON_DATA_KEY_area}
              />
            </div>
          </div>
          <div className="col-sm-6 mb10 paddingRight0">
            <div className="col-sm-12 mb10">
              <MyCloneField
                errors={errors}
                setFieldError={setFieldError}
                value={values?.phone || [""]}
                name="phone"
                label={"Số điện thoại liên hệ"}
              />
            </div>

            <div className="col-sm-12 mb10">
              <MyField name={"email"} label={"Email"} />
            </div>
            <div className="col-sm-12 mb10">
              <MySelectSystem
                name={"customer_demand"}
                label={"Nhu cầu của Khách hàng"}
                type={"common"}
                valueField={"value"}
                idKey={Constant.COMMON_DATA_KEY_CUSTOMER_DEMAND}
                showLabelRequired
              />
            </div>

            <div className="col-sm-12 mb10">
              <MySelectSystem
                name={"assigned_type"}
                label={"Chọn loại CSKH"}
                type={"common"}
                valueField={"value"}
                idKey={Constant.COMMON_DATA_KEY_EMPLOYER_HOTLINE_TYPE}
                showLabelRequired
                handleChange={this.onChangeStatus}
              />
            </div>

            {finalType == 1 && (
              <div className="col-sm-12 mb10">
                <MySelectFetch
                  name={"assigned_staff_id"}
                  label={"Giỏ CSKH"}
                  fetchApi={getTeamMember}
                  fetchFilter={{}}
                  fetchField={{ value: "id", label: "login_name" }}
                  showLabelRequired
                />
              </div>
            )}

            {finalType == 2 && (
              <div className="col-sm-12 mb10">
                <MySelectFetch
                  name={"assigned_staff_id"}
                  label={"Giỏ CSKH"}
                  fetchApi={getStaffHeadhunt}
                  fetchFilter={this.getCustomerCareArgs()}
                  fetchField={{ value: "id", label: "login_name" }}
                  showLabelRequired
                />
              </div>
            )}

            {finalType == 0 && (
              <div className="col-sm-12 mb10">
                <CanAction isDisabled={true}>
                  <MySelectSystem
                    name={"assigned_staff_id"}
                    label={"Giỏ CSKH"}
                    type={"common"}
                    valueField={"value"}
                    showLabelRequired
                  />
                </CanAction>
              </div>
            )}
          </div>
          <div className="col-md-12 mb10  ">
            <MyTextField name={"note"} label={"Ghi chú"} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProp(state) {
  return {
    branch: state.branch,
  };
}

export default connect(mapStateToProp, null)(FormComponent);
