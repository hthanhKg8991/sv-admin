import React, { Component } from "react";
import ComponentFilter from "./ComponentFilter";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import config from 'config';
import queryString from 'query-string';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import classnames from 'classnames';
import PopupCustomerService from "./Popup/PopupCustomerService";
import Detail from "./Detail";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
const idKey = Constant.IDKEY_ACCOUNT_SERVICE_TEAM_LIST;

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            page: 1,
            per_page: Constant.PER_PAGE_LIMIT,
            division_list: []
        };
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnActive = this._btnActive.bind(this);
        this.btnInActive = this._btnInActive.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.divisionList = this._divisionList.bind(this);
        this.activeItem = this._activeItem.bind(this);

    }

    _divisionList() {
        const params = {
            q: Constant.COMMON_DATA_KEY_account_service
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_DIVISION_LIST, params);
    }

    _refreshList(delay = 0) {
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_TEAM, params, delay);
        this.props.uiAction.showLoading();
    }

    _changePage(newpage) {
        this.setState({ page: newpage }, () => {
            this.refreshList();
        });
    }

    _changePerPage(newperpage) {
        this.setState({ page: 1 });
        this.setState({ per_page: newperpage }, () => {
            this.refreshList();
        });
    }

    _btnAdd() {
        const { division_list } = this.state;
        this.props.uiAction.createPopup(PopupCustomerService, "Thêm Nhóm CSKH Account Service", { division_list, idKey });
    }

    _btnEdit(item) {
        const { division_list } = this.state;
        this.props.uiAction.createPopup(PopupCustomerService, "Chỉnh Sửa Nhóm CSKH Account Service", { object: item, division_list, idKey });
        let query = queryString.parse(window.location.search);
        query.action_active = 'edit';
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    _btnDelete(item) {
        this.props.uiAction.SmartMessageBox({
            title: `Bạn có chắc muốn xóa nhóm Id: ${item.id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CHANGE_STATUS, { team_id: item.id, status: Constant.STATUS_DELETED });
            }
        });
    }

    _btnActive(item) {
        this.props.uiAction.SmartMessageBox({
            title: `Bạn có chắc muốn hoạt động nhóm Id: ${item.id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CHANGE_STATUS, { team_id: item.id, status: Constant.STATUS_ACTIVED });
            }
        });
    }

    _btnInActive(item) {
        this.props.uiAction.SmartMessageBox({
            title: `Bạn có chắc muốn ngưng hoạt động nhóm Id: ${item.id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CHANGE_STATUS, { team_id: item.id, status: Constant.STATUS_INACTIVED });
            }
        });
    }

    _activeItem(key) {
        let check = this.state.data_list.filter(c => String(c.id) === String(key));

        let itemActive = this.state.itemActive;
        itemActive = String(itemActive) !== String(key) && check.length ? key : -1;
        this.setState({ itemActive: itemActive });

        let query = queryString.parse(window.location.search);
        if (itemActive !== -1) {
            query.item_active = key;
        } else {
            delete query.item_active;
            delete query.action_active;
        }
        this.props.history.push(`?${queryString.stringify(query)}`);
    }

    componentDidMount() {
        this.divisionList();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST]) {

            let response = newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({
                    division_list: response?.data || []
                })
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DIVISION_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_TEAM]) {

            let response = newProps.api[ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_TEAM];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list = response.data && response.data.items ? response.data.items : [];
                this.setState({ data_list: data_list }, () => {
                    let query = queryString.parse(window.location.search);
                    if (query.item_active) {
                        this.activeItem(query.item_active);
                    }
                });
                this.setState({ pagination_data: response.data });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_LIST_ACCOUNT_SERVICE_TEAM);
        }

        if (newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CHANGE_STATUS]) {
            let response = newProps.api[ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CHANGE_STATUS];
            this.props.uiAction.hideSmartMessageBox();
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_ACCOUNT_SERVICE_TEAM_CHANGE_STATUS);
        }
        if (newProps.refresh[idKey]) {
            let delay = newProps.refresh[idKey].delay ? newProps.refresh[idKey].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList(idKey);
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))) {
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }
    render() {
        let { data_list, division_list, itemActive, per_page, page, pagination_data } = this.state;

        let team_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_team_status);
        return (
            <div className="row-body">
                <div className="col-search">
                    <ComponentFilter idKey={idKey} history={this.props.history} />
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Quản Lý Nhóm CSKH Account Service</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={() => { this.refreshList() }}>
                                    <i className="fa fa-refresh" />
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="top-table">
                                    <div className="left btnCreateNTD">
                                        <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                            <span>Thêm nhóm <i className="glyphicon glyphicon-plus" /></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader" width={50}>
                                            ID
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={220}>
                                            Tên nhóm
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Mã bộ phận
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={150}>
                                            Ngày tạo
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={250}>
                                            Hành động
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key) => {
                                                let data = {
                                                    id: item.id,
                                                    name: item.name,
                                                    status: team_status[item.status] ? team_status[item.status] : item.status,
                                                    division: division_list.find(ite => ite.id == item.division_id)
                                                };

                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "", String(itemActive) === String(item.id) ? "active" : "")} >
                                                            <td onClick={() => { this.activeItem(item.id) }}>
                                                                <div className="cell" title={data.id}>{data.id}</div>
                                                            </td>
                                                            <td onClick={() => { this.activeItem(item.id) }}>
                                                                <div className="cell" title={data.name}>{data.name}</div>
                                                            </td>
                                                            <td onClick={() => { this.activeItem(item.id) }}>
                                                                <div className="cell" title={data?.division?.code}>{data?.division?.code}</div>
                                                            </td>
                                                            <td onClick={() => { this.activeItem(item.id) }}>
                                                                <div className="cell">
                                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_team_status} value={item?.status} />
                                                                </div>
                                                            </td>
                                                            <td onClick={() => { this.activeItem(item.id) }}>
                                                                <div className="cell">{item.updated_at}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">
                                                                    <span className="text-link text-warning font-bold mr10" onClick={() => this.btnEdit(item)}>
                                                                        Chỉnh sửa
                                                                    </span>
                                                                    {
                                                                        item.status == Constant.STATUS_ACTIVED ?
                                                                            <span className="text-bold text-danger text-underline mr10" onClick={() => this.btnInActive(item)} >
                                                                                Ngưng hoạt đông
                                                                            </span>
                                                                            : <span className="text-link text-blue font-bold mr10" onClick={() => this.btnActive(item)} >
                                                                                Hoạt đông
                                                                            </span>
                                                                    }
                                                                    <span className="text-link text-red font-bold" onClick={() => this.btnDelete(item)}>
                                                                        Xóa
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {
                                                            String(itemActive) === String(item.id) && (
                                                                <tr className="el-table-item">
                                                                    <td colSpan={6}>
                                                                        <Detail item={item} idKey={idKey} history={this.props.history} />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </React.Fragment>
                                                )
                                            })}
                                        </TableBody>
                                    </TableComponent>
                                </div>
                            </div>
                            <div className="crm-section">
                                <Pagination per_page={per_page} page={page} data={pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
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


export default connect(mapStateToProps, mapDispatchToProps)(index);
