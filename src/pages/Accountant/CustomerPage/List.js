import React, {Component} from "react";
import {connect} from "react-redux";
import config from "config";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import { Gird,SpanCommon } from "components/Common/Ui";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import * as apiFn from "api";
import {getListAccountantCustomer} from "api/saleOrder"

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import {publish} from "utils/event";

import PopupCustomer from "./Popup/PopupCustomer";
import ComponentFilter from "./ComponentFilter";
import Detail from "./Detail";

const idKey = "AccountantCustomerPage"
class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data_list: [],
			page:1,
			per_page:Constant.PER_PAGE_LIMIT,
			itemActive: {},
			columns:[
				{
					title: "Khách hàng kế toán",
					width: 200,
					accessor: "id"
				},
				{
					title: "Mã số thuế",
					width: 200,
					accessor: "tax_code"
				},
				{
					title: "Tên khách hàng",
					width: 200,
					accessor: "name"
				},
				{
					title: "Địa chỉ",
					width: 200,
					accessor: "address"
				},
				{
					title: "Trạng thái tài khoản",
					width: 200,
					cell: row => <SpanCommon value={row?.status} idKey={Constant.COMMON_DATA_KEY_accountant_customer_status} />
				},
			]
		};
		this.refreshList = this._refreshList.bind(this);
		this.changePage = this._changePage.bind(this);
		this.changePerPage = this._changePerPage.bind(this);
		this.activeItem = this._activeItem.bind(this);
		this.btnAdd = this._btnAdd.bind(this);
	}

	_refreshList(delay = 0){
		let params = queryString.parse(window.location.search);
		params["page"] = params["page"] ? params["page"] : this.state.page;
		params["per_page"] = params["per_page"] ? params["per_page"] : this.state.per_page;
		this.props.uiAction.showLoading();
		this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_LIST, params, delay);
		this.setState({itemActive: -1});
	}
	_changePage(newpage){
		this.setState({page: newpage},()=>{
			this.refreshList();
		});
	}
	_changePerPage(newperpage){
		this.setState({page: 1});
		this.setState({per_page: newperpage},()=>{
			this.refreshList();
		});
	}
	_activeItem(key){
		let check = this.state.data_list.filter(c => String(c.id) === String(key));

		let itemActive = this.state.itemActive;
		itemActive = String(itemActive) !== String(key) && check.length ? key : -1;
		this.setState({itemActive: itemActive});

		let query = queryString.parse(window.location.search);
		if(itemActive !== -1){
			query.item_active = key;
		}else{
			delete query.item_active;
			delete query.action_active;
		}
		this.props.history.push(`?${queryString.stringify(query)}`);
	}
	
	_btnAdd(){
		this.props.uiAction.createPopup(PopupCustomer,"Thêm Khách Hàng Kế Toán");
	}

	shouldComponentUpdate(nextProps, nextState) {
		return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
	}

	componentDidMount(){

	}

	render () {
		const {query, defaultQuery, history} = this.props;
		const {columns} = this.state
		return (
			// <CustomFilter name="CustomerPage"/>
			<Default
				left={(
					<WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
				)}
				title="Danh Sách Khách Hàng Kế Toán"
				titleActions={(
					<button type="button" className="bt-refresh el-button" onClick={() => {
						publish(".refresh", {}, idKey)
					}}>
						<i className="fa fa-refresh"/>
					</button>
				)}
				buttons={(
					<div className="left btnCreateNTD">
						<button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
							<span>Thêm KHKT <i className="glyphicon glyphicon-plus"/></span>
						</button>
					</div>
				)}>
				<Gird idKey={idKey}
					query={query}
					fetchApi={getListAccountantCustomer}
					columns={columns}
					history={history}
					defaultQuery={defaultQuery}
					isRedirectDetail={false}
					expandRow={row => <Detail idKey={idKey} object={row} history={this.props.history}/>}
				/>
			</Default>
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

export default connect(mapStateToProps,mapDispatchToProps)(List);
