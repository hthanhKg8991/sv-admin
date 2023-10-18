import React from "react";
import { connect } from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";

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
                        <MyField name={"name"}
                            label={"Tên"}
                            showLabelRequired />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"point"} type={"number"}
                            label={"Point"}
                            showLabelRequired />
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default connect(null, null)(FormComponent);
