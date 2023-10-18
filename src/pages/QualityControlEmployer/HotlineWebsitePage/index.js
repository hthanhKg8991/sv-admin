import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupHotlineWebsite from "./Popup/PopupHotlineWebsite";
import PopupHistoryChange from "./Popup/PopupHistoryChange";
import PopupChangeOrderHotline from "./Popup/PopupChangeOrderHotline";
import classnames from 'classnames';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
        };
        this.refreshList = this._refreshList.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnHidden = this._btnHidden.bind(this);
        this.btnShow = this._btnShow.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnHistoryChange = this._btnHistoryChange.bind(this);
        this.btnChangeOrder = this._btnChangeOrder.bind(this);
        this.showPopup = this._showPopup.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        params['order_by[id]'] = 'DESC';
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST, params, delay);
        this.props.uiAction.showLoading();
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupHotlineWebsite, "Thêm Hotline");
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupHotlineWebsite, "Chỉnh Sửa Hotline", {object: object});
    }
    _btnHidden(object){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_HIDDEN, {hotline_id: object.id});
    }
    _btnShow(object){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_SHOW, {hotline_id: object.id});
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa hotline ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_DELETE, {hotline_id: object.id});
            }
        });
    }
    _btnHistoryChange(){
        this.props.uiAction.createPopup(PopupHistoryChange, "Lịch Sử Cập Nhật Hotline");

        let query = queryString.parse(window.location.search);
        query.action_active = 'history';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _btnChangeOrder(){
        this.props.uiAction.createPopup(PopupChangeOrderHotline, "Thay Đổi Vị Trí Hotline");

        let query = queryString.parse(window.location.search);
        query.action_active = 'change';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    _showPopup(){
        let query = queryString.parse(window.location.search);
        if(query.action_active){
            switch (query.action_active){
                case 'change':
                    this.btnHistoryChange();
                    break;
                case 'history':
                    this.btnHistoryChange();
                    break;
                default:
                    break;
            }
        }
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data},()=>{
                    this.showPopup();
                });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_HOTLINE_WEBSITE_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_HIDDEN]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_HIDDEN];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_HIDDEN);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_SHOW]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_SHOW];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_SHOW);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_HOTLINE_WEBSITE_DELETE);
        }
        if (newProps.refresh['HotlineWebsitePage']){
            let delay = newProps.refresh['HotlineWebsitePage'].delay ? newProps.refresh['HotlineWebsitePage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('HotlineWebsitePage');
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
        let visible_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_visible_status);
        let branch_list = utils.convertArrayToObject(this.props.branch.branch_list, 'code');

        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="HotlineWebsitePage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Hotline</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="top-table">
                                    <div className="left">
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                            <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnChangeOrder}>
                                            <span>Thay đổi vị trí</span>
                                        </button>
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnHistoryChange}>
                                            <span>Lịch sử thay đổi</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Email CSKH
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Nhóm
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Chi nhánh
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Hotline
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Thao tác
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let status = parseInt(item.status);
                                                let data = {
                                                    login_name: item.login_name,
                                                    name: item.name,
                                                    branch_code: branch_list[item.branch_code] ? branch_list[item.branch_code].name : item.branch_code,
                                                    displayed: `${item.displayed_name} - ${item.phone}`,
                                                    status: visible_status[status] ? visible_status[status] : status
                                                };
                                                return (
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        {Object.keys(data).map((name, key) => {
                                                            return(
                                                                <td key={key}>
                                                                    <div className="cell" title={data[name]}>{data[name]}</div>
                                                                </td>
                                                            )
                                                        })}
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                                                                </div>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
                                                                </div>
                                                                {parseInt(status) === Constant.VISIBLE_STATUS_SHOW && (
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-primary" onClick={()=>{this.btnHidden(item)}}>Ẩn</span>
                                                                    </div>
                                                                )}
                                                                {parseInt(status) === Constant.VISIBLE_STATUS_HIDE && (
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-success" onClick={()=>{this.btnShow(item)}}>Hiển thị</span>
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
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
