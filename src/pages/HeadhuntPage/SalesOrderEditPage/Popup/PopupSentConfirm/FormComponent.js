import React from "react";
import MyUpload from "components/Common/Ui/Form/MyUpload";
import {MyField} from "components/Common/Ui";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12 mb10">
                            <MyField
                                name="note"
                                label="Ghi chú"
                            />
                        </div>
                        <div className="col-md-12 mb10">
                            <div className="col-md-12 mb10">
                                <MyUpload name="attached_file_url" label="File"
                                          validateType={['pdf', 'png', 'jpeg', 'jpeg']}
                                          maxSize={10}
                                          viewFile
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
