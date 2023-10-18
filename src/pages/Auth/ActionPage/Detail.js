import React, {Component} from "react";
import {
    toggleStatusAction,
    deleteAction
} from "api/auth";
import {bindActionCreators} from "redux";
import {putToastSuccess} from "actions/uiAction";
import {connect} from "react-redux";
import {publish} from "utils/event";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import FormPermission from "pages/Auth/ActionPage/Popup/FormPermission";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import ButtonCommon from "components/Common/Ui/ButtonCommon";

class Detail extends Component {
    constructor(props) {
        super(props);
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
        const res = await deleteAction({id: permission.id});
        if (res) {
            const {actions} = this.props;
            actions.putToastSuccess('Xóa quyền thành công');
            publish(".refresh", {}, 'ActionList')
        }
    }

    async _onToggleStatus() {
        const {id, actions} = this.props;
        const res = await toggleStatusAction({id});
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
        }
        publish(".refresh", {}, 'ActionList');
    }

    render() {
        const permission = this.props;
        return (
            <>
                {permission.status !== 99 && (
                    <>
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

