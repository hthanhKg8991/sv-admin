import React from "react";
import {connect} from "react-redux"
import MyRadio from "components/Common/Ui/Form/MyRadio";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {

    render() {
        const {sys} = this.props;
        const evaluation = sys.common.items?.[Constant.COMMON_DATA_KEY_headhunt_applicant_evaluation]?.map(v => ({
            value: v.value,
            label: v.name
        })) || [];
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MyRadio
                            label="evaluation"
                            name={"evaluation"}
                            showLabelRequired
                            items={evaluation}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys
    };
}

export default connect(mapStateToProps, null)(FormComponent);


