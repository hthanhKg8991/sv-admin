import React from "react";
import {connect} from "react-redux";
import _ from "lodash";

import Filter from "components/Common/Ui/Table/Filter";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as utils from 'utils/utils';
import * as Constant from 'utils/Constant';
import {getService} from "api/system";

class ComponentFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            service: []
        };
        this.getService = this._getService.bind(this);
    }

    async _getService() {
        const channel_code = this.props.branch.currentBranch?.channel_code;
        const res = await getService({
            filter_channel_code: channel_code,
            status: Constant.STATUS_SERVICE_ALL
        });

        if (res) {
            this.setState({service: res});
        }
    }

    componentDidMount() {
        this.getService();
    }

    render() {
        const {idKey, common, type, gate} = this.props;
        const gateList = utils.mapOptionDroplist(gate?.items, 'full_name', 'code');
        const displayArea = utils.convertArrayValueCommonData(common?.items, Constant.COMMON_DATA_KEY_area);
        const text = type === 2 ? "Nhập ID Tin" : "Nhập ID/Email NTD";

        // TTD
        if (type === 2) {
            return (
                <div className={"row mt15"}>
                    <Filter idKey={idKey}>
                        <SearchField className={"col-md-3"} type="input" label={text} name="job_id"
                                     timeOut={1000}/>
                        <SearchField className={"col-md-3"} type="input" label="ID/Email NTD" name="employer_q"
                                     timeOut={1000}/>
                        <SearchField key_title="label" key_value="value" className={"col-md-3"} type="dropbox"
                                     label="Cổng" name="gate"
                                     data={gateList}/>
                        <SearchField className={"col-md-3"} type="dropbox"
                                     label="Vùng miền" name="displayed_area"
                                     data={displayArea}/>
                    </Filter>
                    <div className={"clearfix"}/>
                </div>
            );
        }

        // NTD
        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey}>
                    <SearchField className={"col-md-3"} type="input" label={text} name="employer_q"
                                 timeOut={1000}/>
                </Filter>
                <div className={"clearfix"}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        common: _.get(state, ['sys', 'common']),
        service: _.get(state, ['sys', 'service']),
        effect: _.get(state, ['sys', 'effect']),
        gate: _.get(state, ['sys', 'gate']),
        branch: _.get(state, ['branch']),
    };
}

export default connect(mapStateToProps, null)(ComponentFilter);
