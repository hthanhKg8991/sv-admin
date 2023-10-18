import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InputImgNormal from "components/Common/InputValue/InputImgNormal";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";

class ImageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: [],
      errors: {
        image: null,
      },
    };

    this.handleChangeImage = this._handleChangeImage.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.item) {
      if (!this.state.item.image_url) {
        this.setState({
          item: { ...this.state.item, image_url: newProps.value },
        });
      }
    }
  }

  _handleChangeImage(value, name) {
    let { item } = this.state;
    item.image_url = value.url;
    item.image_path = value.path;
    this.setState({ item: item });
    const { setFieldValue } = this.props;
    setFieldValue("image_url", value.path);
  }

  render() {
    return (
      <div className="row d-flex align-items-center mt20">
        <div className="col-sm-7 col-xs-12">
          <p>
            Banner<span className="textRed">*</span>
          </p>
          <InputImgNormal
            name={"image_url"}
            folder="combo_posting_package"
            width={Constant.COMBO_POSTING_PACKAGE_BANNER_DIMENSION.width}
            height={Constant.COMBO_POSTING_PACKAGE_BANNER_DIMENSION.height}
            maxSize={1}
            dimension={Constant.COMBO_POSTING_PACKAGE_BANNER_DIMENSION}
            value={this.state.item.image_url}
            onChange={this.handleChangeImage}
            error={this.state.errors.image}
          />
        </div>
      </div>
    );
  }
}

ImageInput.defaultProps = {
  item: {
    image_url: null,
    image_path: null,
    error: "",
  },
};

function mapStateToProps(state) {
  return {
    sys: state.sys,
    api: state.api,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    apiAction: bindActionCreators(apiAction, dispatch),
    uiAction: bindActionCreators(uiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageInput);
