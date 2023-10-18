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
import PopupForte from "./Popup/PopupForte";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import _ from "lodash";

class SkillInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.SkillInfo");
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_SKILL, args, delay);
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupForte, "Thêm Kỹ Năng Sở Trường", {
            data_list: this.state.data_list
        });
    }
    _btnEdit(item, key){
        this.props.uiAction.createPopup(PopupForte, "Chỉnh Kỹ Năng Sở Trường", {
            data_list: this.state.data_list,
            key_edit: key,
            object: item.object,
            object_revision: item.object_revision
        });
    }
    _btnDelete(delete_key){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa kỹ năng sở trường ?",
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
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_SKILL_DELETE, args);
            }
        });
    }
    componentWillMount() {
        this.refreshList()
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_SKILL]) {
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_SKILL];
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
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_SKILL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_SKILL_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_SKILL_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_SKILL_DELETE);
        }
        if (newProps.refresh['ForteInfo']){
            let delay = newProps.refresh['ForteInfo'].delay ? newProps.refresh['ForteInfo'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('ForteInfo');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        const {show_detail, loading, data_list, configForm} = this.state;
        const type_skill_forte = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_type_skill_forte);
        const data_list_active = data_list.filter(c => parseInt(c.object.status) !== Constant.STATUS_DELETED);
        const isInteresting = configForm.includes("interesting");

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Kỹ năng sở trường</span>
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
                                    {!data_list_active.length && parseInt(this.props.status) !== Constant.STATUS_DELETED && (
                                        this.props.canEdit && (
                                            <div className="left">
                                                <button type="button" className="el-button el-button-primary el-button-small" onClick={()=>this.btnAdd({},0,'add')}>
                                                    <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                                </button>
                                            </div>)
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
                                        <TableComponent className="table-custom">
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Kỹ năng chính
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={150}>
                                                Kỹ năng khác
                                            </TableHeader>
                                            {isInteresting && (
                                                <TableHeader tableType="TableHeader" width={150}>
                                                    Sở thich
                                                </TableHeader>
                                            )}
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                {data_list.map((item, key)=> {
                                                    let object = item.object_revision;
                                                    let data = {
                                                        special_skill: object?.special_skill_html,
                                                        interesting: object?.interesting_html,
                                                    };
                                                    const hide_row = object?.status === Constant.STATUS_DELETED;
                                                    return(
                                                        <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""), hide_row ? "d-none" : "")}>
                                                            <td>
                                                                <div className="cell" title={data.special_skill}>
                                                                    <div dangerouslySetInnerHTML={{__html: data.special_skill}} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="cell-custom">
                                                                    {Array.isArray(object.skills) && object.skills.map((i, k) => {
                                                                        return(
                                                                            <div key={k}>- {type_skill_forte[i] ? type_skill_forte[i] : i}</div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </td>
                                                            {isInteresting && (
                                                                <td>
                                                                    <div className="cell" title={data.interesting}>
                                                                        <div dangerouslySetInnerHTML={{__html: data.interesting}} />
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
        refresh: state.refresh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillInfo);
