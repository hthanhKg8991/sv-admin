import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField name={"title"} label="Từ khóa cấm"/>
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
