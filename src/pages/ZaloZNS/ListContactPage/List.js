import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "./Popup/PopupForm";
import * as Constant from "utils/Constant";
import {
    activeListContact,
    deleteListContact,
    getListListContact
} from "api/zalo";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "ZaloZNSContactList";

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
                    title: "Tên",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Group Campaign",
                    width: 200,
                    accessor: "campaign_group_name"
                },
                {
                    title: "Phone thật",
                    width: 50,
                    accessor: "list_contact_detail.type.1"
                },
                {
                    title: "Phone test",
                    width: 50,
                    accessor: "list_contact_detail.type.2"
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_zalo_zns_list_contact_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 200,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                             <span className="text-link text-blue font-bold ml5" onClick={() => this.onDetail(row)}>
                                    Xem chi tiết
                             </span>
                            <CanRender actionCode={ROLES.zalo_zns_list_contact_update}>
                                <span className="text-underline text-danger font-bold ml5"
                                      onClick={() => this.onEdit(row)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.zalo_zns_list_contact_active}>
                                {row.status === Constant.STATUS_INACTIVED && (
                                    <span className="text-underline cursor-pointer text-success font-bold ml5"
                                          onClick={() => this.onActive(row?.id)}>
                                            Duyệt
                                        </span>

                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.zalo_zns_list_contact_delete}>
                                {row.status === Constant.STATUS_INACTIVED && (
                                    <span className="text-link text-red font-bold ml5"
                                          onClick={() => this.onDelete(row?.id)}>
                                            Xóa
                                    </span>

                                )}
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onDetail = this._onDetail.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onActive = this._onActive.bind(this);
    }

    _onDetail(row) {
        const {history} = this.props;
        const {id} = row;
        history.push({
            pathname: Constant.BASE_URL_ZALO_ZNS_LIST_CONTACT,
            search: '?action=detail&list_contact_id=' + id
        });
    }

    _onClickAdd() {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Thêm mới', {idKey});
    }

    _onEdit(object) {
        const {actions} = this.props;
        actions.createPopup(PopupForm, 'Chỉnh sửa', {idKey, object});
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa nhóm ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await deleteListContact({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    _onActive(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn duyệt ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            actions.hideSmartMessageBox();
            if (ButtonPressed === "Yes") {
                const res = await activeListContact({id});
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
                title="Danh Sách Quản Lý List Contact"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.zalo_zns_list_contact_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListListContact}
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


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
