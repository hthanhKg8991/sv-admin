import React,{Component} from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";

class PopupEditMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},this.props.object),
            object_required: ['staff_id', 'team_role', 'customer_care_level', 'employer_care_type'],
            object_error: {},
            name_focus: "",
            staff_list: [],
            staffLevelList: utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_staff_level),
            staffLevelFilterList: []
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeTeamRole = this._onChangeTeamRole.bind(this);
        this.getTeamMemberByStaff = this._getTeamMemberByStaff.bind(this);
    }
    _onSave(data, object_required){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_MEMBER_UPDATE_STAFF, object);
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    _onChangeTeamRole(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});

        let object = Object.assign({},this.state.object);
        object[name] = value;
        if (value !== Constant.TEAM_ROLE_LEADER) {
            delete object['employer_care_type'];
            delete object_error['employer_care_type'];
        }
        object['customer_care_level'] = null;
        this.setState({object: object});
        this.filerStaffLevelList(value);
    }

    // tách ds staff level theo giá trị team_role
    filerStaffLevelList(value) {
        let {staffLevelList} = this.state;
        const {branch} = this.props;
        const channelCode = branch.currentBranch.channel_code;
        let staffLevelLeaderList = [];
        let staffLevelMemberList = [];
        if (value) {
            _.forEach(staffLevelList,(item)=> {
                if (parseInt(item.value) === 1) {
                    staffLevelLeaderList.push(item);
                    //thêm bậc 1 cho member
                    if ([Constant.CHANNEL_CODE_TVN, Constant.CHANNEL_CODE_VL24H, Constant.CHANNEL_CODE_MW].includes(channelCode)){
                        staffLevelMemberList.push(item);
                    }
                } else {
                    staffLevelMemberList.push(item);
                }
            });
        }
        if (value === Constant.TEAM_ROLE_LEADER) {
            this.setState({staffLevelFilterList:staffLevelLeaderList});
        } else {
            this.setState({staffLevelFilterList:staffLevelMemberList});
        }
    }

    _getTeamMemberByStaff(){
        let args = {
            staff_id: this.props.object.staff_id,
            team_id: this.props.object.team_id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL, args);
    }
    componentDidMount(){
        this.getTeamMemberByStaff();
        this.filerStaffLevelList(this.state.object.team_role);
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_TEAM_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_MEMBER_UPDATE_STAFF]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_MEMBER_UPDATE_STAFF];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('CustomerServiceDetail');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_TEAM_MEMBER_UPDATE_STAFF);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {object, object_error, object_required, name_focus, staff_list, staffLevelFilterList} = this.state;
        let role_name = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_role_name);
        let employerCareList = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_care_type);

        // ẩn "hiện Loại khách hàng chăm sóc"
        if(object.team_role === Constant.TEAM_ROLE_LEADER){
            object_required.push('employer_care_type');
        }else{
            object_required = object_required.filter(c => c !== 'employer_care_type');
        }

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                <Dropbox
                                    name="staff_id"
                                    label="CSKH" data={staff_list}
                                    required={object_required.includes('staff_id')}
                                    key_title="login_name"
                                    key_value="id"
                                    error={object_error.staff_id}
                                    value={object.staff_id}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}
                                    readOnly={true}
                                />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox
                                        name="team_role"
                                        label="Quyền"
                                        data={role_name}
                                        required={object_required.includes('team_role')}
                                        error={object_error.team_role}
                                        value={object.team_role}
                                        nameFocus={name_focus}
                                        onChange={this.onChangeTeamRole}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox
                                        name="customer_care_level"
                                        label="Loại CSKH"
                                        data={staffLevelFilterList}
                                        required={object_required.includes('customer_care_level')}
                                        error={_.get(object_error, 'customer_care_level', null)}
                                        value={parseInt(_.get(object, 'customer_care_level', null))}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                    />
                                </div>
                                {object_required.includes('employer_care_type') && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Dropbox
                                            name="employer_care_type"
                                            label="Loại khách hàng chăm sóc"
                                            data={employerCareList}
                                            required={object_required.includes('employer_care_type')}
                                            error={_.get(object_error, 'employer_care_type', null)}
                                            value={_.get(object, 'employer_care_type', null)}
                                            nameFocus={name_focus}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Lưu</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}
function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupEditMember);
