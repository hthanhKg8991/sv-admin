import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import config from 'config';
import queryString from 'query-string';
import moment from "moment";
import PlanDailyRevenueTeam from "./PlanDailyRevenueTeam";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import CanRender from 'components/Common/Ui/CanRender';
import ROLES from 'utils/ConstantActionCode';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            itemActive: {},
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
        };
        this.onRefresh = this._onRefresh.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.exportReport = this._exportReport.bind(this);
        this.sendReport = this._sendReport.bind(this);
    }
    _onRefresh(){
        this.refreshList();
    }
    _refreshList(delay = 0, update = false){
        if (!update){
            this.setState({itemActive: {}});
            this.props.uiAction.showLoading();
        }
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_DATE_LIST, params, delay);
    }
    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
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
    _exportReport(){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_EXPORT, params);
        this.props.uiAction.showLoading();
    }
    _sendReport(){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_REPORT, params);
        this.props.uiAction.showLoading();
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_DATE_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_DATE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_DATE_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_EXPORT]) {
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_EXPORT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                if (response.data) {
                    window.open(response.data);
                }
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_EXPORT);
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_REPORT]) {
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_REPORT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_REPORT);
        }
        if (newProps.refresh['PlanDailyRevenuePage']){
            let refresh = newProps.refresh['PlanDailyRevenuePage'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay, refresh.update);
            this.props.uiAction.deleteRefreshList('PlanDailyRevenuePage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data_list, itemActive} = this.state;
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="PlanDailyRevenuePage" />
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Doanh Thu Hằng Ngày</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={this.onRefresh}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="top-table">
                                    <div className="left">
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.exportReport}>
                                            <span>Xuất excel</span>
                                        </button>
                                    </div>
                                    <CanRender actionCode={ROLES.customer_care_daily_revenue_report}>
                                        <div className="left">
                                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.sendReport}>
                                                <span>Gửi báo cáo</span>
                                            </button>
                                        </div>
                                    </CanRender>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader"  width={450}>
                                            CSKH
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader"  width={150}>
                                            Tổng số phiếu
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Tổng giá trị
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item,key) => {
                                                return(
                                                    <React.Fragment key={key}>
                                                        <tr className="tr-center text-bold tr-body tr-bgColorBisque pointer" onClick={()=>{this.activeItem(item.date)}}>
                                                            <td>
                                                                <div className="cell">{moment.unix(item.date).format("DD/MM/YYYY")}</div>
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="cell">{utils.formatNumber(item.total_achievement,0,".","")}</div>
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="cell">{utils.formatNumber(item.total_revenue,0,".","")}</div>
                                                            </td>
                                                        </tr>
                                                        {itemActive[item.date] && (
                                                            <PlanDailyRevenueTeam colSpan={3} {...item}/>
                                                        )}
                                                    </React.Fragment>
                                                );
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
