import React from "react";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {getConfigForm} from "utils/utils";
import {connect} from "react-redux";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment";
import {getListJobItems} from "api/employer";
import CanAction from "components/Common/Ui/CanAction";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.EmployerPage.Profile"),
        };
    }

    render() {
        const {fieldWarnings, values, errors, branch, sys,data} = this.props;
        const channel_code = branch.currentBranch.channel_code;
        const box_code_list = sys.service.items.filter(c =>
            c.channel_code === channel_code
            && c.code === Constant?.Service_Code_Account_Service
        ).map((item) => {
            return {
                label: item.name,
                value: item.code
            }
        });
        
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Quản lý tài khoản NTD {values?.fee_type === Constant.RECRUITER_ASSISTANT_GIFT_TYPE ? "(Tặng)" : ""}</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <MySelectFetch name={"job_id"}
                            label={"Tin tuyển dụng"}
                            fetchApi={getListJobItems}
                            fetchFilter={{
                                employer_id: this.props.sales_order.employer_id,
                                job_status: Constant.STATUS_ACTIVED, 
                                per_page: 1000,
                                // status_not: `${Constant.STATUS_DISABLED},${Constant.STATUS_LOCKED},${Constant.STATUS_DELETED}`,
                                is_running_as: -1,
                                jobbox_service_code_type: `${channel_code}.jobbox.basic`,
                                // premium_type: Constant.JOB_PREMIUM_VIP,
                                // job_status: Constant.STATUS_ACTIVED,
                                // execute: true
                                // jobbox_service_code: `${channel_code}.jobbox.basic`,
                                // jobbox_service_code_note: `${channel_code}.jobbox.freemium`,
                            }}
                            fetchField={{
                                value: "id",
                                label: "title",
                            }}
                            optionField={"id"}
                            showLabelRequired
                            isWarning={_.includes(fieldWarnings, 'job_id')}
                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <CanAction isDisabled>
                            <DateTimePicker name={"start_date"} 
                                label={"Thời gian bắt đầu"} 
                                minDate={moment.unix(values.start_date)}
                                value={values.start_date}
                                showLabelRequired 
                                readOnly
                            />
                        </CanAction>
                    </div>
                    <div className="col-sm-6 mb10">
                        <CanAction isDisabled>
                            <DateTimePicker name={"end_date"} 
                                label={"Thời gian kết thúc"} 
                                minDate={moment.unix(values.start_date)}
                                value={values.end_date}
                                showLabelRequired 
                                readOnly
                            />
                            {data?.week_quantity && (
                                <div className="end-date"><span>{data?.week_quantity} tuần</span></div>
                            )}
                        </CanAction>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null) (FormComponent);
