import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListConfigGroup, getListConfigKpiItems} from "api/commission";
// import moment from 'moment';
import MyDate from "components/Common/Ui/Form/MyDate";

class FormComponent extends React.Component {
    render() {
        const {isEdit} = this.props;
        const configFilter = isEdit ? {} : {status: Constant.STATUS_ACTIVED};
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MyField name={"staff_code"} label={"Mã nhân viên"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"staff_name"} label={"Tên nhân viên"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSystem name={"staff_position"} label={"Chức vụ"}
                                        type={"common"}
                                        valueField={"value"}
                                        idKey={Constant.COMMON_DATA_KEY_revenue_staff_position}
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MySelectFetch name={"config_id"} label={"Cấu hình"}
                                        fetchApi={getListConfigKpiItems}
                                        fetchFilter={{...configFilter, per_page: 100}}
                                        fetchField={{
                                            value: "id",
                                            label: "name",
                                        }}
                                        showLabelRequired/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb10">
                        <MySelectSearch name={"staff_group_code"} label={"Group"}
                                        searchApi={getListConfigGroup}
                                        initKeyword={this.props.values?.group_code}
                                        defaultQuery={{config_id: this.props.values?.config_id || 999}}
                                        valueField={"code"}
                                        showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyDate name={"commission_end_date"} label={"Ngày ngừng tính hoa hồng"} />
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
