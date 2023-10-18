import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import Dropbox from 'components/Common/InputValue/Dropbox';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import DateTimePicker from "components/Common/InputValue/DateTimePicker";
import moment from "moment";
import InputArea from "components/Common/InputValue/InputArea";
import {getDetailGuaranteeInfo, updateDetailGuaranteeInfo} from "api/saleOrder";
class PopupUpdateDetailInfoGuarantee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            object: {
                registration_guarantee_type: null,
                status: null,
                start_date: null,
                end_date: null,
                note: null,
            },
            info: {},
            object_required: ['registration_guarantee_type'],
            object_error: {},
            name_focus: "",
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
    }

    async _onSave(data) {
        const {row, idKey, uiAction} = this.props;

        const {object_required, info} = this.state;
        const object = Object.assign({}, data);
        if (object) {
            const check = utils.checkOnSaveRequired(object, object_required);
            if (check.error) {
                this.setState({name_focus: check.field});
                this.setState({object_error: check.fields});
                return;
            }
            delete object.registration_guarantee_type;
            this.setState({loading: true});

            const res = await updateDetailGuaranteeInfo({...object, id: info?.id, point_guarantee_id: row?.point_guarantee_id});
            
            if (res?.id) {
                publish('.refresh', {}, idKey);
                uiAction.deletePopup();
                uiAction.putToastSuccess("Cập nhật thành công!");
            } else {
                uiAction.putToastError(res?.msg);
            }

            this.setState({object_error: {}, name_focus: "", loading: false});
        }
    }

    async _onGetDetailGuaranteeByRegistrationGuaranteeType() {
        const {row, uiAction} = this.props;
        const {object} = this.state;
        this.setState({loading: true});

        const res = await getDetailGuaranteeInfo({point_guarantee_id: row?.point_guarantee_id, registration_guarantee_type: object?.registration_guarantee_type});
        
        if (res) {
            this.setState({info: res}, () => {
                uiAction.hideLoading();
            });
        } else {
            uiAction.putToastError(res);
        }

        this.setState({loading: false});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {object} = this.state;
        if (prevState?.object?.registration_guarantee_type !== object?.registration_guarantee_type) {
            this._onGetDetailGuaranteeByRegistrationGuaranteeType();
        }
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

        const {info, object, object_error, object_required, name_focus} = this.state;
        const registrationGuaranteeType = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_registration_guarantee_type);
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
                                    <Dropbox name="registration_guarantee_type" label="Loại bảo hành" data={registrationGuaranteeType}
                                                required={object_required.includes('registration_guarantee_type')}
                                                value={object.registration_guarantee_type}
                                                error={object_error.registration_guarantee_type}
                                                nameFocus={name_focus}
                                                onChange={this.onChange}
                                    />
                                    <div className="row d-flex align-items-center mb10 mt20">
                                        <div className="col-md-3"/>
                                        <div className="col-md-4"><b>Hiện tại</b></div>
                                        <div className="col-md-5"><b>Điều chỉnh</b></div>
                                    </div>
                                    <div className="row d-flex align-items-center mb10">
                                        <div className="col-md-3">Ngày bắt đầu</div>
                                        <div className="col-md-4">
                                            {info?.start_date && moment.unix(info?.start_date).format("DD/MM/YYYY")}
                                        </div>
                                        <div className="col-md-5">
                                            <DateTimePicker name="start_date" label="Ngày bắt đầu (Tin đăng)"
                                                            minDate={moment()}
                                                            error={object_error['start_date']}
                                                            value={object['start_date']}
                                                            nameFocus={name_focus}
                                                            onChange={this.onChange}
                                                            required={object_required.includes('start_date')}
                                            />
                                        </div>
                                    </div>
                                    <div className="row d-flex align-items-center mb10">
                                        <div className="col-md-3">Ngày kết thúc</div>
                                        <div className="col-md-4">
                                            {info?.end_date && moment.unix(info?.end_date).format("DD/MM/YYYY")}
                                        </div>
                                        <div className="col-md-5">
                                            <DateTimePicker name="end_date" label="Ngày hạn hết (Tin đăng)"
                                                            minDate={moment()}
                                                            error={object_error['end_date']}
                                                            value={object['end_date']}
                                                            nameFocus={name_focus}
                                                            onChange={this.onChange}
                                                            required={object_required.includes('end_date')}
                                            />
                                        </div>
                                    </div>
                                    <InputArea name="note" label="Ghi chú" required={object_required.includes('note')}
                                                style={{height:"50px", minHeight:"50px"}} nameFocus={name_focus}
                                                value={object.note || info?.note} error={object_error.note}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupUpdateDetailInfoGuarantee);
