import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        const {query, menuCode, idKey} = this.props;
        const commonSaleStatus = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_status_headhunt);
        let sales_order_status = commonSaleStatus.filter(_ => _?.value !== Constant.STATUS_DELETED);

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Mã phiếu, ID/Email" name="q" timeOut={1000}/>
                <SearchField type="input" label="Khách hàng" name="customer_id" timeOut={1000}/>
                <SearchField type="dropbox" label="Trạng thái phiếu" name="status" data={sales_order_status}/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
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
