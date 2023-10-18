import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getListDivideStaff, deleteDivideStaff, createDivideStaffOld, deleteAllDivideStaff, resetDivideStaff} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox,
} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import queryString from 'query-string';
import SpanBranch from "components/Common/Ui/SpanBranch";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "EmployerDivideStaffOld";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Mã",
                    width: 60,
                    accessor: "staff_id",
                },
                {
                    title: "UserName",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            <span className="cursor-pointer"
                                  style={{color: '#3276b1'}}>{row?.staff_username}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action_active: 'edit',
                            item_active: row.staff_id,
                            q: row.staff_id,
                            page: 1,
                        };
                        window.open(Constant.BASE_URL_AUTH_STAFF + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Tên Đầy Đủ",
                    width: 160,
                    accessor: "staff_name",
                },
                {
                    title: "Level",
                    width: 80,
                    cell: row => (<SpanCommon notStyle value={row.customer_care_level}
                                              idKey={Constant.COMMON_DATA_KEY_staff_level}/>)
                },
                {
                    title: "Nhóm",
                    width: 130,
                    accessor: "team_name",
                },
                {
                    title: "Miền",
                    width: 100,
                    cell: (row) => (
                        <>
                            <SpanBranch value={row?.branch_code}/>
                        </>
                    ),
                },
                {
                    title: "Phòng",
                    width: 100,
                    accessor: "room_info.name",
                },
                {
                    title: "Chức năng",
                    width: 120,
                    cell: (row) => (
                        <>
                            <CanRender actionCode={ROLES.quality_control_employer_split_old_account_create}>
                                <span className="text-underline text-link" href="#" onClick={() => this.onAddStaff(row)}>
                                    Thêm
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.quality_control_employer_split_old_account_delete}>
                                <span className="text-underline text-delete ml5" href="#"
                                   onClick={() => this.onDeleteStaff(row)}>Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                }
            ]
        };
        this.onAddStaff = this._onAddStaff.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDeleteStaff = this._onDeleteStaff.bind(this);
        this.onDeleteAll = this._onDeleteAll.bind(this);
        this.onReset = this._onReset.bind(this);
    }


    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_DIVIDE_OLD_ACCOUNT,
            search: '?action=edit&id=0'
        });
    }

    _onAddStaff(row) {
        const {staff_name, staff_id} = row;
        const {actions, query} = this.props;
        actions.SmartMessageBox({
                title: 'Bạn có chắc chắn muốn Thêm ' + staff_name + ' vào danh sách nhận tài khoản NTD',
                content: "",
                buttons: ['No', 'Yes']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    actions.hideSmartMessageBox();
                    const res = await createDivideStaffOld({staff_id, type: [query?.type]});
                    if (res) {
                        actions.putToastSuccess('Thao tác thành công');
                        publish(".refresh", {}, idKey);
                    }
                }
            }
        );
    }

    _onDeleteStaff(row) {
        const {ids, staff_name} = row;
        const {actions} = this.props;
        actions.SmartMessageBox({
                title: 'Bạn có chắc chắn muốn xoá ' + staff_name + ' khỏi danh sách nhận tài khoản NTD',
                content: "",
                buttons: ['No', 'Yes']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    actions.hideSmartMessageBox();
                    const res = await deleteDivideStaff({ids});
                    if (res) {
                        actions.putToastSuccess('Thao tác thành công');
                        publish(".refresh", {}, idKey);
                    }
                }
            }
        );
    }

    _onDeleteAll(row) {
        const {actions} = this.props;
        const {type} = this.props?.query;
        actions.SmartMessageBox({
                title: 'Bạn có chắc chắn muốn reset lại danh sách nhận tài khoản NTD',
                content: "",
                buttons: ['No', 'Yes']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    actions.hideSmartMessageBox();
                    const res = await deleteAllDivideStaff({throwout_type: Constant.TYPE_DIVIDE_OLD, type});
                    if (res) {
                        actions.putToastSuccess('Thao tác thành công');
                        publish(".refresh", {}, idKey);
                    }
                }
            }
        );
    }

    _onReset(row) {
        const {actions} = this.props;
        actions.SmartMessageBox({
                title: 'Bạn có chắc chắn muốn xoá hết danh sách nhận tài khoản NTD',
                content: "",
                buttons: ['No', 'Yes']
            }, async (ButtonPressed) => {
                if (ButtonPressed === "Yes") {
                    actions.hideSmartMessageBox();
                    const res = await resetDivideStaff();
                    if (res) {
                        actions.putToastSuccess('Thao tác thành công');
                        publish(".refresh", {}, idKey);
                    }
                }
            }
        );
    }

    render() {
        const {columns} = this.state;
        const {query, history, defaultQuery} = this.props;
        const {type} = query;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách chia tài khoản Cũ"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <CanRender actionCode={ROLES.quality_control_employer_split_old_account_create}>
                            <div className="left btnCreateNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm CSKH <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                        <CanRender actionCode={ROLES.quality_control_employer_split_old_account_deleteall}>
                            <div className="btnCreateNTD pull-right">
                                <button type="button"
                                        className="el-button el-button-bricky el-button-small"
                                        onClick={this.onDeleteAll}>
                                    <span>Xóa tất cả <i className="ml5 glyphicon glyphicon-remove"/></span>
                                </button>
                            </div>
                        </CanRender>
                        {Number(type) === 2 && (
                            <CanRender actionCode={ROLES.quality_control_employer_split_old_account_reset}>
                                    <div className="btnCreateNTD pull-right">
                                        <button type="button"
                                                className="el-button el-button-warning el-button-small"
                                                onClick={this.onReset}>
                                            <span>Reset<i className="ml5 glyphicon glyphicon-refresh"/></span>
                                        </button>
                                    </div>
                            </CanRender>
                        )}
                    </>
                )}>
                {Number(type) === 1 && (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-info">
                                <strong>
                                    (*) Xả loại 1 bao gồm:
                                </strong>
                                <ul>
                                    <li>Xả do không lên VIP</li>
                                    <li>Xả do tin tồn</li>
                                    <li>Xả do NTD free loại 1</li>
                                    <li>Xả do đã từng vip</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {Number(type) === 2 && (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-info">
                                <strong>
                                    (*) Xả loại 2 bao gồm:
                                </strong>
                                <ul>
                                    <li>Xả hết hạn chăm sóc</li>
                                    <li>Xả do chuyển vùng miền</li>
                                    <li>Xả do thanh lọc đăng nhập</li>
                                    <li>Xả tài khoản từ giỏ CSKH bất kỳ khác</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                <Gird idKey={idKey}
                      fetchApi={getListDivideStaff}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isPushRoute={true}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
