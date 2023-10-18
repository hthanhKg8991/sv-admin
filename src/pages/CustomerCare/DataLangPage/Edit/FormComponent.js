import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {fieldWarnings, values} = this.props;
        console.log("values:", values);
        return (
            <div className="col-md-6 mb10">
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem
                            name={"type"}
                            label={"Loại hiển thị"}
                            type={"common"}
                            valueField={"value"}
                            idKey={Constant.COMMON_DATA_KEY_system_lang_type}
                            showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField
                            name={"common_id"}
                            label={"Key mapping (ex: '123',home','/taikhoan/profile') "}
                            isWarning={_.includes(fieldWarnings, "common_id")}
                            showLabelRequired
                        />
                    </div>
                </div>
                <div className="row">
                    {values?.type !== "common_data" && <div className="col-md-6 mb10">
                        <MyField
                            name={"key"}
                            label={"Tên tiếng việt"}
                            isWarning={_.includes(fieldWarnings, "key")}
                            showLabelRequired
                        />
                    </div>}
                    <div className="col-md-6 mb10">
                        <MyField
                            name={"name"}
                            label={"Tên hiển thị"}
                            isWarning={_.includes(fieldWarnings, "name")}
                            showLabelRequired
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem
                            name={"lang"}
                            label={"Ngôn ngữ"}
                            type={"common"}
                            valueField={"value"}
                            idKey={Constant.COMMON_DATA_KEY_SYSTEM_LANG_LIST}
                            showLabelRequired
                        />
                    </div>
                </div>
            </div>
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
