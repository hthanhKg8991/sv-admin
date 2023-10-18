import React from "react";
import { connect } from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListFullGamificationPoint, getListFullGamificationReward} from "api/gamification";
import MyDate from "components/Common/Ui/Form/MyDate";
import moment from "moment";

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
                        <MySelectFetch
                            label={"Reward"}
                            name={"reward_id"}
                            fetchApi={getListFullGamificationReward}
                            fetchField={{value: "id", label: "name"}}
                            showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectFetch
                            label={"Point"}
                            name={"point_id"}
                            fetchApi={getListFullGamificationPoint}
                            fetchField={{value: "id", label: "name"}}
                            showLabelRequired
                        />
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"total"}
                            label={"Total"}
                             type={"number"}
                            showLabelRequired />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"range"}
                             type={"number"}
                            label={"Range"}
                            showLabelRequired />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyDate name={"start_date"} label={"Ngày bắt đầu"}
                                minDate={moment()}
                                showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"end_date"} label={"Ngày kết thúc"}
                                showLabelRequired/>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default connect(null, null)(FormComponent);
