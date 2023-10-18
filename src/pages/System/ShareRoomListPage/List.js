import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/System/ShareRoomListPage/ComponentFilter";
import Detail from "pages/System/ShareRoomListPage/Detail";
import FormList from "pages/System/ShareRoomListPage/Popup/FormList";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {deleteShareRoom, getDetailShareRoom, getListShareRoom} from "api/employer";
import {getListRoom} from "api/auth";
import * as Constant from "utils/Constant";

const idKey = "ShareRoomList";

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    title: "ID danh sách nhận",
                    width: 150,
                    accessor: "id"
                },
                {
                    title: "Web",
                    width: 200,
                    cell: row => row?.channel_code.toUpperCase()
                },
                {
                    title: "Tên danh sách nhận",
                    with: 300,
                    accessor: "name"
                },
                {
                    title: "Hành động",
                    width: 150,
                    onClick: () => true,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.system_config_list_share_room_update}>
                                <span className="text-link text-blue font-bold mr10" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.system_config_list_share_room_delete}>
                                <span className="text-link text-red font-bold" onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            room_list: [],
            loading: false
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        this.props.uiAction.createPopup(FormList, 'Thêm danh sách nhận', {object: {}, idKey});
    }

    async _onEdit(id) {
        const object = await getDetailShareRoom({id: id});
        this.props.uiAction.createPopup(FormList, 'Chỉnh sửa danh sách nhận', {object: object, idKey});
    }

    _onDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteShareRoom({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    async _getRoom() {
        const res = await getListRoom({status: Constant.STATUS_ACTIVED});
        if(res) {
            this.setState({
                room_list: res?.items || []
            })
        }
    }

    componentDidMount() {
        this._getRoom();
    }

    render() {
        const {columns, room_list} = this.state;
        const {query, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Cấu hình DS nhận phòng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" ref={input => this.refreshBtn = input}
                            onClick={() => {
                                publish(".refresh", {}, idKey)
                            }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.system_config_list_share_room_create}>
                            <div className="left btnCreateNTD">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm danh sách nhận <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                )}>
                <Gird idKey={idKey} fetchApi={getListShareRoom}
                      query={query} columns={columns}
                      history={history}
                      expandRow={row => <Detail {...row} history={history} room_list={room_list}/>}/>
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
