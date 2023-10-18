import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import queryString from 'query-string';
import Input2 from 'components/Common/InputValue/Input2';
import Dropbox from 'components/Common/InputValue/Dropbox';
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import InputArea from 'components/Common/InputValue/InputArea';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {getConfigForm, getMergeDataRevision} from "utils/utils";
import {
    createResumeFile,
    createResumeStep,
    deleteResumeMeta,
    getResumeDetail,
    getResumeMeta,
    getResumeRevision,
    updateResumeFile,
    updateResumeStep,
    extractingPlainText
} from "api/resume";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import InputFile from "components/Common/InputValue/InputFile";
import SpanText from "components/Common/Ui/SpanText";
import TagAsync from "components/Common/InputValue/TagAsync";
import { getSkillSuggest } from "api/mix";
import _ from "lodash";
import MySelectSystem from "components/Common/Ui/Form/MySelectSystem";

class ResumeInfo extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const objectRequired = ['title', 'occupation_ids', 'min_expected_salary', 'experience', 'province_ids', 'level', 'is_search_allowed', "position"];
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ResumeInfo");
        if (configForm.includes("current_position")) {
            objectRequired.push("current_position");
        }
        this.state = {
            show_detail: true,
            object: {},
            objectMerge: {},
            meta: {},
            object_revision: {},
            object_required: objectRequired,
            object_error: {},
            name_focus: "",
            is_render_file: true,
            file_preview: null,
            configForm: configForm,
            textPDFConvert:""
        };
        this.showHide = this._showHide.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onDeleteFileMeta = this._onDeleteFileMeta.bind(this);
        this.onGoDetail = this._onGoDetail.bind(this);
    }

    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }

    _onGoDetail(id) {
        const {history} = this.props;
        history.push({
            pathname: `${Constant.BASE_URL_RESUME}/list`,
            search: `?action=detail&id=${id}`
        });
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        const objectMerge = {...this.state.objectMerge};
        objectMerge[name] = value;
        this.setState({objectMerge: objectMerge});
    }

     async _onDeleteFileMeta(meta_id) {
         const {actions, uiAction} = this.props;
         const {object} = this.state;
         const {id} = object;

         actions.SmartMessageBox({
             title: 'Bạn có chắc muốn xóa file preview?',
             content: "",
             buttons: ['No', 'Yes']
         }, async (ButtonPressed) => {
             if (ButtonPressed === "Yes") {
                 const res = await deleteResumeMeta({id: meta_id});
                 if(res) {
                     uiAction.putToastSuccess("Thao tác thành công!");
                     this.asyncData(id);
                     actions.hideSmartMessageBox();
                 }
             }
         })
     }

    async _onSave() {
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        const {objectMerge} = this.state;
        const {object_required} = this.state;
        let objectRequired = [...object_required] || [];
        if (this.props.resume_type === Constant.RESUME_NORMAL_FILE) {
            objectRequired.push('cv_file');
            objectRequired = object_required.filter(_ => _ !== "career_objective");
        }

        let check = utils.checkOnSaveRequired(objectMerge, objectRequired);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        let res;
        if (!objectMerge.id) {
            let params = queryString.parse(window.location.search);
            objectMerge.resume_type = this.props.resume_type;
            objectMerge.seeker_id = params['seeker_id'];
            res = this.props.resume_type === Constant.RESUME_NORMAL ? await createResumeStep(objectMerge) : await createResumeFile(objectMerge);
        } else {
            res = this.props.resume_type === Constant.RESUME_NORMAL ? await updateResumeStep(objectMerge) : await updateResumeFile(objectMerge);
        }
        if (res) {
            const params = {
                id : res.id,
                seeker_id : res.seeker_id
            };
            this.props.history.push(window.location.pathname + '?' + queryString.stringify(params));
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            this.props.showInfo(true, res?.status, res?.last_revision_status);
            this.asyncData(res.id);
        }
        this.props.uiAction.hideLoading();
    }

    async asyncData(id) {
        this.setState({is_render_file: false});
        const object = await getResumeDetail(id);
        const object_revision = await getResumeRevision(id);
        this.props.showInfo(true, object?.status, object?.last_revision_status);
        const objectMerge = getMergeDataRevision(object, object_revision);
        const meta = await getResumeMeta({id: id});
        this.setState({
            object,
            object_revision,
            objectMerge,
            meta: meta,
            loading: false,
            is_render_file: true,
            file_preview: objectMerge?.cv_file_url
        });
    }

    componentDidMount() {
        let params = queryString.parse(window.location.search);
        if(params?.id > 0){
            this.setState({loading: true}, () => {
                this.asyncData(params.id);
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state) ||
            JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    convertPDFToText = async() =>{
        const { object_revision }=this.state;
        const { resume_id }=object_revision;
        this.props.uiAction.showLoading();
        let params = {resume_id: resume_id};
        // let params = {url: this.state.file_preview};
        try {
            const res = await extractingPlainText(params);
            const dataSort = res?.sort((a, b) => a.page - b.page);
            let result = [];
            dataSort.forEach((item)=>{
               result = [...result, item.originalText]
            })
            if(res){
                this.setState({
                    textPDFConvert:result.join(',')
                });
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }
        } catch (error) {
            this.props.uiAction.hideLoading();
        } finally {
            this.props.uiAction.hideLoading();
        }
        
    }

    copyClipboard = async ()=>{
        navigator.clipboard.writeText(this.state.textPDFConvert);
    }

    render() {
        let {show_detail, loading, objectMerge, object, object_error, object_required, name_focus, meta, is_render_file, file_preview, configForm, object_revision} = this.state;
        let occupation = this.props.sys.occupations.items;
        let jobField = this.props.sys.jobField.items;
        let province = this.props.sys.provinceInForm.items;
        let resume_experience_range = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_resume_experience_range);
        let resume_level_requirement = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_resume_level_requirement);
        let resume_working_method = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_resume_working_method);
        let is_search_allowed = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_is_search_allowed);
        let seeker_level = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_seeker_level);
        if (this.props.resume_type === Constant.RESUME_NORMAL_FILE) {
            object_required.push('cv_file');
            object_required = object_required.filter(_ => _ !== "career_objective");
        }

        const cvFileExtension = file_preview ? file_preview?.split(".").pop() : "";

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">
                            Thông tin hồ sơ
                            {object.id && (
                                <>: {object.id} - <SpanText cls="null" value={object.status_combine} idKey={Constant.COMMON_DATA_KEY_resume_status}/></>
                            )}
                        </span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        <div>
                            {loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="row margin0">
                                        <div className="col-sm-12 col-xs-12">
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <Input2 type="text" name="title" label="Tiêu đề hồ sơ"
                                                        required={object_required.includes('title')}
                                                        error={object_error.title} nameFocus={name_focus}
                                                        old_value={object.title}
                                                        value={objectMerge?.title}
                                                        onChange={this.onChange}
                                                        readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <DropboxMulti name="occupation_ids" label="Nghề nghiệp"
                                                              required={object_required.includes('occupation_ids')}
                                                              data={occupation}
                                                              maximumSelectionLength={3} key_value="id" key_title="name"
                                                              error={object_error.occupation_ids} nameFocus={name_focus}
                                                              old_value={object.occupation_ids}
                                                              value={objectMerge?.occupation_ids}
                                                              onChange={this.onChange}
                                                              readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                        </div>
                                        {object.is_merge_occupation && (
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-6 col-xs-12 mb10" />
                                                <div className="col-sm-6 col-xs-12 mb10">
                                                    <DropboxMulti name="field_ids" label="Ngành nghề"
                                                                  required={object_required.includes('field_ids')}
                                                                  data={jobField}
                                                                  maximumSelectionLength={3} key_value="id" key_title="name"
                                                                  error={object_error.field_ids} nameFocus={name_focus}
                                                                  value={object_revision?.field_ids}
                                                                  onChange={this.onChange}
                                                                  readOnly
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-sm-12 col-xs-12">
                                            <div className="col-sm-3 col-xs-6 mb10">
                                                <Input2 type="text" name="min_expected_salary"
                                                        label="Mong muốn mức lương tối thiểu"
                                                        required={object_required.includes('min_expected_salary')}
                                                        isNumber suffix=" đ"
                                                        error={object_error.min_expected_salary} nameFocus={name_focus}
                                                        old_value={object.min_expected_salary}
                                                        value={objectMerge?.min_expected_salary}
                                                        onChange={this.onChange}
                                                        readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                            <div className="col-sm-3 col-xs-6 mb10">
                                                <Dropbox name="experience" label="Số năm kinh nghiệm"
                                                         data={resume_experience_range}
                                                         required={object_required.includes('experience')}
                                                         error={object_error.experience} nameFocus={name_focus}
                                                         old_value={object.experience}
                                                         value={objectMerge?.experience}
                                                         onChange={this.onChange}
                                                         readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                            <div className="col-sm-6 col-xs-12 mb10">
                                                <DropboxMulti name="province_ids" label="Địa điểm làm việc"
                                                              required={object_required.includes('province_ids')}
                                                              data={province}
                                                              maximumSelectionLength={5} key_value="id" key_title="name"
                                                              error={object_error.province_ids} nameFocus={name_focus}
                                                              old_value={object.province_ids}
                                                              value={objectMerge?.province_ids}
                                                              onChange={this.onChange}
                                                              readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-xs-12">
                                            {_.includes(configForm, "current_position") && (
                                                <div className="col-sm-3 col-xs-6 mb10">
                                                    <Dropbox name="current_position" label="Cấp bậc hiện tại"
                                                             data={resume_level_requirement}
                                                             required={object_required.includes('current_position')}
                                                             error={object_error.current_position} nameFocus={name_focus}
                                                             old_value={object.current_position}
                                                             value={objectMerge?.current_position}
                                                             onChange={this.onChange}
                                                             readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                    />
                                                </div>
                                            )}
                                            <div className="col-sm-3 col-xs-6 mb10">
                                                <Dropbox name="position" label="Cấp bậc mong muốn"
                                                         data={resume_level_requirement}
                                                         required={object_required.includes('position')}
                                                         error={object_error.position} nameFocus={name_focus}
                                                         old_value={object.position}
                                                         value={objectMerge?.position}
                                                         onChange={this.onChange}
                                                         readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                            {_.includes(configForm, "work_time") && (
                                                <div className="col-sm-3 col-xs-6 mb10">
                                                    <Dropbox name="work_time" label="Hình thức làm việc"
                                                             data={resume_working_method}
                                                             required={object_required.includes('work_time')}
                                                             old_value={object.work_time} nameFocus={name_focus}
                                                             error={object_error.work_time}
                                                             value={objectMerge?.work_time}
                                                             onChange={this.onChange}
                                                             readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                    />
                                                </div>
                                            )}
                                            <div className="col-sm-3 col-xs-6 mb10">
                                                <Dropbox name="level" label="Trình độ học vấn"
                                                         data={seeker_level}
                                                         required={object_required.includes('level')}
                                                         error={object_error.level} nameFocus={name_focus}
                                                         old_value={object.level}
                                                         value={objectMerge?.level}
                                                         onChange={this.onChange}
                                                         readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                        </div>

                                        {this.props.resume_type !== Constant.RESUME_NORMAL_FILE && (
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-6 col-xs-6 mb10">
                                                    <InputArea name="career_objective" label="Mục tiêu nghề nghiệp"
                                                               required={object_required.includes('career_objective')}
                                                               style={{minHeight: "30px", height: "30px"}}
                                                               error={object_error.career_objective} nameFocus={name_focus}
                                                               old_value={object.career_objective}
                                                               value={objectMerge?.career_objective}
                                                               onChange={this.onChange}
                                                               readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                    />
                                                </div>  
                                                <div className="col-sm-6 col-xs-6">
                                                        <TagAsync name={"skills_new"} value={objectMerge?.skills_new}
                                                        label={"Kỹ năng mềm & cứng"}
                                                        onChange={this.onChange}
                                                        apiRequest={getSkillSuggest}
                                                        max={10} />
                                                </div>
                                            </div>
                                        )}
                                        {this.props.resume_type === Constant.RESUME_NORMAL_FILE&&
                                                <div className="col-sm-12 col-xs-12">
                                                    <div className="col-sm-6 col-xs-6 mb10">
                                                        <TagAsync name={"skills_new"} value={objectMerge?.skills_new}
                                                            label={"Kỹ năng mềm & cứng"}
                                                            onChange={this.onChange}
                                                            apiRequest={getSkillSuggest}
                                                            max={10} />
                                                    </div>
                                                </div>
                                        }
                                       
                                        {object_required.includes('cv_file') && (
                                            <div className="col-sm-12 col-xs-12">
                                                <div className="col-sm-12 col-xs-12 mb10">
                                                    {is_render_file &&
                                                        <InputFile name="cv_file" label="Tải lên file đính kèm" maxSize={2}
                                                                   folder="resume"
                                                                   required={object_required.includes('cv_file')}
                                                                   error={object_error.cv_file}
                                                                   value={objectMerge?.cv_file}
                                                                   file_url={objectMerge?.cv_file_url}
                                                                   validateType={["docx","doc","pdf"]}
                                                                   onChange={this.onChange}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        )}
                                        {meta?.meta_value_url && (
                                            <CanRender actionCode={ROLES.seeker_care_resume_detail_resume_meta}>
                                                <div className="col-sm-12 col-xs-12">
                                                    <div className="col-sm-12 col-xs-12 mb10">
                                                        File preview: <a href={meta?.meta_value_url || "#"} download rel="noopener noreferrer" target="_blank">Tại đây</a>
                                                        {meta?.meta_value_url && <span onClick={() => this.onDeleteFileMeta(meta?.id)} className="ml5 textlink cursor-pointer">| Xóa file</span>}
                                                    </div>
                                                </div>
                                            </CanRender>
                                        )}
                                        <div className="col-sm-12 col-xs-12 mt10">
                                            <div className="col-sm-6 col-xs-6 mb10">
                                                <Dropbox name="is_search_allowed" label="Cho phép nhà NTD tìm kiếm hổ sơ"
                                                         data={is_search_allowed}
                                                         required={object_required.includes('is_search_allowed')}
                                                         error={object_error.is_search_allowed} nameFocus={name_focus}
                                                         old_value={object.is_search_allowed}
                                                         value={objectMerge?.is_search_allowed}
                                                         onChange={this.onChange}
                                                         readOnly={!this.props.canEdit && this.props.resume_type === Constant.RESUME_NORMAL}
                                                />
                                            </div>
                                        </div>
                                        {this.props.canEdit && (
                                            <div className="col-xs-12 col-sm-12">
                                                <div className="text-right mt15">
                                                    {parseInt(object.status) !== Constant.STATUS_DELETED && (
                                                        <button type="button"
                                                                className="el-button el-button-success el-button-small"
                                                                onClick={this.onSave}>
                                                            <span>Lưu</span>
                                                        </button>
                                                    )}
                                                    {object?.id &&
                                                        <button type="button"
                                                                className="el-button el-button-default el-button-small"
                                                                onClick={() => this.onGoDetail(object?.id)}>
                                                            <span>Quay lại</span>
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {this.props.resume_type === Constant.RESUME_NORMAL_FILE && file_preview && (
                                        <div className="row mt30 vertical-align">
                                            <div className="col-md-6">
                                                {Constant.EXTENSION_DOC.includes(cvFileExtension) && (
                                                    <iframe
                                                        title="docx"
                                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${file_preview}`}
                                                        width="100%" height="1000px" frameBorder='0' />
                                                )}
                                                {Constant.EXTENSION_PDF === cvFileExtension && (
                                                    <>
                                                        <button type="button"
                                                                className="el-button el-button-primary el-button-small right"
                                                                // onClick={this._convertPDFToText}
                                                                onClick={this.convertPDFToText}>
                                                                <span>Convert thành text</span>
                                                        </button>
                                                        <div className=" mb10">
                                                            <iframe
                                                                title="pdf"
                                                                src={file_preview}
                                                                style={{width: "100%", height: "1000px"}} frameBorder="0"/>
                                                        </div>
                                                        </>
                                                    )}
                                            </div>
                                            <div className="col-md-1 text-center clear-with-col">
                                                    <i className="fa fa fa-long-arrow-right text-primary fs50"></i>
                                            </div>
                                            <div className="col-md-5">
                                                <button type="button"
                                                    className="el-button el-button-default el-button-small "
                                                    // onClick={() => this.onGoDetail(object?.id)}
                                                    disabled={(!this.state.textPDFConvert) && true}
                                                    onClick={this.copyClipboard}
                                                >
                                                    <span>Copy text</span>
                                                </button>
                                                <div className="box-copy-text mb10">
                                                    {/* <textarea/> */}
                                                    {this.state.textPDFConvert}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResumeInfo);
