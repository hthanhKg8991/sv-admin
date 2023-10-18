import React from "react";
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField
                            name={"title"}
                            label={"Tag"}
                            showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default FormComponent;
