import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {getListHeadhuntGroupMemberAll, deleteHeadhuntGroupMember} from "api/headhunt";
import PopupGroupMemberForm from "pages/HeadhuntPage/GroupPage/Popup/PopupGroupMemberForm";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";

const idKey = "HeadhuntGroupListMember";

class ListMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Mã nhân viên",
                    width: 140,
                    accessor: "staff_code"
                },
                {
                    title: "Tên đăng nhập",
                    width: 140,
                    accessor: "login_name"
                },
                {
                    title: "Email",
                    width: 140,
                    accessor: "email"
                },
                {
                    title: "Role",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_group_member_rule}
                                             value={row.role}/>,
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_group_add_user}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
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
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {actions, id, division_code} = this.props;
        actions.createPopup(PopupGroupMemberForm, 'Thêm mới', {idKey, group_id: id, division_code});
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
                const res = await deleteHeadhuntGroupMember({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                }
                publish(".refresh", {}, idKey);
            }
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, id} = this.props;
        return (
            <>
                <div className="row">
                    <div className="col-md-12">
                        <CanRender actionCode={ROLES.headhunt_group_add_user}>
                            <button type="button" className="el-button el-button-bricky el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm CSKH <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                </div>
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntGroupMemberAll}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, group_id: id}}
                      history={history}
                      isPushRoute={false}
                      isPagination={false}
                      isRedirectDetail={false}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListMember);
