import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import {getLogsPayment} from "api/saleOrder";

const idKey = "PaymentLogs";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Payment ID",
                    width: 100,
                    accessor: "payment_id"
                },
                {
                    title: "Trạng thái payment",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status}
                                           value={row?.payment_status}/>;
                    }
                },
                {
                    title: "Transaction ID",
                    width: 100,
                    accessor: "transaction_id"
                },
                {
                    title: "Ngày ghi nhận",
                    width: 100,
                    time: true,
                    accessor: "created_at"
                },
            ],
            loading: false,
        };
        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.goBack();
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;
        const {payment_id} = query;

        return (
            <Default
                title="Lịch Sử Cập Nhật Payment"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getLogsPayment}
                      query={query}
                      columns={columns}
                      defaultQuery={{payment_id: payment_id}}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
