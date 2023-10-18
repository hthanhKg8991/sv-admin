import React from "react";
import {connect} from "react-redux";
import {getListJobItems} from "api/employer";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"job_id"}
                                       label={"Tin tuyển dụng"}
                                       fetchApi={getListJobItems}
                                       fetchFilter={{employer_id: values?.employer_id, job_status: Constant.STATUS_ACTIVED, per_page: 1000}}
                                       fetchField={{
                                           value: "id",
                                           label: "title",
                                       }}
                                       optionField={"id"}
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
