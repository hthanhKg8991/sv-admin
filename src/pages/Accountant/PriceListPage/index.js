/* eslint-disable react/no-deprecated */
import React, {Component} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {bindActionCreators} from "redux";

import CustomFilter from "components/Common/Ui/CustomFilter";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

import ComponentFilter from "./ComponentFilter";
import PriceList from "./PriceList";

const servicePriceList = [
	{
		serviceName: "jobbox_freemium",
		serviceType: Constant.SERVICE_TYPE_JOB_FREEMIUM,
		// serviceTitle: "Tin Freemium"
	},
	{
		serviceName: "jobbox_basic",
		serviceType: Constant.SERVICE_TYPE_JOB_BASIC,
		// serviceTitle: "Tin Cơ Bản"
	},
	{
		serviceName: "jobbox",
		serviceType: Constant.SERVICE_TYPE_JOB_BOX,
		serviceTitle: "Tin Phí"
	},
	{
		serviceName: "effect",
		serviceType: Constant.SERVICE_TYPE_EFFECT,
		serviceTitle: "Hiệu ứng"
	},
	{
		serviceName: "filter_resume_2018",
		serviceType: Constant.SERVICE_TYPE_FILTER_RESUME_2018,
		// serviceTitle: "Điểm Dịch Vụ"
	},
	{
		serviceName: "banner",
		serviceType: Constant.SERVICE_TYPE_BANNER,
		serviceTitle: "Quảng bá thương hiệu"
	},
	{
		serviceName: "account_service",
		serviceType: Constant.SERVICE_TYPE_ACCOUNT_SERVICE,
		serviceTitle: "Quản lý tài khoản Nhà Tuyển Dụng"
	},
	// Pharse sau sẽ mở
	// {
	// 	serviceName: "service_point",
	// 	serviceType: Constant.SERVICE_TYPE_SERVICE_POINT,
	// 	serviceTitle: "Điểm dịch vụ"
	// },
	{
		serviceName: "account_service_filter_resume",
		serviceType: Constant.SERVICE_TYPE_ACCOUNT_SERVICE_FILTER_RESUME,
		serviceTitle: "Quản lý tài khoản lọc hồ sơ"
	},
	{
		serviceName: "minisite",
		serviceType: Constant.SERVICE_TYPE_FILTER_MINISITE,
		serviceTitle: "Minisite"
	},
]

class index extends Component {
	constructor(props) {
		super(props);
		const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
		this.state = {
			configPackageBySite: utils.getConfigForm(channelCodeCurrent, "CustomerCare.SalesOrderEditPage.Package")
		};
		this.refreshList = this._refreshList.bind(this);
	}

	_refreshList(delay = 0){
		const {uiAction} = this.props

		servicePriceList.forEach((item) => {
			uiAction.refreshList("PriceList" + item?.serviceType, {delay: delay});
		})
	}

	componentWillReceiveProps(newProps) {
		if (newProps.refresh["PriceListPage"]){
			let delay = newProps.refresh["PriceListPage"].delay ? newProps.refresh["PriceListPage"].delay : 0;
			this.refreshList(delay);
			this.props.uiAction.deleteRefreshList("PriceListPage");
		}
		if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
			this.refreshList();
		}
	}

	render () {
		let {configPackageBySite} = this.state;
		const {query, defaultQuery, history} = this.props;
		return (
			<div className="row-body">
				<div className="col-search">
					<CustomFilter name="PriceListPage"/>
					<ComponentFilter history={this.props.history}/>
				</div>
				<div className="col-result">
					{
						servicePriceList.map((itemPriceList) => _.includes(configPackageBySite, itemPriceList?.serviceName) && (
							<PriceList history={history} defaultQuery={defaultQuery} query={query} title={itemPriceList?.serviceTitle} service_type={itemPriceList?.serviceType}/>
						))
					}
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
		branch: state.branch
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
