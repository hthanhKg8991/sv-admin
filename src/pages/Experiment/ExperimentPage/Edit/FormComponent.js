import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListProjectItems} from "api/experiment";
import {getListSegmentItems} from "api/audience";
import MyConditionAudience from "components/Common/Ui/Form/MyConditionAudience";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyExperimentExclude from "components/Common/Ui/Form/MyExperimentExclude";

class FormComponent extends React.Component {
    render() {
        const {values, isEdit} = this.props;
        const common = this.props.sys.common.items;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"project_id"} label={"Project"}
                                       fetchApi={getListProjectItems}
                                       fetchField={{value: "id", label: "name"}}
                                       fetchFilter={{per_page: 1000}}
                                       showLabelRequired
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"Code"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"description"} label={"Mô tả"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"type"} label={"Type"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_experiment_type}
                                        showLabelRequired
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"traffic"} label={"Traffic(%)"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Audience</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"audience_segment_id"} label={"Chọn segment"}
                                       fetchApi={getListSegmentItems}
                                       fetchField={{value: "id", label: "name"}}
                                       fetchFilter={{status: Constant.STATUS_ACTIVED, per_page: 1000}}
                        />
                    </div>
                </div>
                <div className="row mt30">
                    <div className="col-sm-12 sub-title-form">
                        <span>Thêm điều kiện audience</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <MyConditionAudience values={values} name={"audience_conditions"} label={"Điều kiện"}
                                             common={common}/>
                    </div>
                </div>
                <div className="row mt30">
                    <div className="col-sm-12 sub-title-form">
                        <span>Experiment loại trừ</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <MyExperimentExclude values={values} name={"experiment_exclude"} label={"Experiment Exclude"} isEdit={isEdit}/>
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
