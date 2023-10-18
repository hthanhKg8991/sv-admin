import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getAssignmentRequestList} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/AssignmentRequestPage/ComponentFilter";
import {putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import Edit from "pages/CustomerCare/AssignmentRequestPage/Edit";
import PopupReason from "pages/CustomerCare/AssignmentRequestPage/PopupReason";
import SpanText from "components/Common/Ui/SpanText";
import * as Constant from "utils/Constant";
import {deleteAssignmentRequest} from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "AssignmentRequestList",
            columns: [
                {
                    title: "Email NTD",
                    width: 200,
                    cell: row => {
                        const {employer_info} = row;
                        return <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                            action: "detail",
                            id: employer_info?.id
                        })}`} target="_new">
                            <span>{employer_info.id } - {employer_info?.email}</span>
                        </Link>
                    }
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
                    title: "Ghi chú",
                    width: 140,
                    accessor: "note"
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
                    title: "Ngày yêu cầu",
                    width: 140,
                    cell: row => {
                        const {created_at} = row;
                        return <>{moment.unix(created_at).format("DD-MM-YYYY HH:mm:ss")}</>
                    }
                },
                {
                    title: "Người yêu cầu",
                    width: 140,
                    cell: row => {
                        return <>{row?.to_staff_username || ""}</>
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
                            {   row?.status === Constant.REASON_STATUS_NOT_ACTIVE &&
                                <span className="text-link" onClick={() => {this.onViewReason(reason_reject)}}>(Xem lý do)</span>
                            }
                        </>
                    }
                },
                {
                    title: "Hành động",
                    width: 60,
                    cell: row => {
                       return row?.status === Constant.STATUS_INACTIVED &&
                           <span onClick={() => this.onDelete(row.id)} className="btn-delete"><b>Xóa</b></span>
                    }
                },
            ],
            loading : false,
        };

        this.onDelete = this._onDelete.bind(this);
        this.onViewReason = this._onViewReason.bind(this);
    }

    _onViewReason(msg) {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupReason, "Lý do yêu cầu", {msg: msg});
    }

    _onDelete(id) {
        const {idKey} = this.state;
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa yêu cầu ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteAssignmentRequest({id});
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
        const {columns, idKey} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Yêu cầu chuyển giỏ"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                >
                <Edit idKey={idKey} id={0} history={history}/>

                <div className="row form-container">
                    <div className="col-md-12">
                        <div className="sub-title-form mb10">
                            <span>Lịch sử yêu cầu chuyển giỏ</span>
                        </div>
                        <Gird idKey={idKey}
                              fetchApi={getAssignmentRequestList}
                              query={query}
                              columns={columns}
                              defaultQuery={defaultQuery}
                              history={history}
                              isRedirectDetail={false}
                        />
                    </div>
                </div>
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
