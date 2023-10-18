import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import EditContractAppendix from "pages/HeadhuntPage/ContractPage/Edit/ContractAppendix";
import _ from "lodash";
import queryString from "query-string";

class PopupAddContractAppendix extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {idKey, contract_id} = this.props;
        const {id} = this.props;
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <EditContractAppendix idKey={idKey} id={id} contract_id={contract_id} />
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddContractAppendix);
