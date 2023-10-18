import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey, options} = this.props;
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_headhunt_contract_status);
        const contract_form = options?.contract_form.map(v=> ({value: v.id, title: v.name}));
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID, mã hợp đồng" name="q" timeOut={1000}/>
                <SearchField type="input" label="ID khách hàng" name="customer_id" timeOut={1000}/>
                <SearchField type="dropbox" label="Mẫu hợp đồng" name="contract_form_id" data={contract_form}/>
                <SearchField type="dropbox" label="Trạng thái HĐ" name="status" data={status}/>
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
