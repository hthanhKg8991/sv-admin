import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {connect} from "react-redux";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/QA/CallLineStatisticPage/ComponentFilter";
import {publish} from "utils/event";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {deleteCallLine, getListCallLineStaff} from "api/call";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import queryString from "query-string";
import moment from "moment";
const idKey = "CallLineList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "User",
                    width: 140,
                    accessor: "staff_name"
                },
                {
                    title: "Số line",
                    width: 80,
                    accessor: "line"
                },
                {
                    title: "Gọi thành công (cuộc)",
                    width: 80,
                    accessor: "success_call_quantity"
                },
                {
                    title: "Thời lượng cuộc gọi thành công",
                    width: 80,
                    accessor: "success_call_duration"
                },
                {
                    title: "KH không nghe máy (cuộc)",
                    width: 80,
                    accessor: "not_answered_call_quantity"
                },
                {
                    title: "Tổng số hợp đồng",
                    width: 80,
                    accessor: "total_contract"
                },
                {
                    title: "Gọi đến (cuộc)",
                    width: 80,
                    accessor: "incoming_call_duration"
                },
                {
                    title: "Thời gian gọi đến",
                    width: 80,
                    accessor: "incoming_call_duration"
                },
                {
                    title: "Thao tác",
                    width: 140,
                    cell: row => {
                        const param = queryString.stringify({
                            action: "history",
                            line: row?.line,
                            "date[from]": moment().unix(),
                            "date[to]": moment().unix(),
                        });
                        return row?.line && <>
                            <a className="text-link text-primary font-bold mr5"
                                href={`${Constant.BASE_URL_QA_CALL_LINE_STATISTIC}?${param}`}
                                target={"_blank"}>
                                Xem chi tiết
                            </a>
                            <CanRender actionCode={ROLES.qa_call_line_update}>
                                <span className="text-link text-red font-bold" onClick={() => this.onEdit(row?.line)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                        </>
                    }
                }
            ],
            loading : false,
        };

        this.onAdd = this._onAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_QA_CALL_LINE_STATISTIC,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_QA_CALL_LINE_STATISTIC,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteCallLine({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                    left={(
                        <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                    )}
                    title="Danh Sách Thống Kê Cuộc Gọi Ngoài Kinh Doanh"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.qa_call_line_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListCallLineStaff}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isPagination={false}/>
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
