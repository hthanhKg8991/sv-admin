import React from "react";
import {connect} from "react-redux";
import MySelect from "components/Common/Ui/Form/MySelect";
import MyField from "components/Common/Ui/Form/MyField";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class FormComponent extends React.Component {
    render() {
        const teamLine = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_team_call_line).map((item) => {
            return {
                label: item?.title,
                value: item?.value
            }
        });
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 mb10">
                        <MyField name={"line"} label={"Số line"}
                                 showLabelRequired/>
                    </div>
                    <div className="col-sm-6 mb10">
                        <MySelect name={"team_id"} label={"Nhóm"}
                                  options={teamLine || []}
                                  showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"staff_name"} label={"Tên user"}
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
