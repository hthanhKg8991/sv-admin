import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MyDate from "components/Common/Ui/Form/MyDate";
import * as Constant from "utils/Constant";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MyConditionConfig from "components/Common/Ui/Form/MyConditionConfig";
import { Field } from 'formik';

class FormComponent extends React.Component {
    render() {
        const common = this.props.sys.common.items;
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MyField name={"title"} label={"Tên chương trình"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"service_type"} label={"Gói dịch vụ"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_extend_programs_service_type}
                                        isMulti
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10 wrapper-type-fee-package paddingLeft0">
                        <div className={`col-md-${values?.fee_type?.includes(Constant.COMMON_DATA_KEY_GIFT_PACKAGE) ? "9" : "12"}`}> 
                        <MySelectSystem name={"fee_type"} label={"Loại gói phí"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_extend_programs_fee_type}
                                        isMulti
                                        showLabelRequired/>
                        </div>
                        {
                            values?.fee_type?.includes(Constant.COMMON_DATA_KEY_GIFT_PACKAGE)
                            && 
                            (
                                <div className="col-md-3">
                                <Field type="checkbox" name="include_guarantee" checked={!!values?.include_guarantee} value={!!values?.include_guarantee} className="margin0 mr5 check-box-custom" />
                                <span>Gói bảo hành</span> 
                                </div>
                            )
                        }
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"start_date"} label={"Ngày bắt đầu"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"end_date"} label={"Ngày kết thúc"} showLabelRequired/>
                    </div>
                    <div className="col-md-12 mb10">
                        <MyField name={"description"} label={"Ghi chú"} multiline rows={5}/>
                    </div>
                </div>
                <div className="row mt20">
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Điều kiện áp dụng</span>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-12">
                        <MyConditionConfig values={values} name={"conditions"} label={"Điều kiện"} common={common}/>
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
