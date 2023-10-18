import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {FilterLeft,SearchField} from "components/Common/Ui";

import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
	render() {
		const {query, menuCode, idKey} = this.props;
		const promotions_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_promotion_programs_status);

		return (
			<FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
				<SearchField type="input" label="ID, Tên" name="q" timeOut={1000}/>
				<SearchField type="dropbox" label="Trạng thái" name="status" data={promotions_status}/>
				<SearchField type="datetimerangepicker" label="Thời gian áp dụng" name="start_date" />
				<SearchField type="datetimerangepicker" label="Thời gian kết thúc" name="end_date" />
			</FilterLeft>
		)
	}
}

function mapStateToProps(state) {
	return {
		api: state.api,
		sys: state.sys,
		province: state.province,
		user: state.user
	};
}

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
		apiAction: bindActionCreators(apiAction, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
