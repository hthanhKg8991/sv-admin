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
        const {idKey, common, type, effect, gate, branch, initFilter} = this.props;
        const {service, staff_list} = this.state;
        const channelCode = branch.currentBranch.channel_code;
        const sales_order_status = utils.convertArrayValueCommonData(common?.items,
            Constant.COMMON_DATA_KEY_status_registration);
        const serviceList = service?.filter(_ => _.object_type === type || _.parent_service_code === (channelCode === Constant.CHANNEL_CODE_TVN ? Constant.Service_Code_Account_Service_TVN : Constant.Service_Code_Account_Service));
        const serviceEmployer = serviceList.filter(s => !(Constant.SERVICE_IGNORE_FILTER[channelCode].includes(s.code)));
        const serviceEmployerList = utils.mapOptionDroplist(serviceEmployer, 'name', 'code');
        const serviceJobBox = serviceList.filter(s => [Constant.SERVICE_TYPE_JOB_BASIC, Constant.SERVICE_TYPE_JOB_BOX].includes(s?.service_type));
        const serviceJobList = utils.mapOptionDroplist(serviceJobBox, 'name', 'code');
        const effectList = utils.mapOptionDroplist(effect?.items, 'name', 'code');
        const gateList = utils.mapOptionDroplist(gate?.items, 'full_name', 'code');
        const displayArea = utils.convertArrayValueCommonData(common?.items, Constant.COMMON_DATA_KEY_area);
        const text = type === 2 ? "Nhập ID Tin" : "Nhập ID/Email NTD";
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
        // TTD
        if (type === 2) {
            return (
               <>
                   <div className={"row mt15 d-flex"}>
                       <Filter idKey={idKey} initFilter={initFilter}>
                           <SearchField className={"col-md-2"} type="input" label={text} name="job_id"
                                        timeOut={1000}/>
                           <SearchField className={"col-md-2"} type="input" label="ID/Email NTD" name="employer_q"
                                        timeOut={1000}/>
                           <SearchField className={"col-md-2"} type="dropbox" label="Trạng thái gói" name="status"
                                        data={sales_order_status}/>
                           <SearchField type="dropbox" label="CSKH" className={"col-md-2"}
                                        name="assigned_staff_id" key_value="id"
                                        key_title="login_name" data={staff_list}/>
                           <SearchField key_title="label" key_value="value" className={"col-md-2"} type="dropbox"
                                        label="Gói dịch vụ" name="service_code"
                                        data={serviceJobList}/>
                           <SearchField key_title="label" key_value="value" className={"col-md-2"} type="dropbox"
                                        label="Hiệu ứng" name="effect"
                                        data={effectList}/>
                       </Filter>
                   </div>
                   <div className={"row mt15"}>
                       <Filter idKey={idKey} initFilter={initFilter}>

                           <SearchField key_title="label" key_value="value" className={"col-md-2"} type="dropbox"
                                        label="Cổng" name="gate"
                                        data={gateList}/>
                           <SearchField className={"col-md-2"} type="dropbox"
                                        label="Vùng miền" name="displayed_area"
                                        data={displayArea}/>
                           <SearchField noDelete={true} type="datetimerangepicker" className={"col-md-2"} label="Ngày hết hạn VIP"
                                        name="end_date" ranges={ranges}/>
                       </Filter>
                   </div>
               </>
            );
        }

        // NTD
        return (
            <div className={"row mt15"}>
                <Filter idKey={idKey} initFilter={initFilter}>
                    <SearchField className={"col-md-2"} type="input" label={text} name="q"
                                 timeOut={1000}/>
                    <SearchField className={"col-md-2"} type="dropbox" label="Trạng thái gói" name="status"
                                 data={sales_order_status}/>
                    <SearchField key_title="label" key_value="value" className={"col-md-3"} type="dropbox"
                                 label="Gói dịch vụ" name="service_code"
                                 data={serviceEmployerList}/>
                    <SearchField type="datetimerangepicker" className={"col-md-2"} label="Ngày hết hạn"
                                 name="expired_at" ranges={ranges}/>
                    <SearchField type="dropbox" label="CSKH" className={"col-md-3"} name="assigned_staff_id" key_value="id"
                                 key_title="login_name" data={staff_list}/>
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
