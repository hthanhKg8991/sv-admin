import React from "react";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import * as Yup from "yup";
import * as utils from "utils/utils";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { subscribe } from "utils/event";
import { putToastError, putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { checkConditions } from "api/emailMarketing";
import PopupCheckConditions from "pages/EmailMarketing/ListContactPage/Popup/PopupCheckConditions";
import { createPopup } from "actions/uiAction";

class AddSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loading: true,
      initialForm: {
        conditions: "conditions",
      },
    };

    this.subscribers = [];
    this.subscribers.push(
      subscribe(
        ".refresh",
        () => {
          this.setState({ loading: true }, () => {
            this.asyncData();
          });
        },
        props.idKey
      )
    );

    this.onSubmit = this._onSubmit.bind(this);
    this.goBack = this._goBack.bind(this);
  }

  _goBack() {
    const { history } = this.props;
    history.goBack();
  }

  _onSubmit(data, action) {
    const { setErrors } = action;
    const dataSubmit = _.pickBy(data, (item) => {
      return !_.isUndefined(item);
    });
    this.setState({ loading: true }, () => {
      this.submitData(dataSubmit, setErrors);
    });
  }

  async submitData(data, setErrors) {
    const { actions, history } = this.props;

    let res = await checkConditions(data);

    if (res) {
      const { data, code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        const { actions } = this.props;
        actions.createPopup(PopupCheckConditions, "Xác nhận", { data, history });
      } else {
        setErrors(data);
        actions.putToastError(msg);
      }
    }
    this.setState({ loading: false });
  }

  async asyncData() {
    this.setState({ loading: false });
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const { initialForm, item, loading } = this.state;

    const validationSchema = Yup.object().shape({
      audience_conditions: Yup.array().of(
        Yup.object().shape({
          left: Yup.string().required(Constant.MSG_REQUIRED),
          operation: Yup.string().required(Constant.MSG_REQUIRED),
          right: Yup.string().required(Constant.MSG_REQUIRED),
        })
      ),
    });

    const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
    dataForm.conditions = dataForm?.conditions?.length > 0 ? dataForm.conditions : [Constant.CONDITION_DEFAULT];

    return (
      <div className="form-container">
        {loading && <LoadingSmall className="form-loading" />}

        <FormBase
          onSubmit={this.onSubmit}
          initialValues={dataForm}
          validationSchema={validationSchema}
          fieldWarnings={[]}
          FormComponent={FormComponent}
        >
          <div className={"row mt15"}>
            <div className="col-sm-12">
              <button type="submit" className="el-button el-button-success el-button-small">
                <span>Lưu</span>
              </button>
              <button type="button" className="el-button el-button-default el-button-small" onClick={() => this.goBack()}>
                <span>Quay lại</span>
              </button>
            </div>
          </div>
        </FormBase>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, putToastError, createPopup }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(AddSegment);
