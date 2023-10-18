import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from "query-string";
import {bindActionCreators} from "redux";

import BoxSearch from "components/Common/Ui/BoxSearch";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			params: {},
			staff_list: []
		};
		this.onSearch = this._onSearch.bind(this);
	}
	_onSearch(params){
		if(JSON.stringify(params) !== JSON.stringify(this.state.params)){
			params.page = 1;
		}
		this.setState({params: params});
		this.props.history.push(window.location.pathname + "?" + queryString.stringify(params));
		this.props.uiAction.refreshList("PriceRecontractPage");
	}

	componentDidMount(){
		this.props.uiAction.refreshList("PriceRecontractPage");

	}

	render () {
		let price_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_price_status);
		return (
			<BoxSearch showQtty={4} onChange={this.onSearch}>
				<SearchField type="input" label="Mã, tên bảng giá" name="q" timeOut={1000}/>
				<SearchField type="datetimerangepicker" label="Thời gian hiệu lực" name="active_date"/>
				<SearchField type="dropbox" label="Trạng thái" name="status" data={price_status}/>
			</BoxSearch>
		)
	}
}

function mapStateToProps(state) {
	return {
		api: state.api,
		sys: state.sys
	};
}
function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch),
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);
