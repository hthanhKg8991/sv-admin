import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import {getList} from "api/employer";
import {
    getListAccountantCustomer,
    getListFieldPromotionProgramsItems,
    getListOpportunity,
    getListSalesOrderByField
} from "api/saleOrder";
import MySelect from "components/Common/Ui/Form/MySelect";
import {getTeamMember} from "api/auth";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import ROLES from "utils/ConstantActionCode";
import CanAction from "components/Common/Ui/CanAction";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opportunity: [],
            promotion_programs_info: {}
        }
        this.onChangeCustomer = this._onChangeCustomer.bind(this);
        this.onChangeStaff = this._onChangeStaff.bind(this);
    }

    async _onChangeCustomer(value) {
        const {setFieldValue} = this.props;
        if(!value) {
            setFieldValue('customer_name', null);
            setFieldValue('customer_address', null);
            return;
        }
        const res = await getListAccountantCustomer({id: value});
        if(res && Array.isArray(res.items)) {
            const [item] = res.items;
            setFieldValue('customer_name', item?.name);
            setFieldValue('customer_address', item?.address);
        }
    }

    async _getListOpportunity(code) {
        const res = await getListOpportunity({sellerCode: code});
        if(res && Array.isArray(res?.data?.records)) {
            const opportunity = res.data.records.map(item => {
                return { label: `${item?.deal_ref} - ${item?.customer_ref} - ${item?.name}`, value: item.id }
            });
            this.setState({opportunity: opportunity});
        } else {
            this.setState({opportunity: []});
        }
    }

    _onChangeStaff(value) {
        if(value) {
            this._getListOpportunity(value);
        }
    }

    componentDidMount() {
        const {values} = this.props;
        this._getListOpportunity(values?.revenue_by_staff_code);
    }

    render() {
        const {values, isEdit} = this.props;
        const {channel_code} = this.props.branch.currentBranch;
        const {opportunity} = this.state;
        // const isDisable = !(!values?.status || (parseInt(values?.status) === Constant.SALE_ORDER_NOT_COMPLETE));
        const isDisable = false;
        const isPromotion = parseInt(values.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelectSearch name={"employer_id"} label={"Nhà tuyển dụng"}
                                        searchApi={getList}
                                        initKeyword={this.props.values?.employer_id}
                                        defaultQuery={{channel_checkmate: channel_code}}
                                        optionField={"email"}
                                        showLabelRequired
                                        readOnly={isDisable}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"type_campaign"} label={"Loại phiếu"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_type_campaign}
                                        showLabelRequired
                                        readOnly={isDisable}
                        />
                    </div>
                </div>
                {isPromotion && (
                    <div className="row">
                        <div className="col-md-6 mb10">
                            <MySelectSearch name={"original_sales_order_id"} label={"PĐK gốc"}
                                            searchApi={getListSalesOrderByField}
                                            initKeyword={this.props.values?.original_sales_order_id}
                                            defaultQuery={{
                                                employer_id: values?.employer_id,
                                                status: Constant.SALE_ORDER_ACTIVED,
                                                type_campaign: Constant.CAMPAIGN_TYPE_DEFAULT
                                            }}
                                            labelField={"employer_info.name"}
                                            readOnly={isDisable}
                            />
                        </div>
                        <div className="col-md-6 mb10">
                            <MySelectFetch name={"promotion_programs_id"} label={"Chương trình tặng"}
                                           fetchApi={getListFieldPromotionProgramsItems}
                                           fetchField={{ value: "id", label: "title" }}
                                           fetchFilter={isEdit ? {} : {status: Constant.STATUS_ACTIVED}}
                                           // readOnly={isEdit}
                                           showLabelRequired
                            />
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name_representative"} label={"Người đại diện"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"position_representative"} label={"Chức vụ"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"payment_term_method"} label={"Hạn thanh toán"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_payment_term_method_checkmate}
                                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"is_signature"} label={"Siêu Việt ký"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_sales_order_is_signature}
                                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <CanAction actionCode={ROLES.customer_care_sales_order_update_staff}>
                            <MySelectFetch name={"revenue_by_staff_code"} label={"CSKH ghi nhận danh thu"}
                                           fetchApi={getTeamMember} f
                                           etchField={{status: Constant.STATUS_ACTIVED, per_page: 1000}}
                                           fetchField={{
                                               value: "code",
                                               label: "login_name",
                                           }}
                                           onChange={this.onChangeStaff}
                                           optionField={"code"}
                            />
                        </CanAction>
                    </div>
                </div>
                <div className={"row mt20"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Khách hàng kế toán</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelectSearch name={"accountant_customer_id"} label={"Mã số thuế"}
                                        searchApi={getListAccountantCustomer}
                                        initKeyword={this.props.values?.accountant_customer_id}
                                        defaultQuery={{status: Constant.STATUS_ACTIVED}}
                                        optionField={"address"}
                                        onChange={this.onChangeCustomer}
                                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"customer_name"} label={"Tên công ty"} InputProps={{readOnly: true}}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"customer_address"} label={"Địa chỉ"} InputProps={{readOnly: true}}/>
                    </div>
                </div>
                <div className={"row mt20"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Opportunity</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelect name={"opportunity_id"} label={"Opportunity"} options={opportunity}/>
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
        user: state.user,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
