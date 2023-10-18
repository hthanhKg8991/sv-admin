import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {printHeadhuntAcceptanceRecord, printHeadhuntSalesOrder} from "api/headhunt";

class PopupPrint extends Component {
    constructor(props) {
        super(props);
        this.onPrint = this._onPrint.bind(this);

    }

    async _onPrint() {
        const {id} = this.props;
        const res = await printHeadhuntAcceptanceRecord({id, type: "doc"});
        if (res) {
            window.open(res?.url, "_blank");
        }
    }


    render() {
        let {html} = this.props;
        return (
            <div className="dialog-popup-body">
                <div className="v-card-action">
                    <CanRender actionCode={ROLES.headhunt_sales_order_print}>
                        <button type="button" onClick={this.onPrint} className="el-button el-button-warning el-button-small">
                            <span>In</span>
                        </button>
                    </CanRender>
                </div>
                <div className="popupContainer">
                    <div dangerouslySetInnerHTML={{__html: html}} />
                </div>
                <hr className="v-divider margin0"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupPrint);
