import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import MyDate from "components/Common/Ui/Form/MyDate";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.HOME_PAGE_DIMENSION = {
      PC: {
        width: 2880,
        height: 640,
      },
      PC_PREVIEW: {
        width: 720,
        height: 160,
      },
      MB: {
        width: 750,
        height: 800,
      },
      MB_PREVIEW: {
        width: 375,
        height: 400,
      },
      PC_SIZE_MAX: 250000,
      MB_SIZE_MAX: 150000,
    };

    this.DEFAULT_DEMENSION = {
      PC: {
        width: 500,
        height: 1200,
      },
      PC_PREVIEW: {
        width: 250,
        height: 600,
      },
      MB: {
        width: 500,
        height: 1200,
      },
      MB_PREVIEW: {
        width: 250,
        height: 600,
      },
      PC_SIZE_MAX: 250000,
      MB_SIZE_MAX: 150000,
    };

    this.state = {
      image_demension: this.HOME_PAGE_DIMENSION,
    };
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.isEdit &&
      newProps.values &&
      newProps.values.position_key &&
      newProps.values.position_key !== "HOME_PAGE" &&
      newProps.values.position_key !== "HOME_PAGE_CV"
    ) {
      this.setState({
        ...this.state,
        image_demension: this.DEFAULT_DEMENSION,
      });
    }
  }

  render() {
    const { fieldWarnings, values, setFieldValue } = this.props;
    const handleChagePositionKey = (value) => {
      let demension = this.HOME_PAGE_DIMENSION;
      if (value !== "HOME_PAGE" && value !== "HOME_PAGE_CV") {
        demension = this.DEFAULT_DEMENSION;
      }
      this.setState({
        ...this.state,
        image_demension: demension,
      });

      setFieldValue("image_pc", "");
      setFieldValue("image_mb", "");
      setFieldValue("image_pc_url", "");
      setFieldValue("image_mb_url", "");
      setFieldValue("position_key", value);
    };

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
            <MySelectSystem
              name={"position_key"}
              label={"Vị trí trang đăng"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_banner_type}
              showLabelRequired
              onChange={(value) => handleChagePositionKey(value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb10">
            <MyField
              name={"url"}
              label={"URL"}
              isWarning={_.includes(fieldWarnings, "url")}
            />
          </div>
          <div className="col-md-6 mb10">
            <MyField name={"ordering"} label={"Ordering"} showLabelRequired />
          </div>
        </div>

        {values?.position_key && (
          <div className="row mt30">
            <div className="col-md-6 mb10 banner-pc">
              <p className="text-center">
                Banner PC <span className="text-red">*</span>
              </p>
              <DropzoneImage
                validationImage={{
                  width: this.state.image_demension.PC.width,
                  height: this.state.image_demension.PC.height,
                  type: Constant.FILE_IMAGE_TYPE,
                  size: this.state.image_demension.PC_SIZE_MAX,
                }}
                name={"image_pc"}
                folder={"seeker-banner"}
                label={""}
              />
              {!values?.image_pc_url && (
                <p className="note">
                  Kích thước banner cho PC{" "}
                  <b>
                    {this.state.image_demension.PC.width} x{" "}
                    {this.state.image_demension.PC.height} px
                  </b>{" "}
                  <br />
                  Dung lượng{" "}
                  <b>
                    không quá {this.state.image_demension.PC_SIZE_MAX / 1000} KB
                  </b>
                </p>
              )}
            </div>
            {(values?.position_key === "HOME_PAGE" ||
              values?.position_key === "HOME_PAGE_CV") && (
              <div className="col-md-6 mb10 banner-mb">
                <p className="text-center">
                  Banner Mobile <span className="text-red">*</span>
                </p>
                <DropzoneImage
                  validationImage={{
                    width: this.state.image_demension.MB.width,
                    height: this.state.image_demension.MB.height,
                    type: Constant.FILE_IMAGE_TYPE,
                    size: this.state.image_demension.MB_SIZE_MAX,
                  }}
                  label={""}
                  name={"image_mb"}
                  folder={"seeker-banner"}
                />
                {!values?.image_mb_url && (
                  <p className="note">
                    Kích thước banner cho Mobile tối thiểu{" "}
                    <b>
                      {this.state.image_demension.MB.width} x{" "}
                      {this.state.image_demension.MB.height} px
                    </b>{" "}
                    <br />
                    Dung lượng{" "}
                    <b>
                      không quá {this.state.image_demension.MB_SIZE_MAX / 1000}{" "}
                      KB
                    </b>
                  </p>
                )}
              </div>
            )}
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
              label={"Thời gian bắt đầu Hiển thị"}
              format={"DD/MM/YYYY HH:mm:ss"}
              isWarning={_.includes(fieldWarnings, "available_from_date")}
              minDate={moment()}
              showLabelRequired
              time={true}
            />
          </div>
          <div className="col-md-6 mb10">
            <MyDate
              name={"available_to_date"}
              label={"Thời gian hạ banner"}
              isWarning={_.includes(fieldWarnings, "available_to_date")}
              minDate={moment.unix(values.available_from_date)}
              showLabelRequired
              format={"DD/MM/YYYY HH:mm:ss"}
              time={true}
            />
          </div>
        </div>
        <div className="row">
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
        <style>{`
          .banner-pc .dropzone-custom {
            width: ${this.state.image_demension.PC_PREVIEW.width}px;
            height: ${this.state.image_demension.PC_PREVIEW.height}px;
            min-height: 100px;
          }

          .banner-pc .banner-mobile {
            position: relative;
          }

          .note {
            position: absolute;
            top: 50px;
            right: 0;
            left: 0;
            margin: 0 auto;
            text-align: center;
            width: 260px;
          }

          .banner-mb .dropzone-custom {
            width: ${this.state.image_demension.MB_PREVIEW.width}px;
            height: ${this.state.image_demension.MB_PREVIEW.height}px;
            min-height: 100px;
          }
        `}</style>
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
