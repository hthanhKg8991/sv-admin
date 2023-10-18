import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyConditionAudience from "components/Common/Ui/Form/MyConditionAudience";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        const common = this.props.sys.common.items;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"description"} label={"Mô tả"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelect name={"ring"} label={"Ring"} options={Constant.SEGMENT_RING_OPTIONS} showLabelRequired/>
                    </div>
                </div>
                <div className="row mt30">
                    <div className="col-sm-12 sub-title-form">
                        <span>Điều kiện</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <MyConditionAudience values={values} name={"conditions"} label={"Điều kiện"}
                                             common={common}/>
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
