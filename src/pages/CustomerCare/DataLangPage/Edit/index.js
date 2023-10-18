import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import queryString from "query-string";
import { bindActionCreators } from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import { langCreate, langGetDetail, langUpdate } from "api/system";

import { putToastError, putToastSuccess } from "actions/uiAction";
import * as Constant from "utils/Constant";
import { subscribe } from "utils/event";
import * as utils from "utils/utils";

import FormComponent from "./FormComponent";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    let defaultItem = {
      status: Constant.STATUS_ACTIVED,
      available_from_date: moment().unix(),
    };
    this.state = {
      id: props.id,
      item: defaultItem,
      loading: true,
      initialForm: {
        name: "name",
        type: "type",
        key: "key",
        lang: "lang",
        common_id: "common_id",
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

  _goBack(id) {
    const { history } = this.props;

    if (id > 0) {
      if (_.get(history, "action") === "POP") {
        history.push({
          pathname: Constant.BASE_URL_LANG_PAGE,
          search: "?action=list",
        });

        return true;
      }

      if (_.get(history, "action") === "PUSH") {
        const search = queryString.parse(
          _.get(history, ["location", "search"])
        );
        const params = {
          ...search,
          action: "list",
        };

        history.push({
          pathname: Constant.BASE_URL_LANG_PAGE,
          search: "?" + queryString.stringify(params),
        });

        return true;
      }
    } else {
      history.push({
        pathname: Constant.BASE_URL_LANG_PAGE,
      });
    }

    return true;
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
    const { id } = this.state;
    const { actions, history } = this.props;
    this.setState({ loading: false });
    let res;
    if (id > 0) {
      data.id = id;
      res = await langUpdate(data);
    } else {
      res = await langCreate(data);
    }
    if (res) {
      this.setState({ loading: false });
      const { data, code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        actions.putToastSuccess("Thao tác thành công!");
        history.push({
          pathname: Constant.BASE_URL_LANG_PAGE,
        });
        this.setState({ id: data?.id || 0 });
        this.asyncData();
      } else {
        setErrors(data);
        actions.putToastError(msg);
      }
    }
    this.setState({ loading: false });
  }

  async asyncData() {
    const { id } = this.state;

    if (id > 0) {
      const res = await langGetDetail({ id });
      if (res) {
        this.setState({ item: res, loading: false });
      }
    } else {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { id } = this.state;
    if (id > 0) {
      this.asyncData();
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { id, initialForm, item, loading } = this.state;
    const shapeValidateDefault = {
      name: Yup.string().required(Constant.MSG_REQUIRED),
      lang: Yup.string().required(Constant.MSG_REQUIRED),
      type: Yup.string().required(Constant.MSG_REQUIRED),
      common_id: Yup.string().required(Constant.MSG_REQUIRED),
    };

    const validationSchema = Yup.object().shape({
      ...shapeValidateDefault,
    });

    const dataForm = item
      ? utils.initFormValue(initialForm, item)
      : utils.initFormKey(initialForm);

    return (
      <React.Fragment>
        <div className="form-container">
          {loading && <LoadingSmall className="form-loading" />}

          <FormBase
            onSubmit={this.onSubmit}
            initialValues={dataForm}
            validationSchema={validationSchema}
            isEdit={id > 0}
            FormComponent={FormComponent}
          >
            <div className={"row mt15"}>
              <div className="col-sm-12">
                <button
                  type="submit"
                  className="el-button el-button-success el-button-small"
                >
                  <span>Lưu</span>
                </button>
                <button
                  type="button"
                  className="el-button el-button-default el-button-small"
                  onClick={() => this.goBack(id)}
                >
                  <span>Quay lại</span>
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
    branch: state.branch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, putToastError }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
