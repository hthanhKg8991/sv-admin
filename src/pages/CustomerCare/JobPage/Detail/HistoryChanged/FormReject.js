import React from "react";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

class FormReject extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="col-sm-12 col-xs-12 mb15">
                <MySelectSystem name={"rejected_reason"} label={"Lý do không duyệt"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_job_rejected_reason}
                                isMulti
                                showLabelRequired/>
            </div>
        );
    }
}

export default FormReject;
