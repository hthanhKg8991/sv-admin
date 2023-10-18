import React,{Component} from "react";
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from 'lodash';

class PopupCustomerService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_required: ['name', 'branch_code'],
            object_error: {},
            name_focus: "",
            staff_list: [],
            staff_leader_list: [],
            staff_member_list: [],
            roomList: [],
            unLimitPerPage: Constant.UN_LIMIT_PER_PAGE
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onChangeLeaderId = this._onChangeLeaderId.bind(this);
        this.onChangeMemberId = this._onChangeMemberId.bind(this);
        this.getCustomerCare = this._getCustomerCare.bind(this);
        this.onChangeBranch = this._onChangeBranch.bind(this);
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
        // append division_type
        object = {...object, division_type: Constant.DIVISION_SEEKER};
        this.props.uiAction.showLoading();
        if(!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_TEAM_UPDATE, object);
        }
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({},this.state.object);
        object[name] = value;
        this.setState({object: object},()=>{
            this.onChangeBranch(value, name);
        });
    }

    _onChangeLeaderId(value, name){
        const {staff_list} = this.state;
        let index = _.findIndex(staff_list, { 'id': value});
        let new_list = [...staff_list];
        _.pullAt(new_list, [index]);

        this.setState({staff_member_list: new_list},()=>{
            this._onChange(value, name);
        });
    }

    _onChangeMemberId(value, name){
        const {staff_list} = this.state;
        let new_list = [...staff_list];
        let indexes = [];
        _.forEach(value, function(v) {
            const index = _.findIndex(staff_list, { 'id': v});
            indexes.push(index);
        });

        _.pullAt(new_list, indexes);

        this.setState({staff_leader_list: new_list},()=>{
            this._onChange(value, name);
        });
    }

    _onChangeBranch(value, name) {
        if (name === 'branch_code') {
            if (!value) {
                this.setState({
                    staff_list: [],
                    staff_leader_list: [],
                    staff_member_list: [],
                });
            } else {
                this.getCustomerCare(value);
            }
        }
    }

    _getCustomerCare(branch_code){
        let args = {
            branch_code_real: branch_code,
            'division_code_list[0]': Constant.DIVISION_TYPE_seeker_care_leader,
            'division_code_list[1]': Constant.DIVISION_TYPE_seeker_care_member
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE, args);
    }

    componentDidMount(){
        // load list phòng
        if(this.state.object.id){
            this.onChangeBranch(this.state.object.branch_code, 'branch_code');
            this.getCustomerCare();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({staff_list: response.data});
                this.setState({staff_leader_list: response.data});
                this.setState({staff_member_list: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_LIST_STAFF_FREE);
        }

        if (newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('CustomerServicePage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_TEAM_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_TEAM_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('CustomerServicePage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_TEAM_UPDATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }
    render () {
        let {object, object_error, object_required, name_focus, staff_leader_list, staff_member_list} = this.state;
        let branch_list = this.props.branch.branch_list.filter(c => c.channel_code === this.props.branch.currentBranch.channel_code);
        if(!object.id){
            object_required.push('leader_id');
        }

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-6 col-xs-12 mb15">
                                <Input2 type="text" name="name" label="Tên nhóm" required={object_required.includes('name')}
                                        value={object.name} error={object_error.name}  nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <Dropbox name="branch_code" label="Chi nhánh"
                                         data={branch_list}
                                         required={object_required.includes('branch_code')}
                                         key_value="code" key_title="name"
                                         error={object_error.branch_code}
                                         value={object.branch_code} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>

                            {object_required.includes('leader_id') && (
                                <div className="col-sm-12 col-xs-12 padding0">
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Dropbox name="leader_id" label="Nhóm trưởng" data={staff_leader_list} required={object_required.includes('leader_id')}
                                                 key_title="login_name" key_value="id"
                                                 error={object_error.leader_id} value={object.leader_id} nameFocus={name_focus}
                                                 onChange={this.onChangeLeaderId}
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <DropboxMulti name="member_id" label="CSNTV" data={staff_member_list} required={object_required.includes('member_id')}
                                                      key_value="id" key_title="login_name"
                                                      error={object_error.member_id} value={object.member_id} nameFocus={name_focus}
                                                      onChange={this.onChangeMemberId}
                                        />
                                    </div>
                                </div>)}
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupCustomerService);
