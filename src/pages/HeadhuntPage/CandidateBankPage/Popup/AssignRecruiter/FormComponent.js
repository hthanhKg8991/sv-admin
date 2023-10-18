import React from "react";
import {connect} from "react-redux";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {
    getListStaffItemsHeadhunt,
} from "api/headhunt";
import * as Constant from "utils/Constant";
import MySelectFetch from "../../../../../components/Common/Ui/Form/MySelectFetch";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>

                <div className={"row d-flex"} style={{alignItems: "center"}}>
                    <div className="col-md-2 font-bold">Chuyển thủ công:</div>
                    <div className="col-md-6">
                        <MySelectFetch name={"recruiter_staff_login_name"} label={"Recruiter"}
                                       fetchApi={getListStaffItemsHeadhunt}
                                       fetchField={{
                                           value: "login_name",
                                           label: "login_name",
                                       }}
                                       fetchFilter={{
                                           status: Constant.STATUS_ACTIVED,
                                           division_code: [Constant.DIVISION_TYPE_customer_headhunt_recruiter],
                                           per_page: 999
                                       }}
                                       showLabelRequired
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

export default connect(mapStateToProps, null)(FormComponent);
