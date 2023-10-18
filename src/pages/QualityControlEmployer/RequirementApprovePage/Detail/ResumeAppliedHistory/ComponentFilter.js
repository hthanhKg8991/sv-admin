import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

import Filter from "components/Common/Ui/Table/Filter";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as utils from "../../../../../utils/utils";
import * as Constant from "../../../../../utils/Constant";

class ComponentFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {idKey,isJob,common} = this.props;
        let request_status = utils.convertArrayValueCommonData(common?.items,Constant.COMMON_DATA_KEY_request_status);
        const buildStatus = request_status.filter(_ => ([Constant.STATUS_ACTIVED,Constant.STATUS_DISABLED].includes(_.value)));
        if(isJob){
            return (
                <div className={"row mt15"}>
                    <Filter idKey={idKey}>
                        <SearchField className={"col-md-3"} type="input" label="ID" name="job_id" timeOut={700}/>
                        <SearchField className={"col-md-3"} type="dropbox" label="Trạng thái" name="status" data={buildStatus}/>
                    </Filter>
                    <div className={"clearfix"}/>
                </div>
            );
        }

        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey}>
                    <SearchField className={"col-md-3"} type="input" label="ID" name="employer_id" timeOut={700}/>
                    <SearchField className={"col-md-3"} type="dropbox" label="Trạng thái" name="status" data={buildStatus}/>
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
