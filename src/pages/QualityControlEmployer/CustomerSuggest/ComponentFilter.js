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
    render () {
        const {query, menuCode, idKey} = this.props;
        const customer_type_code = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_customer_type_code);
        const customer_suggest_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_customer_suggest_status);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID, Tên" name="q" timeOut={1000}/>
                <SearchField type="input" label="Mã code" name="code" timeOut={1000}/>
                <SearchField type="dropbox" label="Loại code" name="type_code" data={customer_type_code}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={customer_suggest_status}/>
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
