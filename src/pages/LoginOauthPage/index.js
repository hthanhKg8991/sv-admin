import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';
import {postLoginSocial} from "api/auth";
import _ from "lodash";
import {connect} from "react-redux";
import AdminStorage from "utils/storage";
import jwt from "jsonwebtoken";
import * as Constant from "utils/Constant";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listStaff: null,
            token: null
        };
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

    render() {
        return (<React.Fragment>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_SV_GG_CLIENT_ID}>
                    <div className="v-dialog-content">
                        <div className={`v-dialog ${this.state.listStaff && 'v-dialog-list'}`}>
                            <div className="v-card">
                                <div className="dialog-header">Đăng Nhập</div>
                                <div className="dialog-body">
                                    <div className="logo">
                                        <img src="/assets/img/logo_sv.png" alt="Logo" className="img-logo"/>
                                    </div>
                                    <div className="container mt-auto">
                                        {!this.state.listStaff && (
                                            <div className="">
                                                <div className="google-cls">
                                                    <GoogleLogin
                                                        size="large"
                                                        shape="circle"
                                                        width="245"
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
        uiAction: bindActionCreators(uiAction, dispatch), apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
