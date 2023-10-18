import React, {Component} from "react";
import ColorPicker from 'material-ui-color-picker'


class InputCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            required: props.required
        };
        this.onChange = this._onChange.bind(this);
    }

    _onChange(value) {
        const {onChange,name} = this.props;
        if(value){
            onChange(value,name);
        }
    }


    render() {
        let {name,label, value} = this.props;

        return (
            <>
                <p className={"popup-label-input"}>{label}</p>
                <input type="checkbox"/>
            </>
        );
    }
}

export default InputCheckbox;
