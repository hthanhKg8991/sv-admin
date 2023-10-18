import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import Dropbox from 'components/Common/InputValue/Dropbox';
import DropboxGroup from 'components/Common/InputValue/DropboxGroup';
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
import _ from "lodash";

class PopupEmployerCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: [
                'name','email','password','province_id', 'fields_activity', 'company_size','contact_name',
                'contact_email','contact_phone', 'assigned_staff_id'
            ],
            object_error: {},
            name_focus: "",
            loading: false,
            vsicList: [],
            customerList: [],
            provinceList: this.props.sys.province.items,
            companySizeList: utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_employer_company_size)
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getVsicField = this._getVsicField.bind(this);
        this.getCustomerList = this._getCustomerList.bind(this);
    }

    _getVsicField() {
        let args = {
            'filter_channel_code' : this.props.branch.currentBranch.channel_code,
            'status' : Constant.STATUS_ACTIVED
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_VSIC_FIELD, args);
    }

    _getCustomerList() {
        let args = {
            status : Constant.STATUS_ACTIVED,
            'division_code[]' : [Constant.DIVISION_TYPE_customer_care_member, Constant.DIVISION_TYPE_customer_care_leader],
            execute: true,
            scopes: true
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_AUTH_STAFF_LIST, args);
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

    _onSave(event){
        event.preventDefault();
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object = this.state.object;
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_CREATE, object);
    }

    componentDidMount() {
        this.getVsicField();
        this.getCustomerList();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thêm Nhà tuyển dụng thành công!");
                this.props.uiAction.deletePopup();
                //this.props.uiAction.refreshList('EmployerPage',{delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_CREATE);
        }

        if (newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_AUTH_STAFF_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({customerList: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_AUTH_STAFF_LIST);
        }

        if (newProps.api[ConstantURL.API_URL_GET_VSIC_FIELD]){
            let response = newProps.api[ConstantURL.API_URL_GET_VSIC_FIELD];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({vsicList: response.data})
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_VSIC_FIELD);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
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
        let {object, object_required, object_error, name_focus, vsicList, customerList, provinceList, companySizeList} = this.state;
        return (
            <form onSubmit={this.onSave}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin chung</span>
                            </div>

                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text"
                                        name="name"
                                        offAutoComplete
                                        label="Tên nhà tuyển dụng"
                                        required={object_required.includes('name')}
                                        error={object_error.name}
                                        nameFocus={name_focus}
                                        value={_.get(object, 'name', null)}
                                        onChange={this.onChange}
                                />
                            </div>

                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="email" name="email" label="Email đăng nhập"
                                        required={object_required.includes('email')}
                                        offAutoComplete
                                        error={object_error.email}
                                        nameFocus={name_focus}
                                        value={_.get(object, 'email', null)}
                                        onChange={this.onChange}
                                />
                            </div>

                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="password" name="password" label="Mật khẩu"
                                        offAutoComplete
                                        required={object_required.includes('password')}
                                        showPass={true}
                                        error={object_error.password}
                                        nameFocus={name_focus}
                                        value={null}
                                        onChange={this.onChange}

                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0 mb10">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="province_id" label="Tỉnh/thành phố"
                                             required={object_required.includes('province_id')}
                                             data={provinceList}
                                             key_value="id"
                                             key_title="name"
                                             error={object_error.province_id}
                                             nameFocus={name_focus}
                                             value={_.get(object, 'province_id', null)}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="company_size" label="Quy mô công ty"
                                             required={object_required.includes('company_size')}
                                             data={companySizeList}
                                             error={object_error.company_size}
                                             nameFocus={name_focus}
                                             value={_.get(object, 'company_size', null)}
                                             onChange={this.onChange}
                                    />
                                </div>
                            </div>

                            <div className="col-sm-12 col-xs-12 mb10">
                                <DropboxGroup name="fields_activity" label="Lĩnh vực hoạt động"
                                              required={object_required.includes('fields_activity')}
                                              data={vsicList}
                                              key_value="id"
                                              key_title="name"
                                              key_group="parent"
                                              error={object_error.fields_activity}
                                              nameFocus={name_focus}
                                              value={_.get(object, 'fields_activity', [])}
                                              onChange={this.onChange}
                                />
                            </div>

                            <div className="col-sm-12 col-xs-12 mb10">
                                <Dropbox name="assigned_staff_id" label="Chăm sóc khách hàng"
                                         required={object_required.includes('assigned_staff_id')}
                                         data={customerList}
                                         key_value="id"
                                         key_title="login_name"
                                         error={object_error.assigned_staff_id}
                                         nameFocus={name_focus}
                                         value={_.get(object, 'assigned_staff_id', null)}
                                         onChange={this.onChange}
                                />
                            </div>

                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Liên hệ</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="contact_name" label="Tên người liên hệ"
                                        offAutoComplete
                                        required={object_required.includes('contact_name')}
                                        error={object_error.contact_name}
                                        nameFocus={name_focus}
                                        value={_.get(object, 'contact_name', null)}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0 mb10">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="email" name="contact_email" label="Email liên hệ"
                                        required={object_required.includes('contact_email')}
                                        error={object_error.contact_email}
                                        nameFocus={name_focus}
                                        value={_.get(object, 'contact_email', null)}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="contact_phone" label="Số điện thoại liên hệ"
                                            required={object_required.includes('contact_phone')}
                                            error={object_error.contact_phone}
                                            nameFocus={name_focus}
                                            value={_.get(object, 'contact_phone', null)}
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
        api: state.api,
        user: state.user,
        branch: state.branch
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupEmployerCreate);
