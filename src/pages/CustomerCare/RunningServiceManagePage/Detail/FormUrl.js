import React from "react";
import MyField from 'components/Common/Ui/Form/MyField';
import CanAction from 'components/Common/Ui/CanAction';

class FormUrl extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="col-sm-12 col-xs-12 mb15">
                <CanAction isDisabled>
                    <MyField name="old_url" label={"Url Cũ"} showLabelRequired/>
                </CanAction>
                <MyField name="url" label={"Url mới"} showLabelRequired/>
            </div>
        );
    }
}

export default FormUrl;
