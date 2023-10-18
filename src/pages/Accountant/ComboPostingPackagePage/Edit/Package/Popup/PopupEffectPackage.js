import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment-timezone";
import { bindActionCreators } from "redux";

import Dropbox from "components/Common/InputValue/Dropbox";
import Input2 from "components/Common/InputValue/Input2";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import { createPostingComboItem, getListPriceRunning } from "api/saleOrder";
import { getDetailSKU } from "api/system";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import { publish } from "utils/event";
import * as utils from "utils/utils";
import { getConfigForm } from "utils/utils";
moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupEffectPackage extends Component {
  constructor(props) {
    super(props);
    const { channel_code } = props.branch.currentBranch;
    const configForm = getConfigForm(
      channel_code,
      "CustomerCare.SalesOrderEditPage.PackageEffect"
    );

    let object_required = [
      "service_code",
      "quantity",
      "week_quantity",
      "sku_code",
      "type_campaign",
    ];
    if (configForm.includes("parent_service_code")) {
      object_required.push("parent_service_code");
    }
    this.state = {
      object: {},
      object_required: object_required,
      object_error: {},
      name_focus: "",
      package_running: [],
      configForm: configForm,
    };
    this.onSave = this._onSave.bind(this);
    this.onChange = this._onChange.bind(this);
    this.onChangeService = this._onChangeService.bind(this);
  }

  async _onSave(data, object_required) {

    const { uiAction } = this.props;
    this.setState({ object_error: {} });
    this.setState({ name_focus: "" });

    let object = Object.assign({}, data);
    let check = utils.checkOnSaveRequired(object, object_required);
    if (check.error) {
      this.setState({ name_focus: check.field });
      this.setState({ object_error: check.fields });

      if (check.fields.sku_code) {
        uiAction.putToastError("Mã SKU là thông tin bắt buộc");
      }

      return;
    }
    let error = {};
    if (parseInt(object.quantity) <= 0) {
      error["quantity"] = ":attr_name không hợp lệ.";
    }
    if (!(Object.entries(error).length === 0)) {
      this.setState({ object_error: error });
      return;
    }
    object.combo_post_id = this.props.id;
    // object.type_campaign = this.props.type_campaign;
    object.service_type = Constant.SERVICE_TYPE_EFFECT;
    this.props.uiAction.showLoading();

    const res = await createPostingComboItem(_.omitBy(object, _.isNil));
    if (res) {
      this.props.uiAction.deletePopup();
      uiAction.putToastSuccess("Thao tác thành công");
      publish(".refresh", {}, Constant.IDKEY_EFFECT_PACKAGE);
    }
    this.props.uiAction.hideLoading();
  }

  _onChange(value, name) {
    let object_error = this.state.object_error;
    delete object_error[name];
    this.setState({ object_error: object_error });
    this.setState({ name_focus: "" });
    let object = Object.assign({}, this.state.object);
    object[name] = value;
    if (name === "parent_service_code") {
      object.service_code = null;
      let box_code = this.props.sys.service.items.filter(
        (c) => c.code === value
      );
      if (
        box_code.length &&
        box_code[0].service_type === Constant.SERVICE_TYPE_JOB_BASIC
      ) {
        object.displayed_area = null;
        object.displayed_method = null;
      }
    }
    // Reset sku code
    if (name === "parent_service_code") {
      object.sku_code = null;
    }
    this.setState({ object: object });
  }

  async _onChangeService(value, name) {
    const { object } = this.state;
    if (value) {
      const res = await getDetailSKU({
        service_code: object?.parent_service_code || null,
        effect_code: value,
      });
      if (res) {
        this.setState({ object: { ...object, sku_code: res?.sku_code } });
      }
    } else {
      object.sku_code = null;
      this.setState({ object: object });
    }
    this.onChange(value, name);
  }

  async _getPackageRunning() {
    const res = await getListPriceRunning({
      service_type: [
        Constant.SERVICE_TYPE_JOB_BASIC,
        Constant.SERVICE_TYPE_JOB_BOX,
      ],
    });
    if (res && Array.isArray(res)) {
      const packages = res.map((p) => p?.service_code);
      this.setState({ package_running: packages });
    }
  }

  componentDidMount() {
    this._getPackageRunning();
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
    const channel_code = this.props.branch.currentBranch.channel_code;
    let {
      object,
      object_error,
      object_required,
      name_focus,
      package_running,
      configForm,
    } = this.state;
    let box_code_list = this.props.sys.service.items.filter(
      (c) =>
        c.channel_code === channel_code &&
        (c.service_type === Constant.SERVICE_TYPE_JOB_BOX ||
          c.service_type === Constant.SERVICE_TYPE_JOB_BASIC) &&
        package_running.includes(c.code) // kiểm tra các gói đang chạy trong bảng giá
    );
    let effect_list = this.props.sys.effect.items.filter(
      (c) => c.channel_code === channel_code
    );

    let box_code = box_code_list.filter(
      (c) => c.code === object.parent_service_code
    );
    let is_basic = false;
    if (
      box_code.length &&
      box_code[0].service_type === Constant.SERVICE_TYPE_JOB_BASIC
    ) {
      is_basic = true;
      effect_list = effect_list.filter(
        (c) =>
          c.code.indexOf(Constant.EFFECT_TYPE_REFRESH_HOUR) >= 0 ||
          c.code.indexOf(Constant.EFFECT_TYPE_REFRESH_DAY) >= 0
      );
    } else {
      effect_list = effect_list.filter(
        (c) =>
          c.detail_part.indexOf(Constant.EFFECT_TYPE_REFRESH_HOUR) < 0 &&
          c.detail_part.indexOf(Constant.EFFECT_TYPE_REFRESH_DAY) < 0
      );
      object_required = object_required.concat([
        "displayed_area",
        "displayed_method",
      ]);
    }

    let area = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_area
    )?.filter(item => item?.value !== 3);
    let display_method = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_display_method
    );
    const bundles_type_campaign = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_BUNDLES_TYPE_CAMPAIGN
    );


    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          this.onSave(object, object_required);
        }}
      >
        <div className="dialog-popup-body">
          <div className="popupContainer">
            <div className="form-container row">
              <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                <span>Hiệu ứng</span>
              </div>
              <div className="col-sm-12 col-xs-12 padding0">
                {_.includes(configForm, "parent_service_code") && (
                  <div className="col-sm-6 col-xs-12 mb10">
                    <Dropbox
                      name="parent_service_code"
                      label="Gói dịch vụ"
                      data={box_code_list}
                      required={object_required.includes("parent_service_code")}
                      key_value="code"
                      key_title="name"
                      error={object_error.parent_service_code}
                      value={object.parent_service_code}
                      nameFocus={name_focus}
                      onChange={this.onChange}
                    />
                  </div>
                )}
                <div className="col-sm-6 col-xs-12 mb10">
                  <Dropbox
                    name="service_code"
                    label="Hiệu ứng"
                    data={effect_list}
                    required={object_required.includes("service_code")}
                    key_value="code"
                    key_title="name"
                    error={object_error.service_code}
                    value={object.service_code}
                    nameFocus={name_focus}
                    onChange={this.onChangeService}
                  />
                </div>
              </div>
              {!is_basic ? (
                <div className="col-sm-12 col-xs-12 padding0">
                  <div className="col-sm-4 col-xs-12 mb10">
                    <Input2
                      type="text"
                      name="quantity"
                      label="Số tin"
                      isNumber
                      required={object_required.includes("quantity")}
                      error={object_error.quantity}
                      value={object.quantity}
                      nameFocus={name_focus}
                      onChange={this.onChange}
                    />
                  </div>
                  {object.displayed_area !== 3 && object.displayed_area !== null &&   <div className="col-sm-4 col-xs-12 mb10">
                    <Dropbox
                      name="displayed_area"
                      label="Khu vực hiển thị"
                      data={area}
                      required={object_required.includes("displayed_area")}
                      error={object_error.displayed_area}
                      value={object.displayed_area}
                      nameFocus={name_focus}
                      onChange={this.onChange}
                    />
                  </div>}
                  <div className="col-sm-4 col-xs-12 mb10">
                    <Dropbox
                      name="displayed_method"
                      label="Hình thức hiển thị"
                      data={display_method}
                      required={object_required.includes("displayed_method")}
                      error={object_error.displayed_method}
                      value={object.displayed_method}
                      nameFocus={name_focus}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="col-sm-12 col-xs-12 mb10">
                  <Input2
                    type="text"
                    name="quantity"
                    label="Số tin"
                    isNumber
                    required={object_required.includes("quantity")}
                    error={object_error.quantity}
                    value={object.quantity}
                    nameFocus={name_focus}
                    onChange={this.onChange}
                  />
                </div>
              )}

              <div className="col-sm-12 col-xs-12 padding0">
                <div className="col-sm-6 col-xs-12 mb10">
                  <Input2
                    type="text"
                    name="week_quantity"
                    label="TG DV (tuần)"
                    isNumber
                    required={object_required.includes("week_quantity")}
                    error={object_error.week_quantity}
                    value={object.week_quantity}
                    nameFocus={name_focus}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col-sm-6 col-xs-12 mb10">
                  <Input2
                    type="text"
                    name="sku_code"
                    label="Mã SKU"
                    required={object_required.includes("sku_code")}
                    value={object.sku_code}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-sm-12 col-xs-12 padding0">
                <div className="col-sm-6 col-xs-12 mb10">
                  <Input2
                    type="text"
                    name="discount_rate"
                    label="Chiết Khấu (%)"
                    isNumber
                    suffix=" %"
                    error={object_error.discount_rate}
                    value={object.discount_rate}
                    required={object_required.includes("discount_rate")}
                    nameFocus={name_focus}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col-sm-6 col-xs-12 mb10">
                  <Input2
                    type="text"
                    name="promotion_rate"
                    label="Khuyến mãi (%)"
                    isNumber
                    suffix=" %"
                    error={object_error.promotion_rate}
                    value={object.promotion_rate}
                    required={object_required.includes("promotion_rate")}
                    nameFocus={name_focus}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col-sm-6 col-xs-12 mb10">
                  <Dropbox
                    name="type_campaign"
                    label="Loại gói"
                    data={bundles_type_campaign}
                    required={object_required.includes("type_campaign")}
                    error={object_error.type_campaign}
                    value={object.type_campaign}
                    nameFocus={name_focus}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col-sm-6 col-xs-12 mb10">
                  <Input2
                    type="text"
                    name="point_convert"
                    label="Điểm dịch vụ"
                    isNumber
                    required={object_required.includes("point_convert")}
                    error={object_error.point_convert}
                    value={object.point_convert}
                    nameFocus={name_focus}
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="v-divider margin0" />
          <div className="v-card-action">
            <button
              type="submit"
              className="el-button el-button-success el-button-small"
            >
              <span>Lưu</span>
            </button>
          </div>
        </div>
      </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupEffectPackage);
