import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {cancelOpportunity} from "api/saleOrder";
import Input2 from "components/Common/InputValue/Input2";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupCancel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {
                cancel_notice: null,
                cancel_reason: null,
            },
            object_required: ['cancel_reason'],
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
        const res = await cancelOpportunity({...object, id: this.props?.row?.id});
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

    render() {
        const {object, object_required, object_error, name_focus} = this.state;
        const {row} = this.props;
        const mapList = {
            1: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_1,
            2: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_2,
            4: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_4,
            5: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_5,
            6: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_6,
            7: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_7,
            99: Constant.COMMON_DATA_KEY_opportunity_cancel_reason_99,
        }
        const commonReason = mapList[row?.level];
        let cancel_reason = utils.convertArrayValueCommonData(this.props.sys.common.items, commonReason);

        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0 margin-top-10">
                                <Dropbox name="cancel_reason" label="Lý do thất bại"
                                         data={cancel_reason}
                                         required={object_required.includes("cancel_reason")}
                                         error={object_error.cancel_reason} value={object.cancel_reason}
                                         nameFocus={name_focus}
                                         onChange={this.onChange}
                                />
                            </div>
                            <div className="col-sm-12 col-xs-12 padding0 margin-top-10">
                                <Input2 type="text" name="cancel_notice" label="Ghi chú"
                                        required={object_required.includes('cancel_notice')}
                                        error={object_error.cancel_notice}
                                        value={object.cancel_notice}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupCancel);
