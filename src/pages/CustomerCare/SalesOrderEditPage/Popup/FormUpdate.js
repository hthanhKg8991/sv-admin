import React from "react";
import MyField from 'components/Common/Ui/Form/MyField';

class FormUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <div className="col-sm-12 col-xs-12 mb15">
                    <MyField name="name_representative" label={"Tên người đại diện"} showLabelRequired/>
                </div>
                <div className="col-sm-12 col-xs-12 mb15">
                    <MyField name="position_representative" label={"Chức vụ"} showLabelRequired/>
                </div>
            </>
        );
    }
}

export default FormUpdate;
