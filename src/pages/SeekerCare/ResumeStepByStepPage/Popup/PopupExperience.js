import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input2 from 'components/Common/InputValue/Input2';
import DateTimePicker from 'components/Common/InputValue/DateTimePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import InputArea from 'components/Common/InputValue/InputArea';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import queryString from 'query-string';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {getConfigForm} from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from "lodash";

class PopupExperience extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ExperienceInfo");
        this.state = {
            object: Object.assign({}, props.object),
            object_revision: Object.assign({}, props.object_revision),
            object_required: ['company_name', 'position', 'start_date', 'description'],
            object_error: {},
            name_focus: "",
            configForm: configForm,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    _onSave(object_required) {
        this.setState({ object_error: {} });
        this.setState({ name_focus: "" });

        let object_revision = Object.assign({}, this.state.object_revision);
        // Bỏ đi cơ chế merge data luôn lấy dữ liệu chính api trả về
        let object = object_revision;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({ name_focus: check.field });
            this.setState({ object_error: check.fields });
            return;
        }
        let data_arr = [];
        this.props.data_list.forEach((item) => {
            data_arr.push(item.object_revision);
        });
        let params = queryString.parse(window.location.search);
        let args = {
            resume_id: params.id,
            seeker_id: params.seeker_id
        };
        // set default salary unit
        object.salary_unit = object.salary_unit || Constant.SALARY_UNIT_DEFAULT;
        if (this.props.object && this.props.object_revision) {
            data_arr[this.props.key_edit] = {...object, is_validate: true};
        } else {
            data_arr.push({...object, is_validate: true});
        }
        args.data = data_arr;
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost,
            config.apiSeekerDomain,
            ConstantURL.API_URL_POST_RESUME_EXPERIENCE_SAVE,
            args);
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object_revision = Object.assign({}, this.state.object_revision);
        object_revision[name] = value;
        this.setState({ object_revision: object_revision });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_EXPERIENCE_SAVE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_EXPERIENCE_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('ExperienceInfo');
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_EXPERIENCE_SAVE);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
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
        let { object, object_revision, object_error, object_required, name_focus, configForm } = this.state;
        let currencyList = this.props.sys.currency.items;
        let is_current_work = object_revision.is_current_work;
        if (is_current_work !== 1) {
            object_required.push('end_date');
        } else {
            object_required = object_required.filter(c => c !== 'end_date');
        }

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object_required);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="company_name"
                                            label="Tên Công ty/Tổ chức"
                                            required={object_required.includes('company_name')}
                                            nameFocus={name_focus} error={object_error.company_name}
                                            value={(object_revision.company_name !== undefined) ? object_revision.company_name : object.company_name}
                                            old_value={object.company_name}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="position" label="Chức danh"
                                            required={object_required.includes('position')}
                                            nameFocus={name_focus} error={object_error.position}
                                            value={(object_revision.position !== undefined) ? object_revision.position : object.position}
                                            old_value={object.position}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "salary") && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Input2 type="text" name="salary" label="Mức lương" isNumber
                                                required={object_required.includes('salary')}
                                                nameFocus={name_focus} error={object_error.salary}
                                                value={(object_revision.salary !== undefined) ? object_revision.salary : object.salary}
                                                old_value={object.salary}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "salary_unit") && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Dropbox name="salary_unit" label="Tiền tệ" data={currencyList}
                                                 required={object_required.includes('salary_unit')}
                                                 key_value="id" key_title="name"
                                                 nameFocus={name_focus} error={object_error.salary_unit}
                                                 value={(object_revision.salary_unit !== undefined) ?
                                                     (object_revision.salary_unit || Constant.SALARY_UNIT_DEFAULT) :
                                                     (object.salary_unit || Constant.SALARY_UNIT_DEFAULT)}
                                                 old_value={object.salary_unit}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-5 col-xs-12 mb10">
                                    <DateTimePicker name="start_date" label="Từ"
                                                    required={object_required.includes('start_date')}
                                                    nameFocus={name_focus}
                                                    error={object_error.start_date}
                                                    value={(object_revision.start_date !== undefined) ? object_revision.start_date : object.start_date}
                                                    old_value={object.start_date}
                                                    onChange={this.onChange}
                                    />
                                </div>
                                {object_required.includes('end_date') && (
                                    <div className="col-sm-5 col-xs-12 mb10">
                                        <DateTimePicker name="end_date" label="Đến"
                                                        required={object_required.includes(
                                                            'end_date')}
                                                        nameFocus={name_focus}
                                                        error={object_error.end_date}
                                                        value={(object_revision.end_date !== undefined) ? object_revision.end_date : object.end_date}
                                                        old_value={object.end_date}
                                                        onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                <div className="col-sm-2 col-xs-12">
                                    <FormControlLabel
                                        control={<Checkbox checked={is_current_work === 1}
                                                           color="primary"
                                                           icon={<CheckBoxOutlineBlankIcon
                                                               fontSize="large"/>}
                                                           checkedIcon={<CheckBoxIcon
                                                               fontSize="large"/>}
                                                           onChange={(event) => {
                                                               const value = event.target.checked ? 1 : 0;
                                                               this.onChange(value,
                                                                   'is_current_work');
                                                           }}/>}
                                        label={<label className="v-label">Hiện tại</label>}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <InputArea name="description" label="Mô tả công việc"
                                           required={object_required.includes('description')}
                                           style={{ minHeight: "30px", height: "50px" }}
                                           error={object_error.description} nameFocus={name_focus}
                                           value={(object_revision.description !== undefined) ? object_revision.description : object.description}
                                           old_value={object.description}
                                           onChange={this.onChange}
                                />
                            </div>
                            {_.includes(configForm, "achieved") && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="achieved" label="Thành tích đạt được"
                                               required={object_required.includes('achieved')}
                                               style={{ minHeight: "30px", height: "50px" }}
                                               error={object_error.achieved} nameFocus={name_focus}
                                               value={(object_revision.achieved !== undefined) ? object_revision.achieved : object.achieved}
                                               old_value={object.achieved}
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupExperience);
