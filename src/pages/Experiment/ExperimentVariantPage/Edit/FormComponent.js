import React from "react";
import {connect} from "react-redux";
import MyExperimentVariant from "components/Common/Ui/Form/MyExperimentVariant";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        return (
            <div className="row">
                <div className="col-md-12 mb10">
                    <MyExperimentVariant name="data" label="Data" values={values}/>
                </div>
            </div>
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
