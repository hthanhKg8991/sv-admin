import React from "react";
import withAutoSubmit from "components/Common/Ui/Form/Action/AutoSubmit";
import {Form} from "formik";

class MyForm extends React.Component {
    render() {
        return (
            <Form>
                {this.props.children}
            </Form>
        )
    }
}

export default withAutoSubmit(MyForm);
