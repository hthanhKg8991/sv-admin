import React from "react";
import { addContactHotline, updateContactHotline, contactHotlineDetail } from "api/hotline";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { subscribe } from "utils/event";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as utils from "utils/utils";
import { putToastError, putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { asyncApi } from "api";

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      contact: null,
      loading: true,
      reloadAdd: false,
      initialForm: {
        name: "name",
        email: "email",
        phone: "phone",
        employer_id: "employer_id",
        tax_code: "tax_code",
        address: "address",
        contact_name: "contact_name",
        assigned_staff_id: "assigned_staff_id",
        assigned_type: "assigned_type",
        customer_demand: "customer_demand",
        assigned_staff_username: "assigned_staff_username",
        note: "note",
        area: "area",
      },
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
    this.goBack = this._goBack.bind(this);
  }

  _goBack(id) {
    const { history } = this.props;
    history.goBack();
  }

  _onSubmit(data, action) {
    const { setErrors } = action;
    delete data.assigned_staff_username;

    const dataSumbit = _.pickBy(data, (item, key) => {
      return !_.isUndefined(item);
    });

    this.setState({ loading: true }, () => {
      this.submitData(dataSumbit, setErrors);
    });
  }

  async submitData(data, setErrors) {
    const { id } = this.state;
    const { actions, history } = this.props;
    let res;
    if (id > 0) {
      data.id = id;
      res = await updateContactHotline(data);
    } else {
      res = await addContactHotline(data);
    }
    if (res) {
      const { data, code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        actions.putToastSuccess("Thao tác thành công!");
        if (data.id) {
          history.push({
            pathname: Constant.BASE_URL_HOTLINE_LIST_CONTACT_HOTLINE,
            search: "?action=detail&id=" + data.id,
          });
        } else {
          history.push({
            pathname: Constant.BASE_URL_HOTLINE_LIST_CONTACT_HOTLINE,
          });
        }
      } else {
        setErrors(data);
        actions.putToastError(msg);
        this.setState({ loading: false });
      }
    }
    this.setState({ loading: false });
  }

  async asyncData() {
    const { id } = this.state;
    this.setState({
      loading: true,
      contact: null,
    });

    if (id > 0) {
      const res = await asyncApi({
        data: contactHotlineDetail(id),
      });

      const { data } = res;
      if (data) {
        this.setState({
          loading: false,
          contact: data,
        });
      }
    } else {
      this.setState({
        reloadAdd: true,
      });
      setTimeout(() => {
        this.setState({
          loading: false,
          contact: null,
          reloadAdd: false,
        });
      }, 300);
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
    const { id, initialForm, contact, loading, reloadAdd } = this.state;

    const shape = {
      name: Yup.string().required(Constant.MSG_REQUIRED).nullable(),
      email: Yup.string().email(Constant.MSG_TYPE_VALID).nullable(),
      phone: Yup.array()
        .of(Yup.string().min(10, Constant.MSG_MIN_CHARATER_10).required(Constant.MSG_REQUIRED))
        .required(Constant.MSG_REQUIRED),

      assigned_staff_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      assigned_type: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      customer_demand: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      note: Yup.string().nullable(),
      area: Yup.string().nullable(),
    };

    const validationSchema = Yup.object().shape(shape);

    const dataForm = contact ? utils.initFormValue(initialForm, contact) : utils.initFormKey(initialForm);
    return (
      <div className="form-container bg-white">
        {loading && <LoadingSmall className="form-loading" />}

        {!reloadAdd && (
          <FormBase
            onSubmit={this.onSubmit}
            isEdit={id > 0}
            initialValues={dataForm}
            validationSchema={validationSchema}
            FormComponent={FormComponent}
          >
            <div className=" mt15 flex-row-end-class ">
              <div className="">
                <button type="button" className="el-button el-button-default el-button-small" onClick={() => this.goBack(id)}>
                  <span>Quay lại</span>
                </button>
                <button type="submit" className="el-button el-button-success el-button-small">
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </FormBase>
        )}
      </div>
    );
  }
}

function mapStateToProp(state) {
  return {
    branch: state.branch,
    sys: state.sys,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, putToastError }, dispatch),
  };
}

export default connect(mapStateToProp, mapDispatchToProps)(Add);
