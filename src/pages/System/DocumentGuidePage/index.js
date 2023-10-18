import React, {Component} from "react";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import ComponentFilter from "./ComponentFilter";
import config from 'config';
import classnames from 'classnames';
import ReactDragListView from 'react-drag-listview';
import PopupDocumentGuide from './Popup/PopupDocumentGuide';
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            data_list_full: [],
            // page: 1,
            per_page: 50,
        };
        this.refreshList = this._refreshList.bind(this);
        // this.changePage = this._changePage.bind(this);
        // this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.onChangeSort = this._onChangeSort.bind(this);
    }

    _refreshList(delay = 0) {
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        params['order_by[sort]'] = 'ASC';
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_DOCUMENT_GUIDE_LIST, params, delay);
    }
    //
    // _changePage(newpage) {
    //     this.setState({page: newpage}, () => {
    //         this.refreshList();
    //     });
    // }
    //
    // _changePerPage(newperpage) {
    //     this.setState({page: 1});
    //     this.setState({per_page: newperpage}, () => {
    //         this.refreshList();
    //     });
    // }

    _btnAdd() {
        this.props.uiAction.createPopup(PopupDocumentGuide, "Thêm Hướng Dẫn");
    }

    _btnEdit(object) {
        this.props.uiAction.createPopup(PopupDocumentGuide, "Chỉnh Sửa Hướng Dẫn", {object});
    }

    _btnDelete(object) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa hướng dẫn này ?",
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_DOCUMENT_GUIDE_DELETE, {id: object.id});
            }
        });
    }

    _onChangeSort(data) {
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_DOCUMENT_GUIDE_SORT, {data});
    }

    componentWillMount() {

    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DOCUMENT_GUIDE_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DOCUMENT_GUIDE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let list = response.data.items ? response.data.items : [];
                let data_list = [];
                let data_list_full = [];
                list.forEach((item) => {
                    let child = [];
                    if (!item.parent_id) {
                        child = list.filter(c => String(c.parent_id) === String(item.id));
                        item.child = child;
                        data_list.push(item);
                        data_list_full.push(item);
                    }
                    child.forEach(c => {
                        data_list_full.push(c);
                    });
                });
                this.setState({data_list: data_list});
                this.setState({data_list_full: data_list_full});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DOCUMENT_GUIDE_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            } else {
                this.props.uiAction.putToastError(response.msg);
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DOCUMENT_GUIDE_DELETE);
            this.props.uiAction.hideLoading();
        }
        if (newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_SORT]) {
            let response = newProps.api[ConstantURL.API_URL_POST_DOCUMENT_GUIDE_SORT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.refreshList();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DOCUMENT_GUIDE_SORT);
        }
        if (newProps.refresh['DocumentGuidePage']) {
            let delay = newProps.refresh['DocumentGuidePage'].delay ? newProps.refresh['DocumentGuidePage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('DocumentGuidePage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))) {
            this.refreshList();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let {data_list, data_list_full} = this.state;
        let visible_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_visible_status);
        let document_kind = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_document_kind);
        let device_type = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_device_type);
        let dragPropsParent = {
            onDragEnd: (fromIndex, toIndex) => {
                if (toIndex === -1) return;
                let data = [
                    {id: data_list_full[fromIndex].id, sort: data_list_full[toIndex].sort},
                    {id: data_list_full[toIndex].id, sort: data_list_full[fromIndex].sort},
                ];
                this.onChangeSort(data);
            },
            nodeSelector: "tr.doc-parent",
            handleSelector: "tr .fa-exchange"
        };
        let dragPropsChild = {
            onDragEnd: (fromIndex, toIndex) => {
                if (toIndex === -1) return;
                if (data_list_full[fromIndex].parent !== data_list_full[toIndex].parent) return;
                let data = [
                    {id: data_list_full[fromIndex].id, sort: data_list_full[toIndex].sort},
                    {id: data_list_full[toIndex].id, sort: data_list_full[fromIndex].sort},
                ];
                this.onChangeSort(data);
            },
            nodeSelector: "tr.doc-child",
            handleSelector: "tr .fa-exchange"
        };
        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="DocumentGuidePage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Hướng Dẫn Thao Tác</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={() => {
                                    this.refreshList()
                                }}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="top-table">
                                    <div className="left btnCreateNTD">
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                                onClick={this.btnAdd}>
                                            <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                        </button>
                                    </div>
                                    <div className="right">
                                        <div><span>
                                             <i className="fa fa-exchange text-primary pointer fs18"
                                                style={{transform: "rotate(90deg)"}}/> Danh mục cha
                                        </span>
                                            <span> <i className="fa fa-exchange textRed pointer fs14"
                                                      style={{transform: "rotate(90deg)"}}/> Danh mục con</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <ReactDragListView {...dragPropsParent}>
                                        <ReactDragListView {...dragPropsChild}>
                                            <TableComponent DragScroll={false}>
                                                <TableHeader tableType="TableHeader" width={40}>

                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={70}>
                                                    Thứ tự hiển thị
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={200}>
                                                    Tiêu đề
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={100}>
                                                    Trạng thái
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={100}>
                                                    Đối tượng
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={80}>
                                                    Phiên bản
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={150}>
                                                    Thao tác
                                                </TableHeader>
                                                <TableBody tableType="TableBody">
                                                    {data_list.map((item, key) => {
                                                        let data = {
                                                            stt: key + 1,
                                                            title: item.title,
                                                            status: visible_status[item.status] ? visible_status[item.status] : item.status,
                                                            document_kind: document_kind[item.document_kind] ? document_kind[item.document_kind] : item.document_kind,
                                                            document_source: device_type[item.document_source] ? device_type[item.document_source] : item.document_source
                                                        };
                                                        return (
                                                            <React.Fragment key={key}>
                                                                <tr className={classnames("el-table-row doc-parent drag-handle")}
                                                                    draggable="false">
                                                                    <td>
                                                                        <div className="cell text-left">
                                                                            <i className="fa fa-exchange text-primary pointer fs18"
                                                                               style={{transform: "rotate(90deg)"}}/>
                                                                        </div>
                                                                    </td>
                                                                    {Object.keys(data).map((name, key) => {
                                                                        return (
                                                                            <td key={key}>
                                                                                <div className="cell"
                                                                                     title={data[name]}>{data[name]}</div>
                                                                            </td>
                                                                        )
                                                                    })}
                                                                    <td>
                                                                        <div className="cell">
                                                                            <div className="text-underline">
                                                                                <span
                                                                                    className="text-bold mr10 text-primary pointer"
                                                                                    onClick={() => {
                                                                                        this.btnEdit(item)
                                                                                    }}>Chỉnh sửa</span>
                                                                                <span
                                                                                    className="text-bold text-danger pointer"
                                                                                    onClick={() => {
                                                                                        this.btnDelete(item)
                                                                                    }}>Xóa</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {item.child.map((i, k) => {
                                                                    let data_child = {
                                                                        stt: data.stt + '.' + (k + 1),
                                                                        title: i.title,
                                                                        status: visible_status[i.status] ? visible_status[i.status] : i.status,
                                                                        document_kind: document_kind[i.document_kind] ? document_kind[i.document_kind] : i.document_kind,
                                                                        document_source: device_type[i.document_source] ? device_type[i.document_source] : i.document_source
                                                                    };
                                                                    return (
                                                                        <tr key={k}
                                                                            className={classnames("el-table-row doc-child")}>
                                                                            <td>
                                                                                <div className="cell text-right">
                                                                                    <i className="fa fa-exchange textRed pointer fs14"
                                                                                       style={{transform: "rotate(90deg)"}}/>
                                                                                </div>
                                                                            </td>
                                                                            {Object.keys(data_child).map((name, key) => {
                                                                                return (
                                                                                    <td key={key}>
                                                                                        <div className="cell"
                                                                                             title={data_child[name]}>{data_child[name]}</div>
                                                                                    </td>
                                                                                )
                                                                            })}
                                                                            <td>
                                                                                <div className="cell">
                                                                                    <div className="text-underline">
                                                                                        <span
                                                                                            className="text-bold mr10 text-primary pointer"
                                                                                            onClick={() => {
                                                                                                this.btnEdit(i)
                                                                                            }}>Chỉnh sửa</span>
                                                                                        <span
                                                                                            className="text-bold text-danger pointer"
                                                                                            onClick={() => {
                                                                                                this.btnDelete(i)
                                                                                            }}>Xóa</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </TableBody>
                                            </TableComponent>
                                        </ReactDragListView>
                                    </ReactDragListView>
                                </div>
                            </div>
                            {/*<div className="crm-section">*/}
                            {/*    <Pagination per_page={this.state.per_page} page={this.state.page}*/}
                            {/*                data={this.state.pagination_data} changePage={this.changePage}*/}
                            {/*                changePerPage={this.changePerPage} changeURL={true}/>*/}
                            {/*</div>*/}
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
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
