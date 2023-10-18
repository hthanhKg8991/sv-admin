import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Dropbox from 'components/Common/InputValue/Dropbox';
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

class PopupOffice extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ItInfo");

        let object_required = ['word_level', 'excel_level', 'powerpoint_level', 'outlook_level'];
        if(configForm.includes("special_achieve")) {
            object_required = [...object_required, "special_achieve"];
        }
        if(channelCodeCurrent === Constant.CHANNEL_CODE_VL24H) {
            object_required = []
        }
        this.state = {
            object: Object.assign({}, props.object),
            object_revision: Object.assign({}, props.object_revision),
            object_required: object_required,
            object_error: {},
            name_focus: "",
            configForm: configForm,
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(){
        const { object_required } = this.state;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        let object_revision = Object.assign({}, this.state.object_revision);
        // Bỏ đi cơ chế merge data luôn lấy dữ liệu chính api trả về
        let object = object_revision;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
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
        if(this.props.object && this.props.object_revision){
            data_arr[this.props.key_edit] = object;
        }else{
            data_arr.push(object);
        }
        args.data = data_arr;
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_IT_SAVE, args);
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
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_IT_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_IT_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('OfficeInfo');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_IT_SAVE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
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
        const {object, object_revision, object_error, object_required, name_focus, configForm} = this.state;
        const language_resume_rate = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_language_resume_rate);

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave();
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <Dropbox name="word_level" label="Word" data={language_resume_rate} required={object_required.includes('word_level')}
                                             nameFocus={name_focus} error={object_error.word_level}
                                             value={(object_revision.word_level !== undefined) ? object_revision.word_level : object.word_level}
                                             old_value={object.word_level}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <Dropbox name="excel_level" label="Excel" data={language_resume_rate} required={object_required.includes('excel_level')}
                                             nameFocus={name_focus} error={object_error.excel_level}
                                             value={(object_revision.excel_level !== undefined) ? object_revision.excel_level : object.excel_level}
                                             old_value={object.excel_level}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <Dropbox name="powerpoint_level" label="Powerpoint" data={language_resume_rate} required={object_required.includes('powerpoint_level')}
                                             nameFocus={name_focus} error={object_error.powerpoint_level}
                                             value={(object_revision.powerpoint_level !== undefined) ? object_revision.powerpoint_level : object.powerpoint_level}
                                             old_value={object.powerpoint_level}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-3 col-xs-6 mb10">
                                    <Dropbox name="outlook_level" label="Outlook" data={language_resume_rate} required={object_required.includes('outlook_level')}
                                             nameFocus={name_focus} error={object_error.outlook_level}
                                             value={(object_revision.outlook_level !== undefined) ? object_revision.outlook_level : object.outlook_level}
                                             old_value={object.outlook_level}
                                             onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <InputArea name="orther_skill" label="Phần mềm khác" required={object_required.includes('orther_skill')}
                                               style={{minHeight:"30px", height:"50px"}}
                                               error={object_error.orther_skill} nameFocus={name_focus}
                                               value={(object_revision.orther_skill !== undefined) ? object_revision.orther_skill : object.orther_skill}
                                               old_value={object.orther_skill}
                                               onChange={this.onChange}
                                    />
                                </div>
                                {_.includes(configForm, "special_achieve") && (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <InputArea name="special_achieve" label="Các thành tích nổi bật" required={object_required.includes('special_achieve')}
                                                   style={{minHeight:"30px", height:"50px"}}
                                                   error={object_error.special_achieve} nameFocus={name_focus}
                                                   value={(object_revision.special_achieve !== undefined) ? object_revision.special_achieve : object.special_achieve}
                                                   old_value={object.special_achieve}
                                                   onChange={this.onChange}
                                        />
                                    </div>
                                )}

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
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupOffice);
