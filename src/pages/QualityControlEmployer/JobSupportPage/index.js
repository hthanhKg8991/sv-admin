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
import moment from "moment";
import classnames from 'classnames';
import PopupJobSupport from "./Popup/PopupJobSupport";
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
        };
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnReject = this._btnReject.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_JOB_SUPPORT_LIST, params, delay);
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
        this.props.uiAction.createPopup(PopupJobSupport,"Thêm hỗ trợ tin");
    }
    _btnReject(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn hủy đăng ký hổ trợ tin này ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                let args = {
                    id: object.id
                };
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_JOB_SUPPORT_REJECT, args);
                this.props.uiAction.showLoading();
            }
        });
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_JOB_SUPPORT_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_JOB_SUPPORT_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_JOB_SUPPORT_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_JOB_SUPPORT_REJECT]) {
            let response = newProps.api[ConstantURL.API_URL_JOB_SUPPORT_REJECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_JOB_SUPPORT_REJECT);
        }
        if (newProps.refresh['JobSupportPage']){
            let delay = newProps.refresh['JobSupportPage'].delay ? newProps.refresh['JobSupportPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('JobSupportPage');
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
        let job_support_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_support_status);
        let job_support_type = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_support_type);
        let job_support_frequency = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_support_frequency);
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="JobSupportPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Hỗ Trợ Tin</span>
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
                                            <span>Thêm hỗ trợ tin <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Tin tuyển dụng
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Loại đăng ký
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={180}>
                                            Thời gian đăng ký
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Tần suất gửi
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Ngày gửi kế tiếp
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Thông tin gửi cuối
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Thao tác
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                return (
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        <td>
                                                            <div className="cell">{item.job_id} - {item.job_title}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" >{job_support_type[item.type]}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" >{job_support_status[item.status]}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                {moment.unix(item.date_from).format("DD/MM/YYYY")} đến {moment.unix(item.date_to).format("DD/MM/YYYY")}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" >{job_support_frequency[item.frequency]}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" >{utils.getNextRunDate(item.date_from, item.frequency, item.last_send_on, "DD/MM/YYYY")}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                {item.last_send_on && (
                                                                    <div>Lần gửi cuối: {moment.unix(item.last_send_on).format("DD/MM/YYYY")}</div>
                                                                )}
                                                                {item.last_sent_seekers_count && (
                                                                    <div>Số NTV gửi cuối: {item.last_sent_seekers_count}</div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline pointer">
                                                                    <a className="text-bold text-success" target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_QC_JOB_SUPPORT_LOGGING + '?job_id=' + item.job_id}>
                                                                        Lịch sử gửi
                                                                    </a>
                                                                </div>
                                                                <div className="text-underline pointer">
                                                                    <a className="text-bold text-primary" target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_QC_JOB_SUPPORT_PREVIEW + '?job_id=' + item.job_id}>
                                                                        Hồ sơ phù hợp
                                                                    </a>
                                                                </div>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger" onClick={()=>{this.btnReject(item)}}>
                                                                        Hủy đăng ký
                                                                    </span>
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
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
