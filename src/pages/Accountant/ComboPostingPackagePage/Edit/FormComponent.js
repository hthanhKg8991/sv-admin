import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import MyDate from "components/Common/Ui/Form/MyDate";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyFieldNew from "components/Common/Ui/Form/MyFieldNew";
import ImageInput from "pages/Accountant/ComboPostingPackagePage/Edit/ImageInput";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";

import * as Constant from "utils/Constant";
import MyCheckbox from "components/Common/Ui/Form/MyCheckbox";

class FormComponent extends React.Component {
  render() {
    const { fieldWarnings, values, branch, setFieldValue, errors, isEdit } =
      this.props;

    const dataKey =
      values.combo_group === "FLEXIBLE"
        ? Constant.COMMON_DATA_KEY_type_campaign_flexible
        : values.combo_group === "BRAND_PROMOTION"
        ? Constant.COMMON_DATA_KEY_type_campaign_brand
        : Constant.COMMON_DATA_KEY_type_campaign_post;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-12 sub-title-form mb10">
            <span>Thông tin hiển thị</span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb10">
            <MyField
              name={"name"}
              label={"Tên"}
              isWarning={_.includes(fieldWarnings, "name")}
              showLabelRequired
            />
          </div>
          <div className="col-md-6 mb10">
            <MyField
              name={"sub_title"}
              label={"Tiêu đề phụ"}
              isWarning={_.includes(fieldWarnings, "sub_title")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb10">
            <MySelectSystem
              name={"combo_group"}
              label={"Nhóm combo"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_combo_group}
              showLabelRequired
            />
          </div>
          <div className="col-md-6 mb10">
            <MySelectSystem
              name={"type_campaign"}
              label={"Type campaign"}
              type={"common"}
              valueField={"value"}
              idKey={dataKey}
              showLabelRequired={
                values.combo_group !== "SERVICE_POINT" ? true : false
              }
            />
          </div>
          <div className="col-md-6 mb10">
            <MySelectSystem
              name={"marketing_type"}
              label={"Loại marketing"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_marketing_type}
            />
          </div>
          <div className="col-md-6 mb10">
            <MyField name={"ordering"} label={"Ordering"} showLabelRequired />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb10">
            <MyFieldNew
              name={"discount_value"}
              label={"Chiết Khấu (%)"}
              disabled={true}
              isWarning={_.includes(fieldWarnings, "discount_value")}
            />
          </div>
          <div className="col-sm-6 mb10">
            <MyFieldNew
              name={"promotion_value"}
              disabled={true}
              label={"Khuyến mãi (%)"}
              isWarning={_.includes(fieldWarnings, "discount_value")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb10">
            {(values.description !== undefined || !isEdit) && (
              <MyCKEditor
                config={[
                  ["Bold", "Italic", "Strike"],
                  ["Styles", "Format"],
                  ["NumberedList", "BulletedList"],
                  ["Image", "Table", "HorizontalRule"],
                  ["Maximize"],
                  ["Source"],
                ]}
                label={"Mô tả"}
                name="description"
                showLabelRequired
              />
            )}
          </div>
          <div className="col-md-6 mb10 text-red">
            <MyCheckbox
              name="show_promotion"
              items={[
                {
                  label:
                    "Hiển thị giá trước chiết khấu khuyến mãi trên Website",
                  value: 1,
                },
              ]}
            />
          </div>
        </div>
        <ImageInput
          setFieldValue={setFieldValue}
          value={values?.image_url || ""}
          isWarning={_.includes(fieldWarnings, "image_url")}
        />
        {errors?.image_url && (
          <div class="v-messages v-messages-error textRed">
            {errors.image_url}
          </div>
        )}

        <div className="row mt10">
          <div className="col-sm-12 sub-title-form mb10">
            <span>Thông tin chung</span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb10">
            <MyDate
              name={"available_from_date"}
              label={"thời gian bắt đầu"}
              isWarning={_.includes(fieldWarnings, "available_from_date")}
              minDate={moment()}
              showLabelRequired
            />
          </div>
          <div className="col-md-6 mb10">
            <MyDate
              name={"available_to_date"}
              label={"Thời gian kết thúc"}
              isWarning={_.includes(fieldWarnings, "available_to_date")}
              minDate={moment.unix(values.available_from_date)}
              showLabelRequired
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb10">
            <MySelectSystem
              name={"status"}
              label={"Trạng thái"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_bundle_status}
              showLabelRequired
            />
          </div>
          <div className="col-md-6 mb10">
            <MySelectSystem
              name={"is_display"}
              label={"Hiển thị ở FE"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_bundle_display}
              showLabelRequired
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    branch: state.branch,
    sys: state.sys,
  };
}

export default connect(mapStateToProps, null)(FormComponent);
