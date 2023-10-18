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
            </React.Fragment>
        );
    }
}

export default FormComponent;
