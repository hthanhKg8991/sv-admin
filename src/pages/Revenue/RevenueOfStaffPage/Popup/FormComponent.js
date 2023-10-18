import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyConditionKPI from "components/Common/Ui/Form/MyConditionKPI";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        const common = this.props.sys.common.items;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Thông tin tiêu chí & hoa hồng</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10 mb10">
                        <MyConditionKPI name="conditions"
                                        label="Conditions"
                                        values={values}
                                        common={common}/>
                    </div>
                    <div className="col-md-2 mb10">
                        <MyField name="percent_commission"
                                 label="Hoa hồng"
                                 showLabelRequired
                        />
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
