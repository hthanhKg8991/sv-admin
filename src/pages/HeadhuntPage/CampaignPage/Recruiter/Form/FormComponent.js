import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListStaffItems} from "api/auth";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"list_group_member_login_name"} label={"Recruiter"}
                                       fetchApi={getListStaffItems}
                                       fetchField={{
                                           value: "login_name",
                                           label: "login_name",
                                       }}
                                       fetchFilter={{
                                           status: Constant.STATUS_ACTIVED,
                                           division_code: [Constant.DIVISION_TYPE_customer_headhunt_recruiter,Constant.DIVISION_TYPE_customer_headhunt_sale],
                                           per_page: 999
                                       }}
                                       showLabelRequired
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

export default connect(mapStateToProps, null)(FormComponent);
