import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";

class ComponentFilter extends Component {
    render () {
        const {query, menuCode, idKey} = this.props;
        const teamLine = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_team_call_line);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="datetimerangepicker" label="Thời gian gọi" name="date"/>
                <SearchField type="input" label="Tên user" name="staff_name" timeOut={1000}/>
                <SearchField type="input" label="Line" name="line" timeOut={1000}/>
                <SearchField type="dropbox" label="Bộ phận" name="team_id" data={teamLine}/>
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
