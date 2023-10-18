import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import {getListRoomItems} from "api/auth";
import MyField from "components/Common/Ui/Form/MyField";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên danh sách nhận"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"room_id"} label={"Phòng"}
                                       fetchApi={getListRoomItems}
                                       fetchField={{ value: "id", label: "name" }}
                                       fetchFilter={{per_page: 1000}}
                                       showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"employer_care_type"} label={"Loại CSKH"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_assigned_type}
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"customer_care_level"} label={"Level CSKH"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_staff_level}
                                        isMulti
                                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"mode"} label={"Chế độ CSKH"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_staff_mode}
                                        isMulti
                                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    };
}

export default connect(mapStateToProps, null)(FormComponent);
