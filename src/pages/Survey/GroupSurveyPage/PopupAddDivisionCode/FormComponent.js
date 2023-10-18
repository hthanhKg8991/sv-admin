import React from "react";
import MySelect from "components/Common/Ui/Form/MySelect";
class FormComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { listDivisionCode } = this.props;
        
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 mb10">
                        <MySelect
                            name="division_code"
                            label="Bộ phận"
                            options={listDivisionCode || []}
                            showLabelRequired
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent
