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
import PopupExperience from "./Popup/PopupExperience";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import _ from "lodash";

class ExperienceInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ExperienceInfo");
        this.state = {
            data_list: [],
            show_detail: true,
            origin_list: [],
            revision_list: [],
            configForm: configForm,
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_EXPERIENCE, args, delay);
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupExperience, "Thêm Kinh Nghiệm", {
            data_list: this.state.data_list
        });
    }
    _btnEdit(item, key){
        this.props.uiAction.createPopup(PopupExperience, "Chỉnh Sửa Kinh Nghiệm", {
            data_list: this.state.data_list,
            key_edit: key,
            object: item.object,
            object_revision: item.object_revision
        });
    }
    _btnDelete(delete_key){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa kinh nghiệm làm việc ?",
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
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_EXPERIENCE_DELETE, args);
            }
        });
    }
    componentWillMount() {
        this.refreshList()
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_EXPERIENCE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_EXPERIENCE];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_EXPERIENCE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_EXPERIENCE_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_EXPERIENCE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_EXPERIENCE_DELETE);
        }
        if (newProps.refresh['ExperienceInfo']){
            let delay = newProps.refresh['ExperienceInfo'].delay ? newProps.refresh['ExperienceInfo'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('ExperienceInfo');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {show_detail, loading, data_list, configForm} = this.state;
        const currencyList = utils.convertArrayToObject(this.props.sys.currency.items, 'id');

        const isSalary = configForm.includes("salary");
        const isSalaryUnit = configForm.includes("salary_unit");
        const isAchieved = configForm.includes("achieved");

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Kinh nghiệm làm việc</span>
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
                                                Tên Công ty/Tổ chức
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Chức danh
                                            </TableHeader>
                                            {isSalary && (
                                                <TableHeader tableType="TableHeader" width={100}>
                                                    Mức lương
                                                </TableHeader>
                                            )}
                                            {isSalaryUnit && (
                                                <TableHeader tableType="TableHeader" width={100}>
                                                    Tiền tệ
                                                </TableHeader>
                                            )}
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Thời gian
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Mô tả công việc
                                            </TableHeader>
                                            {isAchieved && (
                                                <TableHeader tableType="TableHeader" width={200}>
                                                    Thành tích đạt được
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
                                                        endDate = object?.is_current_work ? 'Hiện tại' : moment.unix(object?.end_date).format("MM/YYYY");
                                                    } else {
                                                        // Sai format
                                                        startDate = object?.start_text || "";
                                                        endDate = object?.end_text || "";
                                                    }
                                                    let data = {
                                                        company_name: object?.company_name,
                                                        position: object?.position,
                                                        salary: object?.salary > 0 ? utils.formatNumber(object?.salary, 0, ".", "") : null,
                                                        salary_unit: currencyList[object?.salary_unit] ? currencyList[object?.salary_unit].name : object?.salary_unit,
                                                        start_date: startDate,
                                                        end_date: endDate,
                                                        description: object?.description,
                                                        description_html: object?.description_html,
                                                        achieved: object?.achieved,
                                                        achieved_html: object?.achieved_html
                                                    };
                                                    const hide_row = object?.status === Constant.STATUS_DELETED;
                                                    return(
                                                        <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none": "")}>
                                                            <td>
                                                                <div className="cell" title={data.company_name}>{data.company_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.position}>{data.position}</div>
                                                            </td>
                                                            {isSalary && (
                                                                <td>
                                                                    <div className="cell" title={data.salary}>{data.salary}</div>
                                                                </td>
                                                            )}
                                                            {isSalaryUnit && (
                                                                <td>
                                                                    <div className="cell" title={data.salary_unit}>{data.salary_unit}</div>
                                                                </td>
                                                            )}
                                                            <td>
                                                                <div className="cell" title={`${data.start_date} - ${data.end_date}`}>{`${data.start_date} - ${data.end_date}`}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.description}>
                                                                    <div dangerouslySetInnerHTML={{__html: data.description_html}} />
                                                                </div>
                                                            </td>
                                                            {isAchieved && (
                                                                <td>
                                                                    <div className="cell" title={data.achieved}>
                                                                        <div dangerouslySetInnerHTML={{__html: data.achieved_html}} />
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {this.props.canEdit && (
                                                                <td>
                                                                    {parseInt(object?.status) !== Constant.STATUS_DELETED && (
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
        refresh: state.refresh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExperienceInfo);
