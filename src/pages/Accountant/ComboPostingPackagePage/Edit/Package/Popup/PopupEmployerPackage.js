import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";
import { bindActionCreators } from "redux";

import Dropbox from "components/Common/InputValue/Dropbox";
import Input2 from "components/Common/InputValue/Input2";
import LoadingSmall from "components/Common/Ui/LoadingSmall";

import { createPostingComboItem } from "api/saleOrder";
import { getDetailSKU } from "api/system";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import { publish } from "utils/event";
import * as utils from "utils/utils";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupEmployerPackage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      object: {},
      object_required: [
        "service_code",
        "quantity",
        "sku_code",
        "type_campaign",
      ],
      object_error: {},
      name_focus: "",
    };
    this.onSave = this._onSave.bind(this);
    this.onChange = this._onChange.bind(this);
    this.onChangeService = this._onChangeService.bind(this);
  }

  async _onSave(data) {
    const { uiAction } = this.props;
    this.setState({ object_error: {} });
    this.setState({ name_focus: "" });

    let object = Object.assign({}, data);
    let object_required = this.state.object_required;
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
    object.service_type = Constant.SERVICE_TYPE_FILTER_RESUME_2018;
    this.props.uiAction.showLoading();
    const res = await createPostingComboItem(object);
    if (res) {
      this.props.uiAction.deletePopup();
      uiAction.putToastSuccess("Thao tác thành công");
      publish(".refresh", {}, Constant.IDKEY_EMPLOYER_PACKAGE);
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
    if (name === "quantity") {
      const pointConfig =
          this.props.sys.common.items[
              Constant.COMMON_DATA_KEY_list_price_promotion_point
              ] || [];
      const configSort = pointConfig.sort(
          (a, b) => Number(b.from) - Number(a.from)
      );
      const point = configSort.find((item) => value >= item.from);
      object["week_quantity"] = point ? Number(point?.to) : "";
    }
    this.setState({ object: object });
  }

  async _onChangeService(value, name) {
    const { object } = this.state;
    if (value) {
      const res = await getDetailSKU({ service_code: value });
      if (res) {
        this.setState({ object: { ...object, sku_code: res?.sku_code } });
      }
    } else {
      object.sku_code = null;
      this.setState({ object: object });
    }
    this.onChange(value, name);
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
    let { object, object_error, object_required, name_focus } = this.state;
    let {sys} = this.props;
    const listService = sys?.service?.items;
    const detailService = listService?.find(_=>_?.service_type === "filter_resume_2018");
    let channel_code = this.props.branch.currentBranch.channel_code;
    let box_code_list = this.props.sys.service.items.filter(
        (c) =>
            c.channel_code === channel_code &&
            c.service_type === Constant.SERVICE_TYPE_FILTER_RESUME_2018
    );
    const bundles_type_campaign = utils.convertArrayValueCommonData(
        this.props.sys.common.items,
        Constant.COMMON_DATA_KEY_BUNDLES_TYPE_CAMPAIGN
    );

    return (
        <form
            onSubmit={(event) => {
              event.preventDefault();
              this.onSave(object);
            }}
        >
          <div className="dialog-popup-body">
            <div className="popupContainer">
              <div className="form-container row">
                <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                  <span>{detailService?.display_name_frontend || detailService?.display_name_contract}</span>
                </div>
                <div className="col-sm-12 col-xs-12 mb10">
                  <Dropbox
                      name="service_code"
                      label="Gói dịch vụ"
                      data={box_code_list}
                      required={object_required.includes("service_code")}
                      key_value="code"
                      key_title="name"
                      error={object_error.service_code}
                      value={object.service_code}
                      nameFocus={name_focus}
                      onChange={this.onChangeService}
                  />
                </div>
                <div className="col-sm-12 col-xs-12 padding0">
                  <div className="col-sm-6 col-xs-12 mb10">
                    <Input2
                        type="text"
                        name="quantity"
                        label="Điểm mua"
                        isNumber
                        required={object_required.includes("quantity")}
                        error={object_error.quantity}
                        value={object.quantity}
                        nameFocus={name_focus}
                        onChange={this.onChange}
                    />
                  </div>
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
                </div>
                <div className="col-sm-12 col-xs-12 padding0">
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
                        label={detailService?.display_name_frontend || detailService?.display_name_contract}
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PopupEmployerPackage);
