import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import {getKeywordLock} from "api/employer";
import {publish} from "utils/event";

class PopupUnLockedEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objectLock: {},
            objectLock_error: {},
            objectLock_required: ['unlock_reason'],
            name_focus: '',
            keyWordLock: [],
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
        objectLock.employer_id = this.props.object.id;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_UNLOCK, objectLock);
        this.props.uiAction.showLoading();
    }

    async _checkKeywordUnblock(id) {
        const res = await getKeywordLock(id);
        if(res) {
            this.setState({keyWordLock: res});
        }
    }

    componentDidMount() {
        const {object} = this.props;
        const {id} = object;
        this._checkKeywordUnblock(id);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_UNLOCK]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_UNLOCK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                publish(".refresh", {}, 'EmployerDetail')
            }else{
                this.setState({objectLock_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_UNLOCK);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {objectLock, objectLock_error, objectLock_required, name_focus, keyWordLock} = this.state;
        let unlocked_reason = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_employer_unlocked_reason);

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="row form-container">
                        {keyWordLock.length > 0  &&
                            <div className="alert alert-danger" role="alert">
                                <p>
                                    Bạn chưa bỏ từ khóa bị cấm liên quan đến NTD này. <br/>
                                    Nếu không xóa từ khóa liên quan, NTD mới tạo tài khoản có chứa thông tin từ khóa bị cấm
                                    sẽ dựa vào danh sách nghi ngờ. Bạn có muốn bỏ từ khóa không?
                                </p>
                            </div>
                        }
                        <div className="col-sm-12 col-xs-12 mb15">
                            <DropboxMulti name="unlock_reason" label="Lý do bỏ khóa" required={objectLock_required.includes('unlock_reason')}
                                          data={unlocked_reason} nameFocus={name_focus}
                                          value={objectLock.unlock_reason} error={objectLock_error.unlock_reason}
                                          onChange={this.onChange}
                            />
                        </div>
                    </div>
                </div>
                <hr className="v-divider margin0" />
                <div className="v-card-action">
                    <button type="button" className="el-button el-button-success el-button-small" onClick={this.onSave}>
                        <span>Bỏ khóa</span>
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
export default connect(mapStateToProps,mapDispatchToProps)(PopupUnLockedEmployer);
