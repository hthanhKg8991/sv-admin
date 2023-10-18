import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from 'moment-timezone';
import * as apiAction from 'actions/apiAction';
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import Dropbox from "components/Common/InputValue/Dropbox";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import {getListPayment, updateStatusTransaction} from "api/saleOrder";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

class PopupEditTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: props.object,
            object_required: ['id', 'payment_id'],
            object_error: {},
            name_focus: "",
            payments: [],
        };
        this.onSave = this._onSave.bind(this);
        this.onChange = this._onChange.bind(this);
        this.onClose = this._onClose.bind(this);
        this.getListPayment = this._getListPayment.bind(this);
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
        const res = await updateStatusTransaction(object);
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

    async _getListPayment(value) {
        this.setState({loading_getPayment: true});
        const {object} = this.props;
        const res = await getListPayment({not_status: Constant.PAYMENT_STATUS_PAID, per_page: 100, page:1, q:value});
        if (res && Array.isArray(res?.items)) {
            let isExists = false;
            const payments = res.items.map(item => {
                if (Number(item?.id) === Number(object?.payment_id)) {
                    isExists = true;
                }
                return {
                    value: item?.id,
                    title: `${item?.id} - ${item?.sales_order_id}`
                }
            });
            if (!isExists) {
                const objectNew = {...object, payment_id: null}
                this.setState({object, objectNew});
            }
            this.setState({loading_getPayment: false});
            this.setState({payments: payments});
        }
    }

    componentDidMount() {
        this.getListPayment();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        const {object, object_required, object_error, payments, loading_getPayment} = this.state;
        return (
            <form onSubmit={(event) => {
                event.preventDefault();
                this.onSave(object, object_required)
            }}>
                <div className="dialog-popup-body">
                    <div className="popupContainer">
                        <div className="form-container row">
                            <div className="col-sm-12 col-xs-12 padding0">
                                {object?.statement_id && (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        Statement ID: <b>{object?.statement_id}</b>
                                    </div>
                                )}
                                {object?.exceptional_transaction_id && (
                                    <div className="col-sm-12 col-xs-12 mb10">
                                        Exceptional Transaction ID: <b>{object?.exceptional_transaction_id}</b>
                                    </div>
                                )}
                                <div className="col-sm-12 col-xs-12 mb10">
                                    <Dropbox name="payment_id" label="Payment ID"
                                             data={payments}
                                             value={object.payment_id}
                                             error={object_error.payment_id}
                                             required={object_required.includes('payment_id')}
                                             onChange={this.onChange}
                                             timeOut={1000}
                                             loading={loading_getPayment}
                                             onChangeTimeOut={this.getListPayment}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupEditTransaction);
