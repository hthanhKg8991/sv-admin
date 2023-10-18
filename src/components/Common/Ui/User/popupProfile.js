import React, {Component} from "react";
import Dropbox from 'components/Common/InputValue/Dropbox';
import Input2 from 'components/Common/InputValue/Input2';
import InputImg from 'components/Common/InputValue/InputImg';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as authAction from "actions/authAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import { CKEditor } from 'ckeditor4-react';

class PopupProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: Object.assign({}, props.user),
            user_require: ['display_name', 'language_code', 'login_name'],
            user_error: {},
            name_focus: ""
        };

        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onChange(value, name){
        let user_error = this.state.user_error;
        delete user_error[name];
        this.setState({user_error: user_error});
        this.setState({name_focus: ""});
        let user = this.state.user;
        user[name] = value;
        this.setState({user: user});
    }
    _onSave(e) {
        e.preventDefault();
        this.setState({user_error: {}});
        this.setState({name_focus: ""});
        let user = this.state.user;
        let check = utils.checkOnSaveRequired(user, this.state.user_require);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        let args = {
            id: user.id,
            display_name: user.display_name,
            language_code: user.language_code,
            login_name: user.login_name,
            avatar_path: user.avatar_path,
            signature: user.signature,
        };
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_CHANGE_PROFILE, args);
        this.props.uiAction.showLoading();
    }

    componentWillReceiveProps(newProps) {
        this.props.uiAction.hideLoading();
        if (newProps.api[ConstantURL.API_URL_POST_CHANGE_PROFILE]){
            let response = newProps.api[ConstantURL.API_URL_POST_CHANGE_PROFILE];
            if (response.code === Constant.CODE_SUCCESS){
                const data = response.data;
                const info = data?.data || {};
                const user = {...data, ...info}
                this.props.authAction.changeProfile(user);
                this.props.uiAction.putToastSuccess("Đổi thông tin thành công!");
                this.props.uiAction.deletePopup();
            }else{
                this.setState({user_error: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CHANGE_PROFILE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        let data_lang = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_language_code);
        let user_require = this.state.user_require;
        return (
            <form onSubmit={this.onSave}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Thông tin</span>
                            </div>
                            <div className="col-sm-6 col-lg-8 col-xs-12">
                                <div className="mb10">
                                    <Input2 type="text" name="login_name" label="Tên đăng nhập" required={user_require.includes('login_name')} readOnly={true}
                                            error={this.state.user_error.login_name} value={this.state.user.login_name} nameFocus={this.state.name_focus}
                                            onChange={this.onChange}/>
                                </div>
                                <div className="mb10">
                                    <Input2 type="text" name="display_name" label="Tên hiển thị" required={user_require.includes('display_name')}
                                           error={this.state.user_error.display_name} value={this.state.user.display_name} nameFocus={this.state.name_focus}
                                           onChange={this.onChange}/>
                                </div>
                                <div className="mb20">
                                    <Dropbox name="language_code" label="Ngôn ngữ" data={data_lang} required={user_require.includes('language_code')}
                                             error={this.state.user_error.language_code} value={this.state.user.language_code} nameFocus={this.state.name_focus}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="mb20">
                                    <div className="v-input-control">
                                        <label className="v-label sub-title-form" htmlFor="signature">
                                            Chữ ký
                                        </label>
                                        <CKEditor
                                            name="signature"
                                            initData={this.state.user.signature || ""}
                                            data={this.state.user.signature || ""}
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
                            <div className="col-sm-6 col-lg-4 col-xs-12 mb10">
                                <InputImg style={{width: "200px", height: "200px"}} name="avatar_path" label="Ảnh đại diện" width={300} height={300} folder="user" maxSize={2} //2M
                                          error={this.state.user_error.avatar_path} value={this.state.user.avatar_path}
                                          onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
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
        user: state.user,
        api: state.api,
        sys: state.sys
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        authAction: bindActionCreators(authAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupProfile);
