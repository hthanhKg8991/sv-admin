import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import queryString from "query-string";
import { bindActionCreators } from "redux";
import * as Yup from "yup";

import FormBase from "components/Common/Ui/Form";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import {
  createPostingCombo,
  getDetailPostingCombo,
  updatePostingCombo,
} from "api/saleOrder";

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
        sub_title: "sub_title",
        ordering: "ordering",
        description: "description",
        available_from_date: "available_from_date",
        available_to_date: "available_to_date",
        is_display: "is_display",
        status: "status",
        discount_value: "discount_value",
        promotion_value: "promotion_value",
        marketing_type: "marketing_type",
        type_campaign: "type_campaign",
        combo_group: "combo_group",
        image_url: "image_url",
        show_promotion: "show_promotion",
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
          pathname: Constant.BASE_URL_COMBO_POSTING_PACKAGE_PAGE,
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
          pathname: Constant.BASE_URL_COMBO_POSTING_PACKAGE_PAGE,
          search: "?" + queryString.stringify(params),
        });

        return true;
      }
    } else {
      history.push({
        pathname: Constant.BASE_URL_COMBO_POSTING_PACKAGE_PAGE,
      });
    }

    return true;
  }

  _onSubmit(data, action) {
    const { setErrors } = action;
    const dataSubmit = _.pickBy(data, (item) => {
      return !_.isUndefined(item);
    });

    if (!dataSubmit.discount_type) {
      dataSubmit.discount_type = "PERCENT";
    }
    if (!dataSubmit.promotion_type) {
      dataSubmit.promotion_type = "PERCENT";
    }

    this.setState({ loading: true }, () => {
      this.submitData(dataSubmit, setErrors);
    });
  }

  async submitData(data, setErrors) {
    const { id } = this.state;
    const { actions, history } = this.props;
    this.setState({ loading: false });
    data.discount_value = null;
    data.promotion_value = null;
    data.show_promotion = data.show_promotion?.length > 0 ? 1 : 2;
    if (data.combo_group !== "SERVICE_POINT" && !data.type_campaign) {
      setErrors({ type_campaign: "Thông tin là bắt buộc" });
      return false;
    }
    if (data.image_url.includes("https://")) {
      data.image_url = new URL(data.image_url).pathname;
    }
    let res;
    if (id > 0) {
      data.id = id;
      res = await updatePostingCombo(data);
    } else {
      res = await createPostingCombo(data);
    }
    if (res) {
      this.setState({ loading: false });
      const { data, code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        actions.putToastSuccess("Thao tác thành công!");
        history.push({
          pathname: Constant.BASE_URL_COMBO_POSTING_PACKAGE_PAGE,
          search: `?action=edit&id=${data?.id || 0}`,
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
      const res = await getDetailPostingCombo({ id });
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
    const fieldWarnings = [];
    const shapeValidateDefault = {
      name: Yup.string().required(Constant.MSG_REQUIRED),
      ordering: Yup.number()
        .typeError(Constant.MSG_NUMBER_ONLY)
        .positive(Constant.MSG_POSITIVE_ONLY)
        .min(1, Constant.MSG_MIN_NUMBER_VALUE_DYNAMIC(1))
        .max(9, Constant.MSG_MAX_NUMBER_VALUE_DYNAMIC(9))
        .required(Constant.MSG_REQUIRED),
      available_from_date: Yup.string().required(Constant.MSG_REQUIRED),
      available_to_date: Yup.string().required(Constant.MSG_REQUIRED),
      is_display: Yup.string().required(Constant.MSG_REQUIRED),
      status: Yup.string().required(Constant.MSG_REQUIRED),
      combo_group: Yup.string().required(Constant.MSG_REQUIRED),
      image_url: Yup.string().required(Constant.MSG_REQUIRED),
      description: Yup.string().required(Constant.MSG_REQUIRED),
      type_campaign: Yup.string().when("combo_group", {
        is: (v) => !["SERVICE_POINT"].includes(v),
        then: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
      }),
    };
    const validationSchema = Yup.object().shape({
      ...shapeValidateDefault,
    });

    const dataForm = item
      ? utils.initFormValue(initialForm, item)
      : utils.initFormKey(initialForm);
    dataForm.show_promotion =
      item?.show_promotion === 1 ? [dataForm.show_promotion] : [];
    return (
      <React.Fragment>
        <div className="form-container">
          {loading && <LoadingSmall className="form-loading" />}

          <FormBase
            onSubmit={this.onSubmit}
            initialValues={dataForm}
            validationSchema={validationSchema}
            fieldWarnings={fieldWarnings}
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
