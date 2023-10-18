import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Input2 from 'components/Common/InputValue/Input2';
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

class PopupReference extends Component {
    constructor(props) {
        super(props);
        const channelCodeCurrent = _.get(props, "branch.currentBranch.channel_code".split("."), null);
        const configForm = getConfigForm(channelCodeCurrent, "SeekerCare.ResumeStepByStepPage.ConsultorInfo");
        let object_required = ['name', 'company_name', 'position', 'phone'];
        if (configForm.includes("email")) {
            object_required = [...object_required, "email"];
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
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object_revision = Object.assign({}, this.state.object_revision);
        // Bỏ đi cơ chế merge data luôn lấy dữ liệu chính api trả về
        let object = object_revision;
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
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
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSeekerDomain, ConstantURL.API_URL_POST_RESUME_CONSULTOR_SAVE, args);
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
        if (newProps.api[ConstantURL.API_URL_POST_RESUME_CONSULTOR_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_POST_RESUME_CONSULTOR_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.deletePopup();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('ReferenceInfo');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_RESUME_CONSULTOR_SAVE);
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
        const {object, object_revision, object_error, object_required, configForm, name_focus} = this.state;

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave();
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="name" label="Họ và tên" required={object_required.includes('name')}
                                        nameFocus={name_focus} error={object_error.name}
                                        value={(object_revision.name !== undefined) ? object_revision.name : object.name}
                                        old_value={object.name}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="company_name" label="Công ty/tổ chức" required={object_required.includes('company_name')}
                                        nameFocus={name_focus} error={object_error.company_name}
                                        value={(object_revision.company_name !== undefined) ? object_revision.company_name : object.company_name}
                                        old_value={object.company_name}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="position" label="Chức vụ" required={object_required.includes('position')}
                                        nameFocus={name_focus} error={object_error.position}
                                        value={(object_revision.position !== undefined) ? object_revision.position : object.position}
                                        old_value={object.position}
                                        onChange={this.onChange}
                                />
                            </div>
                            {_.includes(configForm, "email") && (
                                <div className="col-sm-12 col-xs-12 padding0">
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        <Input2 type="text" name="email" label="Email" required={object_required.includes('email')}
                                                nameFocus={name_focus} error={object_error.email}
                                                value={(object_revision.email !== undefined) ? object_revision.email : object.email}
                                                old_value={object.email}
                                                onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="phone" label="Số điện thoại" numberOnly required={object_required.includes('phone')}
                                            nameFocus={name_focus} error={object_error.phone}
                                            value={(object_revision.phone !== undefined) ? object_revision.phone : object.phone}
                                            old_value={object.phone}
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
        branch: state.branch,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupReference);
