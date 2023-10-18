import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
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

class RevertPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['password'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
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

        const staff = this.props.object;

        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_AUTH_STAFF_REVERT_PASSWORD, {
            staff_id: staff.id,
            ...data
        });
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

    componentDidMount(){}

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_REVERT_PASSWORD]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_STAFF_REVERT_PASSWORD];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('StaffPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_STAFF_REVERT_PASSWORD);
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
        let {object, object_error, object_required, name_focus} = this.state;

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object, object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Khôi phục mật khẩu</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="password" label="Mật khẩu" required={object_required.includes('password')}
                                        error={object_error.password} value={object.password} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                                <p><em><b>Lưu ý:</b> Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 ký tự chữ, 1 ký tự số.</em></p>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Đổi mật khẩu</span>
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
export default connect(mapStateToProps,mapDispatchToProps)(RevertPassword);
