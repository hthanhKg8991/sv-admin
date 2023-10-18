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
import PopupTimeFrame from "./Popup/PopupTimeFrame";
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
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_TIME_FRAME_LIST, params, delay);
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
        this.props.uiAction.createPopup(PopupTimeFrame,"Thêm Khung Giờ");
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupTimeFrame,"Sửa Khung Giờ", {object:object});
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa khung giờ này ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                let args = {
                    id: object.id
                };
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_TIME_FRAME_DELETE, args);
                this.props.uiAction.showLoading();
            }
        });
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_TIME_FRAME_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_CALL_TIME_FRAME_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_TIME_FRAME_DELETE);
        }
        if (newProps.refresh['TimeFramePage']){
            let delay = newProps.refresh['TimeFramePage'].delay ? newProps.refresh['TimeFramePage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('TimeFramePage');
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
        let time_frame_type = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_time_frame_type);
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="TimeFramePage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Khung Giờ Quy Định</span>
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
                                            <span>Thêm Khung giờ <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Tiêu đề
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Thời gian bắt đầu
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Thời gian kết thúc
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Yêu cầu (cuộc)
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Loại
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Thao tác
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                return (
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        <td>
                                                            <div className="cell" title={item.name}>{item.name}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={moment(item.from_time,"HHmm").format("HH:mm")}>{moment(item.from_time,"HHmm").format("HH:mm")}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={moment(item.end_time,"HHmm").format("HH:mm")}>{moment(item.end_time,"HHmm").format("HH:mm")}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={item.call_require}>{item.call_require}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={time_frame_type[item.time_frame_type]}>{time_frame_type[item.time_frame_type]}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>
                                                                        Chỉnh sửa
                                                                    </span>
                                                                </div>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>
                                                                        Xóa
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
