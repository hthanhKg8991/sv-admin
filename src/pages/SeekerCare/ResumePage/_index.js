import React, {Component} from "react";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import Detail from "./Detail";
import PopupSeeker from "./Popup/PopupSeeker";
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
        this.activeItem = this._activeItem.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.onRefresh = this._onRefresh.bind(this);
        this.editSeeker = this._editSeeker.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_SEEKER_LIST, params, delay);
        this.props.uiAction.showLoading();
        this.setState({itemActive: -1});
    }
    _onRefresh(){
        this.props.uiAction.refreshList('SeekerPage');
        this.props.uiAction.refreshList('SeekerGeneralInf');
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
    _btnAdd(event){
        event.preventDefault();
        this.props.uiAction.createPopup(PopupSeeker,"Thêm Người Tìm Việc");
    }
    _editSeeker(id){
        this.props.uiAction.createPopup(PopupSeeker, "Chỉnh Sửa Người Tìm Việc",{object: {id: id}});
    }
    componentWillMount(){
        let query = queryString.parse(window.location.search);
        if (query.seeker_id && query.show_popup){
            this.editSeeker(query.seeker_id)
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_SEEKER_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_SEEKER_LIST];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SEEKER_LIST);
        }
        if (newProps.refresh['SeekerPage']){
            let delay = newProps.refresh['SeekerPage'].delay ? newProps.refresh['SeekerPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('SeekerPage');
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
        let seeker_status = utils.convertObjectValueCommonDataFull(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
        return (
                <div className="row-body">
                    <div className="col-search">
                        <CustomFilter name="SeekerPage"/>
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-result">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">Danh Sách Người Tìm Việc</span>
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
                                                <span>Thêm NTV <i className="glyphicon glyphicon-plus"/></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="body-table el-table">
                                        <TableComponent>
                                            <TableHeader tableType="TableHeader" width={140}>
                                                Họ tên
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={160}>
                                                Email
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={130}>
                                                Điện thoại liên hệ
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={130}>
                                                Ngày đăng ký
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={160}>
                                                Đăng nhập gần nhất
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader"  width={160}>
                                                Trạng thái tài khoản
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={130}>
                                                Hỗ trợ NTV
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                {data_list.map((item, key)=> {
                                                    let status = item.status;
                                                    let last_revision_status = item.last_revision_status;
                                                    if (parseInt(status) === Constant.STATUS_ACTIVED && [Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(last_revision_status))){
                                                        status = String(status) + String(last_revision_status);
                                                    }
                                                    let i = {
                                                        name: item.id + ' - ' + item.name,
                                                        email: item.email,
                                                        mobile: item.mobile,
                                                        created_at: moment.unix(item.created_at).format('DD/MM/YYYY HH:mm:ss'),
                                                        logined_at: item.logined_at ? moment.unix(item.logined_at).format('DD/MM/YYYY HH:mm:ss') : '',
                                                        status: seeker_status[status] ? seeker_status[status] : {},
                                                        assigned_staff_username: item.assigned_staff_login_name,
                                                    };
                                                    return (
                                                            <React.Fragment key={key}>
                                                                <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(item.id) ? "active" : "")} onClick={()=>{this.activeItem(item.id)}}>
                                                                    <td>
                                                                        <div className="cell" title={i.name}>{i.name}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell" title={i.email}>{i.email}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell" title={i.mobile}>{i.mobile}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell" title={i.created_at}>{i.created_at}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell" title={i.logined_at}>{i.logined_at}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell" style={{color: i.status.text_color}} title={i.status.name}>{i.status.name}</div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell" title={i.assigned_staff_username}>{i.assigned_staff_username}</div>
                                                                    </td>
                                                                </tr>
                                                                {String(itemActive) === String(item.id) && (
                                                                        <tr className="el-table-item">
                                                                            <td colSpan={7}>
                                                                                <Detail {...item} history={this.props.history}/>
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
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
