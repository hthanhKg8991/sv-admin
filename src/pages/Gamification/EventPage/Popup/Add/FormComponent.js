import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"name"}
                                  label={"Name"}
                                  showLabelRequired/>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(FormComponent);
