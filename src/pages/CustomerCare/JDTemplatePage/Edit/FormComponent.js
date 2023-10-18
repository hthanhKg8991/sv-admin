import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MyField name={"title"} label={"Vị trí"} showLabelRequired/>
                    </div>
                    <div className="col-md-12 mb10">
                        <MyField name={"description"} label={"Mô tả công việc"}
                                 multiline
                                 rows={15}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-12 mb10">
                        <MyField name={"requirements"} label={"Yêu cầu công việc"}
                                 multiline
                                 rows={15}
                                 showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
        sys: state.sys,
    };
}

export default connect(mapStateToProps, null)(FormComponent);
