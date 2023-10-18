import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import moment from "moment";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
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
            staff_info: {},
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
        };
        this.refreshList = this._refreshList.bind(this);
        this.onRefresh = this._onRefresh.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_ASSIGNMENT_HISTORY_BY_STAFF, params, delay);
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
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_ASSIGNMENT_HISTORY_BY_STAFF]){
            let response = newProps.api[ConstantURL.API_URL_GET_ASSIGNMENT_HISTORY_BY_STAFF];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ASSIGNMENT_HISTORY_BY_STAFF);
        }
        if (newProps.refresh['StatisticEmployerByStaffPage']){
            let delay = newProps.refresh['StatisticEmployerByStaffPage'].delay ? newProps.refresh['StatisticEmployerByStaffPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('StatisticEmployerByStaffPage');
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
        let params = queryString.parse(window.location.search);
        let from = "---";
        if (params['assigned[from]']){
            from = moment.unix(params['assigned[from]']).format("DD/MM/YYYY");
        }
        let to = "---";
        if (params['assigned[to]']){
            to = moment.unix(params['assigned[to]']).format("DD/MM/YYYY");
        }
        let employer_discharged_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_discharged_reason);
        let employer_premium_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_premium_status);
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="StatisticEmployerByStaffPage" />
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Tài Khoản Xả</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={this.onRefresh}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="sub-title-form crm-section inline-block">
                                    Danh Sách Tài Khoản Bị Xả Của CSKH <span className="textBlack">{params['staff_id']}</span> Từ Ngày {from} Đến Ngày {to}
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            NTD
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Email đăng nhập
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={140}>
                                            Loại tài khoản
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={140}>
                                            Ngày chăm sóc
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={140}>
                                            Ngày xả
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={140}>
                                            Lý do xả
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item,key)=> {
                                                let snapshot_data = JSON.parse(item.snapshot_data);
                                                let reason_title = '';
                                                item.reason.split(",").forEach((i, k) => {
                                                    let reason = employer_discharged_reason[i] ? employer_discharged_reason[i] : i;
                                                    reason_title += k === 0 ? reason : ', ' + reason;
                                                });
                                                let data = {
                                                    employer_name: item.employer_id + ' - ' + item.employer_name,
                                                    employer_email: item.employer_email,
                                                    employer_premium_status: employer_premium_status[item.employer_premium_status] ? employer_premium_status[item.employer_premium_status] : item.employer_premium_status,
                                                    assigning_changed_at: snapshot_data.assigning_changed_at,
                                                    created_at: item.created_at ? moment.unix(item.created_at).format('DD/MM/YYYY HH:mm:ss') : '',
                                                    reason_title: reason_title
                                                };
                                                return(
                                                    <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        {Object.keys(data).map((name) => {
                                                            return(
                                                                <td key={name}>
                                                                    <div className="cell" title={data[name]}>{data[name]}</div>
                                                                </td>
                                                            )
                                                        })}
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
