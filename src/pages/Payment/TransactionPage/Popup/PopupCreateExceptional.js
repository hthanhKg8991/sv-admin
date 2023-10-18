import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {publish} from "utils/event";
import {createExceptionalTransaction} from "api/saleOrder";
import Input2 from "components/Common/InputValue/Input2";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupCreateExceptional extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: props.object,
            object_required: ['amount', 'content'],
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
        const res = await createExceptionalTransaction(object);
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

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {object, object_required, object_error} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="content" label="Nội dung giao dịch"
                                            required={object_required.includes('content')}
                                            error={object_error.content}
                                            value={object.content}
                                            onChange={this.onChange}
                                    />
                                </div>
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Input2 type="text" name="amount" label="Giá trị giao dịch" isNumber
                                            required={object_required.includes('amount')}
                                            error={object_error.amount}
                                            value={object.amount}
                                            onChange={this.onChange}
                                    />
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupCreateExceptional);
