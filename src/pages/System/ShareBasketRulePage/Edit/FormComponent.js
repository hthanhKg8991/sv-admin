import React from "react";
import {getListShareBasketItems} from "api/employer";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import {getListRoomItems} from "api/auth";
import MySelect from "components/Common/Ui/Form/MySelect";
import * as utils from "utils/utils";

class FormComponent extends React.Component {
    render() {
        const type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_assigned_type);
        const ignore_type_options  = type.filter(e => e.value !== Constant.ASSIGNMENT_CUSTOMER_BIG)
                                        .map(m => {return {label: m.title, value: m.value}});
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"config_id"} label={"Danh sách nhận"}
                                       fetchApi={getListShareBasketItems}
                                       fetchField={{ value: "id", label: "name" }}
                                       showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"room_id"} label={"Phòng"}
                                       fetchApi={getListRoomItems}
                                       fetchField={{ value: "id", label: "name" }}
                                       fetchFilter={{per_page: 1000}}
                                       />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        {ignore_type_options &&
                            <MySelect name={"type"} label={"Loại CSKH"}
                                      labelField={"title"}
                                      valueField={"value"}
                                      options={ignore_type_options || []}
                                      showLabelRequired/>
                        }
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"company_kind"} label={"Quy mô"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"throwout_type"} label={"Chọn loại KH mới/cũ"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_throwout_type}
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
