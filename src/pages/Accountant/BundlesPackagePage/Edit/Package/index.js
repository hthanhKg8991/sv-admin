import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

import * as utils from "utils/utils";

import EffectPackage from "pages/Accountant/BundlesPackagePage/Edit/Package/EffectPackage";
import EmployerPackage from "pages/Accountant/BundlesPackagePage/Edit/Package/EmployerPackage";
import JobBasicPackage from "pages/Accountant/BundlesPackagePage/Edit/Package/JobBasicPackage";
import JobPackage from "pages/Accountant/BundlesPackagePage/Edit/Package/JobPackage";

class Packages extends React.Component {
	constructor(props) {

		super(props);
		const {channel_code} = props.branch.currentBranch;
		this.state = {
			configPackageBySite: utils.getConfigForm(channel_code, "CustomerCare.SalesOrderEditPage.Package")
		};
	}

	render() {
		const {id} = this.props;
		const {configPackageBySite} = this.state;

		return (
			<React.Fragment>
				{_.includes(configPackageBySite, "jobbox_basic") && (
					<JobBasicPackage id={id}/>
				)}
				{_.includes(configPackageBySite, "jobbox") && (
					<JobPackage id={id}/>
				)}
				{_.includes(configPackageBySite, "effect") && (
					<EffectPackage id={id}/>
				)}
				{_.includes(configPackageBySite, "filter_resume_2018") && (
					<EmployerPackage id={id}/>
				)}
			</React.Fragment>
		)
	}
}

function mapStateToProps(state) {
	return {
		branch: state.branch,
	};
}

export default connect(mapStateToProps, null)(Packages);
