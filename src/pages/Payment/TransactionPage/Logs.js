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
import {getLogsTransaction} from "api/saleOrder";
import PopupLogFileUpload from "pages/Payment/TransactionPage/Popup/PopupLogFileUpload";

const idKey = "TransactionLogs";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Transaction ID",
                    width: 100,
                    accessor: "transaction_id"
                },
                {
                    title: "Statement ID",
                    width: 100,
                    accessor: "statement_id"
                },
                {
                    title: "Exceptional ID",
                    width: 100,
                    accessor: "exceptional_transaction_id"
                },
                {
                    title: "Payment ID",
                    width: 100,
                    accessor: "payment_id"
                },
                {
                    title: "Loại thao tác",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_transaction_log_type}
                                           value={row?.type} notStyle/>;
                    }
                },
                {
                    title: "Trạng thái match",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_transaction_status}
                                           value={row?.status}/>;
                    }
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_transaction_status_confirm}
                                           value={row?.status_confirm}/>;
                    }
                },
                {
                    title: "Ghi chú",
                    width: 100,
                    accessor: "note"
                },
                {
                    title: "File",
                    width: 100,
                    cell: row => (
                        row?.file_url?.length > 0 && <span onClick={()=>this.onShowListFile(row.file_url)} className="cursor-pointer text-link">Xem</span>
                    )
                },
                {
                    title: "Ngày thay đổi",
                    width: 100,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Người thay đổi",
                    width: 140,
                    accessor: "created_by"
                },
            ],
            loading: false,
        };
        this.goBack = this._goBack.bind(this);
        this.onShowListFile = this._onShowListFile.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.goBack();
    }

    _onShowListFile(files) {
        this.props.actions.createPopup(PopupLogFileUpload,"Danh sách file chứng từ",{files})
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;
        const {transaction_id} = query;

        return (
            <Default
                title="Lịch Sử Thay Đổi Transaction"
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
                      fetchApi={getLogsTransaction}
                      query={query}
                      columns={columns}
                      defaultQuery={{transaction_id: transaction_id}}
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
