import React from "react";
import MyField from 'components/Common/Ui/Form/MyField';

class FormTitle extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="col-sm-12 col-xs-12 mb15">
                <MyField name="title" label={"Tên viết tắt"} showLabelRequired/>
            </div>
        );
    }
}

export default FormTitle;
