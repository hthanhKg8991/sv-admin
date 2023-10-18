import React from "react";
import CanAction from "components/Common/Ui/CanAction";
import MyField from "components/Common/Ui/Form/MyField";
import DropzoneImage from "components/Common/Ui/Form/DropzoneImage";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0,
        };
    }


    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <CanAction actionCode={"123"}>
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"email"} label={"Email"}
                                             readOnly/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"employer_name"} label={"Tên công ty"}
                                             readOnly/>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className="col-sm-12 mb10">
                                    <MyField name={"title"} label={"Tiêu đề cũ"}
                                             readOnly/>
                                </div>
                            </div>
                        </CanAction>
                        <div className={"row"}>
                            <div className="col-sm-12 mb10">
                                <MyField name={"new_data"} label={"Tiêu đề mới"}
                                         showLabelRequired
                                         />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="col-sm-6">
                            <DropzoneImage label={"File đính kèm"}
                                           prefix={"yeucau"}
                                           validationImage={{type: Constant.ASSIGNMENT_UPLOAD_TYPE}}
                                           name={"file"}
                                           isFile
                                           folder={"reason"}/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
