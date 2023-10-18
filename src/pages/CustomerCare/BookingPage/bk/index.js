import React, {Component} from "react";
import ComponentFilter from "./ComponentFilter";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import Pagination from "components/Common/Ui/Pagination";
import PopupBooking from "pages/Accountant/AccBookingPage/Popup/PopupBooking";
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
        this.btnAdd = this._btnAdd.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiBookingDomain, ConstantURL.API_URL_GET_LIST_BOOKING, params, delay);
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
    _btnAdd(){
        this.props.uiAction.createPopup(PopupBooking, "Thêm Đặt chổ", {refresh_page: 'BookingPage'});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING]){
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOOKING];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOOKING);
        }
        if (newProps.api[ConstantURL.API_URL_GET_LIST_BOX]) {
            let response = newProps.api[ConstantURL.API_URL_GET_LIST_BOX];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({box_list: response.data});
            }
            // this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_BOX);
        }
        if (newProps.refresh['BookingPage']){
            let delay = newProps.refresh['BookingPage'].delay ? newProps.refresh['BookingPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('BookingPage');
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
        let {data_list, box_list} = this.state;
        let booking_canceled_reason = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_booking_canceled_reason);
        let booking_status = utils.convertObjectValueCommonDataFull(this.props.sys.common.items,Constant.COMMON_DATA_KEY_booking_status);
        let box_code_list = utils.convertArrayToObject(box_list, 'id');
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="BookingPage" />
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Đặt Chổ</span>
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
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                            <span>Đăng ký đặt chổ <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent data={data_list}>
                                        <TableHeader tableType="TableHeader" width={140} dataField="code">
                                            Mã đặt chổ
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200} dataField="employer_name">
                                            Nhà tuyển dụng
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130} dataField="employer_email">
                                            Email NTD
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130} dataField="booking_box_id" content={box_code_list} key_value="name">
                                            gói dịch vụ
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130} dataField="booking_status" content={booking_status}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130} dataField="cancelled_reason" content={booking_canceled_reason}>
                                            Tình trạng
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130} dataField="from_date" timeStamp={true} format="DD/MM/YYYY">
                                            Ngày đặt chổ
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130} dataField="to_date" timeStamp={true} format="DD/MM/YYYY">
                                            Ngày hết hạn
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130} dataField="staff_email">
                                            CSKH đặt chổ
                                        </TableHeader>
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
