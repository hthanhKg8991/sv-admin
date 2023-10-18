import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListFullSkuHeadhunt} from "api/headhunt";
import MyUpload from "components/Common/Ui/Form/MyUpload";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"title"}
                                 label="Vị trí tuyển dụng"  />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"quantity_needed"}
                                 label="Số lượng cần tuyển" type={"number"}  />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"location"}
                                 label="Địa điểm làm việc"  />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"interview_process"}
                                 label="Quy trình phỏng vấn"  />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"experience_required"}  label="Yêu cầu kinh nghiệm" multiline rows={8} />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"other_required"}  label="Yêu cầu khác" multiline rows={8} />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectFetch
                            name={"sku_code"}
                            label="Gói dịch vụ"
                            fetchApi={getListFullSkuHeadhunt}
                            fetchField={{
                                value: "code",
                                label: "name",
                            }}
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"fee"}  label="Mức phí ứng viên"  />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"guarantee"}  label="Bào hành" />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"payment_term"}  label="Điều khoản thanh toán" />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyUpload name={"file_url"} label={"File"}
                                  validateType={['pdf', 'docx']}
                                  maxSize={15}
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
