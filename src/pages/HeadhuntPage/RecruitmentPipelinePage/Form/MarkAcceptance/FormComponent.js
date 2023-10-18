import React from "react";
import {MyDate} from "components/Common/Ui";

class FormComponent extends React.Component {
    render() {

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyDate
                            label="Ngày hoàn thành/onboard"
                            name="onboard_at"
                            showLabelRequired
                         />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;


