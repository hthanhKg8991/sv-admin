import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Dropbox from 'components/Common/InputValue/Dropbox';
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
import Input2 from "components/Common/InputValue/Input2";

class PopupLanguage extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.LanguageInfo");
        const checkVl24h = channelCodeCurrent === Constant.CHANNEL_CODE_VL24H;
        const object_language = props.object_revision?.language !== undefined ? props.object_revision?.language :  props.object?.language;
        let object_required = ['language'];
        if (configForm.includes("listen_level") && !checkVl24h) {
          object_required = [...object_required, "listen_level"];
        }
        if (configForm.includes("speak_level") && !checkVl24h) {
          object_required = [...object_required, "speak_level"];
        }
        if (configForm.includes("reading_level") && !checkVl24h) {
          object_required = [...object_required, "reading_level"];
        }
        if (configForm.includes("writing_level") && !checkVl24h) {
          object_required = [...object_required, "writing_level"];
        }
        if(configForm.includes("level")) {
            object_required = [...object_required, "level"];
        }
        this.state = {
            object: Object.assign({}, props.object),
            object_revision: Object.assign({}, props.object_revision),
            object_required: object_required,
            object_error: {},
            name_focus: "",
            is_show_other_language: Number(object_language) === Constant.OTHER_LANGUAGE_VALUE,
            configForm: configForm,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    _onSave() {
        this.setState({ object_error: {} });
        this.setState({ name_focus: "" });
        const { object_required } = this.state;

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
        if (this.props.object && this.props.object_revision) {
            data_arr[this.props.key_edit] = object;
        } else {
            data_arr.push(object);
        }
        args.data = data_arr;
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost,
            config.apiSeekerDomain,
            ConstantURL.API_URL_POST_RESUME_LANGUAGE_SAVE,
            args);
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        const {object_required} = this.state;
        delete object_error[name];
        this.setState({ object_error: object_error });
        this.setState({ name_focus: "" });
        let object_revision = Object.assign({}, this.state.object_revision);
        object_revision[name] = value;
        this.setState({ object_revision: object_revision });
        const isOtherLanguage = Number(value) === Constant.OTHER_LANGUAGE_VALUE;
        if(String(name) === Constant.OTHER_LANGUAGE_NAME && isOtherLanguage) {
            this.setState({is_show_other_language: true});
        }
        if(String(name) === Constant.OTHER_LANGUAGE_NAME && !isOtherLanguage) {
            this.setState({is_show_other_language: false});
        }
        this.setState({object_required: object_required});
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_LANGUAGE_SAVE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_LANGUAGE_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('LanguageInfo');
            } else {
                this.setState({ object_error: Object.assign({}, response.data) });
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_LANGUAGE_SAVE);
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
        const { object, object_revision, object_error, object_required, name_focus, is_show_other_language, configForm } = this.state;

        const language_resume = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_resume);
        const language_resume_rate = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_resume_rate);
        const languageLevel = utils.convertArrayValueCommonData(this.props.sys.common.items,
            Constant.COMMON_DATA_KEY_language_level);

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave();
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="language" label="Ngoại ngữ"
                                             data={language_resume}
                                             required={object_required.includes('language')}
                                             nameFocus={name_focus} error={object_error.language}
                                             value={(object_revision.language !== undefined) ? object_revision.language : object.language}
                                             old_value={object.language}
                                             onChange={this.onChange}
                                    />
                                </div>
                                {is_show_other_language &&
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Input2 type="text" name="other_language"
                                                label="Ngôn ngữ khác"
                                                required={object_required.includes('other_language')}
                                                nameFocus={name_focus} error={object_error.other_language}
                                                value={(object_revision.other_language !== undefined) ? object_revision.other_language : object.other_language}
                                                old_value={object.other_language}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                }
                                {_.includes(configForm, "level") && (
                                    <div className="col-sm-6 col-xs-12 mb10">
                                        <Dropbox name="level" label="Trình độ"
                                                 data={languageLevel}
                                                 required={object_required.includes('level')}
                                                 nameFocus={name_focus} error={object_error.level}
                                                 value={(object_revision.level !== undefined) ? object_revision.level : object.level}
                                                 old_value={object.level}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                {_.includes(configForm, "listen_level") && (
                                    <div className="col-sm-3 col-xs-6 mb10">
                                        <Dropbox name="listen_level" label="Nghe"
                                                 data={language_resume_rate}
                                                 required={object_required.includes('listen_level')}
                                                 nameFocus={name_focus}
                                                 error={object_error.listen_level}
                                                 value={(object_revision.listen_level !== undefined) ? object_revision.listen_level : object.listen_level}
                                                 old_value={object.listen_level}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "speak_level") && (
                                    <div className="col-sm-3 col-xs-6 mb10">
                                        <Dropbox name="speak_level" label="Nói"
                                                 data={language_resume_rate}
                                                 required={object_required.includes('speak_level')}
                                                 nameFocus={name_focus} error={object_error.speak_level}
                                                 value={(object_revision.speak_level !== undefined) ? object_revision.speak_level : object.speak_level}
                                                 old_value={object.speak_level}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "reading_level") && (
                                    <div className="col-sm-3 col-xs-6 mb10">
                                        <Dropbox name="reading_level" label="Đọc"
                                                 data={language_resume_rate}
                                                 required={object_required.includes('reading_level')}
                                                 nameFocus={name_focus}
                                                 error={object_error.reading_level}
                                                 value={(object_revision.reading_level !== undefined) ? object_revision.reading_level : object.reading_level}
                                                 old_value={object.reading_level}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                                {_.includes(configForm, "writing_level") && (
                                    <div className="col-sm-3 col-xs-6 mb10">
                                        <Dropbox name="writing_level" label="Viết"
                                                 data={language_resume_rate}
                                                 required={object_required.includes('writing_level')}
                                                 nameFocus={name_focus}
                                                 error={object_error.writing_level}
                                                 value={(object_revision.writing_level !== undefined) ? object_revision.writing_level : object.writing_level}
                                                 old_value={object.writing_level}
                                                 onChange={this.onChange}
                                        />
                                    </div>
                                )}
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupLanguage);
