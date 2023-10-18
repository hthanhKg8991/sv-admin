import React from "react";
import MyField from "components/Common/Ui/Form/MyField";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListGroupCampaignItems} from "api/emailMarketing";

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
                        <MySelectFetch name={"campaign_group_id"} label={"Group Campaign"}
                                       fetchApi={getListGroupCampaignItems}
                                       fetchField={{value: "id", label: "name"}}
                                       fetchFilter={{status: Constant.STATUS_ACTIVED, per_page: 1000}}
                                       showLabelRequired/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FormComponent;
