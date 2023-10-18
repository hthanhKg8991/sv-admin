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
        const {idKey, common} = this.props;
        let resume_status_v2 = utils.convertArrayValueCommonData(common?.items, Constant.COMMON_DATA_KEY_resume_status_v2);
        let resume_applied_status_v2 = utils.convertArrayValueCommonData(common?.items, Constant.COMMON_DATA_KEY_resume_applied_status_V2);
        let applied_status = utils.convertArrayValueCommonData(common?.items, Constant.COMMON_DATA_KEY_applied_status);
        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey}>
                    <SearchField className={"col-md-3"} type="input" label="ID NTV / Email NTV" name="seeker_q" timeOut={700}/>
                    <SearchField className={"col-md-3"} type="datetimerangepicker" label="Thời gian" name="applied_at"/>
                    <SearchField className={"col-md-2"} type="dropbox" label="Trạng thái hồ sơ" name="resume_status" data={resume_status_v2}/>
                    <SearchField className={"col-md-2"} type="dropbox" label="Trạng thái ứng tuyển" name="status" data={resume_applied_status_v2}/>
                    <SearchField className={"col-md-2"} type="dropbox" label="Trạng thái tuyển dụng" name="applied_status" data={applied_status}/>
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
