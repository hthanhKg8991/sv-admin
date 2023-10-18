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
        const transaction_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_transaction_status);
        const transaction_status_confirm = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_transaction_status_confirm);
        const transaction_internal = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_transaction_internal);

        return (
            <div className="row mt-15 mb5 d-flex">
                <Filter idKey={idKey} query={query} menuCode={menuCode}>
                    <SearchField type="input" className="col-md-2" label="ID SO, QR Code, Payment, Statement" name="q"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-2" label="Tên ngân hàng, Nội dung giao dịch" name="bank_q"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-2" label="Virtual Account" name="virtual_account"
                                 timeOut={1000}/>
                    <SearchField type="dropbox" className="col-md-2" label="Trạng thái match" name="status"
                                 data={transaction_status}/>
                    <SearchField type="dropbox" className="col-md-2" label="Trạng thái" name="status_confirm"
                                 data={transaction_status_confirm}/>
                    <SearchField type="dropbox" className="col-md-2" label="Loại" name="type"
                                 data={transaction_internal}/>
                    <SearchField type="datetimerangepicker" className="col-md-2" label="Ngày giao dịch"
                                 name="transaction_date"/>
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