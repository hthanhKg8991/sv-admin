import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import {getListStaffItems} from "api/auth";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";

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
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"staff_code"} label={"CSKH ghi nhận doanh thu"}
                                       fetchApi={getListStaffItems}
                                       fetchField={{value: "code", label: "display_name"}}
                                       fetchFilter={{
                                           status: Constant.STATUS_ACTIVED,
                                           division_code: [
                                               Constant.DIVISION_TYPE_customer_care_leader,
                                               Constant.DIVISION_TYPE_customer_care_member
                                           ],
                                           per_page: 1000,
                                       }}
                                       optionField={"code"}
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
