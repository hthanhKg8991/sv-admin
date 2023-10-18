import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey} = this.props;
        const statement_test = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_statement_test);
        return (
            <div className="row mt-15 mb5 d-flex">
                <Filter idKey={idKey} query={query} menuCode={menuCode}>
                    <SearchField type="input" className="col-md-2" label="ID Statement, QR code" name="q"
                                 timeOut={1000}/>
                    <SearchField type="datetimerangepicker" className="col-md-2" label="Ngày giao dịch"
                                 name="transaction_date"/>
                    <SearchField type="dropbox" className="col-md-2" label="KT đánh dấu" name="is_test"
                                 data={statement_test}/>
                    <SearchField type="input" className="col-md-2" label="CSKH" name="customer_care"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-2" label="INV" name="inv"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-2" label="Ghi chú" name="note"
                                 timeOut={1000}/>
                </Filter>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
