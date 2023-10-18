import React from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import {getListFieldPromotionProgramsItems} from "api/saleOrder";

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
                    <div className="col-md-12 mb10">
                        <MySelectFetch name={"promotion_programs_id"} label={"Chương trình tặng"}
                                       fetchApi={getListFieldPromotionProgramsItems}
                                       fetchField={{value: "id", label: "title"}}
                                       fetchFilter={{status: Constant.STATUS_ACTIVED}}
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
