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
import classnames from 'classnames';
import PopupInfoContract from "./Popup/PopupInfoContract";
import Detail from "./Detail";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
import _ from "lodash";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            showDetail: 0,
            page:1,
            per_page:Constant.PER_PAGE_LIMIT
        };
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_INFO_CONTRACT_LIST, params, delay);
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
        this.props.uiAction.createPopup(PopupInfoContract, "Thêm thông tin hợp đồng",{isAdd: true} );
    }
    _btnDelete(item){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xoá Phòng ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_INFO_CONTRACT_DELETE, {id: item.id});
            }
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
        if (newProps.api[ConstantURL.API_URL_GET_INFO_CONTRACT_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_INFO_CONTRACT_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list = _.get(response.data, "items", []);
                this.setState({data_list: data_list},()=>{
                    let query = queryString.parse(window.location.search);
                    if(query.item_active){
                        this.activeItem(query.item_active);
                    }
                });
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_INFO_CONTRACT_LIST);
        }

        if (newProps.refresh['InfoContractPage']){
            let delay = newProps.refresh['InfoContractPage'].delay ? newProps.refresh['InfoContractPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('InfoContractPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    componentFilterRefreshList(params) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        return  utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }
    render () {
        let {data_list, itemActive, per_page, page, pagination_data} = this.state;
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="CustomerServicePage"/>
                    <ComponentFilter history={this.props.history} onRefreshList={this.componentFilterRefreshList.bind(this)}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Thông tin hợp đồng</span>
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
                                            <span>Thêm thông tin <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Mã
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Mã phòng
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={420}>
                                            Đại diện
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(item.id) ? "active" : "")} onClick={()=>{this.activeItem(item.id)}}>
                                                            <td>
                                                                <div className="cell">{item.id}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={item.room_id}>{item.room_id}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={item.representative}>{item.representative}</div>
                                                            </td>
                                                        </tr>
                                                        {String(itemActive) === String(item.id) && (
                                                            <tr className="el-table-item">
                                                                <td colSpan={3}>
                                                                    <Detail item={item} history={this.props.history}/>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
