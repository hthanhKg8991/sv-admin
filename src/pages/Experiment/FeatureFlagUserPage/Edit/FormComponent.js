import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySwitch from "components/Common/Ui/Form/MySwitch";
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
                        <MyField name={"uid"} label={"UID"} showLabelRequired/>
                    </div>
                    <div className="col-md-12 mb10">
                        <MySwitch name={"toggle"} label={"Bật/Tắt"} options={Constant.TOGGLE_FLAG_OPTIONS}
                                  showLabelRequired/>
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
