import React, {Component} from "react";
import Edit from "pages/Experiment/ExperimentVariantPage/Expand/Edit";

class PopupExperimentTestForm extends Component {
    render() {
        return (
            <Edit {...this.props}/>
        )
    }
}

export default PopupExperimentTestForm;