import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import {MySelectSystem} from "components/Common/Ui";
import * as Constant from "utils/Constant";

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
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"email"} label={"Email"} showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"phone"} label={" Số điện thoại"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"position"} label={"Vị trí"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"time_at_company"} label={"Thời gian làm việc tại Công ty"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"time_at_industry"} label={"Thời gian làm việc trong ngành"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"link_profile"} label={"Link Profile"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectSystem type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_headhunt_customer_info_result} name={"result"}
                                        label={"Result"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"note"} label={"Note"}/>
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
