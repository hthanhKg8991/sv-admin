import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MySelectService from "components/Common/Ui/Form/MySelectService";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getVsic} from "api/system";
import {getListRoomItems} from "api/auth";

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            routerNames : []
        };
    }

    render() {
        const {isEdit} = this.props;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"Tên mã"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"type_code"} label={"Loại mã"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_customer_type_code}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"name"} label={"Tên Company"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectService name={"province_id"} label={"Tỉnh thành"}
                                type={"provinceInForm"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MyField name={"address"} label={"Địa chỉ"}/>
                    </div>
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"fields_activity"} label={"Lĩnh vực hoạt động"}
                                       fetchApi={getVsic}
                                       fetchField={{
                                           value: "id",
                                           label: "name",
                                           groupBy: "parent"
                                       }}
                                       isGroup
                                       isMulti/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"company_kind"} label={"Quy mô"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                        showLabelRequired
                        />
                    </div>
                    {isEdit &&
                        <div className="col-md-6 mb10">
                            <MySelectFetch
                                label={"Phòng"}
                                name={`room_id`}
                                fetchApi={getListRoomItems}
                                fetchFilter={{per_page: 1000}}
                                fetchField={{value: "id", label: "name"}}
                                readOnly 
                            />
                        </div>
                    }
                </div>
                {isEdit &&
                    <div className="row">
                        <div className="col-md-6">
                            <MySelectSystem 
                                name={"fraud_status"} 
                                label={"Phân loại Customer"}
                                type={"common"}
                                valueField={"value"}
                                idKey={Constant.COMMON_DATA_KEY_fraud_status}
                                showLabelRequired
                            />
                        </div>
                    </div>
                }
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
