import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import InputRange from "components/Common/InputValue/InputRange";
import InputArea from "components/Common/InputValue/InputArea";
import Dropbox from 'components/Common/InputValue/Dropbox';
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import moment from "moment";
import _ from "lodash";

class PopupJob extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        this.state = {
            object: {},
            object_revision: {},
            object_required: [
                'employer_id', 'title', 'level_requirement', 'field_ids_main', 'province_ids', 'vacancy_quantity', 'salary_range', 'working_method', 'attribute', 'resume_apply_expired', 'description', 'benefit', 'degree_requirement', 'gender', 'experience_range', 'contact_name', 'contact_email', 'contact_phone', 'contact_address', 'gate_code'
            ],
            object_error: {},
            name_focus: "",
            loading: true,
            employer_list: [],
            configForm: getConfigForm(channelCodeCurrent, "CustomerCare.JobPage.Form")
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.getObject = this._getObject.bind(this);
        this.getObjectRevision = this._getObjectRevision.bind(this);
        this.getListEmployer = this._getListEmployer.bind(this);
    }

    _getObject() {
        let args = {
            id: this.props.object.id
        };
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_JOB, args);
    }

    _getObjectRevision() {
        let args = {
            job_id: this.props.object.id,
        };
        this.props.apiAction.requestApi(apiFn.fnGet,config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_JOB_REVISION, args);
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object_revision = Object.assign({}, this.state.object_revision);
        if (Array.isArray(name)) {
            name.forEach((item, key) => {
                object_revision[item] = value[key];
            })
        } else {
            object_revision[name] = value;
            if (name === 'field_ids_main' && object_revision.field_ids_sub) {
                object_revision.field_ids_sub = object_revision.field_ids_sub.filter((item) => item !== value);
            }
            if (name === 'gate_code' && !value) {
                object_revision.field_ids_main = null;
            }
        }
        this.setState({ object_revision: object_revision });
    }

    _onSave(event) {
        event.preventDefault();
        this.setState({ object_error: {} });
        this.setState({ name_focus: "" });
        let object_revision = this.state.object_revision;
        let object = this.state.object;
        object = utils.compareObject(object, object_revision);

        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({ name_focus: check.field });
            this.setState({ object_error: check.fields });
            return;
        }
        this.props.uiAction.showLoading();
        if (!object.id) {
            this.props.apiAction.requestApi(apiFn.fnPost,
                    config.apiEmployerDomain,
                    ConstantURL.API_URL_POST_JOB_CREATE,
                    object);
        } else {
            this.props.apiAction.requestApi(apiFn.fnPost,
                    config.apiEmployerDomain,
                    ConstantURL.API_URL_POST_JOB_EDIT,
                    object);
        }
    }

    _getListEmployer(value) {
        this.setState({ loading_getEmployer: true });
        let args = {
            q: value,
            status_not: Constant.STATUS_DELETED,
            per_page: 10,
            page: 1
        };
        this.props.apiAction.requestApi(apiFn.fnGet,
                config.apiEmployerDomain,
                ConstantURL.API_URL_GET_EMPLOYER_LIST,
                args);
    }

    componentDidMount() {
        //remove filed hidden is required
        let object_required = this.state.object_required;
        _.map(this.state.configForm, function(item){
            object_required = object_required.filter(c => c !== item);
        });
        this.setState({object_required : object_required});

        if (this.props.object) {
            this.getObject();
            this.getObjectRevision();
            this.getListEmployer(this.props.object.employer_id);
        } else {
            this.setState({ loading: false });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB] && newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB_REVISION]) {
            let response_object = newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB];
            let response_object_revision = newProps.api[ConstantURL.API_URL_GET_DETAIL_JOB_REVISION];

            if (response_object.code === Constant.CODE_SUCCESS) {
                this.setState({ object: response_object.data });
            }
            if (response_object_revision.code === Constant.CODE_SUCCESS) {
                this.setState({ object_revision: response_object_revision.data });
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_JOB);
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_JOB_REVISION);
            this.setState({ loading: false });
        }
        if (newProps.api[ConstantURL.API_URL_POST_JOB_CREATE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('JobPage', { delay: Constant.DELAY_LOAD_LIST_2S });
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_JOB_EDIT]) {
            let response = newProps.api[ConstantURL.API_URL_POST_JOB_EDIT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('JobPage', { delay: Constant.DELAY_LOAD_LIST_2S });
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_JOB_EDIT);
        }
        if (newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST]) {
            let response = newProps.api[ConstantURL.API_URL_GET_EMPLOYER_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let employer_list = [];
                response.data.items.forEach((item) => {
                    employer_list.push({
                        value: item.id,
                        title: item.id + ' - ' + item.email + " - " + item.name
                    });
                });
                this.setState({ employer_list: employer_list });
            }
            this.setState({ loading_getEmployer: false });
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_EMPLOYER_LIST);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render() {
        if (this.state.loading) {
            return (
                    <div className="dialog-popup-body">
                        <div className="form-container">
                            <div className="popupContainer text-center">
                                <LoadingSmall/>
                            </div>
                        </div>
                    </div>
            )
        }
        let { configForm, object, object_revision, object_required, object_error, name_focus, employer_list, loading_getEmployer } = this.state;

        // let job_level_requirement = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_level_requirement);
        let job_salary_range = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_salary_range);
        let job_working_method = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_working_method);
        let job_attribute = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_attribute);
        let job_probation_duration = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_probation_duration);
        let job_degree_requirement = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_degree_requirement);
        let job_gender = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_gender);
        let job_experience_range = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_experience_range);
        let job_contact_method = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_contact_method);
        let job_age_range = utils.convertArrayValueCommonData(this.props.sys.common.items,
                Constant.COMMON_DATA_KEY_job_age_requirement);

        let province = this.props.sys.province.items;
        let gateList = this.props.sys.gate.items;

        let gate_code = object.gate_code;
        if (object_revision.gate_code !== undefined) {
            gate_code = object_revision.gate_code;
        }

        let gateJobField = this.props.sys.gateJobField.items.filter(c => c.gate_code === gate_code);
        let gateJobField_object = utils.convertArrayToObject(gateJobField, 'job_field_id');

        let jobField_main = this.props.sys.jobField.items.filter(c => gateJobField_object[c.id]);
        let jobField_sub = jobField_main.filter((item) => String(item.id) !== String(object_revision.field_ids_main));

        let gateJobLevel = this.props.sys.gateJobLevel.items.filter(c => c.gate_code === gate_code);
        let gateJobLevel_object = utils.convertArrayToObject(gateJobLevel, 'job_level_code');
        let jobLevel = this.props.sys.jobLevel.items.filter(c => gateJobLevel_object[c.code]);
        return (
            <form onSubmit={this.onSave}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 sub-title-form mb10">
                                <span>Thông tin chung</span>
                            </div>
                            {_.includes(configForm, "employer_id") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="employer_id"
                                             label="Nhà tuyển dụng"
                                             required={object_required.includes('employer_id')}
                                             data={employer_list}
                                             readOnly={!!this.props.object}
                                             error={object_error.employer_id}
                                             nameFocus={name_focus}
                                             old_value={object.employer_id}
                                             value={(object_revision.employer_id !== undefined) ? object_revision.employer_id : object.employer_id}
                                             onChange={this.onChange}
                                             onChangeTimeOut={this.getListEmployer}
                                             timeOut={1000}
                                             loading={loading_getEmployer}
                                    />
                                </div>
                            )}

                            {_.includes(configForm, "title") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text"
                                            name="title"
                                            label="Tiêu đề"
                                            required={object_required.includes('title')}
                                            error={object_error.title}
                                            nameFocus={name_focus}
                                            old_value={object.title}
                                            value={(object_revision.title !== undefined) ? object_revision.title : object.title}
                                            onChange={this.onChange}
                                    />
                                </div>
                            )}

                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "gate_code") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="gate_code"
                                                 label="Cổng"
                                                 required={object_required.includes('gate_code')}
                                                 data={gateList}
                                                 error={object_error.gate_code}
                                                 nameFocus={name_focus}
                                                 key_value="code"
                                                 key_title="full_name"
                                                 old_value={object.gate_code}
                                                 value={(object_revision.gate_code !== undefined) ? object_revision.gate_code : object.gate_code}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}

                                {_.includes(configForm, "level_requirement") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="level_requirement"
                                                 label="Cấp bậc"
                                                 required={object_required.includes('level_requirement')}
                                                 data={jobLevel}
                                                 error={object_error.level_requirement}
                                                 nameFocus={name_focus}
                                                 key_value="id"
                                                 key_title="name"
                                                 old_value={object.level_requirement}
                                                 value={(object_revision.level_requirement !== undefined) ? object_revision.level_requirement : object.level_requirement}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "field_ids_main") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="field_ids_main"
                                                 label="Ngành chính"
                                                 required={object_required.includes('field_ids_main')}
                                                 data={jobField_main}
                                                 error={object_error.field_ids_main}
                                                 nameFocus={name_focus}
                                                 key_value="id"
                                                 key_title="name"
                                                 old_value={object.field_ids_main}
                                                 value={(object_revision.field_ids_main !== undefined) ? object_revision.field_ids_main : object.field_ids_main}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}

                                {_.includes(configForm, "field_ids_sub") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <DropboxMulti name="field_ids_sub"
                                                      label="Ngành phụ"
                                                      required={object_required.includes('field_ids_sub')}
                                                      data={jobField_sub}
                                                      maximumSelectionLength={2}
                                                      key_value="id"
                                                      key_title="name"
                                                      error={object_error.field_ids_sub}
                                                      nameFocus={name_focus}
                                                      old_value={object.field_ids_sub}
                                                      value={(object_revision.field_ids_sub !== undefined) ? object_revision.field_ids_sub : object.field_ids_sub}
                                                      onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                            {_.includes(configForm, "province_ids") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <DropboxMulti name="province_ids"
                                                  label="Tỉnh/thành phố"
                                                  required={object_required.includes('province_ids')}
                                                  data={province}
                                                  maximumSelectionLength={5}
                                                  key_value="id"
                                                  key_title="name"
                                                  error={object_error.province_ids}
                                                  nameFocus={name_focus}
                                                  old_value={object.province_ids}
                                                  value={(object_revision.province_ids !== undefined) ? object_revision.province_ids : object.province_ids}
                                                  onChange={this.onChange}
                                    />
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "vacancy_quantity") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text"
                                                name="vacancy_quantity"
                                                label="Số lượng cần tuyển"
                                                isNumber
                                                required={object_required.includes('vacancy_quantity')}
                                                error={object_error.vacancy_quantity}
                                                nameFocus={name_focus}
                                                old_value={object.vacancy_quantity}
                                                value={(object_revision.vacancy_quantity !== undefined) ? object_revision.vacancy_quantity : object.vacancy_quantity}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "salary_range") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="salary_range"
                                                 label="Mức lương"
                                                 required={object_required.includes('salary_range')}
                                                 data={job_salary_range}
                                                 error={object_error.salary_range}
                                                 nameFocus={name_focus}
                                                 old_value={object.salary_range}
                                                 value={(object_revision.salary_range !== undefined) ? object_revision.salary_range : object.salary_range}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "working_method") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="working_method"
                                                 label="Hình thức làm việc"
                                                 required={object_required.includes('working_method')}
                                                 data={job_working_method}
                                                 error={object_error.working_method}
                                                 nameFocus={name_focus}
                                                 old_value={object.working_method}
                                                 value={(object_revision.working_method !== undefined) ? object_revision.working_method : object.working_method}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "attribute") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="attribute"
                                                 label="Tính chất công việc"
                                                 required={object_required.includes('attribute')}
                                                 data={job_attribute}
                                                 error={object_error.attribute}
                                                 nameFocus={name_focus}
                                                 old_value={object.attribute}
                                                 value={(object_revision.attribute !== undefined) ? object_revision.attribute : object.attribute}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "resume_apply_expired") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <DateTimePicker name="resume_apply_expired"
                                                        label="Hạn nộp hồ sơ"
                                                        required={object_required.includes('resume_apply_expired')}
                                                        minDate={moment()}
                                                        error={object_error.resume_apply_expired}
                                                        nameFocus={name_focus}
                                                        old_value={object.resume_apply_expired}
                                                        value={(object_revision.resume_apply_expired !== undefined) ? object_revision.resume_apply_expired : object.resume_apply_expired}
                                                        onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "probation_duration") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="probation_duration"
                                                 label="Thời gian thử việc"
                                                 required={object_required.includes('probation_duration')}
                                                 data={job_probation_duration}
                                                 error={object_error.probation_duration}
                                                 nameFocus={name_focus}
                                                 old_value={object.probation_duration}
                                                 value={(object_revision.probation_duration !== undefined) ? object_revision.probation_duration : object.probation_duration}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}

                                {!_.includes(configForm, "probation_duration_text") && (
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                            <Input2 type="text"
                                                    name="probation_duration_text"
                                                    label="Thời gian thử việc (ghi chú)"
                                                    required={object_required.includes('probation_duration_text')}
                                                    error={object_error.probation_duration_text}
                                                    nameFocus={name_focus}
                                                    old_value={object.probation_duration_text}
                                                    value={(object_revision.probation_duration_text !== undefined) ? object_revision.probation_duration_text : object.probation_duration_text}
                                                    onChange={this.onChange}
                                            />
                                        </div>
                                )}

                                {_.includes(configForm, "age_range") || (
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                            <Dropbox name="age_range"
                                                     label="Độ tuổi"
                                                     required={object_required.includes('age_range')}
                                                     data={job_age_range}
                                                     error={object_error.age_range}
                                                     nameFocus={name_focus}
                                                     old_value={object.age_range}
                                                     value={(object_revision.age_range !== undefined) ? object_revision.age_range : object.age_range}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                )}
                                {_.includes(configForm, "commission_from-commission_to") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <InputRange type="text"
                                                    label="Hoa hồng"
                                                    isNumber
                                                    suffix="%"
                                                    nameFocus={name_focus}
                                                    name={['commission_from', 'commission_to']}
                                                    required={object_required.includes(
                                                            'commission_from') || object_required.includes(
                                                            'commission_to')}
                                                    error={[object_error.commission_from, object_error.commission_to]}
                                                    old_value={[object.commission_from, object.commission_to]}
                                                    value={(object_revision.commission_from !== undefined || object_revision.commission_to !== undefined) ? [object_revision.commission_from, object_revision.commission_to] : [object.commission_from, object.commission_to]}
                                                    onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>

                            {_.includes(configForm, "description") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="description"
                                               label="Mô tả công việc"
                                               required={object_required.includes('description')}
                                               style={{
                                                   minHeight: "30px",
                                                   height: "100px"
                                               }}
                                               error={object_error.description}
                                               nameFocus={name_focus}
                                               old_value={object.description}
                                               value={(object_revision.description !== undefined) ? object_revision.description : object.description}
                                               onChange={this.onChange}
                                    />
                                </div>
                            )}
                            {_.includes(configForm, "benefit") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="benefit"
                                               label="Quyền lợi"
                                               required={object_required.includes('benefit')}
                                               style={{
                                                   minHeight: "30px",
                                                   height: "100px"
                                               }}
                                               error={object_error.benefit}
                                               nameFocus={name_focus}
                                               old_value={object.benefit}
                                               value={(object_revision.benefit !== undefined) ? object_revision.benefit : object.benefit}
                                               onChange={this.onChange}
                                    />
                                </div>
                            )}
                            {_.includes(configForm, "job_requirement") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="job_requirement"
                                               label="Yêu cầu công việc"
                                               required={object_required.includes('job_requirement')}
                                               style={{
                                                   minHeight: "30px",
                                                   height: "100px"
                                               }}
                                               error={object_error.job_requirement}
                                               nameFocus={name_focus}
                                               old_value={object.job_requirement}
                                               value={(object_revision.job_requirement !== undefined) ? object_revision.job_requirement : object.job_requirement}
                                               onChange={this.onChange}
                                    />
                                </div>
                            )}

                            {_.includes(configForm, "other_requirement") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="other_requirement"
                                               label="Yêu cầu khác"
                                               required={object_required.includes('other_requirement')}
                                               style={{
                                                   minHeight: "30px",
                                                   height: "100px"
                                               }}
                                               error={object_error.other_requirement}
                                               nameFocus={name_focus}
                                               old_value={object.other_requirement}
                                               value={(object_revision.other_requirement !== undefined) ? object_revision.other_requirement : object.other_requirement}
                                               onChange={this.onChange}
                                    />
                                </div>
                            )}


                            <div className="col-sm-12 sub-title-form mb15"><span>Yêu cầu</span>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "degree_requirement") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="degree_requirement"
                                                 label="Bằng cấp"
                                                 required={object_required.includes('degree_requirement')}
                                                 data={job_degree_requirement}
                                                 error={object_error.degree_requirement}
                                                 nameFocus={name_focus}
                                                 old_value={object.degree_requirement}
                                                 value={(object_revision.degree_requirement !== undefined) ? object_revision.degree_requirement : object.degree_requirement}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "gender") || (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="gender"
                                                 label="Giới tính"
                                                 required={object_required.includes('gender')}
                                                 data={job_gender}
                                                 error={object_error.gender}
                                                 nameFocus={name_focus}
                                                 old_value={object.gender}
                                                 value={(object_revision.gender !== undefined) ? object_revision.gender : object.gender}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                            {_.includes(configForm, "experience_range") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="experience_range"
                                             label="Kinh nghiệm"
                                             required={object_required.includes('experience_range')}
                                             data={job_experience_range}
                                             error={object_error.experience_range}
                                             nameFocus={name_focus}
                                             old_value={object.experience_range}
                                             value={(object_revision.experience_range !== undefined) ? object_revision.experience_range : object.experience_range}
                                             onChange={this.onChange}
                                    />
                                </div>
                            )}
                            {_.includes(configForm, "resume_requirement") || (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="resume_requirement"
                                               label="Yêu cầu hồ sơ"
                                               required={object_required.includes('resume_requirement')}
                                               style={{
                                                   minHeight: "30px",
                                                   height: "100px"
                                               }}
                                               error={object_error.resume_requirement}
                                               nameFocus={name_focus}
                                               old_value={object.resume_requirement}
                                               value={(object_revision.resume_requirement !== undefined) ? object_revision.resume_requirement : object.resume_requirement}
                                               onChange={this.onChange}
                                    />
                                </div>
                            )}

                            <div className="col-sm-12 sub-title-form mb15"><span>Liên hệ</span>
                            </div>
                            {_.includes(configForm, "contact_name") || (
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
                                        />
                                    </div>
                            )}
                            {_.includes(configForm, "contact_email") || (
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
                                        />
                                    </div>
                            )}
                            {_.includes(configForm, "contact_phone") || (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text"
                                                name="contact_phone"
                                                label="Số điện thoại liên hệ"
                                                required={object_required.includes('contact_phone')}
                                                error={object_error.contact_phone}
                                                nameFocus={name_focus}
                                                numberOnly
                                                old_value={object.contact_phone}
                                                value={(object_revision.contact_phone !== undefined) ? object_revision.contact_phone : object.contact_phone}
                                                onChange={this.onChange}
                                        />
                                    </div>
                            )}
                            {_.includes(configForm, "contact_address") || (
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
                                        />
                                    </div>
                            )}
                            {_.includes(configForm, "contact_method") || (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Dropbox name="contact_method"
                                                 label="Hình thức liên hệ"
                                                 required={object_required.includes(
                                                         'contact_method')}
                                                 data={job_contact_method}
                                                 error={object_error.contact_method}
                                                 nameFocus={name_focus}
                                                 old_value={object.contact_method}
                                                 value={(object_revision.contact_method !== undefined) ? object_revision.contact_method : object.contact_method}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                            )}
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit"
                                className="el-button el-button-success el-button-small">
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
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupJob);
