import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import PopupPlanDailyRevenue from "./Popup/PopupPlanDailyRevenue";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import classnames from 'classnames';
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanDailyRevenueMemberDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            page:1,
            per_page:5,
            pagination_data:{},
        };
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.refreshList = this._refreshList.bind(this);
    }
    _refreshList(delay = 0, update = false){
        let params = {
            date: this.props.date,
            team_id: this.props.team_id,
            staff_id: this.props.staff_id,
            page: this.state.page,
            per_page: this.state.per_page
        };
        if (!update){
            this.setState({loading: true});
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_MEMBER_DETAIL, params, delay);
    }
    _btnAdd(){
        let params = {
            date: this.props.date,
            team_id: this.props.team_id,
            staff_id: this.props.staff_id
        };
        this.props.uiAction.createPopup(PopupPlanDailyRevenue,"Thêm Chi Tiết Doanh Thu", {...params});
    }
    _btnEdit(object){
        object.revenue = object.total_revenue;
        let params = {
            date: this.props.date,
            team_id: this.props.team_id,
            staff_id: this.props.staff_id,
            object: {
                achievement_id: object.id,
                employer_name: object.employer_name,
                quantity: object.quantity,
                revenue: parseInt(object.total_revenue)/parseInt(object.quantity)
            }
        };
        this.props.uiAction.createPopup(PopupPlanDailyRevenue,"Chỉnh Sửa Chi Tiết Doanh Thu", {...params});
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_DAILY_REVENUE_DELETE, {achievement_id: object.id});
            }
        });
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
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_MEMBER_DETAIL]) {
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_MEMBER_DETAIL];
            let args = response.info.args;
            if (args.date === this.props.date && args.team_id === this.props.team_id && args.staff_id === this.props.staff_id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data.items});
                    this.setState({pagination_data: response.data});
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_MEMBER_DETAIL);
            }
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_PLAN_DAILY_REVENUE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('PlanDailyRevenueMemberDetail',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenueMember',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenueTeam',{update: true});
                this.props.uiAction.refreshList('PlanDailyRevenuePage',{update: true});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_DAILY_REVENUE_DELETE);
        }
        if (newProps.refresh['PlanDailyRevenueMemberDetail']){
            let refresh = newProps.refresh['PlanDailyRevenueMemberDetail'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay, refresh.update);
            this.props.uiAction.deleteRefreshList('PlanDailyRevenueMemberDetail');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <tr>
                    <td colSpan={this.props.colSpan} className="text-center">
                        <LoadingSmall />
                    </td>
                </tr>
            )
        }
        let {data_list} = this.state;
        return(
            <tr>
                <td colSpan={this.props.colSpan}>
                    <div className="card-body">
                        <div className="crm-section">
                            <div className="top-table">
                                <div className="left">
                                    <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                        <span>Thêm</span>
                                    </button>
                                </div>
                            </div>
                            <div className="body-table el-table">
                                <TableComponent>
                                    <TableHeader tableType="TableHeader"  width={450}>
                                        Tên công ty
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader"  width={150}>
                                        Tổng số phiếu
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={150}>
                                        Tổng giá trị
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Thao tác
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {data_list.map((item,key)=>{
                                            let data = {
                                                quantity: utils.formatNumber(item.quantity,0,".",""),
                                                revenue: utils.formatNumber(item.revenue,0,".","đ"),
                                            };
                                            return(
                                                <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                    <td>
                                                        <div className="cell">
                                                            <span title={item.employer_name}>{item.employer_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="cell" title={data.quantity}>{data.quantity}</div>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="cell" title={data.revenue}>{data.revenue}</div>
                                                    </td>
                                                    <td>
                                                        <div className="cell">
                                                            <div className="text-underline">
                                                                <span className="text-bold mr10 text-primary pointer" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
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
                            <Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false}/>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }
}

function mapStateToProps(state) {
    return {
        refresh: state.refresh,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanDailyRevenueMemberDetail);
