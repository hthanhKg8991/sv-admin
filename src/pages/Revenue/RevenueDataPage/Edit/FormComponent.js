import React from "react";
import {connect} from "react-redux";
import MyField from "components/Common/Ui/Form/MyField";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListConfigGroup, getListConfigKpiItems} from "api/commission";
import * as Constant from "utils/Constant";

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
                        <MyField name={"name"} label={"Tên group"} showLabelRequired/>
                    </div>
                    <div className="col-md-6 mb10">
                        <MyField name={"code"} label={"Mã code"} showLabelRequired/>
                    </div>
                </div>
                <div className="row">
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
                    <div className="col-md-6 mb10">
                        <MySelectSearch name={"parent_code"} label={"Parent code"}
                                        searchApi={getListConfigGroup}
                                        initKeyword={this.props.values?.parent_code}
                                        defaultQuery={{config_id: this.props.values?.config_id || 999}}
                                        valueField={"code"}/>
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
