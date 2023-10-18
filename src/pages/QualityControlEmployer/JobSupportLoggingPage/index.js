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
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_JOB_SUPPORT_LOGGING_LIST, params, delay);
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
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_JOB_SUPPORT_LOGGING_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_JOB_SUPPORT_LOGGING_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_JOB_SUPPORT_LOGGING_LIST);
        }
        if (newProps.refresh['JobSupportLoggingPage']){
            let delay = newProps.refresh['JobSupportLoggingPage'].delay ? newProps.refresh['JobSupportLoggingPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('JobSupportLoggingPage');
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
        let job_support_log_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_support_log_status);
        let params = queryString.parse(window.location.search);
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="JobSupportLoggingPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Lịch Sử Gửi Hỗ Trợ Tin</span>
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
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Tin tuyển dụng
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Ngày gửi
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Campaign
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Số lượng NTV đã gửi
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Thời gian ghi nhận
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Thao tác
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                return (
                                                    <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        <td>
                                                            <div className="cell">{item.job_id} - {item.job_title}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{moment.unix(item.date).format("DD/MM/YYYY")}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{item.campaign}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{job_support_log_status[item.seeker_id]}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell text-right">{utils.formatNumber(item.seekers_count, 0, ".", "")}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">{moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss")}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline pointer">
                                                                    <a className="text-bold text-primary" target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_QC_JOB_SUPPORT_TRACKING + "?job_id=" + params['job_id'] + '&campaign=' + item.campaign}>
                                                                        Chi tiết
                                                                    </a>
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
