import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class ComponentFilter extends React.Component {
	render() {
		const {query, menuCode, idKey} = this.props;
		const status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_bundle_status);

		return (
			<FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
				<SearchField type="input" label="ID, Tên" name="q" timeOut={1000}/>
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

function mapDispatchToProps(dispatch) {
	return {
		uiAction: bindActionCreators(uiAction, dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
