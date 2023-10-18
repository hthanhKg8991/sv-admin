import React from "react";
import withFocus from "components/Common/Ui/Form/Action/Focus";
import Select from "react-select";

class MySelectCore extends React.Component {
    render() {
        const props = {...this.props, ref: this.props.innerRef};
        delete props['innerRef'];

        return (
            <Select {...props}/>
        )
    }
}

export default withFocus(MySelectCore, 'select');
