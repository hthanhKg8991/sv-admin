import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Chọn nhãn cuộc gọi</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10 mt10">
                        <MySelectSystem name={"label"} label={"Nhãn cuộc gọi"}
                        type={"common"}
                        valueField={"value"}
                        isMulti
                        idKey={Constant.COMMON_DATA_KEY_call_center_label}
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
