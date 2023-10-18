import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
class FormComponent extends React.Component {
    render() {
        const { fieldWarnings } = this.props;
        return (
            <div className="row">
                <div className="col-md-12 mb10">
                    <MyField name={"reason"} label={"Lý do không duyệt"} isWarning={_.includes(fieldWarnings, 'reason')} showLabelRequired />
                </div>
            </div>
        );
    }
}

export default FormComponent
