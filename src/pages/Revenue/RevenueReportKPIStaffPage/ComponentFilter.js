import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {query, menuCode, idKey, config_list, commission_rates_list, group_list} = this.props;
        const position = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_revenue_staff_position);

        return (
            <div className="row mt-15 d-flex">
                <Filter idKey={idKey} query={query} menuCode={menuCode} initFilter={{config_id: query?.config_id}}>
                    <SearchField className="col-md-3" type="input" label="ID, Tên" name="q" timeOut={1000}/>
                    <SearchField className="col-md-2" type="dropbox" label="Cấu hình" name="config_id" data={config_list}/>
                    <SearchField className="col-md-3" type="dropbox" label="Team" name="staff_group_code" data={group_list}/>
                    <SearchField className="col-md-2" type="dropbox" label="Kết quả" name="kpi_result" data={commission_rates_list}/>
                    <SearchField className="col-md-2" type="dropbox" label="Vị trí" name="staff_position" data={position}/>
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
