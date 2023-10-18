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

class PopupUnSuspectEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objectLock: {},
            objectLock_error: {},
            objectLock_required: [],
            name_focus: ''
        };
        this.onChange = this._onChange.bind(this);
        this.onSave = this._onSave.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
    }
    _hidePopup() {
        this.props.uiAction.deletePopup();
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
        objectLock.employer_id = this.props.object.id;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT, objectLock);
        this.props.uiAction.showLoading();
    }

    componentWillMount() {

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, 'EmployerDetail')
            }else{
                this.setState({objectLock_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_UNSUSPECT);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="row form-container">
                        <div className="col-sm-12 col-xs-12 mb15 mt10 text-center">
                            <p className="mb20">Bạn có chắc chắn muốn bỏ lý do nghi ngờ?</p>
                            <div className="text-center">
                                <button type="button" className="el-button el-button-success el-button-small" onClick={this.onSave}>
                                    <span>Xác nhận</span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small" onClick={this.hidePopup}>
                                    <span>Đóng</span>
                                </button>
                            </div>
                            {/*<DropboxMulti name="unsuspect_reason" label="Lý do bỏ nghi ngờ" required={objectLock_required.includes('unsuspect_reason')}*/}
                            {/*              data={unsuspect_reason} nameFocus={name_focus}*/}
                            {/*              value={objectLock.unsuspect_reason} error={objectLock_error.unsuspect_reason}*/}
                            {/*              onChange={this.onChange}*/}
                            {/*/>*/}
                        </div>
                    </div>
                </div>
            </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupUnSuspectEmployer);
