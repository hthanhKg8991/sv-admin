import React from "react";
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 mt20">
                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MyField name={"keyword"} label={"Từ khóa"} showLabelRequired />
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MyField name={"description"} label={"Mô tả"} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
