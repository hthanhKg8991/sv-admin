import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import Dropbox from 'components/Common/InputValue/Dropbox';
import Ckeditor from 'components/Common/InputValue/Ckeditor';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {publish} from "utils/event";

class PopupTemplateMail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object),
            object_error: {},
            object_required:['code','subject','email_type','content']
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(object){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();

        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_GET_TEMPLATE_MAIL_CREATE, object);
        }else{
            object.email_template_id = object.id;
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_GET_TEMPLATE_MAIL_EDIT, object);
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
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('TemplateMailPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.uiAction.deletePopup();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEMPLATE_MAIL_CREATE);
            publish(".refresh", {}, this.props.idKey);
        }
        if (newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_GET_TEMPLATE_MAIL_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('TemplateMailPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.uiAction.deletePopup();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_TEMPLATE_MAIL_EDIT);
            publish(".refresh", {}, this.props.idKey);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {object, object_error, object_required, name_focus} = this.state;
        let email_template_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_email_template_type);
        let email_template_load = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_email_template_load);
        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="code" label="Tên mail" required={object_required.includes('code')} readOnly={!!object.id}
                                        error={object_error.code} value={object.code} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="subject" label="Tiêu đề mail" required={object_required.includes('subject')}
                                        error={object_error.subject} value={object.subject} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="default_name" label="Tên mặc định" required={object_required.includes('default_name')}
                                        error={object_error.default_name} value={object.default_name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="default_email" label="Mail mặc định" required={object_required.includes('default_email')}
                                        error={object_error.default_email} value={object.default_email} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="email_load_all" label="Tất cả kênh" data={email_template_load} required={object_required.includes('email_load_all')}
                                         value={object.email_load_all} error={object_error.email_load_all} nameFocus={this.state.name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="email_type" label="Loại hỗ trợ" data={email_template_type} required={object_required.includes('email_type')}
                                         value={object.email_type} error={object_error.email_type} nameFocus={this.state.name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="priority" label="Priority" required={object_required.includes('priority')}
                                        error={object_error.priority} value={object.priority} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Ckeditor name="content" label="Nội dung" height={300} required={object_required.includes('content')}
                                          toolbar={[['Bold','Italic','Strike'], [ 'Styles', 'Format'], ['NumberedList','BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                          value={object.content} error={object_error.content}
                                          onChange={this.onChange}
                                />
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
        api: state.api,
        sys: state.sys
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupTemplateMail);
