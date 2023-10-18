import React from "react";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListDivisionItems} from "api/auth";

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
                        <MySelectFetch name={"division_code"} label={"Bộ phận"}
                                       fetchApi={getListDivisionItems}
                                       fetchField={{value: "code", label: "short_name"}}
                                       fetchFilter={{status: Constant.STATUS_ACTIVED, per_page: 1000}}
                                       optionField={"code"}
                                       showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
