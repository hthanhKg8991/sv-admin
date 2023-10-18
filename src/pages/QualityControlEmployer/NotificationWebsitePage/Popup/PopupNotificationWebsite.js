import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import Ckeditor from "components/Common/InputValue/Ckeditor";
import InputFile from "components/Common/InputValue/InputFile";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment";

class PopupNotificationWebsite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['title', 'notify_object', 'notify_type', 'expired_at', 'content'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(data){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        if (this.props.branch.currentBranch) {
            object.channel_code = this.props.branch.currentBranch.channel_code;
            object.branch_code = this.props.branch.currentBranch.code;
        }
        let dataForm = new FormData();
        dataForm.append('file', object.file);
        delete object.file;
        dataForm.append('data', JSON.stringify(object));
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_AUTH_NOTIFICATION_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_AUTH_NOTIFICATION_UPDATE, object);
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
        let {object} = this.props;
        if (object){
            object.from_time = moment(object.from_time,"HHmm");
            object.end_time = moment(object.end_time,"HHmm");
            this.setState({object: object});
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('NotificationWebsitePage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_NOTIFICATION_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_AUTH_NOTIFICATION_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('NotificationWebsitePage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_AUTH_NOTIFICATION_UPDATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {fnDelete, fnDuplicate, isEdit} = this.props;
        let {object, object_error, object_required, name_focus} = this.state;
        let notify_obj = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_notification_object);
        let notify_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_notification_type);
        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="title" label="Tiêu đề" required={object_required.includes('title')}
                                        error={object_error.title} value={object.title} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="notify_object" label="Đối tượng" data={notify_obj} required={object_required.includes('notify_object')}
                                         error={object_error.notify_object} value={object.notify_object} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            {parseInt(object.notify_object) === 4 && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputFile name="file" validateType={["docx","doc","pdf","xls","xlsx"]} isMergeFile={true} onChange={this.onChange}/>
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="notify_type" label="Hình thức thông báo" data={notify_type} required={object_required.includes('notify_type')}
                                         error={object_error.notify_type} value={object.notify_type} nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <DateTimePicker name="expired_at" label="Ngày kết thúc" required={object_required.includes('expired_at')}
                                                error={object_error.expired_at} value={object.expired_at} nameFocus={name_focus}
                                                onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Ckeditor name="content" label="Nội dung thông báo" required={object_required.includes('content')} nameFocus={name_focus}
                                          toolbar={[['Bold', 'Italic', 'Strike'], ['Styles', 'Format'], ['NumberedList', 'BulletedList'], ['Image', 'Table', 'HorizontalRule'], ['Maximize'], ['Source']]}
                                          value={object.content} error={object_error.content}
                                          onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0" />
                    <div className="v-card-action">
                        {!isEdit && (
                            <button type="submit" className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                        )}
                        {isEdit && (
                            <>
                                <button type="submit" className="el-button el-button-success el-button-small">
                                    <span>Cập nhật</span>
                                </button>
                                {Constant.STATUS_ACTIVED !== object?.status && (
                                   <>
                                       <button type="button" className="el-button el-button-primary el-button-small" onClick={() => fnDuplicate(object)}>
                                           <span>Sao chép</span>
                                       </button>
                                       <button type="button" className="el-button el-button-bricky el-button-small" onClick={() => fnDelete(object)}>
                                           <span>Xóa</span>
                                       </button>
                                   </>
                                )}

                            </>
                        )}
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupNotificationWebsite);
