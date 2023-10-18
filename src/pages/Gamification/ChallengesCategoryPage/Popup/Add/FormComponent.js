import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";
import {MyDate} from "components/Common/Ui";
import moment from "moment"
class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name="name"
                                 label="Tên"
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name="point"
                                 label="Point"
                                 showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyDate name={"start_date"} label={"Start Date"} minDate={moment()} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"end_date"} label={"End Date"}
                                showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(FormComponent);
