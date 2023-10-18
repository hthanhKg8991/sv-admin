import React from "react";
import { connect } from "react-redux";
import MyConditionAudience from "components/Common/Ui/Form/MyConditionAudience";
import MyField from "components/Common/Ui/Form/MyField";
import * as Constant from "utils/Constant";
import { getListGroupCampaignItems } from "api/emailMarketing";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";

class FormComponent extends React.Component {
  render() {
    const { values } = this.props;
    const common = this.props.sys.common.items;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-12 sub-title-form mb10">
            <span>Thông tin chung</span>
          </div>
        </div>
        <div className="row mt20">
          <div className="col-md-6 mb10">
            <MyField name={"name"} label={"Tên"} showLabelRequired />
          </div>
          <div className="col-md-5 mb10 ">
            <MySelectFetch
              name={"campaign_group_id"}
              label={"Group Campaign"}
              fetchApi={getListGroupCampaignItems}
              fetchField={{ value: "id", label: "name" }}
              fetchFilter={{ status: Constant.STATUS_ACTIVED, per_page: 1000 }}
              showLabelRequired
            />
          </div>
        </div>

        <div className="row mt30">
          <div className="col-sm-12 sub-title-form">
            <span>Điều kiện</span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <MyConditionAudience values={values} name={"conditions"} label={"Điều kiện"} common={common} />
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
