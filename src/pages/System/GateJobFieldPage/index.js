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
import PopupGateJobField from './Popup/PopupGateJobField';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";

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
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_GATE_JOB_FIELD_LIST, params, delay);
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
        this.props.uiAction.createPopup(PopupGateJobField, "Thêm Ngành Cổng");
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_GATE_JOB_FIELD_DELETE, {id: object.id});
                this.props.uiAction.showLoading();
            }
        });
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_GATE_JOB_FIELD_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_GATE_JOB_FIELD_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_GATE_JOB_FIELD_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_GATE_JOB_FIELD_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_GATE_JOB_FIELD_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_GATE_JOB_FIELD_DELETE);
        }
        if (newProps.refresh['GateJobFieldPage']){
            let delay = newProps.refresh['GateJobFieldPage'].delay ? newProps.refresh['GateJobFieldPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('GateJobFieldPage');
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
                        <CustomFilter name="TemplateMailPage"/>
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-result">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">Danh Sách Ngành Theo Cổng</span>
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
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Mã cổng
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Tên cổng
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={80}>
                                                ID ngành
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Mã ngành
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Tên ngành
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Ngày tạo
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let data = {
                                                    gate_code: item.gate_code,
                                                    gate_name: item.gate_name,
                                                    job_field_id: item.job_field_id,
                                                    job_field_code: item.job_field_code,
                                                    job_field_name: item.job_field_name,
                                                    created_at: item.created_at ? moment.unix(item.created_at).format('DD/MM/YYYY HH:mm:ss') : ''
                                                };
                                                return (
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        <td>
                                                            <div className="cell" title={data.gate_code}>{data.gate_code}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.gate_name}>{data.gate_name}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.job_field_id}>{data.job_field_id}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.job_field_code}>{data.job_field_code}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.job_field_name}>{data.job_field_name}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.created_at}>{data.created_at}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline">
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
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
