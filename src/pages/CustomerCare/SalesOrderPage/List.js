import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getListSalesOrderRegistration, exportListSaleOrder} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/SalesOrderPage/ComponentFilter";
import {
    hideSmartMessageBox, 
    putToastSuccess, 
    SmartMessageBox, 
    createPopup, 
    hideLoading,  
    showLoading
} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as utils from "utils/utils";
import queryString from "query-string";
import {Link} from "react-router-dom";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import PopupCreateSalesOrderExchange from "pages/CustomerCare/SalesOrderPage/Popup/PopupCreateSalesOrderExchange";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "SalesOrder",
            columns: [
                {
                    title: "Mã phiếu",
                    width: 100,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
                                id: row.id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.id}</span>
                            {(row?.old_channel_code === Constant.CHANNEL_CODE_MW || row?.old_channel_code === Constant.CHANNEL_CODE_MW_FROM_TVN || row?.old_channel_code === Constant.CHANNEL_CODE_VL24H_DELETE) && (
                                <span className="ml5 label"
                                      style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW</span>
                            )}
                            {row?.old_channel_code === Constant.CHANNEL_CODE_TVN && (
                                <span className="ml5 label"
                                      style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN</span>
                            )}
                        </Link>
                    )
                },
                {
                    title: "Tên NTD",
                    width: 200,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail",
                                id: row?.employer_info?.id
                            })}`}>
                            <span>{row?.employer_info?.id} - {row?.employer_info?.name}</span>
                        </Link>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 140,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Ngày duyệt",
                    width: 140,
                    cell: row => {
                        return <>{row?.approved_at && moment.unix(row?.approved_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status} value={row?.status}/>;
                    }
                },
                {
                    title: "Loại phiếu",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_type_campaign} value={row?.type_campaign}/>;
                    }
                },
                {
                    title: "Trạng thái thanh toán",
                    width: 100,
                    cell: row => {
                        return (
                            <>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status}
                                            value={row?.payment_status}/>
                                {row?.request_approve_status &&
                                    <>
                                        <br/>
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_approve_status}
                                                    value={row?.request_approve_status}/>
                                    </>
                                }
                                <br/>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_confirm_payment_status}
                                            value={row?.confirm_payment_status}/>
                            </>
                        );
                    }
                },
                {
                    title: "Hết hạn",
                    width: 90,
                    cell: row => {
                        const oneDay = 60 * 60 * 24;
                        const date = (row.expired_at - moment()
                            .unix()) > 0 ? Math.floor((row.expired_at - moment()
                            .unix()) / oneDay) : false;
                        return (
                            row.expired_at &&
                            <React.Fragment>
                                <div>
                                    {moment.unix(row.expired_at).format("DD/MM/YYYY")}
                                </div>
                                {date && (
                                    <div className="textRed">
                                        {`(Còn ${date} ngày)`}
                                    </div>
                                )}
                            </React.Fragment>
                        )
                    }
                },
                {
                    title: "Tổng tiền",
                    width: 100,
                    cell: row => {
                        const taxRate = (100 + Number(row?.vat_percent)) / 100;
                        let total;
                        if (row?.credit_apply) {
                            total = row?.total_amount_credit_apply;
                        } else {
                            total = row?.is_include_tax === true ? row?.total_amount_unit : row?.total_amount_unit * taxRate;
                        }
                        return <>{utils.formatNumber(total, 0, ".", "đ")}</>;
                    }
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    }
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onCreateExchangeSalesOrder = this._onCreateExchangeSalesOrder.bind(this);
        this.onExport = this._onExport.bind(this);
    }

    async _onExport() {
        const {query, actions} = this.props;
        console.log(actions)
        actions.showLoading();
        const res = await exportListSaleOrder(query);
        if (res) {
            window.open(res?.url);
        }
        actions.hideLoading();
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: `${Constant.BASE_URL_SALES_ORDER}/add`,
        });
    }

    _onCreateExchangeSalesOrder() {
        const {idKey} = this.state;
        this.props.actions.createPopup(PopupCreateSalesOrderExchange, 'Tạo phiếu convert', {idKey: idKey});
    }

    render() {
        const {columns, idKey} = this.state;
        const {query, defaultQuery, history} = this.props;
        const queryMerge = {
            ...query,
            ...(query.page ? {} : {
                "created_at[from]": moment().startOf('year').unix(),
                "created_at[to]": moment().unix()
            })
        }
        const null_filter = Object.keys(query).filter(_ => !['page', 'per_page'].includes(_)).length === 0;
        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={queryMerge} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách Phiếu Đăng Ký"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <>
                        <CanRender actionCode={ROLES.customer_care_sales_order_create}>
                            <div className="left btnCreateNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                        <CanRender actionCode={ROLES.customer_care_sales_order_duplicate_exchange}>
                            <div className="left">
                                <button type="button"
                                        className="el-button el-button-bricky el-button-small"
                                        onClick={this.onCreateExchangeSalesOrder}>
                                    <span>Tạo phiếu convert <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                        <CanRender actionCode={ROLES.customer_care_sale_order_export_excel}>
                        <div className="left">
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.onExport}>
                                    <span>Xuất Excel <i className="glyphicon glyphicon-file" /></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                }
            >
                {null_filter && (
                    <div className="text-center font-bold text-italic mb10">
                        Do lượng dữ liệu lớn, vui lòng chọn ít nhất 1 bộ lọc để tiếp tục tra cứu!
                    </div>
                )}
                    <Gird idKey={idKey}
                          fetchApi={getListSalesOrderRegistration}
                          query={queryMerge}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                          isReplaceRoute
                          isRedirectDetail={false}
                    />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess, 
            SmartMessageBox, 
            hideSmartMessageBox, 
            createPopup, 
            showLoading,
            hideLoading,}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
