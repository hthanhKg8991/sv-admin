import React from "react";
import _ from "lodash";
import MyPassword from "components/Common/Ui/Form/MyPassword";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {fieldWarnings} = this.props;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Đổi mật khẩu</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6">
                        <MyPassword name={"password"} label={"Mật khẩu"}
                                    isWarning={_.includes(fieldWarnings, 'password')}
                                    showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
