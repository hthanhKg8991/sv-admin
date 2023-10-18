import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import {
    getListFullHeadhuntAction,
} from "api/headhunt";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import {COMMON_DATA_KEY_headhunt_pipeline_action_result} from "utils/Constant";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectFetch
                            name={"action_code"}
                            label={"Action"}
                            fetchApi={getListFullHeadhuntAction}
                            fetchField={
                                {
                                    value: "code",
                                    label: "name"
                                }
                            }
                            showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"date_at"} label={"Ngày"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"result"} label={"Result"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_headhunt_pipeline_action_result}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"reason"} label={"Reason"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"note"} label={"Note"}/>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default connect(null, null)(FormComponent);
