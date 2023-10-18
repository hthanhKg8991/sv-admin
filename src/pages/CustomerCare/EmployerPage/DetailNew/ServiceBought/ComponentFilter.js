import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

import Filter from "components/Common/Ui/Table/Filter";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {idKey} = this.props;
        const type_campaign = utils.convertArrayValueCommonData(this.props.common.items, Constant.COMMON_DATA_KEY_type_campaign);

        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey}>
                    <SearchField className={"col-md-3"} type="input" label="Nhập mã phiếu" name="sales_order_id" timeOut={700}/>
                    <SearchField className={"col-md-3"} type="datetimerangepicker" label="Thời gian" name="created_at"/>
                    <SearchField className={"col-md-3"} type="dropbox" label="Loại phí" name="type_campaign" data={type_campaign}/>
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
