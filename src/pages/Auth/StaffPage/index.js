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
import Detail from "./Detail";
import PopupStaff from "./Popup/PopupStaff";
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
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
            division_list: [],
            itemActive: -1
        };
        this.refreshList = this._refreshList.bind(this);
        this.onRefresh = this._onRefresh.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, params, delay);
        this.props.uiAction.showLoading();
    }
    _onRefresh(){
        this.refreshList();
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
    _activeItem(key){
        let check = this.state.data_list.filter(c => String(c.id) === String(key));

        let itemActive = this.state.itemActive;
        itemActive = String(itemActive) && check.length ? key : -1;
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
    _btnAdd(){
        this.props.uiAction.createPopup(PopupStaff,"Thêm Người Dùng");
    }
    componentDidMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({division_list: response.data});
            }
        }
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }
        if (newProps.refresh['StaffPage']){
            let delay = newProps.refresh['StaffPage'].delay ? newProps.refresh['StaffPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('StaffPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data_list, division_list, itemActive, per_page, page, pagination_data} = this.state;
        let division_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_division_status);
        
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="StaffPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Người Dùng</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={this.onRefresh}>
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
                                            Mã nhân viên
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Tên đăng nhập
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Tên hiển thị
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Email
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Điện thoại
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Bộ phận
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let division = division_list.filter(c => c.code === item.division_code);
                                                let division_name = item.division_code;
                                                if (division.length){
                                                    division_name = division[0].full_name;
                                                }
                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(item.id) ? "active" : "")} 
                                                            onClick={()=>{this.activeItem(item.id == itemActive ? -1 : item.id)}}
                                                        >
                                                            <td>
                                                                <div className="cell" title={item.code}>{item.code}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={item.login_name}>{item.login_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={item.display_name}>{item.display_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={item.email}>{item.email}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={item.phone}>{item.phone}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={division_name}>{division_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={division_status[item.status]}>{division_status[item.status]}</div>
                                                            </td>
                                                        </tr>
                                                        {String(itemActive) === String(item.id) && (
                                                            <tr className="el-table-item">
                                                                <td colSpan={6}>
                                                                    <Detail object={item} history={this.props.history}/>
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
