import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input2 from 'components/Common/InputValue/Input2';
import config from 'config';
import jwt from 'jsonwebtoken';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as utils from "utils/utils";
import _ from "lodash";
import AdminStorage from "utils/storage";
import {postLoginSocial} from "api/auth";
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';

const LOG_GMAIL = 'gmail';
const LOG_PASS = 'password';
const LOG_ALL = 'all';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            user_error: {},
            name_focus: "login_name",
            step: Constant.LOGIN_STEP_0,
            listStaff: null,
            token: null,
            optionLogin: process.env.REACT_APP_SV_LOGIN || LOG_ALL,
        };
        this.onSigninStep1 = this._onSigninStep1.bind(this);
        this.onSigninStep2 = this._onSigninStep2.bind(this);
        this.sendForgotEmail = this._sendForgotEmail.bind(this);
        this.onBackSignin = this._onBackSignin.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    handleChoseUser = async (user) => {
        const {login_name} = user;
        const {token} = this.state;
        await this.onLogin({...token, loginName: login_name});
    }

    onLogin = async (token) => {
        const data = await postLoginSocial(token);
        const {loginCode, response} = data;
        // email có nhiều loginName
        if (loginCode === 8006) {
            this.setState({listStaff: response, token});
            return;
        }
        if (loginCode === 200) {
            console.log("data1:", response);
            const info = _.get(response, 'data', {});
            const user = {...response, ...info}
            AdminStorage.setItem('token_FE', jwt.sign(user, Constant.JWT_SECRET_KEY));
            const current_page = AdminStorage.getItem('referrer_url');
            AdminStorage.removeItem('referrer_url');
            const url = current_page ? String(current_page) : Constant.BASE_URL;
            window.location.replace(url);
        }
    }

    onError = (error) => {
        this.props.uiAction.putToastError(JSON.stringify(error));
    }

    _onChange(value, name) {
        let user_error = this.state.user_error;
        delete user_error[name];
        this.setState({user_error: user_error});
        let user = Object.assign({}, this.state.user);
        user[name] = value;
        this.setState({user: user});
    }

    _onSigninStep1(event){
        event.preventDefault();
        this.setState({user_error: {}});
        this.setState({name_focus: ""});
        let user = this.state.user;
        let check = utils.checkOnSaveRequired(user, ['login_name']);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        user.step = Constant.LOGIN_STEP_1;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_SIGNIN, user);
        this.props.uiAction.showLoading();
    }

    _onSigninStep2(event){
        event.preventDefault();
        this.setState({user_error: {}});
        this.setState({name_focus: ""});
        let user = this.state.user;
        let check = utils.checkOnSaveRequired(user, ['password']);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        user.step = Constant.LOGIN_STEP_2;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_SIGNIN, user);
        this.props.uiAction.showLoading();
    }

    _onBackSignin(event){
        event.preventDefault();
        this.setState({step: Constant.LOGIN_STEP_0});
        this.setState({user: {}});
    }

    _sendForgotEmail() {
        let {id} = this.state.user;
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_FORGOT_PASS, {id:id});
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_SIGNIN]){
            let response = newProps.api[ConstantURL.API_URL_POST_SIGNIN];
            if (response.code === Constant.CODE_SUCCESS){
                if (response.info?.args?.step === Constant.LOGIN_STEP_1) {
                    this.setState({user: response.data});
                    this.setState({step: Constant.LOGIN_STEP_1});
                }
                if (response.info?.args?.step === Constant.LOGIN_STEP_2) {
                    this.props.uiAction.putToastSuccess("Đăng nhập thành công.");

                    //const user = response.data;
                    const data = response.data;
                    const info = _.get(data, 'data', {});
                    const user = {...data, ...info}

                    if (parseInt(user.login_OTP.otp_status) === Constant.OTP_STATUS_TRUE){
                        AdminStorage.setItem('user', JSON.stringify(user));
                        this.props.history.push(Constant.BASE_URL_OTP + window.location.search);
                    }else {
                        //redirects
                        AdminStorage.setItem('token_FE', jwt.sign(user, Constant.JWT_SECRET_KEY));
                        const current_page = AdminStorage.getItem('referrer_url');
                        AdminStorage.removeItem('referrer_url');
                        const url = current_page ? String(current_page) : Constant.BASE_URL;
                        // this.props.history.push(url);
                        window.location.replace(url)
                    }
                }
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SIGNIN);
        }
        if (newProps.api[ConstantURL.API_URL_POST_FORGOT_PASS]) {
            let response = newProps.api[ConstantURL.API_URL_POST_FORGOT_PASS];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess(response.data);
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_FORGOT_PASS);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {optionLogin} = this.state;
        return (
            <React.Fragment>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_SV_GG_CLIENT_ID}>
                    <div className="v-overlay"/>
                    <div className="v-dialog-content">
                        <div className={`v-dialog ${this.state.listStaff && 'v-dialog-list'}`}>
                            <div className="v-card">
                                <div className="dialog-header">Đăng Nhập</div>
                                <div className="dialog-body">
                                    <div className="logo">
                                        <img src="/assets/img/logo_sv.png" alt="Logo" className="img-logo"/>
                                    </div>
                                    {[LOG_PASS, LOG_ALL].includes(optionLogin) && (
                                        <div className="container">
                                            {this.state.step === Constant.LOGIN_STEP_0 && (
                                                <form id="login-form" className="smart-form client-form"
                                                      onSubmit={this.onSigninStep1}>
                                                    <div className="form-group mb15">
                                                        <Input2 type="email" name="login_name" label="Tên đăng nhập"
                                                                required={1}
                                                                value={this.state.user.login_name}
                                                                error={this.state.user_error.login_name}
                                                                nameFocus={this.state.name_focus}
                                                                onChange={this.onChange}

                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="submit"
                                                                className="right el-button el-button-success el-button-small">
                                                            <span>Tiếp tục</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                            {this.state.step === Constant.LOGIN_STEP_1 && (
                                                <form id="login-form" className="smart-form client-form"
                                                      onSubmit={this.onSigninStep2}>
                                                    <div className="form-group text-center mb15">
                                                        <div>Xin chào, <span className="text-bold pointer"
                                                                             onClick={this.onBackSignin}>{this.state.user.login_name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb15">
                                                        <Input2 type="password" name="password" label="Mật khẩu"
                                                                required={1} showPass={true}
                                                                value={this.state.user.password}
                                                                error={this.state.user_error.password}
                                                                nameFocus={this.state.name_focus}
                                                                onChange={this.onChange}

                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="button"
                                                                className="el-button btn-link el-button--text">
                                                            <span onClick={this.sendForgotEmail}>Quên mật khẩu</span>
                                                        </button>
                                                        <button type="submit"
                                                                className="el-button el-button-success el-button-small right">
                                                            <span>Tiếp tục</span>
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                    <hr/>
                                    {[LOG_GMAIL, LOG_ALL].includes(optionLogin) && (
                                        <div className="container mt-auto">
                                            {!this.state.listStaff && (
                                                <div className="">
                                                    <div className="google-cls">
                                                        <GoogleLogin
                                                            size="large"
                                                            shape="circle"
                                                            width="245px"
                                                            theme="filled_blue"
                                                            logo_alignment="center"
                                                            auto_select={false}
                                                            cancel_on_tap_outside={false}
                                                            useOneTap={false}
                                                            onSuccess={this.onLogin}
                                                            onError={this.onError}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {this.state.listStaff &&
                                                (<>
                                                    <div className="alert alert-warning fade in">
                                                        <i className="fa-fw fa fa-warning"></i>
                                                        <strong>Chú ý</strong> Email của bạn
                                                        có {this.state.listStaff.length || 1} tài khoản vui
                                                        lòng chọn 1 để tiếp tục
                                                    </div>
                                                    <table className="table table-striped table-forum">
                                                        <thead>
                                                        <tr>
                                                            <th colSpan="1" className="hidden-xs hidden-sm">ID</th>
                                                            <th colSpan="1" className="hidden-xs hidden-sm">Tên</th>
                                                            <th className="text-center "
                                                            >Tài khoản
                                                            </th>
                                                            <th className="text-center hidden-xs hidden-sm"
                                                            >Email
                                                            </th>
                                                            <th className="hidden-xs hidden-sm">
                                                                Người tạo
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {this.state.listStaff.map((user) => (
                                                            <tr key={user.id}>
                                                                <td className="text-center hidden-xs hidden-sm">{user.id}
                                                                </td>
                                                                <td className="hidden-xs hidden-sm">
                                                                    <h4><a href="#">
                                                                        {user.code} {user.display_name}
                                                                    </a>
                                                                        <small>{user.phone}</small>
                                                                    </h4>
                                                                </td>
                                                                <td className="text-center ">
                                                                    <a href="#">{user.login_name}</a>
                                                                    <button
                                                                        onClick={() => this.handleChoseUser(user)}
                                                                        className="visible-sx hidden-lg el-button el-button-primary el-button-small">
                                                                        Chọn
                                                                    </button>
                                                                </td>
                                                                <td className="text-center hidden-xs hidden-sm">
                                                                    <a href="#">{user.email}</a>
                                                                </td>
                                                                <td className="hidden-xs hidden-sm">
                                                                    <a href="#">{user.created_by}</a>
                                                                    <br/>
                                                                    <small>
                                                                        <i>{user.created_at}</i>
                                                                    </small>
                                                                </td>
                                                                <td className="">
                                                                    <button
                                                                        onClick={() => this.handleChoseUser(user)}
                                                                        className="el-button el-button-primary el-button-small hidden-xs hidden-sm">
                                                                        Chọn
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </>)
                                            }
                                        </div>
                                    )}
                                </div>
                                <div className="dialog-footer">
                                    <div className="text-center"><span
                                        className="">Tiếng Việt</span><span> | </span><span
                                        className="choose-language">English</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GoogleOAuthProvider>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
