import React, {Component} from "react";
import ColorPicker from 'material-ui-color-picker'


class InputColor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            required: props.required
        };
        this.onChangeColor = this._onChangeColor.bind(this);
    }

    _onChangeColor(value) {
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
                <ColorPicker
                    name={name}
                    defaultValue={value || "#fff"}
                    onChange={this.onChangeColor}
                />
            </>
        );
    }
}

export default InputColor;