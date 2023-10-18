import React from "react";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyField from "components/Common/Ui/Form/MyField";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { getConfigForm } from "utils/utils";
import { connect } from "react-redux";
import moment from "moment";
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
        const { fieldWarnings, values, branch, sys, data } = this.props;
        let { listSalesOrderItem } = this.props;
        const channel_code = branch.currentBranch.channel_code;
        const code = Constant.Service_Code_Account_Service_Filter_Resume;
        const box_code_list = sys.service.items.filter(c =>
            c.channel_code === channel_code
            && c.code === code
        ).map((item) => {
            return {
                label: item.name,
                value: item.code
            }
        });

        listSalesOrderItem = listSalesOrderItem.filter(sub => [Constant.STATUS_SALES_ORDER_ITEM_NEW].includes(Number(sub.status))).map((item) => {
            return {
                label: `ID ${item.id} - ${item.remaining_day} ngày `,
                value: item.id
            }
        });

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Quản lý tài khoản lọc hồ sơ {values?.fee_type === Constant.RECRUITER_ASSISTANT_GIFT_TYPE ? "(Tặng)" : ""}</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 mb10">
                        <MySelect name={"sales_order_items_sub_id"}
                            label={"Chọn Subitem"}
                            isWarning={_.includes(fieldWarnings, 'sales_order_items_sub_id')}
                            options={listSalesOrderItem} showLabelRequired />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MySelect name={"service_code"} label={"Gói dịch vụ"}
                            isWarning={_.includes(fieldWarnings, 'service_code')}
                            showLabelRequired
                            options={box_code_list || []}
                            readOnly
                        />
                    </div>
                    <div className="col-sm-6 mb10">
                        <MyField name={"total_buy_point"} label={"Điểm mua"}
                            isWarning={_.includes(fieldWarnings, 'total_buy_point')}
                            showLabelRequired disabled />
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

export default connect(mapStateToProps, null)(FormComponent);
