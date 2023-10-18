import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import moment from "moment";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên cấu hình"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"status"} label={"Trạng thái"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_revenue_config_status}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyDate name={"date_from"} label={"Thời gian bắt đầu"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"date_to"} label={"Thời gian kết thúc"} minDate={moment.unix(values?.date_from)}
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
