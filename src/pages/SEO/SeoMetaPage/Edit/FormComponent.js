import React from "react";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";

class FormComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { fieldWarnings } = this.props;

    return (
      <React.Fragment>
        <div className={"row"}>
          <div className="col-sm-12 sub-title-form mb10">
            <span>Thông tin chung</span>
          </div>
        </div>
        <div className={"row"}>
          <div className="col-md-6 mb10">
            <MyField
              name={"page_name"}
              label={"Tên trang"}
              isWarning={_.includes(fieldWarnings, "page_name")}
              showLabelRequired
            />
          </div>
          <div className="col-md-6 mb10">
            <MySelectSystem
              name={"priority"}
              label={"Trọng số"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_seo_meta_priority}
              showLabelRequired
            />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-md-6 mb10">
            <MySelectSystem
              name={"status"}
              label={"Trạng thái"}
              type={"common"}
              valueField={"value"}
              idKey={Constant.COMMON_DATA_KEY_seo_template_status}
              showLabelRequired
            />
          </div>
          <div className="col-md-6 mb10">
            <MyField name={"title"} label={"Tiêu đề"} isWarning={_.includes(fieldWarnings, "title")} />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-md-12 mb10">
            <MyField
              name={"description"}
              label={"Mô tả"}
              isWarning={_.includes(fieldWarnings, "description")}
              multiline
              rows={5}
            />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-md-6 mb10">
            <MyField name={"keywords"} label={"Keyword"} isWarning={_.includes(fieldWarnings, "keywords")} />
          </div>
          <div className="col-md-6 mb10">
            <MyField name={"url"} label={"URL"} isWarning={_.includes(fieldWarnings, "url")} showLabelRequired />
          </div>
        </div>
        <div className={"row"}>
          <div className="col-md-12 mb10 mt10">
            <MyCKEditor
              config={[
                ["Bold", "Italic", "Strike"],
                ["Format"],
                ["NumberedList", "BulletedList"],
                ["TextColor", "BGColor"],
                ["Maximize"],
                ["Link"],
                ["Source"],
              ]}
              label={"Content"}
              name="content"
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
