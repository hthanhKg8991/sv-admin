import React, {Component} from "react";
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
import LoadingSmall from "components/Common/Ui/LoadingSmall";

class PopupVerify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            objectLock: props.object,
            objectLock_error: {},
            objectLock_required: ['result_verified'],
            name_focus: '',
            loading: false
        };
        this.onChange = this._onChange.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.hidePopup = this._hidePopup.bind(this);
    }

    _onChange(value, name) {
        let objectLock_error = this.state.objectLock_error;
        delete objectLock_error[name];
        this.setState({objectLock_error: objectLock_error});
        this.setState({name_focus: ""});
        let objectLock = Object.assign({}, this.state.objectLock);
        objectLock[name] = value;
        if (name === 'result_verified') {
            objectLock.admin_note_list = '';
        }
        this.setState({objectLock: objectLock});
    }

    _onApprove(event) {
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
        if (Number(objectLock?.admin_note_list) + Number(objectLock?.admin_note) === 0) {
            this.props.uiAction.putToastError("Vui lòng chọn Lý do hoặc Ghi chú xác minh !");
            return;
        }
        objectLock.id = this.props.object.id;
        // enhance data reason
        const reasonConst = this.props.sys.common.items[Constant.COMMON_DATA_KEY_guarantee_note_list_type];
        objectLock.admin_note_text = reasonConst && reasonConst?.find(_ => _.value === objectLock.admin_note_list)?.name;
        this.props.uiAction.showLoading();
        this.setState({loading:true});
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POINT_GUARANTEE_APPROVE, objectLock);
    }

    _onReject(event) {
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
        if (Number(objectLock?.admin_note_list) + Number(objectLock?.admin_note) === 0) {
            this.props.uiAction.putToastError("Vui lòng chọn Lý do hoặc Ghi chú xác minh !");
            return;
        }
        objectLock.id = this.props.object.id;
        this.props.uiAction.showLoading();
        this.setState({loading:true});
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POINT_GUARANTEE_REJECT, objectLock);
    }

    _hidePopup() {
        this.props.uiAction.deletePopup();
    }

    componentWillMount() {

    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_APPROVE]) {
            let response = newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_APPROVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPointResumeGuaranteePage', {delay: Constant.DELAY_LOAD_LIST_2S});
            } else {
                this.setState({objectLock_error: response.data});
            }
            this.setState({loading:false});
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POINT_GUARANTEE_APPROVE);
        }

        if (newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_REJECT]) {
            let response = newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_REJECT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.deletePopup();
                this.props.uiAction.refreshList('EmployerPointResumeGuaranteePage', {delay: Constant.DELAY_LOAD_LIST_2S});
            } else {
                this.setState({objectLock_error: response.data});
            }
            this.setState({loading:false});
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POINT_GUARANTEE_REJECT);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {objectLock, objectLock_error, objectLock_required, name_focus} = this.state;
        let guarantee_verify_type = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_guarantee_verify_type);

        let guarantee_note_list_type = this.props.sys.common.items[Constant.COMMON_DATA_KEY_guarantee_note_list_type];
        guarantee_note_list_type = _.filter(guarantee_note_list_type, function (o) {
            return parseInt(o.from) === parseInt(objectLock.result_verified)
        });

        return (
            <>
            {
            this.state.loading 
            ?   (
                    <div className="relative card-body text-center">
                        <LoadingSmall />
                    </div>
                )
            :   (
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="row form-container">
                            <div className="col-xs-12 mb10">
                                <Dropbox name="result_verified"
                                        label="Kết quả xác minh"
                                        required={objectLock_required.includes('result_verified')}
                                        data={guarantee_verify_type}
                                        error={objectLock_error.result_verified}
                                        nameFocus={name_focus}
                                        value={_.get(objectLock, "result_verified", null)}
                                        onChange={this.onChange}
                                />
                            </div>
                            {!_.isEmpty(guarantee_note_list_type) && (
                                <div className="col-xs-12 mb10">
                                    <Dropbox name="admin_note_list"
                                            label="Lý do"
                                            key_title="name"
                                            key_value="value"
                                            required={objectLock_required.includes('admin_note_list')}
                                            data={guarantee_note_list_type}
                                            error={objectLock_error.admin_note_list}
                                            nameFocus={name_focus}
                                            value={_.get(objectLock, "admin_note_list", null)}
                                            onChange={this.onChange}
                                    />
                                </div>
                            )}

                            <div className="col-xs-12 mb15 mt10">
                                <InputArea name="admin_note"
                                        label="Ghi chú xác minh"
                                        required={objectLock_required.includes('admin_note')}
                                        nameFocus={name_focus}
                                        style={{minHeight: "102px"}}
                                        value={objectLock.admin_note}
                                        error={objectLock_error.admin_note}
                                        onChange={this.onChange}
                                />
                            </div>
                        </div>

                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        {Number(_.get(objectLock, "result_verified", null)) === 1 && (
                            <button type="button" className="el-button el-button-success el-button-small"
                                    disabled={this.state.loading}
                                    onClick={this.onApprove}>
                                <span>Duyệt</span>
                            </button>
                        )}
                        {Number(_.get(objectLock, "result_verified", null)) === 2 && (
                            <button type="button" className="el-button el-button-bricky el-button-small"
                                    disabled={this.state.loading}
                                    onClick={this.onReject}>
                                <span>Không duyệt</span>
                            </button>
                        )}
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.hidePopup}>
                            <span>Đóng</span>
                        </button>
                    </div>
                </div>
            )
            }
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupVerify);
