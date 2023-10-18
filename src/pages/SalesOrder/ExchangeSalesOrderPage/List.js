import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import ComponentFilter from "pages/SalesOrder/ExchangeSalesOrderPage/ComponentFilter";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import {Link} from 'react-router-dom';
import SpanCommon from "components/Common/Ui/SpanCommon";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupCreateExchange from "pages/SalesOrder/ExchangeSalesOrderPage/Popup/PopupCreate";
import {getListExchangeSalesOrderV2} from "api/saleOrderV2";
import * as utils from "utils/utils";

const idKey = Constant.IDKEY_EXCHANGE;

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EXCHANGE_SALES_ORDER_V2}?${queryString.stringify({
                                id: row.id,
                                action: "exchange-detail"
                            })}`}>
                            <span className={"text-link"}>{row.id}</span>
                        </Link>
                    )
                },
                {
                    title: "Phiếu quy đổi",
                    width: 100,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SALES_ORDER_V2}?${queryString.stringify({
                                id: row.sales_order_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Phiếu áp dụng quy đổi",
                    width: 100,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SALES_ORDER_V2}?${queryString.stringify({
                                id: row.new_sales_order_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.new_sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Giá trị quy đổi",
                    width: 100,
                    cell: row => (
                        <span>{utils.formatNumber(row.amount_total_credit, 0, ",", "đ")}</span>
                    )
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 240,
                    cell: row => (
                        <>
                            <Link
                                to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                    id: row.employer_id,
                                    action: "detail"
                                })}`}>
                                <span className={"text-link"}>{row.employer_info?.id}</span>
                            </Link>
                            <span className="ml5"> - {row?.employer_info?.name}</span>
                        </>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_exchange_sales_order_v2_status}
                                             value={row?.status}/>
                },
                {
                    title: "CSKH",
                    width: 200,
                    accessor: "employer_info.assigned_staff_username"
                },
                {
                    title: "Ngày tạo",
                    width: 200,
                    time: true,
                    accessor: "created_at",
                },
            ],
            loading: false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        this.props.actions.createPopup(PopupCreateExchange, 'Thêm yêu cầu quy đổi', {});
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Quy Đổi Đơn Hàng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.customer_care_sales_order_exchange_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListExchangeSalesOrderV2}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
