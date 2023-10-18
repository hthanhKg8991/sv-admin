import React from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { subscribe } from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import { putToastSuccess, putToastError } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import queryString from "query-string";
import { createSeoMeta, getDetailSeoMeta, updateSeoMeta } from "api/system";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      item: null,
      loading: true,
      loadingSubmit: false,
      initialForm: {
        page_name: "page_name",
        priority: "priority",
        status: "status",
        title: "title",
        description: "description",
        keywords: "keywords",
        url: "url",
        content: "content",
      },
      inputText: {},
      inputLink: {},
    };

    this.subscribers = [];
    this.subscribers.push(
      subscribe(
        ".refresh",
        (msg) => {
          this.setState({ loading: true }, () => {
            this.asyncData();
          });
        },
        props.idKey
      )
    );

    this.onSubmit = this._onSubmit.bind(this);
    this.onChangeText = this._onChangeText.bind(this);
    this.onChangeLink = this._onChangeLink.bind(this);
    this.goBack = this._goBack.bind(this);
  }

  _onChangeText(e) {
    const { inputText } = this.state;
    const newInputText = {
      ...inputText,
      [e.target.name]: e.target.value,
    };
    this.setState({ inputText: newInputText });
  }

  _onChangeLink(e) {
    const { inputLink } = this.state;
    const newInputLink = {
      ...inputLink,
      [e.target.name]: e.target.value,
    };
    this.setState({ inputLink: newInputLink });
  }

  _goBack(id) {
    const { history } = this.props;

    if (id > 0) {
      if (_.get(history, "action") === "POP") {
        history.push({
          pathname: Constant.BASE_URL_SEO_META,
          search: "?action=list",
        });

        return true;
      }

      if (_.get(history, "action") === "PUSH") {
        const search = queryString.parse(_.get(history, ["location", "search"]));
        const params = {
          ...search,
          action: "list",
        };

        history.push({
          pathname: Constant.BASE_URL_SEO_META,
          search: "?" + queryString.stringify(params),
        });

        return true;
      }
    } else {
      history.push({
        pathname: Constant.BASE_URL_SEO_META,
      });
    }

    return true;
  }

  _onSubmit(data, action) {
    const { setErrors } = action;
    const dataSumbit = _.pickBy(data, (item, key) => {
      return !_.isUndefined(item);
    });

    const { inputLink, inputText } = this.state;
    this.setState({ loadingSubmit: true }, () => {
      this.submitData({ ...dataSumbit, textlink_text: inputText, textlink_link: inputLink }, setErrors);
    });
  }

  async submitData(data, setErrors) {
    const { id } = this.state;
    const { actions, history } = this.props;
    let res;
    if (id > 0) {
      data.id = id;
      res = await updateSeoMeta(data);
    } else {
      res = await createSeoMeta(data);
    }
    if (res) {
      const { data, code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        actions.putToastSuccess("Thao tác thành công!");
        if (data.id) {
          history.push({
            pathname: Constant.BASE_URL_SEO_META,
            search: "?action=detail&id=" + data.id,
          });
        } else {
          history.push({
            pathname: Constant.BASE_URL_SEO_META,
          });
        }
      } else {
        setErrors(data);
        actions.putToastError(msg);
      }
    }
    this.setState({ loadingSubmit: false });
  }

  async asyncData() {
    const { id } = this.state;

    if (id > 0) {
      const res = await getDetailSeoMeta({ id });
      if (res) {
        this.setState({ item: res, loading: false });
        this.setState({ inputText: res?.textlink_text, inputLink: res?.textlink_link });
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
    const { id, initialForm, item, loading, inputLink, inputText, loadingSubmit } = this.state;
    const fieldWarnings = [];

    const validationSchema = Yup.object().shape({
      page_name: Yup.string().required(Constant.MSG_REQUIRED),
      priority: Yup.string().required(Constant.MSG_REQUIRED),
      status: Yup.number().required(Constant.MSG_REQUIRED),
      title: Yup.string().nullable(),
      description: Yup.string().nullable(),
      keywords: Yup.string().nullable(),
      content: Yup.string().nullable(),
      url: Yup.string().required(Constant.MSG_REQUIRED).max(200, Constant.MSG_MAX_CHARATER_200),
    });

    const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);
    dataForm.slug = item?.slug;

    const arrayInput = Array.from(Array(20).keys());

    return (
      <div className="form-container">
        {loadingSubmit && <LoadingSmall className="form-loading" />}
        {loading ? (
          <LoadingSmall className="form-loading" />
        ) : (
          <FormBase
            onSubmit={this.onSubmit}
            isEdit={id > 0}
            initialValues={dataForm}
            validationSchema={validationSchema}
            fieldWarnings={fieldWarnings}
            FormComponent={FormComponent}
          >
            <div className="row mt15">
              <div className="col-md-8 col-md-offset-2 mb10 text-center">
                <h6>
                  <b>Text link footer</b>
                </h6>
                <i>Để footer hiển thị link phải nhập đủ 20 text link</i>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <b>Text</b>
                    </p>
                    {arrayInput.map((v, idx) => (
                      <div className="mb5" key={idx.toString()}>
                        <input name={v} className={"form-control"} onChange={this.onChangeText} value={inputText[v] ?? null} />
                      </div>
                    ))}
                  </div>
                  <div className="col-md-6">
                    <p>
                      <b>Link</b>
                    </p>
                    {arrayInput.map((v, idx) => (
                      <div className="mb5" key={idx.toString()}>
                        <input name={v} className={"form-control"} onChange={this.onChangeLink} value={inputLink[v] ?? null} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={"row mt15"}>
              <div className="col-sm-12">
                <button type="submit" className="el-button el-button-success el-button-small">
                  <span>Lưu</span>
                </button>
                <button type="button" className="el-button el-button-default el-button-small" onClick={() => this.goBack(id)}>
                  <span>Quay lại</span>
                </button>
              </div>
            </div>
          </FormBase>
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, putToastError }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(Edit);
