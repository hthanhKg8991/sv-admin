import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListStaffItemsHeadhunt} from "api/headhunt";

class FormComponentStaff extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Nhân viên chăm sóc</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={Constant.DIVISION_TYPE_customer_headhunt_lead} label={"Lead"}
                                       fetchApi={getListStaffItemsHeadhunt}
                                       fetchField={{
                                           value: "login_name",
                                           label: "login_name",
                                       }}
                                       fetchFilter={{
                                           status: Constant.STATUS_ACTIVED,
                                           division_code: Constant.DIVISION_TYPE_customer_headhunt_lead,
                                           per_page: 999
                                       }}
                                       isMulti
                                       />
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={Constant.DIVISION_TYPE_customer_headhunt_sale} label={"Sale"}
                                       fetchApi={getListStaffItemsHeadhunt}
                                       fetchField={{
                                           value: "login_name",
                                           label: "login_name",
                                       }}
                                       fetchFilter={{
                                           status: Constant.STATUS_ACTIVED,
                                           division_code: Constant.DIVISION_TYPE_customer_headhunt_sale,
                                           per_page: 999
                                       }}
                                       isMulti
                                       />
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

export default connect(mapStateToProps, null)(FormComponentStaff);
