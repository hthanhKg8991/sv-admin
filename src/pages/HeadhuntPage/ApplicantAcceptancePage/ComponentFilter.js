import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    render() {
        const {query, menuCode, idKey} = this.props;
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_headhunt_applicant_acceptance_status);
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="ID applicant, Tên ứng viên,..." name="q" timeOut={1000}/>
                <SearchField type="input" label="Hợp đồng" name="contract_id" timeOut={1000}/>
                <SearchField type="input" label="Yêu cầu tuyển dụng" name="contract_request_id" timeOut={1000}/>
                <SearchField type="dropbox" data={status} label="Trạng thái" name="acceptance_record_status_approved"/>
            </FilterLeft>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}


export default connect(mapStateToProps, null)(ComponentFilter);
