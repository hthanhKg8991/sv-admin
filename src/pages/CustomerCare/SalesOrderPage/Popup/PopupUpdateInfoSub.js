import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {updateInfoSub} from "api/saleOrder";
import {publish} from "utils/event";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import Dropbox from 'components/Common/InputValue/Dropbox';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Input2 from "components/Common/InputValue/Input2";
import InputArea from "components/Common/InputValue/InputArea";

class PopupUpdateInfoSub extends Component {
    constructor(props) {
        super(props);
        const {channel_code} = props;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;

        this.state = {
            loading: false,
            object: {
                status: null,
                [isMW ? 'reserve_expired_at' : 'expired_at']: null,
                remaining_expired_day: null,
                note: null,
            },
            object_required: [],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    async _onSave(data) {
        const {item, idKey, uiAction} = this.props;

        uiAction.SmartMessageBox({
            title: "Bạn chắc chắn thay đổi thông tin hiện tại?",
            content: "",
            buttons: ['Đóng', 'Xác nhận']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Xác nhận") {
                const {object_required} = this.state;
                const object = Object.assign({}, data);
                if (object) {
                    const check = utils.checkOnSaveRequired(object, object_required);
                    if (check.error) {
                        this.setState({name_focus: check.field});
                        this.setState({object_error: check.fields});
                        return;
                    }
                    uiAction.showLoading();
                    const res = await updateInfoSub({...object, id: item.id});
                    if (res) {
                        publish('.refresh', {}, idKey);
                        uiAction.deletePopup();
                        uiAction.putToastSuccess("Cập nhật thành công!");
                    }
                    this.setState({object_error: {}});
                    this.setState({name_focus: ""});
                    uiAction.hideLoading();
                }
                uiAction.hideSmartMessageBox();
            } else if (ButtonPressed === "Đóng") {
                uiAction.hideSmartMessageBox();
                uiAction.showLoading();
                uiAction.hideLoading();
            } else {
                uiAction.hideSmartMessageBox();
            }
        });
    }

    _onChange(value, name) {
        const {object_error} = this.state;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        const object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    _onClose() {
        const {uiAction} = this.props;
        uiAction.deletePopup();
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="dialog-popup-body">
                    <div className="form-container">
                        <div className="popupContainer text-center">
                            <LoadingSmall/>
                        </div>
                    </div>
                </div>
            )
        }
        const {item, channel_code} = this.props;
        const {object, object_error, object_required, name_focus} = this.state;
        const salesOrderStatus = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_items_sub_status);
        const remainingExpiredDay = item?.remaining_expired_day;
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        const expiredDay = isMW ? item?.reserve_expired_at : item?.expired_at;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="row">
                        <div className="col-12">
                            <div className="popupContainer">
                                <div className="form-container">
                                    <div className="row d-flex align-items-center mb10">
                                        <div className="col-md-3"/>
                                        <div className="col-md-4"><b>Hiện tại</b></div>
                                        <div className="col-md-5"><b>Điều chỉnh</b></div>
                                    </div>
                                    <div className="row d-flex align-items-center mb10">
                                        <div className="col-md-3">Trạng thái Sub</div>
                                        <div className="col-md-4">
                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_items_sub_status}
                                                        value={item?.status} notStyle/>
                                        </div>
                                        <div className="col-md-5">
                                            <Dropbox name="status" label="Trạng thái" data={salesOrderStatus}
                                                     required={object_required.includes('status')}
                                                     value={object.status}
                                                     error={object_error.status}
                                                     nameFocus={name_focus}
                                                     onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row d-flex align-items-center mb10">
                                        <div className="col-md-3">Hạn sử dụng/Bảo lưu</div>
                                        <div className="col-md-4">
                                            {expiredDay && moment.unix(expiredDay).format("DD/MM/YYYY")}
                                        </div>
                                        <div className="col-md-5">
                                            <DateTimePicker name={isMW ? 'reserve_expired_at' : 'expired_at'} label="Ngày hạn hết"
                                                            minDate={moment()}
                                                            error={object_error[isMW ? 'reserve_expired_at' : 'expired_at']}
                                                            value={object[isMW ? 'reserve_expired_at' : 'expired_at']}
                                                            nameFocus={name_focus}
                                                            onChange={this.onChange}
                                                            required={object_required.includes(isMW ? 'reserve_expired_at' : 'expired_at')}
                                            />
                                        </div>
                                    </div>
                                    <div className="row d-flex align-items-center mb10">
                                        <div className="col-md-3">Số ngày bảo lưu</div>
                                        <div className="col-md-4">
                                            {remainingExpiredDay}
                                        </div>
                                        <div className="col-md-5">
                                            <Input2 type="text" name="remaining_expired_day" label="Số ngày bảo lưu thực tế" isNumber
                                                required={object_required.includes('remaining_expired_day')}
                                                error={object_error.remaining_expired_day} value={object.remaining_expired_day}
                                                nameFocus={name_focus}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                    </div>
                                    <InputArea name="note" label="Ghi chú" required={object_required.includes('note')}
                                                style={{height:"50px", minHeight:"50px"}} nameFocus={name_focus}
                                                value={object.note} error={object_error.note}
                                                onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <hr className="v-divider margin0"/>
                            <div className="v-card-action ml15">
                                <button type="submit" className="el-button el-button-success el-button-small mr5">
                                    <span>Xác nhận</span>
                                </button>
                                <button type="button" className="el-button el-button-primary el-button-small ml5"
                                        onClick={this.onClose}>
                                    <span>Đóng</span>
                                </button>
                            </div>
                        </div>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupUpdateInfoSub);
