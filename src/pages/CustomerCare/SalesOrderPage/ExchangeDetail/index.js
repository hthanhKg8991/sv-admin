import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import {
    approveExchangeSalesOrder,
    cancelExchangeSalesOrder,
    getDetailExchangeSalesOrder,
    rejectExchangeSalesOrder,
    submitExchangeSalesOrder
} from "api/saleOrder";
import {publish, subscribe} from "utils/event";
import * as Constant from "utils/Constant";
import {formatNumber} from "utils/utils";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            exchange_object: null,
            credit_total: 0,
        };
        this.getExchangeDetail = this._getExchangeDetail.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
        this.onCancel = this._onCancel.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.getExchangeDetail();
            });
        }, props.idKey));
    }

    async _getExchangeDetail() {
        const res = await getDetailExchangeSalesOrder({id: this.props.id});
        if (res) {
            this.setState({exchange_object: res});
        }
        this.setState({loading: false});
    }

    async _onSubmit() {
        const {uiAction} = this.props;
        const res = await submitExchangeSalesOrder({id: this.props.id});
        if (res) {
            uiAction.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, this.props.idKey);
        }
    }

    async _onCancel() {
        const {uiAction} = this.props;
        const res = await cancelExchangeSalesOrder({id: this.props.id});
        if (res) {
            uiAction.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, this.props.idKey);
        }
    }

    async _onApprove() {
        const {uiAction} = this.props;
        const res = await approveExchangeSalesOrder({id: this.props.id});
        if (res) {
            uiAction.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, this.props.idKey);
        }
    }

    async _onReject() {
        const {uiAction} = this.props;
        const res = await rejectExchangeSalesOrder({id: this.props.id});
        if (res) {
            uiAction.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, this.props.idKey);
        }
    }

    componentDidMount() {
        this.getExchangeDetail();
    }

    render() {
        const {exchange_object, loading} = this.state;

        return (
            <>
                {loading && <LoadingSmall className="form-loading"/>}
                <div className="step-confirm">
                    <div className="font-bold text-primary mb15">Bước 2: Xác nhận credit sau khi thay đổi</div>
                    <div>
                        <b>a. Giá trị credit quy đổi</b> <br/>
                        <div className="exchange-credit-box mt20 mb20">
                            <div className="credit-row">
                                <div className="credit-label">Số credit hiện tại của Khách hàng</div>
                                <div
                                    className="credit-value"> {formatNumber(exchange_object?.credit_employer_total_amount, 0, '.', 'đ')}</div>
                            </div>
                            <div className="credit-row">
                                <div className="credit-label"><i>Giá trị quy đổi</i></div>
                                <div className="credit-value">
                                    {formatNumber(exchange_object?.total_amount, 0, '.', 'đ')}
                                </div>
                            </div>
                            <div className="credit-row">
                                <div className="credit-label">Số credit tăng thêm</div>
                                <div className="credit-value">
                                    {formatNumber(exchange_object?.total_amount, 0, '.', 'đ')}
                                </div>
                            </div>
                            <hr/>
                            <div className="credit-row">
                                <div className="credit-label"><b>Tổng credit sau khi quy đổi</b></div>
                                <div className="credit-value">
                                    <b>{formatNumber(parseInt(exchange_object?.total_amount) + parseInt(exchange_object?.credit_employer_total_amount), 0, '.', 'đ')}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p><b>b. Trạng thái gói dịch vụ</b></p>
                        <p className="mt15">- Các gói dịch vụ dưới đây sau khi xác nhận quy đổi sẽ bị hủy và khách
                            hàng không thể kích hoạt các dịch vụ này</p>

                    </div>
                    <div className="body-table table-exchange el-table crm-section">
                        <div className="body-table el-table">
                            <table className="table-default">
                                <tbody>
                                <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                    <td>
                                        <div className="cell">Tên sản phẩm</div>
                                    </td>
                                    <td>
                                        <div className="cell">Số lượng</div>
                                    </td>
                                    <td>
                                        <div className="cell">Trạng thái hiện tại</div>
                                    </td>
                                    <td>
                                        <div className="cell">Trạng thái sau quy đổi</div>
                                    </td>
                                </tr>
                                {
                                    exchange_object?.sales_order_items_sub &&
                                    exchange_object?.sales_order_items_sub?.map((item, key) => {
                                        const unit = [
                                            Constant.SERVICE_TYPE_FILTER_RESUME,
                                            Constant.SERVICE_TYPE_FILTER_RESUME_2018
                                        ].includes(item?.service_type) ? 'điểm' : 'ngày';
                                        return (
                                            <tr className="text-bold tr-body el-table-row no-bg pointer"
                                                key={key.toString()}>
                                                <td>
                                                    <div className="cell">
                                                        {item?.cache_service_name} <br/>
                                                        Sub ID: {item?.sales_order_items_sub_id}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell">
                                                        {`${item?.remaining} ${unit.toLowerCase()}`}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell">
                                                        <SpanCommon
                                                            idKey={Constant.COMMON_DATA_KEY_sales_order_items_sub_status}
                                                            value={item?.status}/>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="cell text-red">
                                                        Đã quy đổi
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt30 text-center">
                            {[
                                Constant.EXCHANGE_SALES_ORDER_STATUS_NEW,
                                Constant.EXCHANGE_SALES_ORDER_STATUS_CANCELLED
                            ].includes(parseInt(exchange_object?.status)) && (
                                <>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_exchange_submit}>
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                                onClick={this.onSubmit}>
                                            <span>Xác nhận và gửi yêu cầu quy đổi</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_exchange_cancel}>
                                        <button type="button" className="el-button el-button-warning el-button-small"
                                                onClick={this.onCancel}>
                                            <span>Hủy yêu cầu</span>
                                        </button>
                                    </CanRender>
                                </>
                            )}
                            {[Constant.EXCHANGE_SALES_ORDER_STATUS_SUBMITTED].includes(parseInt(exchange_object?.status)) && (
                                <>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_exchange_approve}>
                                        <button type="button" className="el-button el-button-primary el-button-small"
                                                onClick={this.onApprove}>
                                            <span>Duyệt yêu cầu quy đổi</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_exchange_reject}>
                                        <button type="button" className="el-button el-button-warning el-button-small"
                                                onClick={this.onReject}>
                                            <span>Không duyệt</span>
                                        </button>
                                    </CanRender>
                                    <CanRender actionCode={ROLES.customer_care_sales_order_exchange_cancel}>
                                        <button type="button" className="el-button el-button-bricky el-button-small"
                                                onClick={this.onCancel}>
                                            <span>Hủy yêu cầu</span>
                                        </button>
                                    </CanRender>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
