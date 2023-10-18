import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import Filter from "components/Common/Ui/Table/Filter";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import * as utils from 'utils/utils';
import * as Constant from 'utils/Constant';
import moment from "moment";
import {getService} from "api/system";
import {getTeamMember} from "api/auth";

class ComponentFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            service: []
        };
        this.getService = this._getService.bind(this);
        this.getCustomerCare = this._getCustomerCare.bind(this);
    }

    async _getService() {
        const {channel_code} = this.props.branch.currentBranch;
        const res = await getService({
            filter_channel_code: channel_code,
            status: Constant.STATUS_SERVICE_ALL
        });

        if (res) {
            this.setState({service: res});
        }
    }

    async _getCustomerCare() {
        let division_code = this.props.user ? this.props.user.division_code : '';
        let args = {};
        args['division_code_list[0]'] = Constant.DIVISION_TYPE_customer_care_member;
        if (division_code !== Constant.DIVISION_TYPE_customer_care_member) {
            args['division_code_list[1]'] = Constant.DIVISION_TYPE_customer_care_leader;
        }
        const res = await getTeamMember(args);
        if (res) {
            this.setState({staff_list: res});
        }
    }

    componentDidMount() {
        this.getService();
        this.getCustomerCare();
    }

    render() {
        const {idKey, common} = this.props;
        const typeHistoryServiceVtn = utils.convertArrayValueCommonData(common?.items, Constant.COMMON_DATA_KEY_history_service_vtn_type);
        const now = moment();
        const tomorow = moment().add(1, 'days');
        const ranges = {
            'Hôm nay': [now, now],
            'Ngày mai': [tomorow, tomorow],
            'Trong vòng 2 ngày': [moment().add(1, 'days'), moment().add(2, 'days')],
            'Trong vòng 3 ngày': [moment().add(1, 'days'), moment().add(3, 'days')],
            'Trong vòng 4 ngày': [moment().add(1, 'days'), moment().add(4, 'days')],
            'Trong vòng 5 ngày': [moment().add(1, 'days'), moment().add(5, 'days')],
            'Trong vòng 7 ngày': [moment().add(1, 'days'), moment().add(7, 'days')],
            'Trong vòng 14 ngày': [moment().add(1, 'days'), moment().add(14, 'days')],
            // 'Đã hết hạn quá 7 ngày': [moment().subtract(3650*3, 'days'), moment().subtract(7, 'days')],
        };

        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey}>
                    <SearchField className={"col-md-2"} type="input" label="Email NTD" name="email" timeOut={1000}/>
                    <SearchField type="datetimerangepicker" className={"col-md-2"} label="Thời gian" name="actived_at" ranges={ranges}/>
                    <SearchField className={"col-md-2"} type="dropbox" label="Loại phiếu" name="type_order" data={typeHistoryServiceVtn}/>
                </Filter>
                <div className="clearfix" />
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
