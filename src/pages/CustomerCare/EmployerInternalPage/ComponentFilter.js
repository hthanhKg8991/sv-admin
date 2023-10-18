import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey} = this.props;
        const employer_internal_channel_code = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_employer_internal_channel_code);
        const employer_internal_type = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_employer_internal_type);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID NTD" name="employer_id" timeOut={1000}/>
                <SearchField type="dropbox" label="Channel" name="employer_channel"
                             data={employer_internal_channel_code}/>
                <SearchField type="dropbox" label="Type" name="type"
                             data={employer_internal_type}/>
                <SearchField type="datetimerangepicker" label="Ngày config" name="created_at"/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
