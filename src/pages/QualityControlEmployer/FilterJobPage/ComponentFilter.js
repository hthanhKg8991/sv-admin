import React, {Component} from "react";
import {connect} from "react-redux";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import * as Constant from 'utils/Constant';
import * as utils from 'utils/utils';

class ComponentFilter extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        const {query, menuCode, idKey, sys} = this.props;
        const serviceListJob = sys?.service?.items.filter(_=> _.object_type === 2);
        const buildService = serviceListJob.filter(_=> _.service_type !== Constant.SERVICE_TYPE_JOB_BASIC);
        const area = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_area);
        const status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_regis_status);

        // Lấy 3 trạng thái 1. chạy 4.đã hạ 5. đã hạ hết hạn
        const filerConst = [1,4,5];
        const buildStatus = status.filter(_ => filerConst.includes(_.value));

        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode}>
                <SearchField type="input" label="Tên, email, ID NTD" name="employer_q" timeOut={1000}/>
                <SearchField type="input" label="ID Tin" name="job_id" timeOut={1000}/>
                <SearchField key_value="code" key_title="name" type="dropbox" label="Gói phí" name="service_code" data={buildService}/>
                <SearchField type="dropbox" label="Vùng miền" name="displayed_area" data={area}/>
                <SearchField type="dropbox" label="Trạng thái" name="status" data={buildStatus}/>
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
