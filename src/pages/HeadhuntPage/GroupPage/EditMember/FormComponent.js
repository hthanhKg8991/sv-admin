import React from "react";
import {connect} from "react-redux";
import {getListStaffItems} from "api/auth";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"staff_id"} label={"Người dùng"}
                                       fetchApi={getListStaffItems}
                                       fetchField={{
                                           value: "id",
                                           label: "login_name",
                                       }}
                                       fetchFilter={{
                                           status: Constant.STATUS_ACTIVED,
                                           division_code: values.division_code,
                                           per_page: 999
                                       }}
                                       showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"role"} label={"Role"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_headhunt_group_member_rule}
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
