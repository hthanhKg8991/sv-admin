import React from "react";
import {connect} from "react-redux";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import * as Constant from "utils/Constant";
import {getListSalesOrderV2} from "api/saleOrderV2";

class FormComponent extends React.Component {
    render() {
        const {user} = this.props;
        const isCustomerCare = [
            Constant.DIVISION_TYPE_customer_care_member,
            Constant.DIVISION_TYPE_customer_care_leader
        ].includes(user?.division_code);
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Đơn hàng muốn quy đổi</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelectSearch name={"sales_order_id"} label={"SO ID"}
                                        searchApi={getListSalesOrderV2}
                                        labelField={"employer_info.name"}
                                        initKeyword={this.props.values?.sales_order_id}
                                        defaultQuery={{status: Constant.SALES_ORDER_V2_STATUS_APPROVED, assigned_staff_id : isCustomerCare ? user.id : null }}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Đơn hàng áp dụng quy đổi</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb20">
                        <MySelectSearch name={"new_sales_order_id"} label={"SO ID"}
                                        searchApi={getListSalesOrderV2}
                                        labelField={"employer_info.name"}
                                        initKeyword={this.props.values?.new_sales_order_id}
                                        defaultQuery={{status: Constant.SALES_ORDER_V2_STATUS_SUBMITTED}}
                                        showLabelRequired/>
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
