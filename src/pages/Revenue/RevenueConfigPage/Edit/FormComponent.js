import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyConfigKPI from "components/Common/Ui/Form/MyConfigKPI";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        const common = this.props.sys.common.items;
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
                        <MyDate name={"start_at"} label={"Thời gian bắt đầu"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"end_at"} label={"Thời gian kết thúc"} showLabelRequired/>
                    </div>
                </div>
                <div className={"row mt15"}>
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Cấu hình</span>
                    </div>
                </div>
                <div className={"row"}>
                    <MyConfigKPI name={"detail_configs"} values={values} label={"Cấu hình"} common={common}/>
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
