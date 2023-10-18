import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import FreemiumRegistration
    from "pages/CustomerCare/SalesOrderEditPage/Package/FreemiumPackage/FreemiumRegistration";
class FreemiumSubItemRow extends Component {
    constructor() {
        super();
    }

    render() {
        const {sales_order_item, sales_order, idKey, data_list, isFreemium} = this.props;

        /**
         * @type {string}
         */
        return (
            <div>
                <FreemiumRegistration
                    sales_order_item={sales_order_item}
                    sales_order={sales_order}
                    data_list={data_list}
                    isFreemium={isFreemium}
                    idKey={idKey}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FreemiumSubItemRow);
