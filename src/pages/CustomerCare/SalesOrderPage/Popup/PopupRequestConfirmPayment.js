import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {requestConfirmPayment} from "api/saleOrder";
import Input2 from "components/Common/InputValue/Input2";
import {getEmailAccountantLiabilities} from "api/statement";
import * as Constant from "utils/Constant";
import InputFileMulti from "components/Common/InputValue/InputFileMulti";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupRequestConfirmPayment extends Component {
    constructor(props) {
        super(props);
        const {object} = this.props;
        this.state = {
            object: {
                confirm_payment_file: object?.confirm_payment_file || null,
                confirm_payment_email: object?.confirm_payment_email || null,
                confirm_payment_file_url: object?.confirm_payment_file_url || null,
                confirm_payment_note: object?.confirm_payment_note || null,
            },
            object_required: ['confirm_payment_note', 'confirm_payment_email'],
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
        const res = await requestConfirmPayment({...object, sales_order_id: this.props.id});
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

        const res = await getEmailAccountantLiabilities({branch_code: object?.branch_code, channel_code: channelCode});
        
        if (res && res?.length > 0) {
            const [config] = res;
            const {staff_info = {}} = config;
            this.setState({
                object: {...this.state.object, confirm_payment_email: staff_info?.email},
            });
        }
    }

    componentDidMount() {
        const {object} = this.props;

        if (!object?.confirm_payment_email || Number(object?.confirm_payment_status) === Constant.CONFIRM_PAYMENT_STATUS_SENT_MAIL_AND_WAITING_CONFIRM) { // gửi lại y/c duyệt thì lấy ktcn theo miền phiếu
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
                                <Input2 type="email" name="confirm_payment_email" label="Email nhận của kế toán công nợ"
                                    required={object_required.includes('confirm_payment_email')}
                                    error={object_error.confirm_payment_email}
                                    value={object.confirm_payment_email}
                                    nameFocus={name_focus}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0 mt15">
                                <Input2 type="text" name="confirm_payment_note" label="Ghi chú"
                                        required={object_required.includes('confirm_payment_note')}
                                        error={object_error.confirm_payment_note}
                                        value={object.confirm_payment_note}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0">
                                <InputFileMulti name="confirm_payment_file"
                                           folder="salesOrder"
                                           required={object_required.includes('confirm_payment_file')}
                                           error={object_error.confirm_payment_file}
                                           value={object?.confirm_payment_file}
                                           file_url={object?.confirm_payment_file_url}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupRequestConfirmPayment);
