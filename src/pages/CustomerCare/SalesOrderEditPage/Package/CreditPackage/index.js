import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import {formatNumber} from "utils/utils";
import Input2 from "components/Common/InputValue/Input2";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import {getTotalAmountCreditEmployer, salesOrderUpdateCreditApply} from "api/saleOrder";
import {publish} from "utils/event";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_detail: true,
            credit_apply: props.sales_order?.credit_apply,
            total_credit_employer: null,
        };
        this.showHide = this._showHide.bind(this);
        this.onSave = this._onSave.bind(this);
        this.onChangeCredit = this._onChangeCredit.bind(this);
    }

    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }

    _onChangeCredit(value) {
        this.setState({credit_apply: value});
    }

    async _onSave() {
        const {sales_order, uiAction} = this.props;
        const {credit_apply, total_credit_employer} = this.state;
        if (parseInt(credit_apply) > parseInt(total_credit_employer)) {
            uiAction.putToastError('Giá trị credit áp dụng đang quá credit hiện tại!');
            return false;
        }
        const res = await salesOrderUpdateCreditApply({
            sales_order_id: sales_order?.id,
            credit_apply: credit_apply
        });

        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công!");
            publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
            this._getTotalCreditEmployer();
        }
    }

    async _getTotalCreditEmployer() {
        const {sales_order} = this.props;
        const res = await getTotalAmountCreditEmployer({
            employer_id: sales_order?.employer_id
        });
        if (res) {
            this.setState({total_credit_employer: parseInt(res?.total_amount)});
        }
    }

    componentDidMount() {
        this._getTotalCreditEmployer();
    }

    render() {
        const {show_detail, total_credit_employer} = this.state;
        const {sales_order} = this.props;

        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Quản lý Credit</span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={this.state.show_detail}>
                        <div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-xs-12">
                                        <p>Số credit hiện tại: <span
                                            className="text-red">{formatNumber(total_credit_employer, 0, '.', 'đ')}</span>
                                        </p>
                                        <div className="credit-apply-box">
                                            <p>
                                                Số credit áp dụng trong đơn hàng:
                                            </p>
                                            {[Constant.SALE_ORDER_INACTIVE, Constant.SALE_ORDER_NOT_COMPLETE].includes(sales_order?.status) ? (
                                                <>
                                                    <Input2 type="text" name="credit_apply" isNumber
                                                            value={sales_order?.credit_apply} onChange={this.onChangeCredit}/>đ
                                                    <CanRender actionCode={ROLES.customer_care_sales_order_apply_credit}>
                                                        <button className="btn btn-sm btn-success" type="button"
                                                                onClick={this.onSave}>
                                                            {sales_order?.credit_apply ? 'Cập nhật' : 'Lưu'}
                                                        </button>
                                                    </CanRender>
                                                </>
                                            ): (
                                                <b>{formatNumber(sales_order?.credit_apply, 0, '.', 'đ')}</b>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
