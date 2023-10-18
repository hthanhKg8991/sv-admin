import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import queryString from 'query-string';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupReference from "./Popup/PopupReference";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import _ from "lodash";
import {getConfigForm} from "utils/utils";

class ConsultorInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            data_list: [],
            show_detail: true,
            origin_list: [],
            revision_list: [],
            configForm: getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ConsultorInfo"),
        };
        this.refreshList = this._refreshList.bind(this);
        this.showHide = this._showHide.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
    }
    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }
    _refreshList(delay = 0) {
        this.setState({loading: true});
        let params = queryString.parse(window.location.search);
        let args = {
            resume_id: params['id']
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_CONSULTOR, args, delay);
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupReference, "Thêm Người Tham Khảo", {
            data_list: this.state.data_list
        });
    }
    _btnEdit(item, key){
        this.props.uiAction.createPopup(PopupReference, "Chỉnh Người Tham Khảo", {
            data_list: this.state.data_list,
            key_edit: key,
            object: item.object,
            object_revision: item.object_revision
        });
    }
    _btnDelete(delete_key){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa người tham khảo ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                let data_arr = [];
                this.state.data_list.forEach((item, key) => {
                    if(key !== delete_key) {
                        data_arr.push(item.object_revision);
                    }else{
                        item.object_revision.status = Constant.STATUS_DELETED;
                        data_arr.push(item.object_revision);
                    }
                });
                let params = queryString.parse(window.location.search);
                let args = {
                    resume_id: params.id,
                    seeker_id: params.seeker_id,
                    data: data_arr
                };
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_CONSULTOR_DELETE, args);
            }
        });
    }
    componentWillMount() {
        this.refreshList()
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_CONSULTOR]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_CONSULTOR];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list = [];
                if(Array.isArray(response.data)) {
                    response.data.forEach((item) => {
                        let object = item.old_data ? item.old_data : {};
                        if(item.status) object.status = item.status;
                        delete item.old_data;
                        data_list.push({object: object, object_revision: item});
                    });
                }
                this.setState({data_list: data_list});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_CONSULTOR);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_CONSULTOR_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_CONSULTOR_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_CONSULTOR_DELETE);
        }
        if (newProps.refresh['ReferenceInfo']){
            let delay = newProps.refresh['ReferenceInfo'].delay ? newProps.refresh['ReferenceInfo'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('ReferenceInfo');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {show_detail, loading, data_list, configForm} = this.state;
        const isEmail = configForm.includes("email");

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Người tham khảo</span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        <div>
                            <div className="card-body">
                                <div className="top-table">
                                    {this.props.canEdit && (
                                        <div className="left">
                                            {parseInt(this.props.status) !== Constant.STATUS_DELETED && (
                                                <button type="button" className="el-button el-button-primary el-button-small" onClick={()=>this.btnAdd({},0,'add')}>
                                                    <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <div className="right">
                                        <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                            <i className="fa fa-refresh"/>
                                        </button>
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="text-center">
                                        <LoadingSmall />
                                    </div>
                                ):(
                                    <div className="body-table el-table">
                                        <TableComponent>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Họ và tên
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Tên Công ty/Tổ chức
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Chức vụ
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Số điện thoại
                                            </TableHeader>
                                            {isEmail && (
                                                <TableHeader tableType="TableHeader" width={200}>
                                                    Email
                                                </TableHeader>
                                            )}
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                {data_list.map((item, key)=> {
                                                    let object = item.object_revision;
                                                    let data = {
                                                        name: object.name,
                                                        company_name: object.company_name,
                                                        position: object.position,
                                                        phone: object.phone,
                                                        email: object?.email,
                                                    };
                                                    const hide_row = object?.status === Constant.STATUS_DELETED;
                                                    return(
                                                        <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                            <td>
                                                                <div className="cell" title={data.name}>{data.name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.company_name}>{data.company_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.position}>{data.position}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.phone}>{data.phone}</div>
                                                            </td>
                                                            {isEmail && (
                                                                <td>
                                                                    <div className="cell" title={data.email}>{data.email}</div>
                                                                </td>
                                                            )}
                                                            {this.props.canEdit && (
                                                                <td>
                                                                    {parseInt(object.status) !== Constant.STATUS_DELETED && (
                                                                        <div className="cell">
                                                                            <div className="text-underline pointer">
                                                                                <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item, key)}}>Chỉnh sửa</span>
                                                                            </div>
                                                                            <div className="text-underline pointer">
                                                                                <span className="text-bold text-danger" onClick={()=>{this.btnDelete(key)}}>Xóa</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    )
                                                })}
                                            </TableBody>
                                        </TableComponent>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsultorInfo);
