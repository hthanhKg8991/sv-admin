import React, {Component} from "react";
import {connect} from "react-redux";

import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
class ComponentFilter extends Component {
	render () {
		const {query, menuCode, idKey} = this.props;
		const status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_status);

		return (
			<FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={5}>
				<SearchField type="input" label="ID" name="q" timeOut={1000}/>
				<SearchField type="input" label="ID SO gốc" name="sales_order_original_id" timeOut={1000}/>
				<SearchField type="input" label="ID của NTD" name="employer_id" timeOut={1000}/>
				<SearchField type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
				<SearchField type="dropbox" label="Trạng thái" name="status" data={status}/>
			</FilterLeft>
		)
	}
}

function mapStateToProps(state) {
	return {
		sys: state.sys,
	};
}

export default connect(mapStateToProps,null)(ComponentFilter);
