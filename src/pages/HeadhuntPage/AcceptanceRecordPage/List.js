import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {deleteHeadhuntAcceptanceRecord, getListHeadhuntAcceptanceRecord} from "api/headhunt";
import {Link} from "react-router-dom";
import queryString from "query-string";

const idKey = "AcceptanceRecordList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Tên NTD",
                    width: 200,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_HEADHUNT_CUSTOMER}?${queryString.stringify({
                                q: row?.customer_info?.id,
                                action: "list"
                            })}`}>
                            <span className={"text-link"}>{row?.customer_info?.id} - {row?.customer_info?.company_name}</span>
                        </Link>
                    )
                },
                {
                    title: "Mã phiếu",
                    width: 120,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EDIT_HEADHUNT_SALES_ORDER}?${queryString.stringify({
                                id: row.sales_order_id,
                            })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_acceptance_record_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Ngày tạo",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Người tạo",
                    width: 200,
                    accessor: "created_by"
                },
                {
                    title: "Hành động",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_acceptance_record_update}>
                            <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row.id)}>
                                Chỉnh sửa
                            </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_acceptance_record_delete}>
                                    <span className="text-link text-red font-bold ml5" onClick={() => this.onDelete(row.id)}>
                                        Xóa
                                    </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_ACCEPTANCE_RECORD,
            search: '?action=edit&id=0'
        })
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_ACCEPTANCE_RECORD,
            search: '?action=edit&id='+id
        })
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteHeadhuntAcceptanceRecord({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
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
                title="Danh Sách biên bản nghiệm thu"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.headhunt_acceptance_record_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntAcceptanceRecord}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
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
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
