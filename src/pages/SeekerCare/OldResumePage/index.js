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

class ResumePage extends Component {
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
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        params['status_not'] = Constant.STATUS_DELETED;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_LIST, params, delay);
        this.props.uiAction.showLoading();
        this.setState({itemActive: -1});
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
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_LIST];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_LIST);
        }
        if (newProps.refresh['ResumePage']){
            let delay = newProps.refresh['ResumePage'].delay ? newProps.refresh['ResumePage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('ResumePage');
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
                        <CustomFilter name="ResumePage" />
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-result">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">Danh Sách Hồ Sơ Tìm Việc</span>
                                <div className="right">
                                    <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                        <i className="fa fa-refresh"/>
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="crm-section">
                                    <div className="body-table el-table">
                                        <TableComponent>
                                            <TableHeader tableType="TableHeader" width={140}>
                                                Tiêu đề hồ sơ
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader"  width={160}>
                                                Họ tên
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={130}>
                                                Ngày cập nhật
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Nguồn
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={160}>
                                                CSKH
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={160}>
                                                Trạng thái
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={130}>
                                                Người tạo
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let status = utils.parseStatus(item.status, item.last_revision_status);
                                                let i = {
                                                    title: item.id + ' - ' + item.title,
                                                    seeker_name: item.seeker_info.id + ' - ' + item.seeker_info.name,
                                                    updated_at: moment.unix(item.updated_at).format('DD/MM/YYYY HH:mm:ss'),
                                                    completed_at: item.completed_at ? moment.unix(item.completed_at).format('DD/MM/YYYY HH:mm:ss') : '',
                                                    created_source: item.created_source,
                                                    assigned_staff_login_name: item.seeker_info.assigned_staff_login_name,
                                                    status: seeker_status[status] ? seeker_status[status] : {},
                                                    created_by: item.created_by,
                                                };
                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(item.id) ? "active" : "")} onClick={()=>{this.activeItem(item.id)}}>
                                                            <td>
                                                                <div className="cell" title={i.title}>
                                                                    {parseInt(item.resume_type) === Constant.RESUME_NORMAL_FILE && (<i className="fa fa-paperclip"/>)} {i.title}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={i.seeker_name}>{i.seeker_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={i.updated_at}>{i.updated_at}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={i.created_source}>{i.created_source}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={i.assigned_staff_login_name}>{i.assigned_staff_login_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" style={{color: i.status.text_color}} title={i.status.name}>{i.status.name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={i.created_by}>{i.created_by}</div>
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

export default connect(mapStateToProps,mapDispatchToProps)(ResumePage);
