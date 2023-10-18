import React,{Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import InputArea from 'components/Common/InputValue/InputArea';
import Dropbox from 'components/Common/InputValue/Dropbox';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import _ from 'lodash';

class PopupClassify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objectLock: props.object,
            objectLock_error: {},
            objectLock_required: ['classify'],
            name_focus: ''
        };
        this.onChange = this._onChange.bind(this);
        this.onSave = this._onSave.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
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
        objectLock.id = this.props.object.id;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POINT_GUARANTEE_UPDATE_CLASSIFY, objectLock);
        this.props.uiAction.showLoading();
    }
    _hidePopup(){
        this.props.uiAction.deletePopup();
    }

    componentWillMount() {

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_UPDATE_CLASSIFY]){
            let response = newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_UPDATE_CLASSIFY];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPointResumeGuaranteePage', {delay: Constant.DELAY_LOAD_LIST_2S});
            }else{
                this.setState({objectLock_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POINT_GUARANTEE_UPDATE_CLASSIFY);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render () {
        let {objectLock, objectLock_error, objectLock_required, name_focus} = this.state;
        let classify_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_classify_type);

        return (
            <div className="dialog-popup-body">
                <div className="popupContainer">
                    <div className="row form-container">
                        <div className="col-xs-12 mb10">
                            <Dropbox name="classify"
                                     label="Số lần gọi"
                                     required={objectLock_required.includes('classify')}
                                     data={classify_type}
                                     error={objectLock_error?.classify}
                                     nameFocus={name_focus}
                                     value={_.get(objectLock, "classify", null)}
                                     onChange={this.onChange}
                            />
                        </div>

                        <div className="col-xs-12 mb15 mt10">
                            <InputArea name="admin_note_classify"
                                       label="Ghi chú xử lý"
                                       required={objectLock_required.includes('admin_note_classify')}
                                       nameFocus={name_focus}
                                       style={{ minHeight: "102px" }}
                                       value={objectLock.admin_note_classify}
                                       error={objectLock_error?.admin_note_classify}
                                       onChange={this.onChange}
                            />
                        </div>
                    </div>

                </div>
                <hr className="v-divider margin0" />
                <div className="v-card-action">
                    <button type="button" className="el-button el-button-success el-button-small" onClick={this.onSave}>
                        <span>Lưu</span>
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
        api: state.api,
        sys: state.sys,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupClassify);
