import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {publish} from "utils/event";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {deleteShareRoomDetail, getListShareRoomDetail} from "api/employer";
import Gird from "components/Common/Ui/Table/Gird";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import FormDetail from "pages/System/ShareRoomListPage/Popup/FormDetail";

const idKey = "ShareRoomListDetail";

class Detail extends Component {
    constructor(props) {
        super(props);
        const {room_list} = props;
        this.state = {
            columns: [
                {
                    title: "ID phòng",
                    width: 200,
                    accessor: "room_id"
                },
                {
                    title: "Tên phòng",
                    width: 200,
                    cell: row => room_list.find(_ => Number(_.id) === Number(row?.room_id) )?.name
                },
                {
                    title: "Hành động",
                    width: 200,
                    cell: row => (
                        <CanRender actionCode={ROLES.system_config_list_share_room_detail_delete}>
                            <span className="text-link text-blue font-bold margin-right-5" onClick={() => this.onDelete(row?.id)}>
                                Xóa
                            </span>
                        </CanRender>
                    )
                },
            ],
            loading: false,
        };

        this.onDelete = this._onDelete.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        this.props.uiAction.createPopup(FormDetail, 'Thêm phòng', {object: {}, idKey, config_id: this.props.id});
    }

    _onDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteShareRoomDetail({id});
                if (res) {
                    uiAction.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
    }

    render() {
        const {history, id} = this.props;
        const {columns} = this.state;

        return (
           <>
               <CanRender actionCode={ROLES.system_config_list_share_room_detail_create}>
                   <button type="button" className="el-button el-button-primary el-button-small"
                           onClick={this.onClickAdd}>
                       <span>Thêm phòng <i className="glyphicon glyphicon-plus"/></span>
                   </button>
               </CanRender>
               <Gird idKey={idKey}
                     fetchApi={getListShareRoomDetail}
                     query={{config_id: id}}
                     columns={columns}
                     history={history}
                     isRedirectDetail={false}
               />
           </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Detail);

