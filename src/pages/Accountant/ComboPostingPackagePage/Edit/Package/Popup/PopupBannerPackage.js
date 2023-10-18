import React, { Component } from "react";
import Input2 from "components/Common/InputValue/Input2";
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
import moment from "moment-timezone";
import CanAction from "components/Common/Ui/CanAction";
import { publish } from "utils/event";
import { getDetailSKU } from "api/system";
import { createPostingComboItem } from "api/saleOrder";
moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupBannerPackage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      object: {},
      object_required: [
        "service_code",
        "quantity",
        "week_quantity",
        "sku_code",
        "displayed_area",
        "type_campaign",
      ],
      object_error: {},
      name_focus: "",
      is_area_disable: false,
    };
    this.onSave = this._onSave.bind(this);
    this.onChange = this._onChange.bind(this);
    this.onChangeService = this._onChangeService.bind(this);
    this.getDetail = this._getDetail.bind(this);
  }

  async _onSave(data) {
    const { uiAction } = this.props;
    this.setState({ object_error: {}, loading: true, name_focus: "" });

    let object = Object.assign({}, data);
    let object_required = this.state.object_required;
    let check = utils.checkOnSaveRequired(object, object_required);
    if (check.error) {
      this.setState({
        name_focus: check.field,
        loading: false,
        object_error: check.fields,
      });

      if (check.fields.sku_code) {
        uiAction.putToastError("Mã SKU là thông tin bắt buộc");
      }

      return;
    }
    let error = {};

    if (parseInt(object.week_quantity) <= 0) {
      error["week_quantity"] = ":attr_name phải lớn hơn 0.";
    }

    if (parseInt(object.quantity) <= 0) {
      error["quantity"] = ":attr_name không hợp lệ.";
    }

    if (!(Object.entries(error).length === 0)) {
      this.setState({ object_error: error, loading: false });
      return;
    }

    this.props.uiAction.showLoading();
    object.combo_post_id = this.props.id;
    object.service_type = Constant.SERVICE_TYPE_BANNER;
    const res = await createPostingComboItem(object);
    if (res) {
      this.props.uiAction.deletePopup();
      uiAction.putToastSuccess("Thao tác thành công");
      publish(".refresh", {}, Constant.IDKEY_EFFECT_PACKAGE);
    }
    this.props.uiAction.hideLoading();
  }

  _onChange(value, name) {
    const channel_code = this.props.branch.currentBranch.channel_code;
    let object_error = this.state.object_error;
    delete object_error[name];
    this.setState({ object_error: object_error });
    this.setState({ name_focus: "" });
    let object = Object.assign({}, this.state.object);
    object[name] = value;
    this.setState({ object: object });

    // Xử lý thay đổi gói dịch vụ
    // #CONFIG_BRANCH
    if (
      name === "service_code" &&
      channel_code === Constant.CHANNEL_CODE_VL24H
    ) {
      const service_list = this.props.sys.service.items.filter(
        (c) =>
          c.service_type === Constant.SERVICE_TYPE_BANNER &&
          c.page_type === Constant.SERVICE_PAGE_TYPE_HOME_PAGE &&
          c.code === value &&
          parseInt(c.status) === Constant.STATUS_ACTIVED
      );

      if (service_list.length > 0) {
        object.displayed_area = Constant.AREA_ALL;
        this.setState({
          is_area_disable: true,
          object: object,
        });
      } else {
        object["displayed_area"] = null;
        this.setState({
          is_area_disable: false,
          object: object,
        });
      }
    }
  }
  async _onChangeService(value, name) {
    const { object } = this.state;
    if (value) {
      const res = await getDetailSKU({ service_code: value });
      if (res) {
        this.setState({
          object: { ...object, sku_code: res?.sku_code },
        });
      }
    } else {
      object.sku_code = null;
      this.setState({ object: object });
    }
    this.onChange(value, name);
  }
  _getDetail(id) {
    let args = {
      id: id,
      sales_order_id: this.props.sales_order.id,
    };
    this.setState({ loading: true });
    this.props.apiAction.requestApi(
      apiFn.fnGet,
      config.apiSalesOrderDomain,
      ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_DETAIL,
      args
    );
  }
  componentWillMount() {
    let { object } = this.props;
    if (object) {
      this.getDetail(object.id);
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
    const channel_code = this.props.branch.currentBranch.channel_code;
    let { object, object_error, object_required, name_focus, is_area_disable } =
      this.state;
    let box_code_list = this.props.sys.service.items.filter(
      (c) =>
        c.service_type === Constant.SERVICE_TYPE_BANNER &&
        parseInt(c.status) === Constant.STATUS_ACTIVED
    );
    let area = utils.convertArrayValueCommonData(
      this.props.sys.common.items,
      Constant.COMMON_DATA_KEY_area
    );
    let end_date = utils.calcDate(
      object.start_date,
      object.week_quantity,
      object.day_quantity,
      "DD/MM/YYYY"
    );

    /*Kiểm tra điều kiện hiển thị form cho MW*/
    // #CONFIG_BRANCH

    if (channel_code === Constant.CHANNEL_CODE_MW) {
      object.displayed_area =
        Constant.DEFAULT_VALUE_FORM_BANNER[channel_code].displayed_area;
    }

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
                <span>Quảng bá thương hiệu</span>
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
                  <CanAction isDisabled={is_area_disable}>
                    <Dropbox
                      name="displayed_area"
                      label="Khu vực hiển thị"
                      data={area}
                      required={object_required.includes("displayed_area")}
                      error={object_error.displayed_area}
                      value={Constant.AREA_ALL}
                      nameFocus={name_focus}
                      onChange={this.onChange}
                      readOnly={true}
                    />
                  </CanAction>
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
                  {end_date && (
                    <div className="end-date">
                      <span>ngày kết thúc: {end_date}</span>
                    </div>
                  )}
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
              </div>
              <div className="col-sm-12 col-xs-12 padding0">
                <div className="col-sm-6 col-xs-12 mb10">
                  <Input2
                    type="text"
                    name="quantity"
                    label="Số lượng"
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
export default connect(mapStateToProps, mapDispatchToProps)(PopupBannerPackage);
