import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import InputArea from 'components/Common/InputValue/InputArea';
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

class PopupForte extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.SkillInfo");
        this.state = {
            object: Object.assign({}, props.object),
            object_revision: Object.assign({}, props.object_revision),
            object_required: [],
            object_error: {},
            name_focus: "",
            configForm: configForm,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    _onSave() {
        const {uiAction} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        // const { currentBranch } = this.props;
        const {object_required} = this.state;
        let object_revision = Object.assign({}, this.state.object_revision);
        // Bỏ đi cơ chế merge data luôn lấy dữ liệu chính api trả về
        let object = object_revision;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        // Kiểm tra ràng buộc
        const isRequire = !!(object?.special_skill) || (object?.skills?.length > 0) || !!(object?.interesting);
        if(!isRequire) {
            uiAction.putToastError("Vui lòng nhập 1 trong các trường dữ liệu");
            return false;
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
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_SKILL_SAVE, args);
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object_revision = Object.assign({}, this.state.object_revision);
        object_revision[name] = value;
        this.setState({object_revision: object_revision});
    }

    componentWillMount() {

    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_SKILL_SAVE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_SKILL_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('ForteInfo');
            } else {
                this.setState({object_error: Object.assign({}, response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_SKILL_SAVE);
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
        const {object, object_revision, object_error, object_required, name_focus, configForm} = this.state;
        const type_skill_forte = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_type_skill_forte);

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave();
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <InputArea name="special_skill" label="Kỹ năng chính"
                                           required={object_required.includes('special_skill')}
                                           style={{minHeight: "30px", height: "50px"}}
                                           error={object_error.special_skill} nameFocus={name_focus}
                                           value={(object_revision.special_skill !== undefined) ? object_revision.special_skill : object.special_skill}
                                           old_value={object.special_skill}
                                           onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <DropboxMulti name="skills" label="Kỹ năng khác"
                                              required={object_required.includes('skills')} data={type_skill_forte}
                                              error={object_error.skills} nameFocus={name_focus}
                                              value={(object_revision.skills !== undefined) ? object_revision.skills : object.skills}
                                              old_value={object.skills ?? []}
                                              onChange={this.onChange}
                                />
                            </div>
                            {_.includes(configForm, "interesting") && (
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="interesting" label="Sở thích"
                                               required={object_required.includes('interesting')}
                                               style={{minHeight: "30px", height: "50px"}}
                                               error={object_error.interesting} nameFocus={name_focus}
                                               value={(object_revision.interesting !== undefined) ? object_revision.interesting : object.interesting}
                                               old_value={object.interesting}
                                               onChange={this.onChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupForte);
