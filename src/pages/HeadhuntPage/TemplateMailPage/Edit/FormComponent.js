import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListDropboxCampaign} from "api/emailMarketing";
import * as Constant from "utils/Constant";

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
                        <MyField name={"name"} label={"Tiêu đề mail"} showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mt10 mb10">
                        <span>Nội dung email</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyCKEditor
                            config={[['Bold','Italic','Strike'], [ 'Styles', 'Format'], ['NumberedList','BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                            label={"Content"}
                            name="content"
                            showLabelRequired
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField name={"utm"} label={"Utm"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mt15 mb10">
                        <span>Personalization tags</span>
                    </div>
                    <div className="col-sm-12">
                        <p>{`+ {CONTACT_NAME}: Các vị trí gán biến này hệ thống sẽ tự động lấy field “Tên” trong “List Contact” bạn chọn để gửi mail.`}</p>
                        <p>{`+ {CONTACT_EMAIL}: Các vị trí gán biến này hệ thống sẽ tự động lấy field “Email” trong “List Contact” bạn chọn để gửi mail.`}</p>
                        <p>{`+ {SEEKER_NAME}: Tên ứng viên`}</p>
                        <p>{`+ {SEEKER_EMAIL}: Email ứng viên`}</p>
                        <p>{`+ {SEEKER_PHONE}: SĐT ứng viên`}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mt15 mb10">
                        <span>Campaign</span>
                    </div>
                    <div className="col-sm-12">
                        <MySelectFetch
                            fetchFilter={{
                                type: Constant.EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_TRANSACTION,
                                per_page: 1000,
                                status: Constant.STATUS_ACTIVED
                            }}
                            fetchApi={getListDropboxCampaign}
                            fetchField={{
                            value: "id",
                            label: "name",
                        }}
                           showLabelRequired label={"Chọn campaign"}
                           name={"email_marketing_campaign_id"} />
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
