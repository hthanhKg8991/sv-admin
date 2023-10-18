import React from "react";
import {connect} from "react-redux";
import {getListConfigKpiItems} from "api/commission";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";

class FormConfigComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb5">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"config_id"} label={"Vui lòng chọn cấu hình"}
                                       fetchApi={getListConfigKpiItems}
                                       fetchField={{value: "id", label: "id"}}
                                       fetchFilter={{per_page: 999}}
                                       optionField={"name"}
                                       showLabelRequired/>
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

export default connect(mapStateToProps, null)(FormConfigComponent);
