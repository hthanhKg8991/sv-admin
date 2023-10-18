import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import InputArea from 'components/Common/InputValue/InputArea';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import { CKEditor } from 'ckeditor4-react';

class PopupStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_required: ['code', 'email', 'division_code', 'data_group_code', 'language_code', 'display_name', 'phone', 'start_working_date', 'mode'],
            object_error: {},
            name_focus: "",
            division_list: [],
            data_group_list: []
        };
        this.getDataGroup = this._getDataGroup.bind(this);
        this.getDivision = this._getDivision.bind(this);
        this.getDetail = this._getDetail.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    _getDataGroup(){
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST, {execute: true});
    }

    _getDivision(){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_DIVISION_LIST);
    }
    _getDetail(id){
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, `${ConstantURL.API_URL_GET_AUTH_STAFF_DETAIL}/${id}`, {});
    }
    _onSave(data, data_required){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, data_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_STAFF_CREATE, object);
        }else{
            object.staff_id = object.id;
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_STAFF_UPDATE, object);
        }
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
    componentDidMount(){
        this.getDataGroup();
        if(!this.props.api[ConstantURL.API_URL_GET_DIVISION_LIST]){
            this.getDivision();
        }
        let {object} = this.props;
        if (object){
            this.getDetail(object.id);
        }
    }

    componentWillReceiveProps(newProps) {
        let id = newProps.object ? newProps.object.id : '';
        if (newProps.api[ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_DATA_GROUP_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_group_list: response.data});
            }
            this.setState({loading: false});
        }
        if (newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_DIVISION_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({division_list: response.data});
            }
        }
        if (newProps.api[`${ConstantURL.API_URL_GET_AUTH_STAFF_DETAIL}${id}`]){
            let response = newProps.api[`${ConstantURL.API_URL_GET_AUTH_STAFF_DETAIL}${id}`];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({object: response.data});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(`${ConstantURL.API_URL_GET_AUTH_STAFF_DETAIL}${id}`);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('StaffPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_STAFF_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('StaffPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_STAFF_UPDATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        if (this.state.loading){
            return(
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall />
                        </div>
                    </div>
                </div>
            )
        }
        let {object, object_error, object_required, name_focus, division_list, data_group_list} = this.state;
        let language_list = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_language_code);
        let modeList = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_staff_mode);
        // let channel_list = this.props.sys.channel.items;
        if(!object.id){
            object_required.push('password');
        }

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Tài khoản</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="email" name="email" label="Email" required={object_required.includes('email')}
                                        error={object_error.email} value={object.email} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            {!object.id && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="password" name="password" label="Mật khẩu" required={object_required.includes('password')} showPass={true}
                                            value={object.password} error={object_error.password} nameFocus={name_focus}
                                            onChange={this.onChange}

                                    />
                                    <p><em><b>Lưu ý:</b> Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 ký tự chữ, 1 ký tự số.</em></p>
                                </div>
                            )}
                            {/*<div className="col-sm-6 col-xs-12 mb10">*/}
                            {/*    <Dropbox name="channel_code" label="Kênh" data={channel_list} required={object_required.includes('channel_code')}*/}
                            {/*             key_value="code" key_title="display_name"*/}
                            {/*             error={object_error.channel_code} value={object.channel_code} nameFocus={name_focus}*/}
                            {/*             onChange={this.onChange}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="code" label="Mã nhân viên" required={object_required.includes('code')}
                                        value={object.code} error={object_error.code} nameFocus={name_focus}
                                        onChange={this.onChange}

                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="data_group_code" label="Nhóm dữ liệu" data={data_group_list} required={object_required.includes('data_group_code')}
                                         key_value="code" key_title="name"
                                         error={object_error.data_group_code} value={object.data_group_code} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <Dropbox name="division_code" label="Bộ phận" data={division_list} required={object_required.includes('division_code')}
                                         key_value="code" key_title="full_name"
                                         error={object_error.division_code} value={object.division_code} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <Dropbox name="mode"
                                         label="Chế độ"
                                         data={modeList}
                                         required={object_required.includes('mode')}
                                         key_value="value"
                                         key_title="title"
                                         error={object_error.mode}
                                         value={object.mode}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="language_code" label="Ngôn ngữ" data={language_list} required={object_required.includes('language_code')}
                                         error={object_error.language_code} value={object.language_code} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Liên hệ</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="display_name" label="Tên hiển thị" required={object_required.includes('display_name')}
                                        error={object_error.display_name} value={object.display_name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="phone" label="Số điện thoại" numberOnly required={object_required.includes('phone')}
                                        error={object_error.phone} value={object.phone} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="xlite_id" label="Line tổng đài" numberOnly required={object_required.includes('xlite_id')}
                                        error={object_error.xlite_id} value={object.xlite_id} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Khác</span>
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <DateTimePicker name="start_working_date" label="Thời gian bắt đầu làm việc" required={object_required.includes('start_working_date')}
                                                error={object_error.start_working_date} value={object.start_working_date} nameFocus={name_focus}
                                                onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 mb10">
                                <DateTimePicker name="end_working_date" label="Thời gian kết thúc làm việc" required={object_required.includes('end_working_date')}
                                                error={object_error.end_working_date} value={object.end_working_date} nameFocus={name_focus}
                                                onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <InputArea name="note" label="Ghi chú" required={object_required.includes('note')} style={{minHeight:"30px", height:"30px"}}
                                           error={object_error.note} value={object.note} nameFocus={name_focus}
                                           onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb20">
                                    <div className="v-input-control">
                                        <label className="v-label sub-title-form" htmlFor="signature">
                                            Chữ ký
                                        </label>
                                        <CKEditor
                                            name="signature"
                                            initData={object.signature}
                                            data={object.signature}
                                            value
                                            config={{
                                                toolbar: [['Bold','Italic','Strike'], [ 'Styles', 'Format', ], ['Image'], ['Source']],
                                                allowedContent: true
                                            }}
                                            onChange={(evt) => {
                                                this.onChange(evt?.editor?.getData(),evt?.editor?.name)
                                            }}
                                        />
                                    </div>
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
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupStaff);
