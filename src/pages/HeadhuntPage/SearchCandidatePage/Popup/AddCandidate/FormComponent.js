import React from "react";
import {connect} from "react-redux";

import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";
import MyUpload from "components/Common/Ui/Form/MyUpload";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin ứng viên</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="col-md-12 mb10">
                            <MyField
                                name={"name"}
                                label={"Tên NTV"}
                                showLabelRequired
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MyField
                                name={"email"}
                                label={"Email"}
                                showLabelRequired
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MyField
                                name={"mobile"}
                                label={"Di động"}
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MyDate
                                name={"birthday"}
                                label={"Ngày sinh"}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="col-md-12 mb10">
                            <MySelectSystem
                                name={"gender"} label={"Giới tính"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_gender}
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectSystem name={"seeker_province_id"} label={"Tỉnh/ thành phố"}
                                            type={"provinceInForm"}
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MyField
                                name={"address"}
                                label={"Địa chỉ"}
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectSystem
                                name={"token_email"}
                                label={"Trạng thái xác thực email"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_headhunt_candidate_email_verify}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin CV</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="col-md-12 mb10">
                            <MyField
                                name={"title"}
                                label={"Tiêu đề hồ sơ"}
                                showLabelRequired
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MyFieldNumber
                                name={"salary"}
                                label={"Mức lương"}
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectSystem
                                name={"position"} label={"Cấp bậc"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_resume_level_requirement}
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MyField
                                name={"social_url"}
                                label={"Social URL"}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="col-md-12 mb10">
                            <MySelectSystem
                                name={"experience"} label={"Số năm kinh nghiệm"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_resume_experience_range}
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectSystem name={"field_ids"} label={"Ngành nghề"}
                                            type={"jobField"}
                                            isMulti
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectSystem name={"province_ids"} label={"Tỉnh/ thành phố"}
                                            type={"provinceInForm"}
                                            isMulti
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <MySelectSystem
                                name={"level"} label={"Trình độ học vấn"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_seeker_level}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="padding-10">
                            <MyUpload name="cv_file_url" label="Tải lên file đính kèm"
                                      showLabelRequired
                                      validateType={['pdf']}
                                      maxSize={10}/>
                        </div>
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
