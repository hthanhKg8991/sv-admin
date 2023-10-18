import React from "react";
import {connect} from "react-redux";
import { getListHeadhuntSalesOrder} from "api/headhunt";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectSearch name={"sales_order_id"} label={"Mã đơn hàng"}
                            searchApi={getListHeadhuntSalesOrder}
                            labelField={"customer_info.company_name"}
                            initKeyword={this.props.values?.sales_order_id}
                            defaultQuery={{status: [
                                Constant.SALES_ORDER_HEADHUNT_STATUS_CONFIRMED,
                                Constant.SALES_ORDER_HEADHUNT_STATUS_SUBMITTED,
                                Constant.SALES_ORDER_HEADHUNT_STATUS_APPROVED,
                                ]}}
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
    };
}

export default connect(mapStateToProps, null)(FormComponent);
