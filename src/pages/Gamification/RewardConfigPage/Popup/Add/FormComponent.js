import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListFullGamificationChallengesCategory} from "api/gamification";
import MyFieldNumber from "components/Common/Ui/Form/MyFieldNumber";

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
                        <MyField name={"name"}
                                 label={"Tên"}
                                 showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"category_id"}
                                       label={"Challenge Category"}
                                       fetchApi={getListFullGamificationChallengesCategory}
                                       fetchField={{value: "id", label: "name"}}
                                       showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name={"total"}
                                 label={"Total"}
                                 showLabelRequired/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name={"weight"}
                                 label={"weight"}
                                 showLabelRequired
                                 />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyFieldNumber name={"percent"}
                                 label={"Phần trăm"}
                                 showLabelRequired
                                 />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"icon_url"}
                                 label={"Icon url"}
                                 />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(FormComponent);
