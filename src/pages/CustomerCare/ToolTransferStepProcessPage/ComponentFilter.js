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
        const {idKey} = this.props;
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_tool_transfer_process_status);
        return (
            <div className={"row mt10 mb10 d-flex"}>
                <Filter idKey={idKey}>
                    <SearchField className="col-md-2" type="input" label="ID yêu cầu. ID/Tên người tạo" name="q" timeOut={1000}/>
                    <SearchField className="col-md-2" type="datetimerangepicker" label="Ngày tạo" name="created_at"/>
                    <SearchField className="col-md-2" type="dropbox" label="Trạng thái" name="status" data={status}/>
                </Filter>
            </div>
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
