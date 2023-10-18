import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupCustomerService from "../Popup/PopupCustomerService";
import PopupAddMember from "../Popup/PopupAddMember";

import config from 'config';
import classnames from 'classnames';

import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import _ from "lodash";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            item: props.item
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnAddMember = this._btnAddMember.bind(this);
        this.btnDeleteMember = this._btnDeleteMember.bind(this);
        this.btnActive = this._btnActive.bind(this);
        this.btnInActive = this._btnInActive.bind(this);
        this.changeRole = this._changeRole.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }
    _refreshList(delay = 0) {
        let args = {
            team_id: this.state.item.id,
            page: this.state.page,
            per_page: this.state.per_page,
        };
        this.setState({ loading: true });
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_DETAIL, args, delay);
    }
    _btnEdit() {
        this.props.uiAction.createPopup(PopupCustomerService, "Chỉnh Sửa Nhóm CSKH", { object: this.props.item });

        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnAddMember() {
        this.props.uiAction.createPopup(PopupAddMember, "Thêm CSKH Vào Nhóm", {
            team_id: this.state.item.id,
            idKey: this.props.idKey,
            refreshList: () => this.refreshList()
        });
    }

    _btnDeleteMember(member) {
        this.props.uiAction.SmartMessageBox({
            title: `Bạn có chắc muốn xóa nhân viên Id: ${member.id_assignment}`,
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                let args = {
                    id: member.id_assignment,
                    status: Constant.STATUS_DELETED
                };
                this.setState({ loading: true });
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_STAFF_CHANGE_STATUS, args);
            }
        });

    }
    _btnActive() {
        let args = {
            team_id: this.state.item.id
        };
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_ACTIVE, args);
    }
    _btnInActive() {
        let args = {
            team_id: this.state.item.id
        };
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_LOCK, args);
    }
    _changeRole(value, name, item) {
        if (this.checkExitRoleLeader(item.id, value)) {
            this.forceUpdate();
            this.props.uiAction.putToastWarning("Nhóm đã tồn tại nhóm trưởng.!");
            return;
        }
        let args = {
            staff_id: item.id,
            team_role: value,
            team_id: this.state.item.id
        };
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_CHANGE_ROLE, args);
    }

    checkExitRoleLeader(id, role) {
        let { data_list } = this.state;
        let index = _.findIndex(data_list, function (o) {
            return parseInt(o.id) !== parseInt(id) && role === Constant.TEAM_ROLE_LEADER && o.team_role === role;
        });
        if (index >= 0) {
            return true;
        } else {
            return false;
        }
    }

    _showPopup() {
        let query = queryString.parse(window.location.search);
        if (query.action_active) {
            switch (query.action_active) {
                case 'edit':
                    this.btnEdit();
                    break;
                case 'history':
                    this.btnHistory();
                    break;
                default:
                    break;
            }
        }
    }
    componentWillMount() {
        this.refreshList();
        this.showPopup();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({ data_list: response.data });
            }
            this.setState({ loading: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_DETAIL);
        }

        if (newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_STAFF_CHANGE_STATUS]) {
            let response = newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_STAFF_CHANGE_STATUS];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.hideSmartMessageBox();
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.setState({ loading: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_STAFF_CHANGE_STATUS);
        }

        this.setState({ item: newProps.item });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render() {
        let { data_list, loading, item } = this.state;
        let status = parseInt(item.status);
        let keyPress = ["1"];
        if (status) {
            if ([Constant.STATUS_INACTIVED].includes(status)) {
                keyPress.push("2");
            }
            if ([Constant.STATUS_ACTIVED].includes(status)) {
                keyPress.push("3");
            }
        }
        let roleList = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_role_name);

        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 crm-section">
                            {status === Constant.STATUS_ACTIVED && (
                                <div className="top-table">
                                    <div className="left">
                                        <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnAddMember}>
                                            <span>Thêm CSKH <i className="glyphicon glyphicon-plus" /></span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {loading ? (
                                <div className="text-center">
                                    <LoadingSmall />
                                </div>
                            ) : (
                                <TableComponent DragScroll={false}>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Id
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Mã nhân viên
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Tên đăng nhập
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Email
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Role
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Hành động
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {data_list.map((member, key) => {
                                            return (
                                                <tr key={key} className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
                                                    <td>
                                                        <div className="cell" title={member.id}>{member.id_assignment}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={member.staff_code}>{member.staff_code}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={member.name}>{member.staff_username}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={member.staff_status}>{member.staff_username}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">{roleList[member.role]}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell d-flex">
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-red" onClick={() => { this.btnDeleteMember(member) }}>Xóa</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
