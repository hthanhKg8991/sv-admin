import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getVsic} from "api/system";
import MyCloneField from "./MyCloneField";
import moment from "moment";
import MyDate from "components/Common/Ui/Form/MyDate";
import {getListFullIndustryHeadhunt} from "api/headhunt";
import {COMMON_DATA_KEY_headhunt_customer_source} from "utils/Constant";

class FormComponent extends React.Component {
    render() {
        const { values,setFieldError} = this.props;

        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6 mb10">
                        <MyField name={"tax_code"} label={"Mã số thuế"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"company_name"} label={"Tên công ty"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"address"} label={"Địa chỉ"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"company_size"} label={"Quy mô"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_employer_company_size}
                                        showLabelRequired
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"branch_name"} label={"Tên thương hiệu"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"type_of_business"} label={"Loại hình doanh nghiệp"} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"industry_id"} label={"Ngành"}
                                       fetchApi={getListFullIndustryHeadhunt}
                                       fetchField={{
                                           value: "id",
                                           label: "name",
                                       }}
                                       fetchFilter={{"order_by[name]": "asc"}}
                                       showLabelRequired
                        />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"founding_at"} label={"Ngày thành lập"}
                                minDate={moment.unix(values.from_date)}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"created_source"} label={"Nguồn"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_headhunt_customer_source}
                                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
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
                    <div className="col-md-6 mb10">
                        <MyField name={"website"} label={"Website"} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"product_service"} label={"Sản phẩm dịch vụ hiện tại"} />
                    </div>
                    <div className="col-md-6 mb10">
                        <MyCloneField
                            setFieldError={setFieldError}
                            value={values?.profit.length === 0 ? [""] : values?.profit}
                            name="profit" label={"Lợi nhuận 3 năm gần nhất"}/>
                    </div>
                </div>
                <div className="row mb20">
                    <div className="col-md-6 mb10">
                        <MyCloneField
                            setFieldError={setFieldError}
                            value={values?.revenue.length === 0 ? [""] : values?.revenue}
                            name="revenue" label={"Doanh thu 3 năm gần nhất"}/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField rows={4} multiline name={"about_us"} label={"Giới thiệu công ty"} />
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
