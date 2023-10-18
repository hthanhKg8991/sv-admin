import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as authAction from "actions/authAction";
import * as utils from "utils/utils";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";

class ChangePass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: Object.assign({}, props.user),
            user_error: {},
            user_require: ['password_old', 'password_new', 're_password_new'],
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
        if (user.password_new !== user.re_password_new) {
            let user_error = {};
            user_error.re_password_new = 'Mật khẩu xác nhận không khớp.';
            this.setState({name_focus: "re_password_new"});
            this.setState({user_error: user_error});
            return;
        }
        let args = {
            id: user.id,
            password_old: user.password_old,
            password_new: user.password_new,
            re_password_new: user.re_password_new
        };
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_CHANGE_PASS, args);
        this.props.uiAction.showLoading();
    }

    componentWillReceiveProps(newProps) {
        this.props.uiAction.hideLoading();
        if (newProps.api[ConstantURL.API_URL_POST_CHANGE_PASS]){
            let response = newProps.api[ConstantURL.API_URL_POST_CHANGE_PASS];
            if (response.code === Constant.CODE_SUCCESS){
                this.props.uiAction.putToastSuccess("Đổi mật khẩu thành công.");
                this.props.uiAction.deletePopup();
                this.props.authAction.logout();
            }else{
                this.setState({user_error: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CHANGE_PASS);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let user_require = this.state.user_require;
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <form>
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Thông tin</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="password" name="password_old" label="Mật khẩu hiện tại" showPass={true} required={user_require.includes('password_old')}
                                       error={this.state.user_error.password_old} value={this.state.user.password_old} nameFocus={this.state.name_focus}
                                       onChange={this.onChange}/>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="password" name="password_new" label="Mật khẩu mới" showPass={true} required={user_require.includes('password_new')}
                                       error={this.state.user_error.password_new} value={this.state.user.password_new} nameFocus={this.state.name_focus}
                                       onChange={this.onChange}/>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="password" name="re_password_new" label="Xác nhận mật khẩu mới" showPass={true} required={user_require.includes('re_password_new')}
                                       error={this.state.user_error.re_password_new} value={this.state.user.re_password_new} nameFocus={this.state.name_focus}
                                       onChange={this.onChange}/>
                            </div>
                        </div>
                    </form>
                </div>
                <hr className="v-divider margin0"/>
                <div className="v-card-action">
                    <button type="button" className="el-button el-button-success el-button-small"
                            onClick={this.onSave}>
                        <span>Lưu</span>
                    </button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        authAction: bindActionCreators(authAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePass);
