import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import Filter from "components/Common/Ui/Table/Filter";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends React.Component {
    render() {
        const {common, idKey} = this.props;
        let service_type = utils.convertArrayValueCommonData(common.items, Constant.COMMON_DATA_KEY_service_type);
        let sales_order_status_list = utils.convertArrayValueCommonData(common.items, Constant.COMMON_DATA_KEY_sales_order_regis_status_filter_actived);

        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey}>
                    <SearchField className={"col-md-3"} type="dropbox"
                                 label="Gói dịch vụ" name="service_type" data={service_type}/>
                    <SearchField className={"col-md-3"} type="datetimerangepicker"
                                 label="Thời gian" name="created_at"/>
                    <SearchField className={"col-md-3"} type="dropbox"
                                 label="Trạng thái" name="status" data={sales_order_status_list}/>
                </Filter>
                <div className={"clearfix"}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        common: _.get(state, ['sys', 'common'])
    };
}

export default connect(mapStateToProps, null)(ComponentFilter);
