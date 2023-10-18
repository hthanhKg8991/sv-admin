import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    render () {
        const {query, menuCode, idKey} = this.props;

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="datetimerangepicker" label="Ngày báo xấu" name="created_at" />
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

export default connect(mapStateToProps,mapDispatchToProps)(ComponentFilter);