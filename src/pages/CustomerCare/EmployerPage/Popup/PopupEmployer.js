import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import InputImg from "components/Common/InputValue/InputImg";
import InputArea from "components/Common/InputValue/InputArea";
import Dropbox from 'components/Common/InputValue/Dropbox';
import DropboxGroup from 'components/Common/InputValue/DropboxGroup';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import queryString from 'query-string';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";

class PopupEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_revision: {},
            object_required_add: [
                'name','email','password','address','province_id','phone','company_size','description','contact_name',
                'contact_email','contact_phone','contact_address'
            ],
            object_required_edit: [
                'name','email','address','province_id','phone','company_size','description','contact_name',
                'contact_email','contact_phone','contact_address'
            ],
            field_disabled: [],
            object_error: {},
            name_focus: "",
            loading: true,
            vsic_field: [],
            role_root: [Constant.DIVISION_TYPE_admin, Constant.DIVISION_TYPE_root, Constant.DIVISION_TYPE_quality_control_employer],
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getObject = this._getObject.bind(this);
        this.getObjectRevision = this._getObjectRevision.bind(this);
        this.getFieldDisabledByRole = this._getFieldDisabledByRole.bind(this);
        this.getVsicField = this._getVsicField.bind(this);
    }

    _getVsicField() {
        let args = {
            'filter_channel_code' : this.props.branch.currentBranch.channel_code,
            'status' : Constant.STATUS_ACTIVED
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSystemDomain, ConstantURL.API_URL_GET_VSIC_FIELD, args);
    }

    _getObject(){
        let args = {
            id: this.props.object.id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER, args);
    }
    _getObjectRevision(){
        let args = {
            employer_id: this.props.object.id,
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION, args);
    }

    _getFieldDisabledByRole() {
        if (this.props.user.isRole(this.state.role_root)) {
            this.setState({field_disabled:[]});
            return;
        }

        let field_disabled = ['name', 'email', 'address', 'phone', 'tax_code', 'company_size', 'contact_name', 'contact_email', 'contact_phone', 'contact_address', 'fields_activity'];
        this.setState({field_disabled:field_disabled});
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
        let params = queryString.parse(window.location.search);
        if(params.status_cheat) {
            object.status = params.status_cheat;
        }
        if (!object.id) {
            this.props.apiAction.requestApi(
                apiFn.fnPost,
                config.apiEmployerDomain,
                ConstantURL.API_URL_POST_EMPLOYER_CREATE,
                object
            );
        } else {
            let urlEdit = this.props.user.isRole(this.state.role_root)
                ? ConstantURL.API_URL_POST_EMPLOYER_EDIT
                : ConstantURL.API_URL_POST_EMPLOYER_EDIT_BY_CUSTOMER;

            this.props.apiAction.requestApi(
                apiFn.fnPost,
                config.apiEmployerDomain,
                urlEdit,
                object
            );
        }
    }

    componentDidMount() {
        this.getVsicField();

        if (this.props.object) {
            this.getObject();
            this.getObjectRevision();
            this.getFieldDisabledByRole();
        } else {
            this.setState({ loading: false });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER] && newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION]){
            let response_object = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER];
            let response_object_revision = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION];
            if (response_object.code === Constant.CODE_SUCCESS && response_object_revision.code === Constant.CODE_SUCCESS) {
                let object_revision = response_object_revision.data;
                let object = response_object.data;
                if (_.has(object, 'contact_info')) {
                    object.contact_name = object.contact_info.contact_name;
                    object.contact_email = object.contact_info.contact_email;
                    object.contact_address = object.contact_info.contact_address;
                    object.contact_phone = object.contact_info.contact_phone;
                    object.contact_method = object.contact_info.contact_method;
                }

                object.password = null;
                object_revision.email = object.email;
                this.setState({object: object});
                this.setState({object_revision: object_revision});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER);
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER_REVISION);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPage',{delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_EDIT]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPage',{delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_EDIT);
        }
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_EDIT_BY_CUSTOMER]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_EDIT_BY_CUSTOMER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPage',{delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_EDIT_BY_CUSTOMER);
        }
        if (newProps.api[ConstantURL.API_URL_GET_VSIC_FIELD]){
            let response = newProps.api[ConstantURL.API_URL_GET_VSIC_FIELD];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({vsic_field: response.data})
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_VSIC_FIELD);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
        //return  JSON.stringify(nextState) !== JSON.stringify(this.state)
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
        let {object, object_revision, object_required_add, object_required_edit, object_error, field_disabled, role_root, name_focus} = this.state;
        let object_required = object.id ? object_required_edit : object_required_add;

        let employer_company_size = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_company_size);
        let employer_contact_method = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_contact_method);
        let employer_staff_age_range = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_staff_age_range);
        let listYear = utils.getListYear(50);
        let province = this.props.sys.province.items;
        let params = queryString.parse(window.location.search);
        let employer_status = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_status);
        employer_status = employer_status.filter(c => [Constant.STATUS_INACTIVED, Constant.STATUS_ACTIVED].includes(parseInt(c.value)));

        // let division_code = this.props.user && this.props.user.division_code ? this.props.user.division_code : '';
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
                                        label="Tên NTD"
                                        required={object_required.includes('name')}
                                        error={object_error.name}
                                        nameFocus={name_focus}
                                        old_value={object.name}
                                        value={(object_revision.name !== undefined) ? object_revision.name : object.name}
                                        onChange={this.onChange}
                                        readOnly={field_disabled.includes('name')}
                                />
                            </div>
                            {params.dev && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="status"
                                             label="Trạng thái"
                                             required={object_required.includes('status')}
                                             data={employer_status}
                                             error={object_error.status}
                                             nameFocus={name_focus}
                                             old_value={object.status}
                                             value={(object_revision.status !== undefined) ? object_revision.status : object.status}
                                             onChange={this.onChange}
                                             readOnly={field_disabled.includes('password')}
                                    />
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="email"
                                        name="email"
                                        label="Email đăng nhập"
                                        required={object_required.includes('email')}
                                        error={object_error.email}
                                        nameFocus={name_focus}
                                        old_value={object.email}
                                        value={(object_revision.email !== undefined) ? object_revision.email : object.email}
                                        onChange={this.onChange}
                                        readOnly={field_disabled.includes('email')}
                                />
                            </div>
                            {this.props.user.isRole(role_root) && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="password"
                                            name="password"
                                            label="Mật khẩu"
                                            required={object_required.includes('password')}
                                            showPass={true}
                                            error={object_error.password}
                                            nameFocus={name_focus}
                                            value={object_revision.password}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('password')}
                                    />
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text"
                                        name="address"
                                        label="Địa chỉ"
                                        required={object_required.includes('address')}
                                        error={object_error.address}
                                        nameFocus={name_focus}
                                        old_value={object.address}
                                        value={(object_revision.address !== undefined) ? object_revision.address : object.address}
                                        onChange={this.onChange}
                                        readOnly={field_disabled.includes('address')}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    {/* data là array */}
                                    <Dropbox name="province_id"
                                             label="Tỉnh/thành phố"
                                             required={object_required.includes('province_id')}
                                             data={province}
                                             key_value="id"
                                             key_title="name"
                                             error={object_error.province_id}
                                             nameFocus={name_focus}
                                             old_value={object.province_id}
                                             value={(object_revision.province_id !== undefined) ? object_revision.province_id : object.province_id}
                                             onChange={this.onChange}
                                             readOnly={field_disabled.includes('province_id')}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text"
                                            name="phone"
                                            label="Điện thoại"
                                            required={object_required.includes('phone')}
                                            numberOnly
                                            error={object_error.phone}
                                            nameFocus={name_focus}
                                            old_value={object.phone}
                                            value={(object_revision.phone !== undefined) ? object_revision.phone : object.phone}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('phone')}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <DropboxGroup name="fields_activity"
                                         label="Lĩnh vực hoạt động"
                                         required={object_required.includes('fields_activity')}
                                         data={this.state.vsic_field}
                                         key_value="id"
                                         key_title="name"
                                         key_group="parent"
                                         error={object_error.fields_activity}
                                         nameFocus={name_focus}
                                         // old_value={object.fields_activity}
                                         value={(object_revision.fields_activity !== undefined) ? object_revision.fields_activity : object.fields_activity}
                                         onChange={this.onChange}
                                         readOnly={field_disabled.includes('fields_activity')}
                                />

                            </div>
                            <div className="col-sm-12 col-xs-12 padding0 mb10">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="company_size"
                                             label="Quy mô công ty"
                                             required={object_required.includes('company_size')}
                                             data={employer_company_size}
                                             error={object_error.company_size}
                                             nameFocus={name_focus}
                                             old_value={object.company_size}
                                             value={(object_revision.company_size !== undefined) ? object_revision.company_size : object.company_size}
                                             onChange={this.onChange}
                                             readOnly={field_disabled.includes('company_size')}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="test" name="tax_code" label="Mã số thuế" required={object_required.includes('tax_code')}
                                            error={object_error.tax_code} nameFocus={name_focus}
                                            old_value={object.tax_code}
                                            value={(object_revision.tax_code !== undefined) ? object_revision.tax_code : object.tax_code}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('tax_code')}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 mb20">
                                <InputArea name="description"
                                           label="Sơ lượt về công ty"
                                           required={object_required.includes('description')}
                                           style={{
                                               maxHeight: "185px",
                                               minHeight: "185px",
                                               minWidth: "100%"
                                           }}
                                           error={object_error.description}
                                           nameFocus={name_focus}
                                           old_value={object.description}
                                           value={(object_revision.description !== undefined) ? object_revision.description : object.description}
                                           onChange={this.onChange}
                                           readOnly={field_disabled.includes('description')}
                                />
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 mb20">
                                <InputImg name="logo"
                                          label="Logo"
                                          style={{ width: "200px", height: "200px" }}
                                          width={300}
                                          height={300}
                                          folder="employer_avatar"
                                          maxSize={2} //2M
                                          error={object_error.logo}
                                          old_value={object.logo}
                                          value={(object_revision.logo !== undefined) ? object_revision.logo : object.logo}
                                          onChange={this.onChange}
                                          readOnly={field_disabled.includes('logo')}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 sub-title-form mb10">
                                <span>Liên hệ</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text"
                                        name="contact_name"
                                        label="Tên người liên hệ"
                                        required={object_required.includes('contact_name')}
                                        error={object_error.contact_name}
                                        nameFocus={name_focus}
                                        old_value={object.contact_name}
                                        value={(object_revision.contact_name !== undefined) ? object_revision.contact_name : object.contact_name}
                                        onChange={this.onChange}
                                        readOnly={field_disabled.includes('contact_name')}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="email"
                                        name="contact_email"
                                        label="Email liên hệ"
                                        required={object_required.includes('contact_email')}
                                        error={object_error.contact_email}
                                        nameFocus={name_focus}
                                        old_value={object.contact_email}
                                        value={(object_revision.contact_email !== undefined) ? object_revision.contact_email : object.contact_email}
                                        onChange={this.onChange}
                                        readOnly={field_disabled.includes('contact_email')}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text"
                                            name="contact_phone"
                                            label="Số điện thoại liên hệ"
                                            required={object_required.includes('contact_phone')}
                                            numberOnly
                                            error={object_error.contact_phone}
                                            nameFocus={name_focus}
                                            old_value={object.contact_phone}
                                            value={(object_revision.contact_phone !== undefined) ? object_revision.contact_phone : object.contact_phone}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('contact_phone')}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text"
                                            name="fax"
                                            label="Fax"
                                            required={object_required.includes('fax')}
                                            error={object_error.fax}
                                            nameFocus={name_focus}
                                            old_value={object.fax}
                                            value={(object_revision.fax !== undefined) ? object_revision.fax : object.fax}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('fax')}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text"
                                            name="contact_address"
                                            label="Địa chỉ liên hệ"
                                            required={object_required.includes('contact_address')}
                                            error={object_error.contact_address}
                                            nameFocus={name_focus}
                                            old_value={object.contact_address}
                                            value={(object_revision.contact_address !== undefined) ? object_revision.contact_address : object.contact_address}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('contact_address')}
                            />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text"
                                            name="website"
                                            label="Website"
                                            required={object_required.includes('website')}
                                            error={object_error.website}
                                            nameFocus={name_focus}
                                            old_value={object.website}
                                            value={(object_revision.website !== undefined) ? object_revision.website : object.website}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('website')}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="contact_method"
                                             label="Hình thức liên hệ"
                                             data={employer_contact_method}
                                             required={object_required.includes('contact_method')}
                                             error={object_error.contact_method}
                                             nameFocus={name_focus}
                                             old_value={object.contact_method}
                                             value={(object_revision.contact_method !== undefined) ? object_revision.contact_method : object.contact_method}
                                             onChange={this.onChange}
                                             readOnly={field_disabled.includes('contact_method')}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text"
                                            name="number_of_employer"
                                            label="Số thành viên"
                                            required={object_required.includes('number_of_employer')}
                                            isNumber
                                            error={object_error.number_of_employer}
                                            nameFocus={name_focus}
                                            old_value={object.number_of_employer}
                                            value={(object_revision.number_of_employer !== undefined) ? object_revision.number_of_employer : object.number_of_employer}
                                            onChange={this.onChange}
                                            readOnly={field_disabled.includes('number_of_employer')}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="founded_year"
                                             label="Năm thành lập"
                                             data={listYear}
                                             error={object_error.founded_year}
                                             nameFocus={name_focus}
                                             old_value={object.founded_year}
                                             value={(object_revision.founded_year !== undefined) ? object_revision.founded_year : object.founded_year}
                                             onChange={this.onChange}
                                             readOnly={field_disabled.includes('founded_year')}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                <Dropbox name="staff_age_range"
                                         label="Độ tuổi"
                                         data={employer_staff_age_range}
                                         required={object_required.includes('staff_age_range')}
                                         error={object_error.staff_age_range}
                                         nameFocus={name_focus}
                                         old_value={object.staff_age_range}
                                         value={(object_revision.staff_age_range !== undefined) ? object_revision.staff_age_range : object.staff_age_range}
                                         onChange={this.onChange}
                                         readOnly={field_disabled.includes('staff_age_range')}
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupEmployer);
