import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {
    deletePermissionAction,
    getAction,
    savePermissionAction,
    toggleStatusPermission,
    deletePermission
} from "api/auth";
import FormBase from "components/Common/Ui/Form";
import MySelectFetch from "components/Common/Ui/Form/MySelectFetch";
import * as Constant from "utils/Constant";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import {connect} from "react-redux";
import {publish} from "utils/event";
import * as Yup from "yup";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import FormPermission from "pages/Auth/PermissionPage/Popup/FormPermission";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import ButtonCommon from "components/Common/Ui/ButtonCommon";


class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                {
                    title: "Tên",
                    width: 140,
                    cell: row => (
                        `${row.id} - ${row.name}`
                    )
                },
                {
                    title: "API",
                    width: 160,
                    accessor: "code"
                },
                {
                    title: "#",
                    width: 160,
                    cell: row => (
                        <span onClick={() => this.onDelete(row)}
                              className="text-underline text-danger pointer">Xóa</span>

                    )
                },
            ],
            data: [],
            loading: false,
        };
        this.onSubmit = this._onSubmit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onToggleStatus = this._onToggleStatus.bind(this);
        this.onEditPermission = this._onEditPermission.bind(this);
        this.onDeletePermission = this._onDeletePermission.bind(this);
    }

    _onEditPermission() {
        const permission = this.props;
        this.props.uiAction.createPopup(FormPermission, 'Chỉnh Sửa Quyền', {object: permission});
    }

    async _onDeletePermission() {
        const permission = this.props;
        const res = await deletePermission({id: permission.id});
        if (res) {
            const {actions} = this.props;
            actions.putToastSuccess('Xóa quyền thành công');
            publish(".refresh", {}, 'detailPermission')
        }
    }

    async _onDelete(row) {
        const permission = this.props;
        const res = await deletePermissionAction({
            permission_code: permission.code,
            action_code: row.code,
        });
        if (res) {
            const {actions} = this.props;
            actions.putToastSuccess('Xóa quyền thành công');
            publish(".refresh", {}, 'detailPermission')
        }
    }

    async _onSubmit(data) {
        const res = await savePermissionAction(data);
        if (res) {
            const {actions} = this.props;
            actions.putToastSuccess('Thêm quyền thành công');
            publish(".refresh", {}, 'detailPermission')
        }
    }

    async _onToggleStatus() {
        const {id, actions} = this.props;
        const res = await toggleStatusPermission({id});
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
        }
        publish(".refresh", {}, 'detailPermission');
    }

    render() {
        const {columns} = this.state;
        const permission = this.props;
        const idKey = 'detailPermission';
        return (
            <>
                {permission.status !== 99 && (
                    <>
                        <div className="mt5">
                            <CanRender actionCode={ROLES.auth_permission}>
                                <ButtonCommon idKey={Constant.COMMON_DATA_KEY_permission_status}
                                              value={(permission.status === 1) ? 2 : 1}
                                              onClick={this.onToggleStatus}/>
                            </CanRender>

                            <CanRender actionCode={ROLES.auth_permission}>
                                <button type="button"
                                        className={`el-button el-button-info el-button-small`}
                                        onClick={this.onEditPermission}>
                                    <span>Chỉnh sửa</span>
                                </button>
                            </CanRender>

                            <CanRender actionCode={ROLES.auth_permission}>
                                <button type="button"
                                        className={`el-button el-button-warning el-button-small`}
                                        onClick={this.onDeletePermission}>
                                    <span>Xóa</span>
                                </button>
                            </CanRender>

                        </div>

                        <div className="mt20">
                            <FormBase onSubmit={this.onSubmit}
                                      initialValues={{
                                          permission_code: permission.code,
                                          action_code: [],
                                      }}
                                      validationSchema={
                                          Yup.object().shape({
                                              action_code: Yup.array().required(Constant.MSG_REQUIRED).nullable(),
                                          })
                                      }
                                      FormComponent={() =>
                                          <MySelectFetch
                                              label={"Chọn quyền"}
                                              name="action_code"
                                              fetchApi={getAction}
                                              fetchFilter={{
                                                  execute: true,
                                                  status: Constant.STATUS_ACTIVED,
                                              }}
                                              fetchField={{value: "code", label: "code"}}
                                              isMulti
                                          />
                                      }>
                                <div className="mt15 text-right">
                                    <button type="submit" className="el-button el-button-small el-button-success">Lưu
                                    </button>
                                </div>
                            </FormBase>
                        </div>

                        <div className="mt15">
                            <Gird idKey={idKey}
                                  fetchApi={getAction}
                                  defaultQuery={{
                                      permission_code: this.props.code,
                                      per_page: 100,
                                  }}
                                  columns={columns}
                                  history={{}}
                                  isPushRoute={false}
                                  isRedirectDetail={false}
                                  isPagination={false}
                            />
                        </div>
                    </>
                )}

                {permission.status === 99 && (
                    <span style={{fontSize: "12px"}}>Quyền đã bị xóa!</span>
                )}
            </>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Detail);

