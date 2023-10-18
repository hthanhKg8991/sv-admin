import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import CustomFilter from "components/Common/Ui/CustomFilter";
import ComponentFilter from "./ComponentFilter";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import PopupScoring from './Popup/PopupScoring';
import config from 'config';
import classnames from 'classnames';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";

class QaMasterScoringPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
        };
        this.onRefresh = this._onRefresh.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
    }
    _onRefresh(){
        this.refreshList();
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_MASTER_SCORING_LIST, params, delay);
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
        this.props.uiAction.createPopup(PopupScoring,"Thêm Bảng Tiêu Chuẩn Đánh Giá");
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupScoring,"Sửa Bảng Tiêu Chuẩn Đánh Giá", {object:object});
    }
    _btnApprove(object, status){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn chuyển trạng thái hoạt động bản giảm giá ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                let args = {
                    master_scoring_id: object.master_scoring_id,
                    active_status: status
                };
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_MASTER_SCORING_STATUS_UPDATE, args);
                this.props.uiAction.showLoading();
            }
        });
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_MASTER_SCORING_LIST]){
            let response = newProps.api[ConstantURL.API_URL_CALL_MASTER_SCORING_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_MASTER_SCORING_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_MASTER_SCORING_STATUS_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_CALL_MASTER_SCORING_STATUS_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_MASTER_SCORING_STATUS_UPDATE);
        }
        if (newProps.refresh['CallMasterScoringPage']){
            let delay = newProps.refresh['CallMasterScoringPage'].delay ? newProps.refresh['CallMasterScoringPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('CallMasterScoringPage');
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
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="CallMasterScoringPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Tiêu Chí Chấm Điểm</span>
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
                                            <span>Thêm Tiêu Chí Chấm Điểm <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Nhóm cấp 1
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Nhóm cấp 2
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={180}>
                                            Tiêu chí
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={110}>
                                            Giá trị
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Thao tác
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item,key)=>{
                                                return(
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        <td>
                                                            <div className="cell" title={item.group1_title}>{item.group1_title}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={item.group2_title}>{item.group2_title}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={item.content}>{item.content}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell text-right" title={item.target_score}>{item.target_score}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>
                                                                        Chỉnh sửa
                                                                    </span>
                                                                </div>
                                                                {parseInt(item.active_status) === Constant.STATUS_INACTIVED && (
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-success" onClick={()=>{this.btnApprove(item, Constant.STATUS_ACTIVED)}}>Hoạt động</span>
                                                                    </div>
                                                                )}
                                                                {parseInt(item.active_status) === Constant.STATUS_ACTIVED && (
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-danger" onClick={()=>{this.btnApprove(item, Constant.STATUS_INACTIVED)}}>Ngưng hoạt động</span>
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
        refresh: state.refresh,
        api: state.api,
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

export default connect(mapStateToProps,mapDispatchToProps)(QaMasterScoringPage);
