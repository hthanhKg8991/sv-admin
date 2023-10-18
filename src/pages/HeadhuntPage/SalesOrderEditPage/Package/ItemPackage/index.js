import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import PopupEmployerPackage from 'pages/CustomerCare/SalesOrderEditPage/Package/Popup/PopupEmployerPackage';
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {publish, subscribe} from "utils/event";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import PopupItemPackage from "pages/HeadhuntPage/SalesOrderEditPage/Popup/PopupItemPackage";
import Input2 from "components/Common/InputValue/Input2";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {
    deleteSalesOrderHeadhuntItem,
    getListFullHeadhuntSalesOrderItem,
    updateSalesOrderHeadhunt,
    updateSalesOrderHeadhuntItem
} from "api/headhunt";

const idKey = Constant.IDKEY_ITEM_PACKAGE;

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: true,
            total_item: {},
            itemActive: {},
            show_edit_discount: 0,
            show_edit_total_discount: false,
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.refreshList();
        }, idKey));

        this.btnBuy = this._btnBuy.bind(this);
        this.btnGift = this._btnGift.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnDuplicate = this._btnDuplicate.bind(this);
        this.showHide = this._showHide.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.setTotal = this._setTotal.bind(this);
        this.onChangeDiscount = this._onChangeDiscount.bind(this);
        this.onChangeTotalDiscount = this._onChangeTotalDiscount.bind(this);
        this.onShowEditTotalDiscount = this._onShowEditTotalDiscount.bind(this);
    }

    _btnBuy() {
        this.props.uiAction.createPopup(PopupItemPackage, "Thêm sản phẩm", {
            sales_order: this.props.sales_order,
            idKey,
            idKeySalesOrder: this.props.idKeySalesOrder
        });
    }

    _onShowEditDiscount(id) {
        this.setState({show_edit_discount: id});
    }

    _onShowEditTotalDiscount() {
        this.setState({show_edit_total_discount: true});
    }


    async _onChangeDiscount(item) {
        const {idKeySalesOrder} = this.props
        const res = await updateSalesOrderHeadhuntItem({...item});
        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKey);
            publish(".refresh", {}, idKeySalesOrder);
            this.setState({show_edit_discount: 0});
        }
    }

    async _onChangeTotalDiscount(sales_order) {
        const {idKeySalesOrder} = this.props
        const res = await updateSalesOrderHeadhunt({...sales_order});
        if (res) {
            this.props.uiAction.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKeySalesOrder);
            this.setState({show_edit_total_discount: false});
        }
    }

    _btnEdit(id) {
        this.props.uiAction.createPopup(PopupItemPackage, "Chỉnh sửa sản phẩm", {
            id,
            sales_order: this.props.sales_order,
            idKey,
            idKeySalesOrder: this.props.idKeySalesOrder,
        });
    }

    async _btnDelete(id) {
        const {uiAction, idKeySalesOrder} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa sản phẩm?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteSalesOrderHeadhuntItem({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKey);
                    publish(".refresh", {}, idKeySalesOrder);
                }
                uiAction.hideLoading();
            }
        });
    }

    _btnGift() {
        this.props.uiAction.createPopup(PopupEmployerPackage, "Mua Điểm Dịch Vụ (Tặng)", {
            sales_order: this.props.sales_order,
            type_campaign: Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift
        });
    }

    _btnDuplicate(object) {
        this.props.uiAction.createPopup(PopupEmployerPackage, "Mua Điểm Dịch Vụ", {
            sales_order: this.props.sales_order,
            type_campaign: object.type_campaign,
            object: object,
            is_duplicate: true,
        });
    }

    async _refreshList() {
        this.setState({loading: true});
        let args = {
            sales_order_id: this.props.sales_order.id
        };
        const resListDetail = await getListFullHeadhuntSalesOrderItem(args)
        if (resListDetail) {
            this.setState({data_list: resListDetail, loading: false})
        }
    }

    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }

    _activeItem(key) {
        let itemActive = Object.assign({}, this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }

    _setTotal(total, key) {
        let total_item = Object.assign({}, this.state.total_item);
        total_item[key] = total;
        this.setState({total_item: total_item});
    }


    componentWillMount() {
        this.refreshList();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state)) || !(JSON.stringify(nextProps) === JSON.stringify(this.props));
    }

    render() {
        let {data_list, show_detail, show_edit_total_discount, show_edit_discount} = this.state;
        let {sales_order} = this.props;
        const canEditItem = ![
            Constant.SALES_ORDER_V2_STATUS_SUBMITTED,
            Constant.SALES_ORDER_V2_STATUS_CONFIRMED,
            Constant.SALES_ORDER_V2_STATUS_APPROVED,
            Constant.SALES_ORDER_V2_STATUS_REJECTED,
            Constant.SALES_ORDER_V2_STATUS_DELETED,

        ].includes(sales_order.status);
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Chi tiết đơn hàng</span>
                        <div className={classnames("right", show_detail ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    <Collapse in={show_detail}>
                        <div>
                            {this.state.loading ? (
                                <div className="text-center">
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="left">
                                        {canEditItem && (
                                            <CanRender actionCode={ROLES.headhunt_sales_order_create}>
                                                <button type="button"
                                                        className="el-button el-button-primary el-button-small"
                                                        onClick={this.btnBuy}>
                                                    <span>Thêm sản phẩm <i className="glyphicon glyphicon-plus"/></span>
                                                </button>
                                            </CanRender>
                                        )}
                                    </div>
                                    <div className="right">
                                        <button type="button" className="bt-refresh el-button" onClick={() => {
                                            this.refreshList()
                                        }}>
                                            <i className="fa fa-refresh"/>
                                        </button>
                                    </div>
                                    <div className="crm-section">
                                        <div className="body-table el-table">
                                            <TableComponent className="table-custom">
                                                <TableHeader tableType="TableHeader" width={50} />
                                                <TableHeader tableType="TableHeader" width={50} >ID</TableHeader>
                                                <TableHeader tableType="TableHeader" width={400}>
                                                    Thông tin sản phẩm
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={50}>
                                                    Số lượng
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Đơn giá (Đã bao gồm VAT)
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                        Thành tiền trước giảm
                                                    </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Khuyến mãi
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Thành tiền sau giảm
                                                </TableHeader>
                                                <TableBody tableType="TableBody">
                                                    {data_list?.map((item, key) => {
                                                        return (
                                                            <React.Fragment key={key}>
                                                                <tr>
                                                                    <td>
                                                                        <div
                                                                            className="cell-custom mt20 mb10 text-center">
                                                                            {canEditItem && (
                                                                                <>
                                                                                    <CanRender
                                                                                        actionCode={ROLES.sales_order_sales_order_update_item}>
                                                                                        <i className="fa fa-pencil-square-o mr15 cursor-pointer"
                                                                                           aria-hidden="true"
                                                                                           onClick={() => this.btnEdit(item.id)}/>
                                                                                    </CanRender>
                                                                                    <CanRender
                                                                                        actionCode={ROLES.sales_order_sales_order_delete_item}>
                                                                                        <i className="fa fa-trash-o cursor-pointer"
                                                                                           aria-hidden="true"
                                                                                           onClick={() => this.btnDelete(item.id)}/>
                                                                                    </CanRender>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom mt20  text-center">
                                                                            {item.id}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom mt20 mb15">
                                                                            <div>
                                                                                <span className="font-bold">Tên gói: </span>
                                                                                {`${item.sku_info?.name}`}
                                                                            </div>
                                                                            <div>
                                                                                <span className="font-bold">SKU: </span>
                                                                                {`${item.sku_code}`}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom mt20  text-center">
                                                                            {item.quantity}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom mt20  text-center">
                                                                            <span>{`${utils.formatNumber(item.sku_price, 0, ".", "đ")}`}</span>
                                                                            <SpanCommon
                                                                                idKey={Constant.COMMON_DATA_KEY_sku_quantity}
                                                                                value={item?.sku_unit} notStyle/>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom mt20  text-center">
                                                                            {utils.formatNumber(item.amount_total, 0, ".", "đ")}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {show_edit_discount === item.id ? (
                                                                            <div
                                                                                className="cell-custom mt10  text-center">
                                                                                <Input2 type="text" name="quantity"
                                                                                        label="Khuyến mãi" isNumber
                                                                                        value={item.amount_discount}
                                                                                        onEnter={e => this.onChangeDiscount({
                                                                                            ...item,
                                                                                            amount_discount: Number(e.replaceAll(',', ''))
                                                                                        })}
                                                                                />
                                                                            </div>

                                                                        ) : (
                                                                            <div onClick={() => {
                                                                                if (canEditItem) {
                                                                                    this._onShowEditDiscount(item.id)
                                                                                }
                                                                            }}
                                                                                 className="cell-custom mt20  text-center cursor-pointer">
                                                                                    <span>
                                                                                        {utils.formatNumber(item.amount_discount, 0, ".", "đ")}
                                                                                        {canEditItem && (
                                                                                            <i className="fa fa-pencil-square-o cursor-pointer ml10"
                                                                                               aria-hidden="true"/>
                                                                                        )}
                                                                                    </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom mt20 text-center">
                                                                            {item.amount_total_due > 0 ? utils.formatNumber(item.amount_total_due, 0, ".", "đ") : "0đ"}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </TableBody>
                                            </TableComponent>
                                        </div>
                                    </div>
                                    <div className="total row">
                                        <div className="col-xs-10"/>
                                        <div className="col-xs-2">
                                            <div className="row">
                                                <div className="col-xs-6 font-bold mb20">Tổng</div>
                                                <div
                                                    className="col-xs-6 text-right font-bold"> {utils.formatNumber(sales_order.amount_total, 0, ".", "đ")}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-6 font-bold  mb20">Khuyến mãi</div>
                                                <div className="col-xs-6 text-right font-bold">
                                                    {show_edit_total_discount ? (
                                                        <div>
                                                            <Input2 type="text" name="quantity"
                                                                    label="Khuyến mãi" isNumber
                                                                    value={sales_order.amount_discount}
                                                                    onEnter={e => this.onChangeTotalDiscount({
                                                                        ...sales_order,
                                                                        amount_discount: Number(e.replaceAll(',', ''))
                                                                    })}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div onClick={() => {
                                                            if (canEditItem) {
                                                                this.onShowEditTotalDiscount()
                                                            }
                                                        }}
                                                             className="cursor-pointer">
                                                                <span>
                                                                    {utils.formatNumber(sales_order.amount_discount, 0, ".", "đ")}
                                                                    {canEditItem && (
                                                                        <i className="fa fa-pencil-square-o cursor-pointer ml10"
                                                                           aria-hidden="true"/>

                                                                    )}
                                                                </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-6 font-bold text-red mb20">Thành tiền</div>
                                                <div
                                                    className="col-xs-6 text-right font-bold text-red"> {utils.formatNumber(sales_order.amount_subtotal, 0, ".", "đ")}</div>
                                            </div>
                                            {sales_order.type_campaign === Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.convert && (
                                                <>
                                                    <div className="row">
                                                        <div className="col-xs-6 font-bold  mb20">Giá trị quy đổi áp
                                                            dụng
                                                        </div>
                                                        <div
                                                            className="col-xs-6 text-right font-bold">{utils.formatNumber(sales_order.amount_total_credit, 0, ".", "đ")}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-xs-6 font-bold text-red mb20">Khách hàng
                                                            phải trả
                                                        </div>
                                                        <div
                                                            className="col-xs-6 text-right font-bold text-red"> { sales_order.amount_total_due > 0 ? utils.formatNumber(sales_order.amount_total_due, 0, ".", "đ") : "0đ"}</div>

                                                    </div>
                                                </>

                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Collapse>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
