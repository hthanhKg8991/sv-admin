import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";
import Input2 from "components/Common/InputValue/Input2";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { connect } from "react-redux";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment";
import CanAction from "components/Common/Ui/CanAction";
class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            week: 4,
            error_week: ""
        }
        this.onUpdateWeek = this._onUpdateWeek.bind(this);
    }
    _onUpdateWeek(value) {
        //Đổi từ điểm mua sang số tuần nếu là gói thường
        const pointConfig = this.props.sys.common.items[Constant.COMMON_DATA_KEY_list_price_promotion_cv] || [];
        const configSort = pointConfig.sort((a, b) => (Number(b.from) - Number(a.from)));
        const point = configSort.find(item => value >= item.from);

        this.setState({
            week: point ? Number(point?.to) : 4
        })  
    }

    componentDidMount() {
        const { values } = this.props;
        if (values.total_buy_point) {
            this.onUpdateWeek(values.total_buy_point)
        }
    }

    render() {
        const { fieldWarnings, values, branch, sys } = this.props;
        const { week } = this.state;
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

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Quản lý tài khoản lọc hồ sơ {values?.type_campaign === Constant.RECRUITER_ASSISTANT_GIFT_TYPE ? "(Tặng)" : ""}</span>
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
                        <MyFieldNumber name={"total_buy_point"} label={"CV mua"}
                            isWarning={_.includes(fieldWarnings, 'total_buy_point')}
                            onChange={(value) => this.onUpdateWeek(value)}
                            showLabelRequired />
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
                        {
                            values?.type_campaign !== Constant.RECRUITER_ASSISTANT_GIFT_TYPE ?
                                <Input2 name={"week_quantity"}
                                    label={"TG DV (tuần)"}
                                    isNumber
                                    value={week}
                                    required
                                    readOnly
                                /> : <MyFieldNumber name={"week_quantity"} label={"TG DV (tuần)"}
                                    isWarning={_.includes(fieldWarnings, 'week_quantity')}
                                    showLabelRequired
                                />
                        }

                    </div>
                    <div className="col-sm-6 mb10">
                        <MyField className name={"sku_code_service"} label={"Mã SKU"}
                            isWarning={_.includes(fieldWarnings, 'sku_code_service')}
                            disabled
                            showLabelRequired />

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
