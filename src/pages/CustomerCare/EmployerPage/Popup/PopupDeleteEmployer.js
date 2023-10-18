import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import config from 'config';
import InputArea from 'components/Common/InputValue/InputArea';
import * as Constant from "utils/Constant";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PopupDeleteEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objectLock: {},
            objectLock_error: {},
            objectLock_required: ['deleted_note'],
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
        objectLock.id = this.props.object.id;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiEmployerDomain, ConstantURL.API_URL_POST_EMPLOYER_DELETE, objectLock);
        this.props.uiAction.showLoading();
    }

    componentWillMount() {

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_EMPLOYER_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_EMPLOYER_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.history.push({
                    pathname: Constant.BASE_URL_EMPLOYER,
                });
            }else{
                this.setState({objectLock_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_EMPLOYER_DELETE);
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
                            <InputArea name="deleted_note"
                                       label="Lý do xóa"
                                       required={objectLock_required.includes('deleted_note')}
                                       nameFocus={name_focus}
                                       style={{ minHeight: "102px" }}
                                       value={objectLock.deleted_note}
                                       error={objectLock_error.deleted_note}
                                       onChange={this.onChange}
                            />
                        </div>
                    </div>
                </div>
                <hr className="v-divider margin0" />
                <div className="v-card-action">
                    <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.onSave}>
                        <span>Xóa</span>
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
        api: state.api
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(PopupDeleteEmployer);
