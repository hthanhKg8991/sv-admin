import React from "react";
import { AddResumeCvScanner } from "api/seeker";
import * as Constant from "utils/Constant";
import _ from "lodash";
import FormBase from "components/Common/Ui/Form";
import FormComponent from "./FormComponent";
import * as Yup from "yup";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import { putToastError, putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SeekerSearch from "./SeekerSearch";

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      loading: true,
      reloadAdd: false,
      dataCV: null,
      initialForm: {
        seeker_id: "seeker_id",
        content: "content",
        resume_id: "resume_id",
      },
    };

    this.onSubmit = this._onSubmit.bind(this);
    this.onSetDataCV = this._onSetDataCV.bind(this);
  }

  _onSubmit(data, action) {
    const { setErrors } = action;

    const dataSumbit = _.pickBy(data, (item, key) => {
      return !_.isUndefined(item);
    });

    this.setState({ loading: true }, () => {
      this.submitData(dataSumbit, setErrors);
    });
  }

  _onSetDataCV(data) {
    const { actions } = this.props;
    actions.putToastSuccess("Thao tác thành công!");
    this.setState({ dataCV: data });
  }

  async submitData(data, setErrors) {
    const { actions } = this.props;
    let res;
    res = await AddResumeCvScanner(data);
    if (res) {
      actions.putToastSuccess("Thao tác thành công!");
    } else {
      setErrors(data);
      actions.putToastError(msg);
      this.setState({ loading: false });
    }

    this.setState({ loading: false });
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const { id, loading, reloadAdd, dataCV } = this.state;

    const shape = {
      seeker_id: Yup.number().required(Constant.MSG_REQUIRED).nullable(),
      content: Yup.string().nullable(),
    };

    const validationSchema = Yup.object().shape(shape);
    const dataForm = {
      content: dataCV?.cv_file_full_text,
      seeker_id: dataCV?.seeker_id,
      resume_id: dataCV?.id,
    };

    console.log(dataCV, 11111111111111);
    return (
      <div className="form-container bg-white">
        {loading && <LoadingSmall className="form-loading" />}
        <SeekerSearch onSetDataCV={this.onSetDataCV} />
        {!reloadAdd && dataCV && (
          <div className={"row mt20"}>
            <div className="col-sm-12 col-xs-12 row-content padding0">
              <div className="col-sm-6 mb10 paddingLeft0">
                <FormBase
                  onSubmit={this.onSubmit}
                  isEdit={id > 0}
                  initialValues={dataForm}
                  validationSchema={validationSchema}
                  FormComponent={FormComponent}
                >
                  <div className=" mt15 flex-row-end-class ">
                    <div className="">
                      <button
                        type="submit"
                        className="el-button el-button-success el-button-small"
                      >
                        <span>Lưu</span>
                      </button>
                    </div>
                  </div>
                </FormBase>
              </div>
              {dataCV?.cv_file_url && (
                <div className="col-sm-6 mb10 paddingLeft0">
                  <embed src={dataCV?.cv_file_url} width="100%" height="900" />
                </div>
              )}
            </div>
          </div>
        )}
        <style jsx>{`
          .form-container {
            min-height: 100px;
          }
        `}</style>
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
