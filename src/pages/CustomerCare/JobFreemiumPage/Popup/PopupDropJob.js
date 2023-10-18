import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {publish} from "utils/event";
import Input2 from "components/Common/InputValue/Input2";

class PopupDropJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objectLock: {},
            objectLock_error: {},
            objectLock_required: ['drop_note'],
            name_focus: ''
        };
        this.onChange = this._onChange.bind(this);
        this.onSave = this._onSave.bind(this);
    }
    _onChange(value, name){
        let objectLock_error = this.state.objectLock_error;
        delete objectLock_error[name];
        this.setState({objectLock_error: objectLock_error});
        this.setState({name_focus: ""});
        let objectLock = Object.assign({},this.state.objectLock);
        objectLock[name] = value;
        this.setState({objectLock: objectLock});
    }
    _onSave(event){
        event.preventDefault();
        this.setState({objectLock_error: {}});
        this.setState({name_focus: ""});
        let objectLock = this.state.objectLock;
        let check = utils.checkOnSaveRequired(objectLock, this.state.objectLock_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        objectLock.registration_id = this.props.object.id;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_DROP_JOB_FREEMIUM, objectLock);
        this.props.uiAction.showLoading();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DROP_JOB_FREEMIUM]){
            let response = newProps.api[ConstantURL.API_URL_GET_DROP_JOB_FREEMIUM];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                setTimeout(() => {
                    publish(".refresh", {}, Constant.IDKEY_JOB_FREEMIUM_LIST)
                }, 1000)
            }else{
                this.setState({objectLock_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DROP_JOB_FREEMIUM);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render () {
        let {objectLock, objectLock_error, objectLock_required, name_focus} = this.state;
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="row form-container">
                        <div className="col-sm-12 col-xs-12 mb15 mt10">
                            <Input2 type="text" 
                                name="drop_note"
                                label="Lý do hạ"
                                required={objectLock_required.includes('drop_note')}
                                error={objectLock_error.drop_note}
                                value={objectLock.drop_note}
                                nameFocus={name_focus}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                </div>
                <hr className="v-divider margin0" />
                <div className="v-card-action">
                    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onSave}>
                        <span>Hạ tin</span>
                    </button>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupDropJob);
