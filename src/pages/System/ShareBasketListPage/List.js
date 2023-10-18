import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/System/ShareBasketListPage/ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {deleteShareBasket, getListShareBasket} from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "ShareRoomBasketList";

class List extends Component {
    constructor(props) {
        super(props);
        const {room_list} = props;
        this.state = {
            columns: [
                {
                    title: "Tên danh sách nhận",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Tên phòng",
                    width: 200,
                    cell: row => room_list.find(_ => Number(_.id) === Number(row?.room_id) )?.name
                },
                {
                    title: "Loại CSKH",
                    width: 150,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_assigned_type}
                                             value={row?.employer_care_type} notStyle/>
                },
                {
                    title: "Level CSKH",
                    width: 150,
                    cell: row => Array.isArray(row?.customer_care_level) && row?.customer_care_level?.map(c => <>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_staff_level}
                                    value={c} notStyle/>
                        <br/>
                    </>)
                },
                {
                    title: "Chế độ CSKH",
                    width: 150,
                    cell: row => Array.isArray(row?.mode) && row?.mode?.map(m => <>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_staff_mode}
                                    value={m} notStyle/>
                        <br/>
                    </>)
                },
                {
                    title: "Hành động",
                    width: 130,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.system_config_employer_share_basket_update}>
                                <span className="text-link text-blue font-bold mr10" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.system_config_employer_share_basket_delete}>
                                <span className="text-link text-red font-bold" onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading : false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SYSTEM_CONFIG_LIST_SHARE_BASKET,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SYSTEM_CONFIG_LIST_SHARE_BASKET,
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
                const res = await deleteShareBasket({id});
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
                    title="Cấu hình DS Nhận Giỏ (CSKH)"
                    titleActions={(
                        <button type="button" className="bt-refresh el-button" onClick={() => {
                            publish(".refresh", {}, idKey)
                        }}>
                            <i className="fa fa-refresh"/>
                        </button>
                    )}
                    buttons={(
                        <div className="left btnCreateNTD">
                            <CanRender actionCode={ROLES.system_config_employer_share_basket_create}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </CanRender>
                        </div>
                    )}>
                <Gird idKey={idKey}
                      fetchApi={getListShareBasket}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
