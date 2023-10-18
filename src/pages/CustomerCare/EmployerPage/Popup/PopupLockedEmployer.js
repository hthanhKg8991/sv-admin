import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import InputTags from 'components/Common/InputValue/InputTags';
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from 'lodash';
import {publish} from "utils/event";

class PopupLockedEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: props.object,
            objectLock: {
                blacklist_keyword : []
            },
            objectLock_error: {},
            objectLock_required: ['locked_reason'],
            name_focus: ''
        };
        this.onChange = this._onChange.bind(this);
        this.onSave = this._onSave.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
        this.onSetTag = this._onSetTag.bind(this);
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
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_LOCK, objectLock);
        this.props.uiAction.showLoading();
    }
    _hidePopup(){
        this.props.uiAction.deletePopup();
    }

    _onSetTag(value){
        let objectLock = this.state.objectLock;
        let blacklist_keyword = [...objectLock.blacklist_keyword];
        blacklist_keyword.push(value);
        this.setState({objectLock: {...objectLock, blacklist_keyword: blacklist_keyword}});
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LOCK]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_LOCK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, 'EmployerDetail')
            }else{
                this.setState({objectLock_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_LOCK);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextState) !== JSON.stringify(this.state);
    }
    render () {
        let {object, objectLock, objectLock_error, objectLock_required, name_focus} = this.state;
        let employer_locked_reason = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_locked_reason);

        let keyword_suggest = [
            object.phone,
            _.split(object.name, ' ').splice(-2, 2).join(' '),
            _.split(object.address, ' ').splice(0, 5).join(' '),
            _.split(object.contact_info.contact_address, ' ').splice(0, 5).join(' ')
        ];
        keyword_suggest = _.filter(keyword_suggest, o => _.trim(o) !== '');

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="row form-container">
                        <div className="col-sm-12 col-xs-12 mb15 mt10">
                            <DropboxMulti name="locked_reason"
                                          label="Lý do khóa"
                                          required={objectLock_required.includes('locked_reason')}
                                          data={employer_locked_reason}
                                          nameFocus={name_focus}
                                          value={objectLock.locked_reason}
                                          error={objectLock_error.locked_reason}
                                          onChange={this.onChange}
                            />
                        </div>
                        <div className="col-sm-12 col-xs-12 mb15">
                            <InputTags type="text"
                                       name="blacklist_keyword"
                                       label="Từ khóa cấm"
                                       required={objectLock_required.includes('blacklist_keyword')}
                                       keyPress={[',', 'Enter', 'Tab']}
                                       nameFocus={name_focus}
                                       value={objectLock.blacklist_keyword}
                                       error={objectLock_error.blacklist_keyword}
                                       onChange={this.onChange}
                            />
                        </div>
                        <div className="col-sm-12 col-xs-12 mb15">
                            <p><b>Từ khóa tham khảo</b></p>
                            {keyword_suggest.map((value, key) => (
                                <button key={key}
                                        onClick={() => this.onSetTag(value)}
                                        type="button"
                                        className="btn btn-xs btn-warning mr5">
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <hr className="v-divider margin0" />
                <div className="v-card-action">
                    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onSave}>
                        <span>Khóa tài khoản</span>
                    </button>
                    <button type="button" className="el-button el-button-primary el-button-small" onClick={this.hidePopup}>
                        <span>Đóng</span>
                    </button>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupLockedEmployer);
