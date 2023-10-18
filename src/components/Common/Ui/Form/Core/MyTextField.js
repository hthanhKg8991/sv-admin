import React from "react";
import withFocus from "components/Common/Ui/Form/Action/Focus";
import TextField from "@material-ui/core/TextField";
class MyTextField extends React.Component {
    render() {
        const props = {...this.props, inputRef: this.props.innerRef};
        delete props['innerRef'];

        return (
            <TextField {...props}/>
        )
    }
}

export default withFocus(MyTextField);
