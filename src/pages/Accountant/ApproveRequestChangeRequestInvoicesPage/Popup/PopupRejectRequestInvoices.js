import React, {Component} from "react";
import Input2 from "components/Common/InputValue/Input2";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import {rejectSalesOrderRequestInvoices} from "api/saleOrder";
import {publish} from "utils/event";

class PopupCancelRequestInvoices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: {},
            object_required: ['note'],
            object_error: {},
            name_focus: ""
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
    }

    async _onSave(data) {
        const {uiAction, idKey} = this.props;
        this.setState({object_error: {}});
        this.setState({name_focus: ""});

        let object = Object.assign({}, data);
        object.request_type = this.state.requestType;
        let object_required = this.state.object_required;
        let check = utils.checkOnSaveRequired(object, object_required);
        if (check.error) {
            this.setState({name_focus: check.field});
            this.setState({object_error: check.fields});
            return;
        }
        object.id = this.props.id;
        uiAction.showLoading();
        const res = await rejectSalesOrderRequestInvoices(object);
        if (res) {
            uiAction.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, idKey);
        }
        uiAction.hideLoading();
        uiAction.deletePopup();
    }

    _onChange(value, name) {
        let object_error = this.state.object_error;
        delete object_error[name];
        this.setState({object_error: object_error});
        this.setState({name_focus: ""});
        let object = Object.assign({}, this.state.object);
        object[name] = value;
        this.setState({object: object});
    }

    render() {
        const {object, object_error, object_required, name_focus} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object);
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 mb10">
                                <Input2 type="text" name="note" label="Lý do"
                                        required={object_required.includes('note')}
                                        error={object_error.note} value={object.note}
                                        nameFocus={name_focus}
                                        onChange={this.onChange}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="v-divider margin0"/>
                    <div className="v-card-action">
                        <button type="submit" className="el-button el-button-bricky el-button-small">
                            <span>Xác nhận</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupCancelRequestInvoices);
