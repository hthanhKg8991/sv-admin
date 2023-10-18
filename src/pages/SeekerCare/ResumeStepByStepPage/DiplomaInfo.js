import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import moment from "moment";
import queryString from 'query-string';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupCertificate from "./Popup/PopupCertificate";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import _ from "lodash";

class DiplomaInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            data_list: [],
            show_detail: true,
            origin_list: [],
            revision_list: [],
            configForm: getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.DiplomaInfo")
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_CERTIFICATE, args, delay);
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupCertificate, "Thêm Bằng Cấp", {
            data_list: this.state.data_list,
            showDeleteImg: true,
        });
    }
    _btnEdit(item, key){
        this.props.uiAction.createPopup(PopupCertificate, "Chỉnh Sửa Bằng Cấp", {
            data_list: this.state.data_list,
            key_edit: key,
            object: item.object,
            object_revision: item.object_revision,
            showDeleteImg: true,
        });
    }
    _btnDelete(delete_key){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa bằng cấp chứng chỉ ?",
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
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_CERTIFICATE_DELETE, args);
            }
        });
    }
    componentWillMount() {
        this.refreshList()
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_CERTIFICATE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_CERTIFICATE];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_CERTIFICATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_CERTIFICATE_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_CERTIFICATE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_CERTIFICATE_DELETE);
        }
        if (newProps.refresh['CertificateInfo']){
            let delay = newProps.refresh['CertificateInfo'].delay ? newProps.refresh['CertificateInfo'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('CertificateInfo');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        const {show_detail, loading, data_list, configForm} = this.state;
        const certificate_rate = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_certificate_rate);

        const isTitle = configForm.includes("title");
        const isCareerName = configForm.includes("career_name");
        const isInfo = configForm.includes("info");
        const isImgDiploma = configForm.includes("img_diploma");

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Bằng cấp chứng chỉ</span>
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
                                        {isTitle && (
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Bằng cấp
                                            </TableHeader>
                                        )}
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Trường
                                        </TableHeader>
                                        {isCareerName && (
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Khoa
                                            </TableHeader>
                                        )}
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Chuyên ngành
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Thời gian học
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Loại tốt nghiệp
                                        </TableHeader>
                                        {isInfo && (
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Thông tin bổ sung
                                            </TableHeader>
                                        )}
                                        {isImgDiploma && (
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Ảnh bằng cấp
                                            </TableHeader>
                                        )}
                                        <TableHeader tableType="TableHeader" width={100}>
                                            Thao tác
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let object = item.object_revision;
                                                let startDate, endDate;
                                                if (object?.start_date) {
                                                    startDate = moment.unix(object?.start_date).format("MM/YYYY");
                                                    endDate = object?.is_current_diploma ? 'Hiện tại' : moment.unix(object?.end_date).format("MM/YYYY");
                                                } else {
                                                    // Sai format
                                                    startDate = object?.start_text || "";
                                                    endDate = object?.end_text || "";
                                                }
                                                let data = {
                                                    title: object.title,
                                                    career_name: object.career_name,
                                                    school_name: object.school_name,
                                                    specialized: object.specialized,
                                                    info: object?.info,
                                                    start_date: startDate,
                                                    end_date: endDate,
                                                    gra_diploma: certificate_rate[object.gra_diploma] ? certificate_rate[object.gra_diploma] : object.gra_diploma,
                                                    img_diploma: object?.img_diploma_url
                                                };
                                                const hide_row = object?.status === Constant.STATUS_DELETED;
                                                return(
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                        {isTitle && (
                                                            <td>
                                                                <div className="cell" title={data.title}>{data.title}</div>
                                                            </td>
                                                        )}
                                                        <td>
                                                            <div className="cell" title={data.school_name}>{data.school_name}</div>
                                                        </td>
                                                        {isCareerName && (
                                                            <td>
                                                                <div className="cell" title={data.career_name}>{data.career_name}</div>
                                                            </td>
                                                        )}
                                                        <td>
                                                            <div className="cell" title={data.specialized}>{data.specialized}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={`${data.start_date} - ${data.end_date}`}>{`${data.start_date} - ${data.end_date}`}</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell" title={data.gra_diploma}>{data.gra_diploma}</div>
                                                        </td>
                                                        {isInfo && (
                                                            <td>
                                                                <div className="cell" title={data.info}>{data.info}</div>
                                                            </td>
                                                        )}
                                                        {isImgDiploma && (
                                                            <td>
                                                                <div className="cell">
                                                                    {data.img_diploma && (
                                                                        <a href={data.img_diploma} target="_blank" rel="noopener noreferrer">Xem file</a>
                                                                    )}
                                                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DiplomaInfo);
