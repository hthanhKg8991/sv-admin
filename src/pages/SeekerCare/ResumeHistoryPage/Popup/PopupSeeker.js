import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import InputImg from "components/Common/InputValue/InputImg";
import Dropbox from 'components/Common/InputValue/Dropbox';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PopupSeeker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_revision: {},
            object_required_add: ['name','email','password','mobile','address','province_id','birthday','gender','marital_status'],
            object_required_edit: ['name','email','mobile','address','province_id','birthday','gender','marital_status'],
            object_error: {},
            name_focus: "",
            loading: true
        };
        this.getObject = this._getObject.bind(this);
        this.getObjectRevision = this._getObjectRevision.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _getObject(){
        let args = {
            seeker_id: this.props.object.id,
            is_update: 1
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER, args);
    }
    _getObjectRevision(){
        let args = {
            seeker_id: this.props.object.id,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSeekerDomain, ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION, args);
    }
    _onChange(value, name){
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object_revision = Object.assign({},this.state.object_revision);
        object_revision[name] = value;
        this.setState({object_revision: object_revision});
    }
    _onSave(event){
        event.preventDefault();
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object_revision = this.state.object_revision;
        let object = this.state.object;
        object = utils.compareObject(object, object_revision);

        let object_required = this.state.object.id ? this.state.object_required_edit : this.state.object_required_add;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_SEEKER_UPDATE, object);
        }
    }
    componentWillMount(){
        if (this.props.object){
            this.getObject();
            this.getObjectRevision();
        }else{
            this.setState({loading: false});
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER] && newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION]){
            let response_object = newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER];
            let response_object_revision = newProps.api[ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION];
            if (response_object.code === Constant.CODE_SUCCESS && response_object_revision.code === Constant.CODE_SUCCESS) {
                let object_revision = response_object_revision.data;
                let object = response_object.data;
                object.password = null;
                this.setState({object: object});
                this.setState({object_revision: object_revision});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_SEEKER);
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_SEEKER_REVISION);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('SeekerPage',{delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SEEKER_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_SEEKER_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('SeekerPage',{delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SEEKER_UPDATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {object, object_revision, object_required_add, object_required_edit, object_error, name_focus} = this.state;

        let object_required = object.id ? object_required_edit : object_required_add;

        let gender = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_gender);
        let marital_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_marital_status);
        let province = this.props.sys.province.items;
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
        return (
            <form onSubmit={this.onSave}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin chung</span>
                            </div>
                            <div className="col-sm-6 col-lg-9 col-xs-12 padding0">
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="name" label="Tên NTV" required={object_required.includes('name')}
                                            error={object_error.name} nameFocus={name_focus}
                                            old_value={object.name}
                                            value={(object_revision.name !== undefined) ? object_revision.name : object.name}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="email" name="email" label="Email đăng nhập" required={object_required.includes('email')}
                                            error={object_error.email} nameFocus={name_focus}
                                            old_value={object.email}
                                            value={(object_revision.email !== undefined) ? object_revision.email : object.email}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="password" name="password" label="Mật khẩu" required={object_required.includes('password')}
                                            error={object_error.password} nameFocus={name_focus}
                                            old_value={object.password}
                                            value={(object_revision.password !== undefined) ? object_revision.password : object.password}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-3 col-xs-12 mb10">
                                <InputImg name="avatar" label="Avatar" style={{width: "170px", height: "170px"}} width={300} height={300} folder="seeker_avatar" maxSize={2} //2M
                                          error={object_error.avatar}
                                          old_value={object.avatar}
                                          value={(object_revision.avatar !== undefined) ? object_revision.avatar : object.avatar}
                                          onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <DateTimePicker name="birthday" label="Ngày sinh" required={object_required.includes('birthday')}
                                                    error={object_error.birthday} nameFocus={name_focus}
                                                    old_value={object.birthday}
                                                    value={(object_revision.birthday !== undefined) ? object_revision.birthday : object.birthday}
                                                    onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <Dropbox name="gender" label="Giới tính" data={gender} required={object_required.includes('gender')}
                                             error={object_error.gender} nameFocus={name_focus}
                                             old_value={object.gender}
                                             value={(object_revision.gender !== undefined) ? object_revision.gender : object.gender}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <Dropbox name="marital_status" label="Hôn nhân" data={marital_status} required={object_required.includes('marital_status')}
                                             error={object_error.marital_status} nameFocus={name_focus}
                                             old_value={object.marital_status}
                                             value={(object_revision.marital_status !== undefined) ? object_revision.marital_status : object.marital_status}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="address" label="Địa chỉ" required={object_required.includes('address')}
                                            error={object_error.address} nameFocus={name_focus}
                                            old_value={object.address}
                                            value={(object_revision.address !== undefined) ? object_revision.address : object.address}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="province_id" label="Tỉnh/thành phố" data={province} key_value="id" key_title="name" required={object_required.includes('province_id')}
                                             error={object_error.province_id} nameFocus={name_focus}
                                             old_value={object.province_id}
                                             value={(object_revision.province_id !== undefined) ? object_revision.province_id : object.province_id}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="mobile" label="Di động" required={object_required.includes('mobile')} numberOnly
                                            error={object_error.mobile} nameFocus={name_focus}
                                            old_value={object.mobile}
                                            value={(object_revision.mobile !== undefined) ? object_revision.mobile : object.mobile}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="phone" label="Điện thoại" required={object_required.includes('phone')} numberOnly
                                            error={object_error.phone} nameFocus={name_focus}
                                            old_value={object.phone}
                                            value={(object_revision.phone !== undefined) ? object_revision.phone : object.phone}
                                            onChange={this.onChange}
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupSeeker);
