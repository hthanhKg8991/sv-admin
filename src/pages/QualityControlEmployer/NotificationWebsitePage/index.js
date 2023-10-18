import React, {Component} from "react";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import ComponentFilter from "./ComponentFilter";
import config from 'config';
import moment from "moment";
import classnames from 'classnames';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {duplicateNotification} from "api/system";
import PopupNotificationWebsite from "pages/QualityControlEmployer/NotificationWebsitePage/Popup/PopupNotificationWebsite";
import PopupViewNotification from "pages/QualityControlEmployer/NotificationWebsitePage/Popup/PopupViewNotification";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
        };
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnChangeStatus = this._btnChangeStatus.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.onClosePopup = this._onClosePopup.bind(this);
        this.reqChangeStatus = this._reqChangeStatus.bind(this);
        this.btnDuplicate = this._btnDuplicate.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_AUTH_NOTIFICATION, params, delay);
        this.props.uiAction.showLoading();
    }
    _changePage(newpage){
        this.setState({page: newpage},()=>{
            this.refreshList();
        });
    }
    _changePerPage(newperpage){
        this.setState({page: 1});
        this.setState({per_page: newperpage},()=>{
            this.refreshList();
        });
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupNotificationWebsite, "Thêm Thông Báo", {
            isEdit: false,
            fnDelete: this.btnDelete
        });
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupNotificationWebsite, "Chỉnh Sửa Thông Báo", {
            isEdit: true,
            object: object,
            fnDelete: this.btnDelete,
            fnDuplicate: this.btnDuplicate
        });
    }
     async _btnDuplicate(object){
        const {uiAction} = this.props;
        const res = await duplicateNotification({notification_id: object.id});
         if(res) {
             uiAction.putToastSuccess("Sao Chép Thông Báo Thành Công");
             this._onClosePopup();
             this.refreshList();
        }
    }
    _btnChangeStatus(object, status){
        if(status === Constant.STATUS_ACTIVED) {
            this.props.uiAction.createPopup(PopupViewNotification, "Kích Hoạt Thông Báo", {
                object: object,
                status:status,
                fnReqChangeStatus: this.reqChangeStatus,
                fnClosePopup: this.onClosePopup,
            })
        } else {
            this._reqChangeStatus(object, status);
        }
    }
    _reqChangeStatus(object, status) {
        this.props.uiAction.showLoading();
        let args = {
            id: object.id,
            status: status
        };
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_AUTH_NOTIFICATION_STATUS, args);
    }
    _onClosePopup() {
        this.props.uiAction.deletePopup();
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa thông báo ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_AUTH_NOTIFICATION_DELETE, {id: object.id});
            }
        });
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_NOTIFICATION]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_NOTIFICATION];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_NOTIFICATION);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_STATUS]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_STATUS];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_NOTIFICATION_STATUS);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_NOTIFICATION_DELETE);
        }
        if (newProps.refresh['NotificationWebsitePage']){
            let delay = newProps.refresh['NotificationWebsitePage'].delay ? newProps.refresh['NotificationWebsitePage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('NotificationWebsitePage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {data_list} = this.state;
        let notify_obj = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_notification_object);
        let notify_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_notification_status);
        let channel_list = this.props.sys.channel ? utils.convertArrayToObject(this.props.sys.channel.items, 'code') : {};

        return (
                <div className="row-body">
                    <div className="col-search">
                        <CustomFilter name="NotificationWebsitePage"/>
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-result">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">Danh Sách Thông Báo Đến Website</span>
                                <div className="right">
                                    <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                        <i className="fa fa-refresh"/>
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="crm-section">
                                    <div className="top-table">
                                        <div className="left btnCreateNTD">
                                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                                <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="body-table el-table">
                                        <TableComponent>
                                            <TableHeader tableType="TableHeader" width={120}>
                                                Tiêu đề
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={120}>
                                                Ngày tạo
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={120}>
                                                Ngày cập nhật
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={120}>
                                                Đối tượng
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Trạng thái
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={120}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                {data_list.map((item, key) => {
                                                    let status = parseInt(item.status);
                                                    let data = {
                                                        title: item.title,
                                                        channel_code: channel_list[item.channel_code] ? channel_list[item.channel_code].display_name : item.channel_code,
                                                        active_at: item.active_at ? moment.unix(item.active_at).format("DD/MM/YYYY") : '',
                                                        created_at: item.created_at ? moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss") : '',
                                                        updated_at: item.updated_at ? moment.unix(item.updated_at).format("DD/MM/YYYY HH:mm:ss") : '',
                                                        expired_at: item.expired_at ? moment.unix(item.expired_at).format("DD/MM/YYYY") : '',
                                                        notify_object: notify_obj[item.notify_object] ? notify_obj[item.notify_object] : item.notify_object,
                                                        notify_status: notify_status[item.status] ? notify_status[item.status] : item.status,
                                                    };
                                                    return (
                                                        <tr key={key} className={classnames("el-table-row", key % 2 !== 0 ? "tr-background" : "")}>
                                                            <td>
                                                                <div className="cell" title={data.title}>{data.title}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.created_at}>{data.created_at}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.updated_at}>{data.updated_at}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.notify_object}>{data.notify_object}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.notify_status}>{data.notify_status}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">
                                                                    <div className="text-underline pointer">
                                                                            <span className="text-bold text-primary"
                                                                                  onClick={() => {
                                                                                      this.btnEdit(item)
                                                                                  }}>Chỉnh sửa</span>
                                                                    </div>
                                                                    {Constant.STATUS_INACTIVED === status && (
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-success" onClick={()=>{this.btnChangeStatus(item, Constant.STATUS_ACTIVED)}}>Hoạt động</span>
                                                                        </div>
                                                                    )}
                                                                    {Constant.STATUS_ACTIVED === status && (
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-danger" onClick={()=>{this.btnChangeStatus(item, Constant.STATUS_INACTIVED)}}>Ngưng hoạt động</span>
                                                                        </div>
                                                                    )}
                                                                    {Constant.STATUS_INACTIVED === status && (
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </TableBody>
                                        </TableComponent>
                                    </div>
                                </div>
                                <div className="crm-section">
                                    <Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={true}/>
                                </div>
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
        refresh: state.refresh,
        sys: state.sys,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
