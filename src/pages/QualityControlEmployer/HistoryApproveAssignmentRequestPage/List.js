import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getAssignmentRequestList} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/QualityControlEmployer/HistoryApproveAssignmentRequestPage/ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import SpanText from "components/Common/Ui/SpanText";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupReason from "pages/CustomerCare/AssignmentRequestPage/PopupReason";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tên NTD",
                    width: 200,
                    cell: row => {
                        const {employer_info} = row;
                        return <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                    action: "detail",
                                    id: employer_info?.id
                                })}`} target="_new">
                                {employer_info.id } - {employer_info?.name}
                            </Link>
                    }
                },
                {
                    title: "CSKH cũ",
                    width: 160,
                    accessor: "from_staff_username"
                },
                {
                    title: "CSKH mới",
                    width: 160,
                    accessor: "to_staff_username"
                },
                {
                    title: "Lý do",
                    width: 200,
                    onClick: () => {},
                    cell: row => {
                        const {reason, orther_reason} = row;
                        return <>
                            <SpanText idKey={Constant.COMMON_DATA_KEY_employer_discard_reason} value={reason} /><br/>
                            {reason === Constant.REASON_OTHER_VALUE &&
                                <span className="ml12 text-link" onClick={() => {this.onViewReason(orther_reason)}}>Xem lý do</span>
                            }
                        </>
                    }
                },
                {
                    title: "File đính kèm",
                    width: 100,
                    cell: row => {
                        const {attached_file, attached_file_url} = row;
                        if(!attached_file) {
                            return "";
                        }
                        const type = attached_file.split(".").pop();
                        if(Constant.FILE_OPEN_BROWSER_TYPE.includes(type)) {
                            return <span onClick={() => {window.open(attached_file_url)}} className="text-link">Xem file</span>
                        } else {
                            return <a href={attached_file_url} target="_new" download className="text-link">Xem file</a>
                        }
                    }
                },
                {
                    title: "Loại",
                    width: 100,
                    cell: row => {
                        const {employer_info} = row;
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status} value={employer_info?.premium_status} />
                    }
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    onClick: () => {},
                    cell: row => {
                        const {status, reason_reject} = row;
                        return <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_assignment_request_status} value={status}/><br/>
                            {row?.status === Constant.REASON_STATUS_NOT_ACTIVE &&
                                <span className="text-link" onClick={() => {this.onViewReason(reason_reject)}}>(Xem lý do)</span>
                            }
                        </>
                    }
                },
                {
                    title: "Người yêu cầu",
                    width: 160,
                    cell: row => {
                        return <>{row?.to_staff_username} <br/> {moment.unix(row?.created_at).format("DD-MM-YY HH:mm:ss")}</>
                    },
                },
                {
                    title: "Người duyệt",
                    width: 160,
                    cell: row => {
                        return <>{row?.updated_by} <br/> {moment.unix(row?.updated_at).format("DD-MM-YY HH:mm:ss")}</>
                    },
                },
            ],
            loading : false,
        };

        this.onViewReason = this._onViewReason.bind(this);
    }

    _onViewReason(msg) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupReason, "Lý do yêu cầu", {msg});
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        const idKey = "HistoryApproveAssignmentRequestList";

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách lịch sử duyệt yêu cầu"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getAssignmentRequestList}
                      query={{...query,
                          not_status : [Constant.STATUS_INACTIVED, Constant.STATUS_DELETED]
                      }}
                      columns={columns}
                      defaultQuery={{...defaultQuery,
                          not_status : [Constant.STATUS_INACTIVED,Constant.STATUS_DELETED]
                      }}
                      history={history}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
