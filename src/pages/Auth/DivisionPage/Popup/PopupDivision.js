import React,{Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import CanAction from 'components/Common/Ui/CanAction';
import {publish} from "utils/event";

class PopupStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: Object.assign({}, props.object),
            object_required: ['code', 'short_name', 'full_name'],
            object_error: {},
            name_focus: ""
        };
        this.getDetail = this._getDetail.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }
    _getDetail(id){
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiAuthDomain, ConstantURL.API_URL_GET_DIVISION_DETAIL + id, {});
    }
    _onSave(data){
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, this.state.object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        this.props.uiAction.showLoading();
        if (!object.id){
            object.status = Constant.DIVISION_STATUS_LOCKED;
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_DIVISION_CREATE, object);
        }else{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiAuthDomain, ConstantURL.API_URL_POST_DIVISION_UPDATE + object.id, object);
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
    componentDidMount(){
        let {object} = this.props;
        if (object){
            this.getDetail(object.id);
        }
    }
    componentWillReceiveProps(newProps) {
        let id = newProps.object ? this.props.object.id : '';
        if (newProps.api[`${ConstantURL.API_URL_GET_DIVISION_DETAIL}${id}`]){
            let response = newProps.api[`${ConstantURL.API_URL_GET_DIVISION_DETAIL}${id}`];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({object: response.data});
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(`${ConstantURL.API_URL_GET_DIVISION_DETAIL}${id}`);
        }
        if (newProps.api[ConstantURL.API_URL_POST_DIVISION_CREATE]){
            let response = newProps.api[ConstantURL.API_URL_POST_DIVISION_CREATE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, "DivisionList");
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DIVISION_CREATE);
        }
        if (newProps.api[`${ConstantURL.API_URL_POST_DIVISION_UPDATE}${id}`]){
            let response = newProps.api[`${ConstantURL.API_URL_POST_DIVISION_UPDATE}${id}`];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, "DivisionList");
            }else{
                this.setState({object_error: Object.assign({},response.data)});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(`${ConstantURL.API_URL_POST_DIVISION_UPDATE}${id}`);
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
        let {object, object_error, object_required, name_focus} = this.state;

        return (
            <form onSubmit={(event)=>{
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <CanAction isDisabled={object?.id > 0}>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="code" label="Mã bộ phận" required={object_required.includes('code')}
                                            error={object_error.code} value={object.code} nameFocus={name_focus}
                                            onChange={this.onChange}
                                    />
                                </div>
                            </CanAction>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="short_name" label="Tên ngắn" required={object_required.includes('short_name')}
                                        error={object_error.short_name} value={object.short_name} nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="full_name" label="Tên dài" required={object_required.includes('full_name')}
                                        error={object_error.full_name} value={object.full_name} nameFocus={name_focus}
                                        onChange={this.onChange}
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
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupStaff);
