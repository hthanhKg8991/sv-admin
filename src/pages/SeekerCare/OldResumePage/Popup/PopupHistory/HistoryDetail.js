import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import Input2 from 'components/Common/InputValue/Input2';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Collapse} from 'react-bootstrap';
import HistoryDiploma from './HistoryDiploma';
import HistoryExperience from './HistoryExperience';
import HistoryConsultor from './HistoryConsultor';
import HistoryLanguage from './HistoryLanguage';
import HistorySkill from './HistorySkill';
import HistoryIt from './HistoryIt';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class HistoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            loading: false,
            show_detail: true,
            show_detail2: true,
            navActive: 1,
            reject:{
                rejected_reason: [],
                rejected_reason_note: null
            },
            reject_error:{},
        };
        this.btnReject = this._btnReject.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeNav = this._onChangeNav.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.showDetail2 = this._showDetail2.bind(this);
    }
    _onChange(value, name){
        let reject_error = this.state.reject_error;
        delete reject_error[name];
        this.setState({reject_error: reject_error});
        let reject = Object.assign({}, this.state.reject);
        reject[name] = value;
        this.setState({reject: reject});
    }
    _btnReject(){
        this.setState({reject_error: {}});
        let reject = this.state.reject;
        if (!reject.rejected_reason.length && !reject.rejected_reason_note) {
            this.props.uiAction.putToastError("Lý do không duyệt là bắt buộc");
        }else {
            let args = {
                id: this.props.object.id,
                rejected_reason: reject.rejected_reason,
                rejected_reason_note: reject.rejected_reason_note
            };
            this.setState({loading: true},()=>{
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_REJECT, args);
            });
        }
    }
    _btnApprove(){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_APPROVE, {id: this.props.object.id});
        });
    }
    _refreshList(){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL, {resume_revision_id: this.props.id});
        });
    }
    _onChangeNav(navItem){
        this.setState({navActive: navItem});
    }
    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }
    _showDetail2(){
        this.setState({show_detail2: !this.state.show_detail2});
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL]){
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.json_content_change});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_RESUME_REVISION_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_APPROVE]){
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_APPROVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('ResumePage', {delay: Constant.DELAY_LOAD_LIST_2S});
                this.props.uiAction.refreshList('ResumeGeneralInf');
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_APPROVE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_REJECT]){
            this.setState({loading: false});
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_REJECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('ResumePage', {delay: Constant.DELAY_LOAD_LIST_2S});
                this.props.uiAction.refreshList('ResumeGeneralInf');
            }else{
                this.setState({reject_error: response.data})
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_REJECT);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        if (this.state.loading){
            return(
                <div className="text-center">
                    <LoadingSmall />
                </div>
            )
        }
        let {reject, reject_error, data_list, navActive, show_detail, show_detail2} = this.state;
        let mapping = {
            province_ids:{
                Content: (key)=>{
                    if (key) {
                        let data_arr = this.props.sys.province.items.filter(c => key.includes(c.id));
                        let data_string = '';
                        data_arr.forEach((item, key) => {
                            data_string += key === 0 ? item.name : ', ' + item.name;
                        });
                        return data_string;
                    }
                    return key;
                }
            },
            field_ids:{
                Content: (key)=>{
                    if (key) {
                        let data_arr = this.props.sys.jobField.items.filter(c => key.includes(c.id));
                        let data_string = '';
                        data_arr.forEach((item, key) => {
                            data_string += key === 0 ? item.name : ', ' + item.name;
                        });
                        return data_string;
                    }
                    return key;
                }
            },
            position:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_level_requirement);
                    return data[key] ? data[key] : key;
                }
            },
            current_position:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_level_requirement);
                    return data[key] ? data[key] : key;
                }
            },
            experience:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_experience_range);
                    return data[key] ? data[key] : key;
                }
            },
            work_time:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_working_method);
                    return data[key] ? data[key] : key;
                }
            },
            level:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_degree_requirement);
                    return data[key] ? data[key] : key;
                }
            },
            revision_status:{
                Content: (key)=>{
                    let data = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_seeker_status);
                    return data[key] ? data[key] : key;
                }
            },
        };
        let resume_rejected_reason = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_resume_rejected_reason);
        let reject_other = (reject.rejected_reason_note || reject.rejected_reason_note === '');
        navActive = show_detail2 ? navActive : 0;
        return (
            <div className="relative form-container">
                <div className="crm-section">
                    <div className="sub-title-form crm-section inline-block">
                        <div className={classnames('pointer', show_detail ? 'active' : '')} onClick={this.showDetail}>
                            Thông tin hồ sơ <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        <div>
                            <TableComponent allowDragScroll={false}>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Trường thay đổi
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Thông tin cũ
                                </TableHeader>
                                <TableHeader tableType="TableHeader" width={150}>
                                    Thông tin mới
                                </TableHeader>
                                <TableBody tableType="TableBody">
                                    {data_list.map((item,key)=> {
                                        if(['channel_code'].includes(item.key)) return null;
                                        let old_data = mapping[item.key] ? mapping[item.key].Content(item.value.old) : item.value.old;
                                        let old_new = mapping[item.key] ? mapping[item.key].Content(item.value.new) : item.value.new;
                                        return(
                                            <tr key={key} className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                <td>
                                                    <div className="cell" title={item.name}>{item.name}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={old_data}>{old_data}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title={old_new}>{old_new}</div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </TableBody>
                            </TableComponent>
                        </div>
                    </Collapse>
                </div>
                {parseInt(this.props.object.resume_type) === Constant.RESUME_NORMAL && (
                    <div className="crm-section">
                        <div className="sub-title-form crm-section inline-block">
                            <div className={classnames('pointer', show_detail2 ? 'active' : '')} onClick={this.showDetail2}>
                                Thông tin nâng cao <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                            </div>
                        </div>
                        <Collapse in={show_detail2}>
                            <div className="box-inf">
                                <div className="nav-box">
                                    <div className="nav-group">
                                        <div className={classnames("nav-item pointer", navActive === 1 ? "active" : "")} onClick={()=>{this.onChangeNav(1)}}>Bằng cấp</div>
                                        <div className={classnames("nav-item pointer", navActive === 2 ? "active" : "")} onClick={()=>{this.onChangeNav(2)}}>Kinh nghiệm</div>
                                        <div className={classnames("nav-item pointer", navActive === 3 ? "active" : "")} onClick={()=>{this.onChangeNav(3)}}>Người tham khảo</div>
                                        <div className={classnames("nav-item pointer", navActive === 4 ? "active" : "")} onClick={()=>{this.onChangeNav(4)}}>Ngoại ngữ</div>
                                        <div className={classnames("nav-item pointer", navActive === 5 ? "active" : "")} onClick={()=>{this.onChangeNav(5)}}>Kỹ năng sở trường</div>
                                        <div className={classnames("nav-item pointer", navActive === 6 ? "active" : "")} onClick={()=>{this.onChangeNav(6)}}>Tin Học</div>
                                    </div>
                                </div>
                                <div style={{padding:"5px 20px"}}>
                                    {navActive === 1 && (
                                        <HistoryDiploma resume_revision_id={this.props.id}/>
                                    )}
                                    {navActive === 2 && (
                                        <HistoryExperience resume_revision_id={this.props.id}/>
                                    )}
                                    {navActive === 3 && (
                                        <HistoryConsultor resume_revision_id={this.props.id}/>
                                    )}
                                    {navActive === 4 && (
                                        <HistoryLanguage resume_revision_id={this.props.id}/>
                                    )}
                                    {navActive === 5 && (
                                        <HistorySkill resume_revision_id={this.props.id}/>
                                    )}
                                    {navActive === 6 && (
                                        <HistoryIt resume_revision_id={this.props.id}/>
                                    )}
                                </div>
                            </div>
                        </Collapse>
                    </div>
                )}
                <div className="crm-section" style={{padding:"5px 20px"}}>
                    {this.props.page === 1 && this.props.approve && this.props.id === this.props.itemApprove &&
                    (
                        <div>
                            <button type="button" className="el-button el-button-success el-button-small" onClick={this.btnApprove}>
                                <span>Duyệt</span>
                            </button>
                        </div>
                    )}
                    {this.props.page === 1 && this.props.reject && this.props.id === this.props.itemApprove &&
                    (
                        <React.Fragment>
                            <div className="left">
                                <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnReject}>
                                    <span>Không duyệt</span>
                                </button>
                            </div>
                            <div className="relative left width250 crm-section paddingLeft5 top-10">
                                <DropboxMulti name="rejected_reason" label="Lý do không duyệt" data={resume_rejected_reason} required={reject.rejected_reason_note ? -1 : 1}
                                              error={reject_error.rejected_reason} value={reject.rejected_reason}
                                              onChange={this.onChange}
                                />
                            </div>
                            <div className="left">
                                <FormControlLabel className="margin0"
                                                  label={<label className="v-label margin0">Khác</label>}
                                                  control={
                                                      <Checkbox checked={!!reject_other} color="primary" icon={<CheckBoxOutlineBlankIcon fontSize="large"/>} checkedIcon={<CheckBoxIcon fontSize="large"/>}
                                                                onChange={()=>{this.onChange(reject_other ? null : "",'rejected_reason_note');}}/>
                                                  }
                                />
                            </div>
                            {reject_other && (
                                <div className="relative left width250 crm-section paddingLeft10 top-10">
                                    <Input2 type="text" name="rejected_reason_note" label="Lý do khác" required={reject.rejected_reason.length ? -1 : 1}
                                           error={reject_error.rejected_reason_note} value={reject.rejected_reason_note}
                                           onChange={this.onChange}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(HistoryDetail);
