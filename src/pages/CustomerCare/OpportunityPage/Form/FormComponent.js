import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import * as Constant from "utils/Constant";
import MyDate from "../../../../components/Common/Ui/Form/MyDate";
import {getCustomerListNew} from "api/auth";
import {getList} from "api/employer";
import MySelectSearch from "../../../../components/Common/Ui/Form/MySelectSearch";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";
import {MySelectSystem} from "components/Common/Ui";
import moment from "moment";
import {getListPromotionPrograms, getListSalesOrderRegistration} from "api/saleOrder";
import MyTextField from "components/Common/Ui/Form/Core/MyTextField";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeAbility = this._onChangeAbility.bind(this);
        this.onChangeRevenue = this._onChangeRevenue.bind(this);
        this.onChangeTax = this._onChangeTax.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.onChangeStaff = this._onChangeStaff.bind(this);
        this.getEmployer = this._getEmployer.bind(this);
        this.getCustomer = this._getCustomer.bind(this);
        this.getSaleOrder = this._getSaleOrder.bind(this);
        this.state = {
            staff: null,
            disable_employer: [6, 7, 8].includes(props.values.level),
            vat_percent: props.values.vat_percent || 0,
            revenue: props.values.revenue || 0,
        }
    }

    _onChangeAbility(value) {
        const {setFieldValue} = this.props;
        const common = this.props.sys.common.items;
        const ability_map = common[Constant.COMMON_DATA_KEY_opportunity_ability_map]?.find(v => v.value === Number(value))?.name || "";
        setFieldValue("ability_map", ability_map);
    }

    _onChangeRevenue(value) {
        this.setState({revenue: Number(value)});
    }

    _onChangeTax(value) {
        const valueN = Number(value);
        if (valueN >= 0 && valueN <= 100) {
            this.setState({vat_percent: valueN});
        } else {
            this.setState({vat_percent: valueN > 100 ? 100 : 0});
        }
    }

    _onChangeStaff(value) {
        const {setFieldValue} = this.props;
        const {staff} = this.state;
        const staff_selected = staff.find(v => v.value === value);
        setFieldValue("staff_team", staff_selected?.team?.name)
    }

    async _getEmployer() {
        const {setFieldValue, values} = this.props;
        const res = await getList({
            q: values.employer_id,
            status_not: 99
        })
        if (res && Array.isArray(res.items)) {
            const [employer] = res.items;
            if (employer) {
                setFieldValue("employer_id_text", `${employer.id} - ${employer.name} - ${employer.email}`)
            }
        }
    }

    async _getSaleOrder() {
        const {setFieldValue, values} = this.props;
        const res = await getListSalesOrderRegistration({
            q: values.sale_order_id,
            status_not: 99
        })
        if (res && Array.isArray(res.items)) {
            const [sale_order] = res.items;
            if (sale_order) {
                setFieldValue("sale_order_id", `${sale_order.id}`)
            }
        }
    }

    async _getCustomer() {
        const {setFieldValue, values, branch} = this.props;
        const res = await getCustomerListNew({
            execute: 1,
            scopes: 1,
            has_room: 1,
            includes: "team,room",
            withTeam: 1,
            team_channel_code: branch?.currentBranch?.channel_code,
            room_channel_code: branch?.currentBranch?.channel_code,
        })
        if (res) {
            const staff = res.find(v => v.login_name === values.staff_email);
            if (staff) {
                setTimeout(()=> setFieldValue("staff_team", staff.team.name), 300 )
            }
        }
    }
    async _asyncData() {
        const {values} = this.props;
        const {disable_employer} = this.state;
        this.getCustomer();
        if (disable_employer) {
            this.getEmployer();
        }

        if (values.ability) {
            setTimeout(() => {
                this.onChangeAbility(values.ability)
            }, 500)

        }
    }


    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {level, employer_id, campaign} = this.props.values;
        const {vat_percent, revenue, disable_employer} = this.state;
        const expected_revenue = Number(revenue) / ((100 + Number(vat_percent)) / 100);
        const format_expected_revenue = expected_revenue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&' + ",")
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên cơ hội"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name={"revenue"} onChange={this.onChangeRevenue}
                                       label={"Doanh số bao gồm thuế"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 mb10">
                        <MySelectSystem name={"ability"} label={"Cấp độ khả năng"}
                                        type="common"
                                        valueField={"value"}
                                        onChange={this.onChangeAbility}
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_ability}
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-3 mb10">
                        <MyField name={"ability_map"}
                                 disabled
                                 label={"Khả năng"}/>
                    </div>
                    <div className="col-md-3 mb10">
                        <MyFieldNumber name={"vat_percent"} onChange={this.onChangeTax}
                                       label={"Thuế GTGT (%)"}/>
                    </div>
                    <div className="col-md-3 mb10">
                        <div className="v-textfield">
                            <MyTextField
                                onChange={this.onChangeTax}
                                value={format_expected_revenue}
                                label={"Doanh thu kỳ vọng"}
                                disabled
                                type={"text"}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyDate name={"expected_date"} label={"Ngày kỳ vọng"} minDate={moment()}
                                showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"reason_guess"} label={"Lý do dự đoán"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"note"} label={"Ghi chú"}
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"package_type"} type="common" label={"Gói dịch vụ"} valueField={"value"}
                                        isMulti
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_package_type}/>
                    </div>
                </div>
                <div className="row mt30">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin cơ hội</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField disabled name={"expired_date"} label={"Thời hạn đóng cơ hội"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"opportunity_status"} label={"Trạng thái cơ hội"}
                                        type="common" valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_status}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"priority"} label={"Độ ưu tiên"}
                                        type="common" valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_priority}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"schedule_call"} label={"Lịch gọi lại"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"staff_email"} label={"CSKH"} disabled/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"contact_status"} label={"Trạng thái liên hệ với KH"}
                                        type="common" valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_contact_status}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"staff_team"} label={"Nhóm"} disabled/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"recruitment_demand"} label={"Nhu cầu tuyển"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSearch name={"campaign"} label={"Chiến dịch"}
                                        searchApi={getListPromotionPrograms}
                                        optionField={"title"}
                                        labelField={"code"}
                                        initKeyword={campaign}
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem isMulti name={"keywords"} label={"Từ khóa"} type="common" valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_keywords}/>
                    </div>
                </div>
                <div className="row mt30">
                    <div className="col-sm-6 sub-title-form mb10">
                        <span>Báo giá</span>
                    </div>
                    <div className="col-sm-6 sub-title-form mb10">
                        <span>Thông tin khách hàng</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"send_quote_status"} label={"Gửi báo giá/ proposal cho KH"}
                                        type="common" valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_send_quote_status}/>
                    </div>
                    <div className="col-md-6 mb10">
                        {disable_employer ? (
                            <>
                                <MyField name={"employer_id_text"} label={"Khách hàng"} disabled/>
                                <MyFieldHidden name={"employer_id"}/>
                            </>
                        ) : (
                            <MySelectSearch name={"employer_id"} label={"Khách hàng"}
                                            searchApi={getList}
                                            optionField={"email"}
                                            initKeyword={employer_id}
                                            defaultQuery={{status_not: 99}}
                                            readOnly={[6, 7, 8].includes(level)}
                            />
                        )}

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyDate name={"response_quote_date"} label={"Ngày KH dự kiến phản hồi về báo giá/proposal"}/>
                    </div>
                    <div className="col-sm-6 sub-title-form">
                        <span>Đơn hàng</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"response_quote_status"} label={"Phản hồi về báo giá/proposal"}
                                        type="common" valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_opportunity_response_quote_status}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"sales_order_id"} label={"Mã phiếu"} disabled/>
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
