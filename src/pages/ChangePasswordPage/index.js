import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import _ from "lodash";
import * as Yup from "yup";
import FormComponent from "./FormComponent";
import FormBase from "components/Common/Ui/Form";
import queryString from 'query-string';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {resetPassword} from 'api/auth';

class index extends Component {
    constructor (props) {
        super(props);
        this.state = {
            item: {},
            loading: false,
            initialForm: {
                "password": "password",
                "re_password": "re_password",
            },
        };
        
        this.onSubmit = this._onSubmit.bind(this);
        this.goBack = this._goBack.bind(this)
    }

    _onSubmit(data, action) {
        const {setErrors} = action;
        const dataSubmit = _.pickBy(data, (item, key) => {
            return !_.isUndefined(item);
        });

        this.setState({loading: true}, () => {
            this.submitData(dataSubmit, setErrors);
        });
    }

    async submitData(data, setErrors) {
        
        const query = queryString.parse(window.location.search);
        
        const {uiAction, history} = this.props;
        
        const res = await resetPassword({...data,token_reset:query?.token,id:query?.id});

        this.setState({loading: false});
        if (res) {
            const {data, code, msg} = res;
            if (code === Constant.CODE_SUCCESS) {
                uiAction.putToastSuccess("Đặt lại mật khẩu thành công!");
                history.push({
                    pathname: Constant.BASE_URL_SIGNIN
                });
            } else {
                setErrors(data);
                uiAction.putToastError(msg);
            }
        }
    };

    _goBack() {
        const {history} = this.props;

        history.push({
            pathname: Constant.BASE_URL_SIGNIN
        });
    }

    componentDidMount(){
        
        const {history} = this.props;
        let query = queryString.parse(window.location.search);

        if(!query?.token || !query?.id){
            history.push({
                pathname: Constant.BASE_URL_SIGNIN
            });
        }
    }

    render () {
        
        const {initialForm, item, loading} = this.state;
        const shapeValidateDefault = {
            password: Yup.string().min(6,Constant.MSG_MIN_CHARATER_DYNAMIC(6)).max(100,Constant.MSG_MAX_CHARATER_DYNAMIC(100)).required(Constant.MSG_REQUIRED),
            re_password: Yup.string().oneOf([Yup.ref('password'), null], 'Không giống với mật khẩu đã nhập!').required(Constant.MSG_REQUIRED),
        };
        const validationSchema = Yup.object().shape({
            ...shapeValidateDefault
        });

        const fieldWarnings = [];

        const dataForm = item ? utils.initFormValue(initialForm, item) : utils.initFormKey(initialForm);

        return (
            <React.Fragment>
                <div className="v-overlay"/>
                <div className="v-dialog-content">
                    <div className="v-dialog">
                        <div className="v-card">
                            <div className="dialog-header">Đặt lại mật khẩu</div>
                            <div className="dialog-body">
                                <div className="logo">
                                    <img src="/assets/img/logo_sv.png" alt="Logo" className="img-logo"/>
                                </div>
                                <div className="container">
                                    {loading ? <LoadingSmall style={{textAlign:"center"}}/>
                                    : <FormBase onSubmit={this.onSubmit}
                                            initialValues={dataForm}
                                            validationSchema={validationSchema}
                                            fieldWarnings={fieldWarnings}
                                            FormComponent={FormComponent}>
                                        <div className={"row mt15"}>
                                            <div className='col-md-12'>
                                                <button type="submit" style={{width:"100%"}} className=" el-button el-button-success el-button-small">
                                                    <span>Xác nhận</span>
                                                </button>     
                                            </div>
                                            <div className='col-md-12 mt-10'>
                                                <button type="button" style={{width:"100%"}} className="el-button el-button-default el-button-small"
                                                        onClick={() => this.goBack()}>
                                                    <span>Quay lại</span>
                                                </button>
                                            </div>
                                        </div>
                                    </FormBase>}
                                </div>
                            </div>
                            <div className="dialog-footer">
                                <div className="text-center"><span className="">Tiếng Việt</span><span> | </span><span className="choose-language">English</span></div>
                            </div>
                        </div>
                    </div>
                </div>
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
