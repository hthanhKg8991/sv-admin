import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListFieldPriceListItems} from "api/saleOrder";

class FormComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"total_resume_required"} label={"Số lượng cần tuyển"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"job_level"} label={"Level tuyển dụng"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_sales_order_by_field_items_level}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"total_week"} label={"Số tuần"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"total_job"} label={"Số tin"} showLabelRequired InputProps={{readOnly: true}}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"salary_min"} label={"Mức lương tối thiểu"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"salary_max"} label={"Mức lương tối đa"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"price_list_id"} label={"Loại gói"}
                                       fetchApi={getListFieldPriceListItems}
                                       fetchField={{ value: "id", label: "name" }}
                                       fetchFilter={{status: Constant.STATUS_ACTIVED, per_page: 1000}}
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
