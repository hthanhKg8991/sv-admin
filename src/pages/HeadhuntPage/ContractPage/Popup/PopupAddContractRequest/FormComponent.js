import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListFullSkuHeadhunt} from "api/headhunt";
import MyUpload from "components/Common/Ui/Form/MyUpload";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";

class FormComponent extends React.Component {


    render() {
        const {values} = this.props;
        const {readOnlyEdit} = values;
        const readOnly = {readOnly: true, style: {background: "#f1f1f1", lineHeight: "16px"}};
        const readOnlyEditProps = readOnlyEdit ? readOnly : {style: {lineHeight: "16px"}};
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin gói dịch vụ</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"title"}
                                 label="Vị trí tuyển dụng" showLabelRequired InputProps={readOnlyEditProps}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name={"quantity_needed"}
                                       label="Số lượng cần tuyển" showLabelRequired InputProps={readOnlyEditProps}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">

                        <MySelectFetch
                            name={"sku_id"}
                            label="Gói dịch vụ"
                            fetchApi={getListFullSkuHeadhunt}
                            fetchField={{
                                value: "id",
                                label: "name",
                            }}
                            readOnly={readOnlyEdit}
                            InputProps
                            showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name="unit_price"
                                       label="Đơn giá ứng viên (Chưa bao gồm thuế)" showLabelRequired
                                       InputProps={readOnlyEditProps}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name={"duration_guarantee"}
                                       label="Thời hạn bảo hành (Ngày)"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin vị trí tuyển dụng</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"field"}
                                 label="Ngành nghề"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"position"}
                                 label="Cấp bậc"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"working_time"}
                                 label="Thời gian làm việc"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"probation_time"}
                                 label="Thời gian thử việc"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"work_location"}
                                 label="Địa điểm làm việc"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"income"}
                                 label="Thu nhập"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"interview_process"} multiline rows={6}
                                 label="Quy trình phỏng vấn"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"terms_of_payment"} multiline rows={6}
                                 label="Điều khoản thanh toán"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"job_description"} multiline rows={6}
                                 label="Mô tả công việc"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"job_requirements"} multiline rows={6}
                                 label="Yêu cầu công việc"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"benefit"} multiline rows={6}
                                 label="Quyền lợi"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"experience_required"} multiline rows={6}
                                 label="Yêu cầu kinh nghiệm"/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"other_requirements"} multiline rows={6}
                                 label="Yêu cầu khác"/>
                    </div>
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
