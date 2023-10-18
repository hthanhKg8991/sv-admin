import React from "react";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

class FormBackup extends React.Component{
    render() {
        return (
            <div className="col-sm-12 col-xs-12 mb15">
                <MySelectSystem name={"status_backup"} label={"Trạng thái backup"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_status_backup}
                                showLabelRequired/>
            </div>
        );
    }
}

export default FormBackup;
