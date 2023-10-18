import React, { Component } from "react";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as apiAction from "actions/apiAction";

class ComponentFilter extends Component {

    render() {
        const { query, menuCode, idKey } = this.props;
 
        let status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_status_group_survey);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={6}>
                <SearchField type="input" label="ID, Tên" name="q" timeOut={1000} />
                <SearchField type="dropbox" label="Trạng thái" name="status" data={status} />
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
