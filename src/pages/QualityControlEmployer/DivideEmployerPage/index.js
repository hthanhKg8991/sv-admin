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
import Pagination from "components/Common/Ui/Pagination";
import moment from "moment/moment";
import classnames from 'classnames';
import PopupDivideEmployer from "./Popup/PopupDivideEmployer";
import Detail from "./Detail";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";

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
        this.btnDelete = this._btnDelete.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_TOOL_SHARE_ACCOUNT_LIST, params, delay);
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
        this.props.uiAction.createPopup(PopupDivideEmployer, "Đăng Ký Chia Tài Khoản");
    }
    _btnDelete(item){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn hủy đăng ký ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_DELETE, {id: item.id});
            }
        });
    }
    _activeItem(key){
        let check = this.state.data_list.filter(c => String(c.id) === String(key));

        let itemActive = this.state.itemActive;
        itemActive = String(itemActive) !== String(key) && check.length ? key : -1;
        this.setState({itemActive: itemActive});

        let query = queryString.parse(window.location.search);
        if(itemActive !== -1){
            query.item_active = key;
        }else{
            delete query.item_active;
            delete query.action_active;
        }
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TOOL_SHARE_ACCOUNT_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_TOOL_SHARE_ACCOUNT_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list = response.data && response.data.items ? response.data.items : [];
                this.setState({data_list: data_list},()=>{
                    let query = queryString.parse(window.location.search);
                    if(query.item_active){
                        this.activeItem(query.item_active);
                    }
                });
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TOOL_SHARE_ACCOUNT_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_TOOL_SHARE_ACCOUNT_DELETE);
        }
        if (newProps.refresh['DivideEmployerPage']){
            let delay = newProps.refresh['DivideEmployerPage'].delay ? newProps.refresh['DivideEmployerPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('DivideEmployerPage');
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
        let {data_list, itemActive, per_page, page, pagination_data} = this.state;
        let branch_list = utils.convertArrayToObject(this.props.branch.branch_list, 'code');
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="DivideEmployerPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Đăng Ký Chia Tài Khoản</span>
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
                                            <span>Đăng ký chia tài khoản <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Ngày đăng ký
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={300}>
                                            Người đăng ký
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={300}>
                                            Chi nhánh
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
                                                    created_at: moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
                                                    created_by: item.created_by,
                                                    branch_code: branch_list[item.branch_code] ? branch_list[item.branch_code].name : item.branch_code,
                                                    status: item?.status,
                                                };
                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr onClick={()=>{this.activeItem(item.id)}} className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(item.id) ? "active" : "")}>
                                                            <td>
                                                                <div className="cell" title={data.created_at}>{data.created_at}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.created_by}>{data.created_by}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.branch_code}>{data.branch_code}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">
                                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_divide_status} value={status}/>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">
                                                                    {[Constant.STATUS_INACTIVED].includes(status) && (
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Hủy</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {String(itemActive) === String(item.id) && (
                                                            <tr className="el-table-item">
                                                                <td colSpan={5}>
                                                                    <Detail {...item}/>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </TableBody>
                                    </TableComponent>
                                </div>
                            </div>
                            <div className="crm-section">
                                <Pagination per_page={per_page} page={page} data={pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={true}/>
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
