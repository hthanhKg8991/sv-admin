import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {getDetailHeadhuntCampaign, getListHeadhuntCampaign} from "api/headhunt";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import * as Constant from "utils/Constant";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import moment from "moment";
import MyFieldHidden from "components/Common/Ui/Form/MyFieldHidden";
import MySelect from "components/Common/Ui/Form/MySelect";


class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recruiter_campaign_detail: [],
        }
        this.getRecruiterCampaignDetail = this._getRecruiterCampaignDetail.bind(this);
    }

    async _getRecruiterCampaignDetail(id) {

        const res = await getDetailHeadhuntCampaign({id});
        if (res) {
            const recruiter_merge = [res.campaign_group_member_recruiter_main, ...res.list_campaign_group_member_recruiter];
            const recruiter_campaign_detail = recruiter_merge.map(v => ({value: v, label: v}));
            this.setState({recruiter_campaign_detail});
        }
    }

    componentDidMount() {
        const {isEdit, values} = this.props;
        if (isEdit) {
            this.getRecruiterCampaignDetail(values.campaign_id);
        }
    }

    render() {

        const {isEdit, values, setFieldValue} = this.props;
        const {recruiter_campaign_detail} = this.state;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                {isEdit ? (
                    <>
                        <MyFieldHidden name="seeker_name"/>
                        <MyFieldHidden name="seeker_date_of_birth"/>
                        <MyFieldHidden name="seeker_email"/>
                        <MyFieldHidden name="seeker_phone"/>
                        <MyFieldHidden name="seeker_address"/>
                        <div className="row mb10">
                            <div className="col-md-6">
                                <span>Tên ứng viên:</span>
                                <span className="ml15 font-bold">{values.seeker_name}</span>
                            </div>
                            <div className="col-md-6">
                                <span>Ngày sinh</span>
                                <span
                                    className="ml15 font-bold">
                                    {values.seeker_date_of_birth ? moment.unix(values.seeker_date_of_birth).format("DD-MM-YYYY") : ""}
                                </span>
                            </div>
                        </div>
                        <div className="row mb10">
                            <div className="col-md-6">
                                <span>Email:</span>
                                <span className="ml15 font-bold">{values.seeker_email}</span>
                            </div>
                            <div className="col-md-6">
                                <span>Số điện thoại:</span>
                                <span className="ml15 font-bold">{values.seeker_phone}</span>
                            </div>
                        </div>
                        <div className="row mb10">
                            <div className="col-md-6">
                                <span>Địa chỉ:</span>
                                <span className="ml15 font-bold">{values.seeker_address}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={"row"}>
                            <div className="col-md-6 mb10">
                                <MyField name={"seeker_name"} label={"Tên ứng viên"} showLabelRequired/>
                            </div>
                            <div className="col-md-6 mb10">
                                <MyDate name={"seeker_date_of_birth"} label={"Ngày sinh"}/>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className="col-md-6 mb10">
                                <MyField name={"seeker_email"} label={"Email"} showLabelRequired/>
                            </div>
                            <div className="col-md-6 mb10">
                                <MyField name={"seeker_phone"} label={"Số điện thoại"} showLabelRequired/>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className="col-md-6 mb10">
                                <MyField name={"seeker_address"} label={"Địa chỉ"}/>
                            </div>
                        </div>
                    </>
                )}

                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin CV</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSearch
                            name={"campaign_id"}
                            label={"Campaign"}
                            searchApi={getListHeadhuntCampaign}
                            valueField={"id"}
                            labelField={"name"}
                            initKeyword={this.props.values?.campaign_id}
                            showLabelRequired
                            onChange={value => {
                                this.getRecruiterCampaignDetail(value)
                                setFieldValue("recruiter_staff_login_name", "")
                            }}
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"data_source"} label={"Nguồn"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_source}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"resume_title"} label={"Tiêu đề"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"revenue_expected"}
                                 label={"Revenue Expected"}
                                 type={"number"}
                                 InputProps={{readOnly: isEdit}}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"applicant_channel_code"}
                                        type={"common"}
                                        showLabelRequired
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_applicant_channel_code}
                                        label={"Web"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelect name={"recruiter_staff_login_name"}
                                  label={"Chọn Recruiter"}
                                  options={recruiter_campaign_detail}
                                  showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 sub-title-form mb10">
                        <div>File đính kèm</div>
                        <DropzoneImage label={"Tập tin"} name={"cv_file"}
                                       folder={"recruitment-pipeline"}
                                       validationImage={{type: Constant.ASSIGNMENT_UPLOAD_TYPE, size: 2048000}}
                                       isFile/>
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
