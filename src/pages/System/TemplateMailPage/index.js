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
import PopupTemplateMail from './Popup/PopupTemplateMail';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {subscribe} from "utils/event";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.refreshList();
            });
        }, props.idKey));

        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
    }
    _refreshList(delay = 0){
        const {uiAction, apiAction} = this.props;
        const {page, per_page} = this.state;
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : page;
        params['per_page'] = params['per_page'] ? params['per_page'] : per_page;
        apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_TEMPLATE_MAIL_LIST, params, delay);
        uiAction.showLoading();
    }
    _changePage(newpage){
        this.setState({page: newpage},()=>{
            this.refreshList();
        });
    }
    _changePerPage(newPerPage){
        this.setState({page: 1});
        this.setState({per_page: newPerPage},()=>{
            this.refreshList();
        });
    }
    _btnAdd(){
        const {uiAction, idKey} = this.props;
        uiAction.createPopup(PopupTemplateMail, "Thêm Mail", {idKey: idKey});
    }
    _btnEdit(object){
        const {uiAction, idKey} = this.props;
        uiAction.createPopup(PopupTemplateMail, "Chỉnh Sửa Mail", {object, idKey: idKey});
    }
    _btnDelete(object){
        const {uiAction, apiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa mail này ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                apiAction.requestApi(
                    apiFn.fnPost,
                    config.apiSystemDomain,
                    ConstantURL.API_URL_GET_TEMPLATE_MAIL_DELETE,
                    {email_template_id: object.id}
                    );
                uiAction.showLoading();
            }
        });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEMPLATE_MAIL_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEMPLATE_MAIL_DELETE);
        }
        if (newProps.refresh['TemplateMailPage']){
            let delay = newProps.refresh['TemplateMailPage'].delay ? newProps.refresh['TemplateMailPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('TemplateMailPage');
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
        let email_template_type = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_email_template_type);
        let channel_list = this.props.sys.channel ? utils.convertArrayToObject(this.props.sys.channel.items, 'code') : {};
        return (
                <div className="row-body">
                    <div className="col-search">
                        <CustomFilter name="TemplateMailPage"/>
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-result">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">Danh Sách Template Email</span>
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
                                            <TableHeader tableType="TableHeader" width={220}>
                                                Tên email
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Tiêu đề
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Ngày tạo
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Ngày cập nhật
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Loại
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Kênh
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let data = {
                                                    code: item.code,
                                                    subject: item.subject,
                                                    created_at: item.created_at ? moment.unix(item.created_at).format('DD/MM/YYYY HH:mm:ss') : '',
                                                    updated_at: item.updated_at ? moment.unix(item.updated_at).format('DD/MM/YYYY HH:mm:ss') : '',
                                                    email_type: email_template_type[item.email_type] ? email_template_type[item.email_type] : item.email_type,
                                                    channel_code: channel_list[item.channel_code] ? channel_list[item.channel_code].display_name : (item.channel_code === "all" ? "Tất cả kênh" : item.channel_code)
                                                };
                                                return (
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        <td>
                                                            <div className="cell" title={data.code}>{data.code}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.subject}>{data.subject}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.created_at}>{data.created_at}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.updated_at}>{data.updated_at}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.email_type}>{data.email_type}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.channel_code}>{data.channel_code}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline">
                                                                    <span className="text-bold mr10 text-primary pointer" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                                                                    <span className="text-bold text-danger pointer" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
                                                                </div>
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
