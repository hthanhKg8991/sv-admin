import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyCheckbox from "components/Common/Ui/Form/MyCheckbox";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListFullHeadhuntAction} from "api/headhunt";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {

    render() {
        const {isEdit} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField
                            name={"code"}
                            InputProps={{readOnly: isEdit}}
                            label={"Code"}
                            showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"name"}
                                  label={"Name"}
                                  showLabelRequired/>
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"ordering"}
                                 label={"Ordering"}
                                 type={"number"}
                                 showLabelRequired/>
                    </div>
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
                        />
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyCheckbox name={"is_default"} items={[{label: "Default", value: Constant.HEADHUNT_APPLICANT_STATUS_DEFAULT}]} />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyCheckbox name={"is_disabled"} items={[{label: "Ẩn", value: Constant.HEADHUNT_APPLICANT_STATUS_DISABLE}]} />
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
