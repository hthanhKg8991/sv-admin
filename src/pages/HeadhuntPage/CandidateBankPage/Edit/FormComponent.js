import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import * as Constant from "utils/Constant";
import {getListStaffItemsHeadhunt} from "api/headhunt";
import MyUpload from "components/Common/Ui/Form/MyUpload";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"title"} label={"Vị trí tuyển dụng"} showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
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
                        />

                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"sourcer_staff_login_name"} label={"Sourcer"}
                                       fetchApi={getListStaffItemsHeadhunt}
                                       fetchField={{
                                           value: "login_name",
                                           label: "login_name",
                                       }}
                                       fetchFilter={{
                                           status: Constant.STATUS_ACTIVED,
                                           division_code: [Constant.DIVISION_TYPE_customer_headhunt_sourcer],
                                           per_page: 999
                                       }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyUpload name={"jd_file_url"} label={"JD"}
                                  validateType={['pdf', 'doc', 'docx']}
                                  maxSize={10}
                                  viewFile
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"note"} label={"Note"} multiline rows={8}/>
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
