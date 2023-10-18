import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {printSalesOrderOriginalV2} from "api/saleOrderV2";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class PopupPrintContract extends Component {
    constructor(props) {
        super(props);
        this.onPrint = this._onPrint.bind(this);
        this.onPrintWord = this._onPrintWord.bind(this);

    }

    async _onPrintWord() {
        const {object, room_id} = this.props;
        const res = await printSalesOrderOriginalV2({id: object.id, word: 1, room_id});
        if (res) {
            window.open(res?.url, "_blank");
        }

    }

    async _onPrint() {
        const {object, room_id} = this.props;
        const res = await printSalesOrderOriginalV2({id: object.id, room_id});
        if (res) {
            window.open(res?.url, "_blank");
        }
    }

    render() {
        let {html} = this.props;
        return (
            <div className="dialog-popup-body">
                <div className="v-card-action">
                    <CanRender actionCode={ROLES.sales_order_sales_order_print_pdf}>
                        <button type="button" onClick={this.onPrint}
                                className="el-button el-button-warning el-button-small">
                            <span>In file pdf</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.sales_order_sales_order_print_word}>
                        <button type="button" onClick={this.onPrintWord}
                                className="el-button el-button-warning el-button-small">
                            <span>In file doc</span>
                        </button>
                    </CanRender>
                </div>
                <div className="popupContainer">
                    <div dangerouslySetInnerHTML={{__html: html}}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupPrintContract);
