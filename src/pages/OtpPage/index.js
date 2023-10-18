import React, {Component} from 'react';
import {connect} from "react-redux";
import Input2 from 'components/Common/InputValue/Input2';
import * as authAction from "actions/authAction";
import * as Constant from "utils/Constant";
import {bindActionCreators} from "redux";
import jwt from 'jsonwebtoken';
import {checkOTP, sendOTP} from "api/auth";
import * as uiAction from "actions/uiAction";
import AdminStorage from "utils/storage";
import T from "components/Common/Ui/Translate";

// class CountDown extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             number: props.timer
//         };
//
//         this.process = this._process.bind(this);
//     }
//
//     _process() {
//         const {number} = this.state;
//         setInterval(() => {
//             if(number > 0) {
//                 this.setState({number: number -1});
//             } else {
//                 clearInterval();
//             }
//         }, 1000)
//     }
//
//     componentDidMount() {
//         this.process();
//     }
//
//     render() {
//         const {timer} = this.state;
//         return timer;
//     }
// }

class OtpPage extends Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(AdminStorage.getItem('user'));
        this.state = {
            language: props.language,
            otp_code_error: "",
            user: {
                phone: "",
                email: ""
            },
            search: null,
            number: user?.login_OTP?.otp_expired,
            otp_method: user?.login_OTP?.otp_method,
        };
        this.timer = null;
        this.onChangeOTPCode = this._onChangeOTPCode.bind(this);
        this.onResendOTP = this._onResendOTP.bind(this);
        this.startCountDown = this._startCountDown.bind(this);
    }

    _startCountDown() {
        this.timer = setInterval(() => {
            const {number} = this.state;
            if (number > 0) {
                this.setState({number: number - 1});
            } else {
                clearInterval();
            }
        }, 1000)
    };

    async _onResendOTP(e) {
        e.preventDefault();
        const user = JSON.parse(AdminStorage.getItem('user'));
        const res = await sendOTP({id: user?.id});
        if (res?.code === Constant.CODE_SUCCESS) {
            this.setState({number: user?.login_OTP?.otp_expired});
            this.props.uiAction.putToastSuccess("Gửi mã OTP thành công!");
        } else {
            this.props.uiAction.putToastError(res?.msg);
        }
    }

    async _onChangeOTPCode(value) {
        this.setState({otp_code: value});
        const user = JSON.parse(AdminStorage.getItem('user'));
        if (value.length === 6) {
            if (user?.id) {
                const data = {
                    id: user?.id,
                    channel_code: user?.channel_code,
                    code: value
                };
                const response = await checkOTP(data);
                if (response.code !== Constant.CODE_SUCCESS) {
                    this.setState({otp_code_error: response?.msg});
                } else {
                    const data = response.data;
                    const info = data?.data || {};
                    const user = {...data, ...info}
                    AdminStorage.setItem('token_FE', jwt.sign(user, Constant.JWT_SECRET_KEY));
                    const current_page = AdminStorage.getItem('referrer_url');
                    const url = current_page ? String(current_page) : Constant.BASE_URL;
                    this.props.history.push(url);
                    AdminStorage.removeItem('referrer_url');
                }
            }
        } else {
            this.setState({otp_code_error: ""});
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({language: newProps.language});
    }

    componentDidMount() {
        const user = JSON.parse(AdminStorage.getItem('user'));
        if (user) {
            this.setState({
                user: {
                    phone: user?.phone.substring(0, 3) + '***' + user?.phone.substring(6),
                    email: user?.email.substring(0, 3) + '***' + user?.email.substring(user?.email.search('@'))
                }
            });
        } else {
            this.props.history.push(Constant.BASE_URL_SIGNIN);
        }
        this.startCountDown();
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    render() {
        const {user, number} = this.state;
        return (
            <React.Fragment>
                <div className="dialog-header"><T>Xác Nhận OTP</T></div>
                <div className="dialog-body">
                    <div className="container">
                        <div className="logo">
                            <img src="/assets/img/logo_sv.png" alt="Logo" className="img-logo"/>
                        </div>
                        <div className="col-md-6 col-md-offset-3">
                            <form className="smart-form client-form text-center" onSubmit={(e) => {
                                e.preventDefault();
                            }}>
                                <div>
                                    <div><T>Mã OTP đã được gửi đến</T></div>
                                    {
                                        this.state.otp_method === Constant.OTP_METHOD_EMAIL ?
                                            (<div className="text-bold">{user?.email}</div>) :
                                            (<div className="text-bold">{user?.phone}</div>)
                                    }
                                </div>
                                {this.state.otp_code_error !== "" && (
                                    <div className="alert alert-danger mt20">{this.state.otp_code_error}</div>
                                )}
                                <Input2 type="text" name="otp-code" className="otp-code"
                                        onChange={this.onChangeOTPCode}
                                        numberOnly/>
                                {number > 0 ? (
                                    <>
                                        <div className="mb10 mt10"><T>Mã OTP có hiệu lực tối đa là</T>
                                            <span className="text-bold ml5">{Math.floor(number)}<T> giây</T></span>
                                        </div>
                                        <div className="mt10 mb10">
                                            <p>Nếu chưa nhận được email mã OTP, bấm vào <span className="text-link"
                                                                                              onClick={this.onResendOTP}>đây</span> để
                                                lấy lại.</p>
                                        </div>
                                    </>

                                ) : (
                                    <>
                                        <div className="mb10 mt10 text-red"><T>Mã OTP của bạn đã hết hạn</T></div>
                                        <div className="mt10 mb10">
                                            <p>Bấm vào <span className="text-link"
                                                             onClick={this.onResendOTP}>đây</span> để gửi lại.</p>
                                        </div>
                                    </>
                                )}

                            </form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        language: state.language
    };
}

function mapDispatchToProps(dispatch) {
    return {
        authAction: bindActionCreators(authAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OtpPage);
