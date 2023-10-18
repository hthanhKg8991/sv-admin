import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên ứng viên"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"date_of_birth"} label={"Ngày sinh"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"email"} label={"Email"}  showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"phone"} label={"Số điện thoại"}  showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"address"} label={"Địa chỉ"}/>
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
