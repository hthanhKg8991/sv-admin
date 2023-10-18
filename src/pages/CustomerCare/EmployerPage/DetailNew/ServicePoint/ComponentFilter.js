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
        let sales_order_status_list = utils.convertArrayValueCommonData(common.items, Constant.COMMON_DATA_KEY_service_point_history_fe);

        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey}>
                    <SearchField className={"col-md-3"} type="input" label="Nhập mã phiếu" name="sales_order_id" timeOut={700}/>
                    <SearchField className={"col-md-3"} type="datetimerangepicker"
                                 label="Thời gian" name="created_at"/>
                    <SearchField className={"col-md-3"} type="dropbox"
                                 label="Trạng thái" name="type" data={sales_order_status_list}/>
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
