import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import {getListTypeLogs} from "api/saleOrder";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import TableComponent from "components/Common/Ui/Table";
import classnames from 'classnames';
import moment from "moment";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";

class PopupShowTypeLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
        };
        this.onClose = this._onClose.bind(this);
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    async _getLogs() {
        const {id} = this.props;
        const res = await getListTypeLogs({transaction_id: id});
        if (res && Array.isArray(res)) {
            this.setState({items: res, loading: false})
        }
    }

    componentDidMount() {
        this._getLogs();
    }

    render() {
        const {loading, items} = this.state;
        if (loading) {
            return (
                <div className="text-center">
                    <LoadingSmall/>
                </div>
            )
        }
        return (
            <div className="padding30">
                <div className="body-table el-table">
                    <TableComponent allowDragScroll={false}>
                        <TableHeader tableType="TableHeader" width={300}>
                            Ghi chú
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={150}>
                            Loại
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={150}>
                            Ngày chuyển
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={150}>
                            Người chuyển
                        </TableHeader>
                        <TableBody tableType="TableBody">
                            {items.map((item, key) => {
                                return (
                                    <React.Fragment key={key}>
                                        <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                            <td>
                                                <div className="cell-custom mt5 mb5">{item?.note}</div>
                                            </td>
                                            <td>
                                                <div className="cell-custom mt5 mb5">
                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_transaction_internal} value={item?.type} notStyle/>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom mt5 mb5">
                                                    {moment.unix(item?.created_at).format("DD/MM/YYYY")}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom mt5 mb5">{item?.created_by}</div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )
                            })}
                        </TableBody>
                    </TableComponent>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupShowTypeLogs);
