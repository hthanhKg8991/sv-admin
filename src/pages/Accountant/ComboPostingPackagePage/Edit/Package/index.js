import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { bindActionCreators } from "redux";

import { putToastError, putToastSuccess } from "actions/uiAction";
import * as utils from "utils/utils";
import EffectPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/EffectPackage";
import ServicePointPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/ServicePointPackage";
import FreemiumPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/FreemiumPackage";
import JobBasicPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/JobBasicPackage";
import JobPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/JobPackage";
import EmployerPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/EmployerPackage";
import BannerPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/BannerPackage";
class Packages extends React.Component {
  constructor(props) {
    super(props);
    const { channel_code } = props.branch.currentBranch;
    this.state = {
      configPackageBySite: utils.getConfigForm(
        channel_code,
        "CustomerCare.SalesOrderEditPage.ComboPost"
      ),
    };
  }

  render() {
    const { id } = this.props;
    const { configPackageBySite } = this.state;

    return (
      <React.Fragment>
        {_.includes(configPackageBySite, "jobbox_basic") && (
          <JobBasicPackage id={id} />
        )}
        {_.includes(configPackageBySite, "jobbox") && <JobPackage id={id} />}
        {_.includes(configPackageBySite, "effect") && <EffectPackage id={id} />}
        {/*Pharse sau sẽ mở*/}
        {/*{_.includes(configPackageBySite, "service_point") && (*/}
        {/*  <ServicePointPackage id={id} />*/}
        {/*)}*/}
        {_.includes(configPackageBySite, "filter_resume_2018") && (
          <EmployerPackage id={id} />
        )}
        {_.includes(configPackageBySite, "jobbox_freemium") && (
          <FreemiumPackage id={id} />
        )}
        {_.includes(configPackageBySite, "banner") && (
          <BannerPackage id={id} />
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    sys: state.sys,
    refresh: state.refresh,
    branch: state.branch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, putToastError }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Packages);
