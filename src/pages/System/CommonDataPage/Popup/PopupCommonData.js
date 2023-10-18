import React, {Component} from "react";
import Input2 from 'components/Common/InputValue/Input2';
import InputColor from 'components/Common/InputValue/InputColor';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import Dropbox from "components/Common/InputValue/Dropbox";
import {COMMON_DATA_KEY_SYSTEM_LANG_LIST} from "utils/Constant";

class PopupCommonData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({},props.object),
            object_error: {},
            object_required:['type','name','value']
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _onSave(object){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});
        
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        if (!object.id){
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_COMMON_DATA_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiSystemDomain, ConstantURL.API_URL_POST_COMMON_DATA_UPDATE, object);
        }
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
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_COMMON_DATA_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_COMMON_DATA_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('CommonDataPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_COMMON_DATA_CREATE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_COMMON_DATA_UPDATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_COMMON_DATA_UPDATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('CommonDataPage');
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_COMMON_DATA_UPDATE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {object, object_error, object_required, name_focus} = this.state;
        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="type" label="type" required={object_required.includes('type')}
                                        error={object_error.type} value={object.type} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="name" label="Tên" required={object_required.includes('name')}
                                            error={object_error.name} value={object.name} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="value" label="Giá trị" required={object_required.includes('value')}
                                            error={object_error.value} value={object.value} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10 input-group-picker-color">
                                    <InputColor name="background_color" label="Màu nền" required={object_required.includes('background_color')}
                                                error={object_error.background_color}
                                                value={object.background_color}
                                                onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10 input-group-picker-color">
                                    <InputColor name="text_color" label="Màu chữ" required={object_required.includes('text_color')}
                                                error={object_error.text_color}
                                                value={object.text_color}
                                                onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="from" label="From" required={object_required.includes('from')}
                                            error={object_error.from} value={object.from} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="to" label="To" required={object_required.includes('to')}
                                            error={object_error.to} value={object.to} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Input2 type="text" name="ordering" label="Ordering" isNumber required={object_required.includes('ordering')}
                                            error={object_error.ordering} value={object.ordering} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-6 col-xs-12 mb10">
                                    <Dropbox name="resource"
                                             label="Resource"
                                             required={object_required.includes('resource')}
                                             data={Constant.COMMON_RESOURCE_FE}
                                             error={object_error.resource}
                                             nameFocus={name_focus}
                                             value={object?.resource}
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
        api: state.api,
        sys: state.sys
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupCommonData);
