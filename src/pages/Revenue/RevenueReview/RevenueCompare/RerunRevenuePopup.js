import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import moment from "moment-timezone";
import { publish } from "utils/event";
import MyDate from "components/Common/Ui/Form/MyDate";
import FormBase from "components/Common/Ui/Form";
import { rerunLostRevenue } from "api/saleOrder";
import * as Constant from "utils/Constant";
import AdminStorage from "utils/storage";
import * as Yup from "yup";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class RerunRevenuePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      object: props.object,
      object_required: ["revenue_at"],
      object_error: {},
      name_focus: "",
      loading: false,
    };

    this.onSubmit = this._onSubmit.bind(this);
    this.onChange = this._onChange.bind(this);
    this.invalidRunLostCron = this._invalidRunLostCron.bind(this);
    this.validRunLostCron = this._validRunLostCron.bind(this);
  }

  async _validRunLostCron(object) {
    const { uiAction, idKey } = this.props;
    const res = await rerunLostRevenue({
      revenue_at: object.revenue_at,
    });
    if (res) {
      AdminStorage.setExpiresCron(
        "check_run_next_cron",
        new Date().getTime() + Constant.THE_NEXT_10_MINUTES
      );
      uiAction.putToastSuccess("Thao tác thành công");
      publish(".refresh", {}, idKey);
    }
  }

  _invalidRunLostCron(min, sec) {
    const { uiAction } = this.props;
    uiAction.putToastError(
      `Bạn cần chờ ${min} phút ${sec} giây để thực hiện cron tiếp theo`
    );
  }

  async _onSubmit(data) {
    const { uiAction } = this.props;
    this.setState({ object_error: {} });
    this.setState({ name_focus: "" });

    let object = Object.assign({}, data);
    let object_required = this.state.object_required;
    if (object.effect_code) {
      object_required = object_required.concat(["revenue_at"]);
    }

    let check = utils.checkOnSaveRequired(object, object_required);
    if (check.error) {
      this.setState({ name_focus: check.field });
      this.setState({ object_error: check.fields });
      return;
    }
    this.setState({ loading: true });
    uiAction.showLoading();
    await AdminStorage.checkExpiresCron(
      "check_run_next_cron",
      this.invalidRunLostCron,
      this.validRunLostCron,
      object
    );
    uiAction.deletePopup();
    this.props.uiAction.hideLoading();
  }

  _onChange(value, name) {
    const { object_error } = this.state;
    delete object_error[name];
    this.setState({ object_error: object_error });
    this.setState({ name_focus: "" });
    let object = Object.assign({}, this.state.object);
    object[name] = value;
    this.setState({ object: object });
  }

  render() {
    const { object_required, loading } = this.state;
    const fieldWarnings = ["revenue_at"];
    const validationSchema = Yup.object().shape({
      revenue_at: Yup.string().required(Constant.MSG_REQUIRED),
    });

    return (
      <React.Fragment>
        <div className="form-container">
          <FormBase
            onSubmit={this.onSubmit}
            initialValues={{ revenue_at: "" }}
            validationSchema={validationSchema}
            fieldWarnings={fieldWarnings}
            FormComponent={({ values }) => (
              <div
                style={{
                  marginTop: "30px",
                  height: "auto",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  margin: "auto",
                }}
              >
                <MyDate
                  name={"revenue_at"}
                  label={"Chọn ngày cần chạy"}
                  maxDate={moment()}
                  //   minDate={moment()}
                  isWarning={_.includes(object_required, "revenue_at")}
                  showLabelRequired
                />
              </div>
            )}
          >
            <hr></hr>
            <div
              className={"row mt15 paddingBottom5 paddingRight10 paddingLeft10"}
            >
              <div className="col-sm-12">
                <button
                  type="submit"
                  className="el-button el-button-success el-button-small"
                  disabled={loading}
                >
                  <span>Xác nhận</span>
                </button>
              </div>
            </div>
          </FormBase>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    sys: state.sys,
    api: state.api,
    branch: state.branch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    apiAction: bindActionCreators(apiAction, dispatch),
    uiAction: bindActionCreators(uiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RerunRevenuePopup);
