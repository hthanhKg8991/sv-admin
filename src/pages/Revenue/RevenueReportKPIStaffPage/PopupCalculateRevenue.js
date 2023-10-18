import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import moment from "moment-timezone";
import FormBase from "components/Common/Ui/Form";
import * as Constant from "utils/Constant";
import { runKPICron } from "api/commission";
import * as Yup from "yup";
import * as utils from "utils/utils";
import MySelect from "components/Common/Ui/Form/MySelect";
import { publish } from "utils/event";
moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupCalculateRevenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      object: props.object,
      object_required: ["data"],
      object_error: {},
      name_focus: "",
      loading: false,
    };

    this.onSubmit = this._onSubmit.bind(this);
  }

  async _onSubmit(data) {
    const { uiAction, idKey } = this.props;
    this.setState({ object_error: {} });
    this.setState({ name_focus: "" });

    let object = Object.assign({}, data);
    let object_required = this.state.object_required;
    if (object.effect_code) {
      object_required = object_required.concat(["data"]);
    }

    let check = utils.checkOnSaveRequired(object, object_required);
    if (check.error) {
      this.setState({ name_focus: check.field });
      this.setState({ object_error: check.fields });
      return;
    }
    this.setState({ loading: true });
    uiAction.showLoading();
    const res = await runKPICron({
      task_name: "Kpistaff",
      function_name: "run",
      data: [data],
    });

    if (res) {
      uiAction.putToastSuccess("Thao tác thành công");
      publish(".refresh", {}, idKey);
    }

    uiAction.deletePopup();
    this.props.uiAction.hideLoading();
  }

  render() {
    const { loading } = this.state;
    const { config_list } = this.props;
    const configList = config_list
      ? config_list.map((e, i) => ({ label: e.title, value: e.value }))
      : [];
    const fieldWarnings = ["data"];
    const validationSchema = Yup.object().shape({
      data: Yup.string().required(Constant.MSG_REQUIRED),
    });

    return (
      <React.Fragment>
        <div className="form-container">
          <FormBase
            onSubmit={this.onSubmit}
            initialValues={{ data: "" }}
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
                <MySelect
                  name={"data"}
                  label={"Cấu hình"}
                  isWarning={_.includes(fieldWarnings, "data")}
                  options={configList}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupCalculateRevenue);
