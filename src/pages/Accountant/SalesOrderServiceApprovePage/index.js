import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import CustomFilter from "components/Common/Ui/CustomFilter";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";

import ComponentFilter from "./ComponentFilter";
import ListApproveBanner from "./ListApproveBanner";
import ListApproveEffect from "./ListApproveEffect";
import ListApproveEmployerPackage from "./ListApproveEmployerPackage";
import ListApproveJobBasic from "./ListApproveJobBasic";
import ListApproveJobBox from "./ListApproveJobBox";
import ListApproveMinisite from "./ListApproveMinisite";

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
		this.refreshList = this._refreshList.bind(this);
	}
	_refreshList(delay = 0){
		this.props.uiAction.refreshList("ListApproveJobBasic", {delay});
		this.props.uiAction.refreshList("ListApproveJobBox", {delay});
		this.props.uiAction.refreshList("ListApproveEffect", {delay});
		this.props.uiAction.refreshList("ListApproveEmployerPackage", {delay});
		this.props.uiAction.refreshList("ListApproveBanner", {delay});
		this.props.uiAction.refreshList("ListApproveMinisite", {delay});
	}

	componentWillReceiveProps(newProps) {
		if (newProps.refresh["SalesOrderServiceApprovePage"]){
			let delay = newProps.refresh["SalesOrderServiceApprovePage"].delay ? newProps.refresh["SalesOrderServiceApprovePage"].delay : 0;
			this.refreshList(delay);
			this.props.uiAction.deleteRefreshList("SalesOrderServiceApprovePage");
		}
		if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
			this.refreshList();
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}
	render () {
		return (
			<div className="row-body">
				<div className="col-search">
					<CustomFilter name="SalesOrderServiceApprovePage"/>
					<ComponentFilter history={this.props.history}/>
				</div>
				<div className="col-result">
					<ListApproveJobBasic />
					<ListApproveJobBox />
					<ListApproveEffect />
					<ListApproveEmployerPackage />
					<ListApproveBanner />
					<ListApproveMinisite />
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		api: state.api,
		refresh: state.refresh,
		sys: state.sys,
		branch: state.branch,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
