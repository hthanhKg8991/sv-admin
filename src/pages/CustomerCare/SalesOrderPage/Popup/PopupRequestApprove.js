import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {requestApprove} from "api/saleOrder";
import Input2 from "components/Common/InputValue/Input2";
import {getListConfig} from "api/system";
import InputFileMulti from "components/Common/InputValue/InputFileMulti";
import * as Constant from "utils/Constant";
moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupRequestApprove extends Component {
    constructor(props) {
        super(props);
        const {object} = this.props;
        this.state = {
            object: {
                request_approve_file: object?.request_approve_file || null,
                request_approve_email: object?.request_approve_email || null,
                request_approve_file_url: object?.request_approve_file_url || null,
                request_approve_note: object?.request_approve_note || null,
            },
            object_required: ['request_approve_note', 'request_approve_email'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    async _onSave(data, required) {
        const {uiAction, idKey} = this.props;
        this.setState({object_error: {}, name_focus: "", loading: true});
        let object = Object.assign({}, data);
        let check = utils.checkOnSaveRequired(object, required);
        if (check.error) {
            this.setState({name_focus: check.field, loading: false, object_error: check.fields});
            return;
        }
        uiAction.showLoading();
        const res = await requestApprove({...object, sales_order_id: this.props.id});
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công");
            publish('.refresh', {}, idKey);
            uiAction.deletePopup();
        }
        uiAction.hideLoading();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = {...this.state.object};
        object[name] = value;
        this.setState({object: object});
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    async _onGetEmailConfig() {
        const {object, channelCode} = this.props;
        const {getCodeEmailAccountantServiceByBranchCode} = utils;

        const res = await getListConfig({code: getCodeEmailAccountantServiceByBranchCode(object?.branch_code), channel_code: channelCode});
        if (res && res?.items?.length > 0) {
            const [config] = res?.items;
            this.setState({
                object: {...this.state.object, request_approve_email: config?.value},
            });
        }
    }

    componentDidMount() {
        const {object} = this.props;
        if (!object?.request_approve_email || Number(object?.request_approve_status) === Constant.REQUEST_APPROVE) { // gửi lại y/c duyệt thì lấy ktcn theo miền phiếu
            this._onGetEmailConfig();
        }
    }


    render() {
        const {object, object_required, object_error, name_focus} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                        <div className="col-sm-12 col-xs-12 padding0">
                                <Input2 type="email" name="request_approve_email" label="Email nhận kế toán kích tin"
                                    required={object_required.includes('request_approve_email')}
                                    error={object_error.request_approve_email}
                                    value={object.request_approve_email}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0 mt15">
                                <Input2 type="text" name="request_approve_note" label="Ghi chú"
                                        required={object_required.includes('request_approve_note')}
                                        error={object_error.request_approve_note}
                                        value={object.request_approve_note}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <InputFileMulti name="request_approve_file"
                                           folder="salesOrder"
                                           required={object_required.includes('request_approve_file')}
                                           error={object_error.request_approve_file}
                                           value={object?.request_approve_file}
                                           file_url={object?.request_approve_file_url}
                                           validateType={["jpg", "jpeg", "png", "docx", "doc", "pdf", "xls", "xlsx"]}
                                           onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-success el-button-small">
                            <span>Xác nhận</span>
                        </button>
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.onClose}>
                            <span>Đóng</span>
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
        branch: state.branch
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupRequestApprove);
