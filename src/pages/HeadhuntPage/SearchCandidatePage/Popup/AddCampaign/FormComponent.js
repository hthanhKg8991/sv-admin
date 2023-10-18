import React from "react";
import {connect} from "react-redux";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";
import {
    getListHeadhuntCampaign,
} from "api/headhunt";
import * as Constant from "utils/Constant";

class FormComponent extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Thông tin chung</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-6">
                        <div className="col-md-12 mb10">
                            <MySelectSearch
                                name={"campaign_id"}
                                label={"Chọn Campaign"}
                                defaultQuery={{status: Constant.STATUS_ACTIVED, per_page: 60}}
                                searchApi={getListHeadhuntCampaign}
                                valueField={"id"}
                                labelField={"name"}
                                initKeyword={this.props.values?.campaign_id}
                                showLabelRequired
                            />
                        </div>
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
