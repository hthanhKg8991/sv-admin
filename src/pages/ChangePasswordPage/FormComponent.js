import React from "react";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import {connect} from "react-redux";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import moment from "moment";

class FormComponent extends React.Component {
    render() {
        const {fieldWarnings, values} = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField name={"password"} label={"Mật khẩu mới"}
                                 isWarning={_.includes(fieldWarnings, 'password')}
                                 showLabelRequired
                        />
                    </div>
                    <div className="col-md-12 mb10">
                        <MyField name={"re_password"} label={"Nhập lại mật khẩu"}
                                 isWarning={_.includes(fieldWarnings, 're_password')}
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
