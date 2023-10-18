import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {bindActionCreators} from "redux";

import {putToastError, putToastSuccess} from "actions/uiAction";
import * as utils from "utils/utils";

import AccountServicePackage from "pages/Accountant/ComboPackagePage/Edit/Package/AccountServicePackage"
import EffectPackage from "pages/Accountant/ComboPackagePage/Edit/Package/EffectPackage";
import EmployerPackage from "pages/Accountant/ComboPackagePage/Edit/Package/EmployerPackage";
import FreemiumPackage from "pages/Accountant/ComboPackagePage/Edit/Package/FreemiumPackage"
import JobBasicPackage from "pages/Accountant/ComboPackagePage/Edit/Package/JobBasicPackage";
import JobPackage from "pages/Accountant/ComboPackagePage/Edit/Package/JobPackage";
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
				{_.includes(configPackageBySite, "account_service") && (
					<AccountServicePackage id={id}/>
				)}
				{_.includes(configPackageBySite, "jobbox_freemium") && (
					<FreemiumPackage id={id}/>
				)}
			</React.Fragment>
		)
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
		actions: bindActionCreators({putToastSuccess, putToastError}, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Packages);
