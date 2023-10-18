import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupCustomerService from "../Popup/PopupCustomerService";
import PopupAddMember from "../Popup/PopupAddMember";
import PopupEditMember from "../Popup/PopupEditMember";
import config from 'config';
import classnames from 'classnames';
import moment from "moment";
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
        this.btnEditMember = this._btnEditMember.bind(this);
        this.btnDeleteMember = this._btnDeleteMember.bind(this);
        this.btnActive = this._btnActive.bind(this);
        this.btnInActive = this._btnInActive.bind(this);
        this.changeRole = this._changeRole.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }
    _refreshList(delay = 0){
        let args = {
            team_id: this.state.item.id,
            page: this.state.page,
            per_page: this.state.per_page,
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL, args, delay);
    }
    _btnEdit(){
        this.props.uiAction.createPopup(PopupCustomerService, "Chỉnh Sửa Nhóm CSKH", {object: this.props.item});

        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnAddMember(){
        this.props.uiAction.createPopup(PopupAddMember, "Thêm CSKH Vào Nhóm", {
            object: {team_id: this.state.item.id}
        });
    }

    _btnEditMember(item){
        this.props.uiAction.createPopup(PopupEditMember, "Cập Nhật Thành Viên Nhóm", {object: item});
    }

    _btnDeleteMember(member){
        let args = {
            staff_id: member.id,
            team_id: this.state.item.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_KICK_STAFF, args);
    }
    _btnActive(){
        let args = {
            team_id: this.state.item.id
        };
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_ACTIVE, args);
    }
    _btnInActive(){
        let args = {
            team_id: this.state.item.id
        };
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_LOCK, args);
    }
    _changeRole(value, name, item){
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
        let {data_list} = this.state;
        let index = _.findIndex(data_list, function(o){
            return parseInt(o.id) !== parseInt(id) && role === Constant.TEAM_ROLE_LEADER && o.team_role === role;
        });
        if (index >= 0) {
            return true;
        } else {
            return false;
        }
    }

    _showPopup(){
        let query = queryString.parse(window.location.search);
        if(query.action_active){
            switch (query.action_active){
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
    componentWillMount(){
        this.refreshList();
        this.showPopup();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_KICK_STAFF]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_KICK_STAFF];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_TEAM_KICK_STAFF);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_ACTIVE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_ACTIVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('CustomerServicePage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_TEAM_ACTIVE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_LOCK]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_LOCK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('CustomerServicePage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_TEAM_LOCK);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_CHANGE_ROLE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_CHANGE_ROLE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.refreshList('CustomerServiceDetail');
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }else{
                this.forceUpdate();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_CHANGE_ROLE);
        }
        if (newProps.refresh['CustomerServiceDetail']){
            let delay = newProps.refresh['CustomerServiceDetail'].delay ? newProps.refresh['CustomerServiceDetail'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('CustomerServiceDetail');
        }
        this.setState({item: newProps.item});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {data_list, loading, item} = this.state;
        let status = parseInt(item.status);
        let keyPress = ["1"];
        if(status){
            if ([Constant.STATUS_INACTIVED].includes(status)) {
                keyPress.push("2");
            }
            if ([Constant.STATUS_ACTIVED].includes(status)) {
                keyPress.push("3");
            }
        }
        let roleList = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_role_name);
        let staffLevelList = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_staff_level);
        return (
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 crm-section">
                            {status === Constant.STATUS_ACTIVED && (
                                <div className="top-table">
                                    <div className="left">
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAddMember}>
                                            <span>Thêm CSKH <i className="glyphicon glyphicon-plus"/></span>
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
                                    <TableHeader tableType="TableHeader" width={200}>
                                        Nhóm viên
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader"  width={150}>
                                        Role
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Cấp bậc
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Ngày vào nhóm
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Thao tác
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {data_list.map((member, key)=> {
                                            let item = {
                                                ...member,
                                                staff_id : member.id
                                            };
                                            return(
                                                <tr key={key} className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
                                                    <td>
                                                        <div className="cell" title={member.login_name}>{member.login_name}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={roleList[member.team_role]}>{roleList[member.team_role]}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell" title={staffLevelList[member.customer_care_level]}>{staffLevelList[member.customer_care_level]}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">{moment.unix(member.created_at).format('DD/MM/YYYY')}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-primary" onClick={()=>{this.btnEditMember(item)}}>Chỉnh sửa</span>
                                                            </div>
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-danger" onClick={()=>{this.btnDeleteMember(member)}}>Xóa</span>
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
                        <div className="col-sm-12 col-xs-12">
                            {keyPress.includes("1")&& (
                                <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnEdit}>
                                    <span>Chỉnh sửa</span>
                                </button>
                            )}
                            {keyPress.includes("2")&& (
                                <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnActive}>
                                    <span>Kích hoạt</span>
                                </button>
                            )}
                            {keyPress.includes("3")&& (
                                <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnInActive}>
                                    <span>Ngưng hoạt động</span>
                                </button>
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

export default connect(mapStateToProps,mapDispatchToProps)(index);
