import React, { Component } from "react";
import Dropbox from "components/Common/InputValue/Dropbox";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import config from "config";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from "api";
import _ from "lodash";

class PopupSuggestJobContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name_focus: "",
      loading: true,
      suggestList: [],
      suggestContent: null,
    };
    this.onSave = this._onSave.bind(this);
    this.onChange = this._onChange.bind(this);
    this.getListSuggestion = this._getListSuggestion.bind(this);
    this.listContentSuggest = ["benefit", "description", "other_requirement"];
  }

  _onChange(value) {
    if (value) {
      this.props.apiAction.requestApi(
        apiFn.fnGet,
        config.apiEmployerDomain,
        ConstantURL.API_URL_GET_JOB_SUGGEST_CONTENT_DETAIL,
        { id: value }
      );
    } else {
      this.setState({ suggestContent: null });
    }
  }

  _onSave(event) {
    event.preventDefault();
    const { setFieldValue, suggestInput, values } = this.props;
    const { suggestContent } = this.state;
    if (!suggestContent) {
      return;
    }

    this.listContentSuggest.forEach((element) => {
      if (suggestInput === element) {
        setFieldValue(
          suggestInput,
          suggestContent[suggestInput].replaceAll("\n  ", "")
        ) || "";
      } else {
        const value = values[element];
        if (!value || value === `<p><br></p>`) {
          setFieldValue(
            element,
            suggestContent[element].replaceAll("\n  ", "")
          ) || "";
        }
      }
      this.props.uiAction.putToastSuccess("Đã thay thế gợi ý thành công!");
      this.props.uiAction.deletePopup();
    });
  }

  _getListSuggestion() {
    this.setState({ loading_getSuggestList: true });
    this.props.apiAction.requestApi(
      apiFn.fnGet,
      config.apiEmployerDomain,
      ConstantURL.API_URL_GET_LIST_JOB_SUGGEST_CONTENT
    );
  }

  componentDidMount() {
    //remove filed hidden is required
    if (this.state.suggestList.length === 0) {
      this.getListSuggestion();
    }
  }

  componentWillReceiveProps(newProps) {
    //benefit, other_requirement, description
    if (newProps.api[ConstantURL.API_URL_GET_LIST_JOB_SUGGEST_CONTENT]) {
      let response =
        newProps.api[ConstantURL.API_URL_GET_LIST_JOB_SUGGEST_CONTENT];
      if (response.code === Constant.CODE_SUCCESS) {
        let suggestList =
          response?.data?.map((item) => {
            return {
              value: item.id,
              title: item.title,
            };
          }) || [];
        this.setState({ suggestList: suggestList });
      }
      this.setState({ loading_getSuggestList: false });
      this.setState({ loading: false });
      this.props.apiAction.deleteRequestApi(
        ConstantURL.API_URL_GET_LIST_JOB_SUGGEST_CONTENT
      );
    }

    if (newProps.api[ConstantURL.API_URL_GET_JOB_SUGGEST_CONTENT_DETAIL]) {
      let response =
        newProps.api[ConstantURL.API_URL_GET_JOB_SUGGEST_CONTENT_DETAIL];
      if (response.code === Constant.CODE_SUCCESS) {
        this.setState({ suggestContent: response?.data || null });
      } else {
        this.setState({ suggestContent: null });
      }
      this.props.apiAction.deleteRequestApi(
        ConstantURL.API_URL_GET_JOB_SUGGEST_CONTENT_DETAIL
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys)
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="dialog-popup-body">
          <div className="form-container">
            <div className="popupContainer text-center">
              <LoadingSmall />
            </div>
          </div>
        </div>
      );
    }
    let { name_focus, suggestList, loading_getSuggestList, suggestContent } =
      this.state;
    const { suggestInput } = this.props;

    return (
      <div onSubmit={this.onSave}>
        <div className="dialog-popup-body">
          <div className="popupContainer">
            <div className="form-container row">
              <div className="col-sm-12 col-xs-12 mb10">
                <Dropbox
                  name="suggest_id"
                  label="Vị trí cần đăng tuyển"
                  required={true}
                  data={suggestList}
                  error={false}
                  nameFocus={name_focus}
                  onChange={this.onChange}
                  onChangeTimeOut={this.getListSuggestion}
                  timeOut={1000}
                  loading={loading_getSuggestList}
                />
              </div>
              <div className="col-sm-12 col-xs-12 mb10 box-content">
                {suggestContent ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: suggestContent[suggestInput] || "",
                    }}
                  ></div>
                ) : (
                  <p className="text-[#B6B6B8] text-14 font-normal">
                    Vui lòng chọn vị trí cần đăng tuyển để xem gợi ý
                  </p>
                )}
              </div>
            </div>
          </div>
          <hr className="v-divider margin0" />
          <div className="v-card-action">
            <button
              type="button"
              className="el-button el-button-success el-button-small"
              onClick={this.onSave}
            >
              <span>Sử dụng</span>
            </button>
            <button
              type="button"
              className="el-button el-button-small"
              onClick={() => this.props.uiAction.deletePopup()}
            >
              <span>Đóng</span>
            </button>
          </div>
          <p className="p10 pt5">
            Khi nhấn “Sử dụng” thì toàn bộ thông tin đã nhập sẽ được thay thế
            bằng mô tả của mẫu này.
          </p>
        </div>
        <style>{`
          .box-content {
            margin-top: 20px;
            padding: 20px;
            border-radius: 10px;
            background-color: #f6f6f6;
            min-height: 200px;
          }
        `}</style>
      </div>
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
)(PopupSuggestJobContent);
