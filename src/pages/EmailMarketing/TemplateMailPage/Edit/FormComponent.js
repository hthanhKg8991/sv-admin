import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import MyCKEditor from "components/Common/Ui/Form/MyCKEditor";

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
                            config={[['Bold','Italic','Strike'], [ 'Styles', 'Format'],['Link'], ['NumberedList','BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
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
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
