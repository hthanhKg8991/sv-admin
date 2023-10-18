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
        const listStatusAccountService = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_account_service_status);

        return (
            <div className="row mt-15 mb5 d-flex">
                <Filter idKey={idKey} query={query} menuCode={menuCode}>
                    <SearchField type="input" className="col-md-3" label="ID campaign" name="campaign_id"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-3" label="ID TTD" name="job_id"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-3" label="ID NTD" name="employer_id"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-3" label="ID hồ sơ, Tên ứng viên" name="resume_q"
                                 timeOut={1000}/>
                    <SearchField type="dropbox" className="col-md-3" label="Trạng thái trợ lý" name="status"
                                 data={listStatusAccountService}/>
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