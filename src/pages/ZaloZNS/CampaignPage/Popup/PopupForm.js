import React, {Component} from "react";
import Edit from "../Edit";

class PopupForm extends Component {
    render() {
        return <Edit {...this.props}/>
    }
}

export default PopupForm;
