import React from "react";
import {connect} from "react-redux";
import {
    getListHeadhuntCustomer
} from "api/headhunt";
import MySelectSearch from "components/Common/Ui/Form/MySelectSearch";

class FormComponent extends React.Component {
    render() {
        const {values} = this.props;
        return (
            <React.Fragment>
                <div className={"row"}>
                    <div className="col-sm-12 sub-title-form mb10">
                        <span>Pipeline Status</span>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-md-12 mb10">
                        <MySelectSearch
                            name={"customer_id"}
                            label={"Customer"}
                            searchApi={getListHeadhuntCustomer}
                            valueField={"id"}
                            labelField={"company_name"}
                            initKeyword={values?.customer_id}
                            optionField={"tax_code"}
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
