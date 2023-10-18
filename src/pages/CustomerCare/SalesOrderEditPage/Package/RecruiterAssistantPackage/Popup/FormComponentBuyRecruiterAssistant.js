import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as Constant from "utils/Constant";
import _ from "lodash";
import {getConfigForm} from "utils/utils";
import {connect} from "react-redux";
import CanAction from "components/Common/Ui/CanAction";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.EmployerPage.Profile"),
        };
    }

    render() {
        const {fieldWarnings, values, errors, branch, sys} = this.props;
        const channel_code = branch.currentBranch.channel_code;
        const code = channel_code === Constant.CHANNEL_CODE_TVN ? Constant.Service_Code_Account_Service_TVN : Constant.Service_Code_Account_Service;
        const box_code_list = sys.service.items.filter(c =>
            c.channel_code === channel_code
                && c.code === code
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
                        <CanAction isDisabled>
                            <MySelect name={"service_code"} label={"Gói dịch vụ"}
                                isWarning={_.includes(fieldWarnings, 'service_code')}
                                showLabelRequired
                                options={box_code_list || []}
                                readOnly
                            />
                        </CanAction>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MyField name={"quantity"} label={"Số tin"}
                            isWarning={_.includes(fieldWarnings, 'quantity')}
                        showLabelRequired/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MyDate name={"start_date"} 
                            label={"Thời gian hiệu lực"} 
                            minDate={moment()}
                            showLabelRequired 
                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-6 mb10">
                        <MyField name={"week_quantity"} label={"TG DV (tuần)"}
                            isWarning={_.includes(fieldWarnings, 'week_quantity')}
                            disabled
                        showLabelRequired/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <CanAction isDisabled>
                            <MyField className name={"sku_code_service"} label={"Mã SKU"}
                                isWarning={_.includes(fieldWarnings, 'sku_code_service')}
                                disabled
                            showLabelRequired/>
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
