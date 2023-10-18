import React from "react";
import MyField from 'components/Common/Ui/Form/MyField';

class FormReject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="col-sm-12 col-xs-12 mb15">
                <MyField name={"reason_reject"} label={"Lý do từ chối duyệt"} showLabelRequired/>
            </div>
        );
    }
}

export default FormReject;
