import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import moment from "moment";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupJobFree from 'pages/CustomerCare/SalesOrderEditPage/Package/Popup/PopupJobFree';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {publish, subscribe} from "utils/event";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import FreemiumSubItem from "pages/CustomerCare/SalesOrderEditPage/SubItem/FreemiumSubItem";

const idKey = Constant.IDKEY_FREEMIUM_PACKAGE;

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: false,
            total_item: 0,
            itemActive: {}
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (id) => {
            this.refreshList();
        }, idKey));

        this.btnBuy = this._btnBuy.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnDuplicate = this._btnDuplicate.bind(this);
        this.showHide = this._showHide.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.setTotal = this._setTotal.bind(this);
    }

    _btnBuy(name) {
        this.props.uiAction.createPopup(PopupJobFree, "Mua "+name, {
            sales_order: this.props.sales_order,
            type_campaign: Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift,
            items_group_id: this.props?.items?.id || null,
        });
    }

    _btnDuplicate(object,name) {
        this.props.uiAction.createPopup(PopupJobFree, "Mua "+name, {
            sales_order: this.props.sales_order,
            type_campaign: object?.type_campaign,
            items_group_id: this.props?.items?.id || null,
            object: object,
            is_duplicate: true,
        });
    }

    _refreshList(delay = 0) {
        let args = {
            service_type: Constant.SERVICE_TYPE_JOB_FREEMIUM,
            sales_order_id: this.props.sales_order.id
        };
        this.setState({loading: true});
        if(this.props?.items?.id){
            args.items_group_id = this.props?.items?.id;
        }
        if(this.props?.bundle?.id){
            args.bundles_group_id= this.props?.bundle?.id;
        }
        if(this.props?.combo?.id){
            args.combo_group_id= this.props?.combo?.id;
        }
        if(this.props?.subscription?.id){
            args.combo_group_id= this.props?.subscription?.id;
        }
        let prefix = "";
        if(this.props?.items?.id){
            prefix = `group_${this.props?.items?.id}`
        }
        if(this.props?.bundle?.id){
            prefix = `bundle_${this.props?.bundle?.id}`
        }
        if(this.props?.combo?.id){
            prefix = `combo_${this.props?.combo?.id}`
        }
        if (this.props?.subscription?.id) {
            prefix = `subscription_${this.props?.subscription?.id}`
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST, args, delay, true, prefix);
    }

    _btnEdit(object,name) {
        this.props.uiAction.createPopup(PopupJobFree, "Chỉnh Sửa Mua "+name, {
            sales_order: this.props.sales_order,
            object: object,
            type_campaign: object?.type_campaign
        });
    }

    _btnDelete(object,name) {
        let prefix = "";
        if(this.props?.items?.id){
            prefix = `group_${this.props?.items?.id}`
        }
        if(this.props?.bundle?.id){
            prefix = `bundle_${this.props?.bundle?.id}`
        }
        if(this.props?.combo?.id){
            prefix = `combo_${this.props?.combo?.id}`
        }
        if (this.props?.subscription?.id) {
            prefix = `subscription_${this.props?.subscription?.id}`
        }
        this.props.uiAction.SmartMessageBox({
            title: `Bạn có chắc muốn xóa gói ${name} ?`,
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS, {
                    id: object.id,
                    sales_order_id: object.sales_order_id,
                    service_type: Constant.SERVICE_TYPE_JOB_FREEMIUM,
                },0,true, prefix);
            }
        });
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

    componentWillReceiveProps(newProps) {
        let prefix = "";
        if(this.props?.items?.id){
            prefix = `group_${this.props?.items?.id}`
        }
        if(this.props?.bundle?.id){
            prefix = `bundle_${this.props?.bundle?.id}`
        }
        if(this.props?.combo?.id){
            prefix = `combo_${this.props?.combo?.id}`
        }
        if (this.props?.subscription?.id) {
            prefix = `subscription_${this.props?.subscription?.id}`
        }
        const keyApi = `${ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST}${prefix}`;
        const keyApiDelete = `${ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS}${prefix}`;
        if (newProps.api[keyApi]) {
            let response = newProps.api[keyApi];
            if (response.info?.args?.service_type === Constant.SERVICE_TYPE_JOB_FREEMIUM) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                    if (response.data.length) {
                        this.setState({show_detail: !!response.data.length});
                        let itemActive = Object.assign({}, this.state.itemActive);
                        response.data.forEach((item) => {
                            itemActive[item.id] = itemActive[item.id] || itemActive[item.id] === false ? itemActive[item.id] : true;
                        });
                        this.setState({itemActive: itemActive});
                    }
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(keyApi);
            }
        }
        if (newProps.api[keyApiDelete]) {
            let response = newProps.api[keyApiDelete];
            if (response.info?.args?.service_type === Constant.SERVICE_TYPE_JOB_FREEMIUM) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.props.uiAction.hideSmartMessageBox();
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    this.refreshList();
                    publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
                    publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                }
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(keyApiDelete);
            }
        }
        const keyRefresh = this.props?.items?.id ? `JobFreeProductGroupPackage${this.props?.items?.id}`:"JobFreePackage";
        if (newProps.refresh[keyRefresh]) {
            let delay = newProps.refresh[keyRefresh].delay ? newProps.refresh[keyRefresh].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList(keyRefresh);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state)) || !(JSON.stringify(nextProps) === JSON.stringify(this.props));
    }

    renderButtons = (item,name) => {
        let {sales_order, is_action = true, channelCode} = this.props;

        if ([Constant.CHANNEL_CODE_TVN, Constant.CHANNEL_CODE_VL24H, Constant.CHANNEL_CODE_MW].includes(channelCode)) {
            if (![
                Constant.SALE_ORDER_DELETED,
                Constant.SALE_ORDER_ACTIVED,
                Constant.SALE_ORDER_INACTIVE,
                Constant.SALE_ORDER_CANCEL,
                Constant.SALE_ORDER_EXPIRED,
                Constant.SALE_ORDER_EXPIRED_ACTIVE].includes(
                parseInt(sales_order.status))
            ) {
                if (is_action) {
                    return (
                        <>
                            <div className="text-underline pointer mt10 mb10">
                                <span className="text-bold text-primary" onClick={()=>{this.btnDuplicate(item,name)}}>Sao chép</span>
                            </div>
                            <div className="text-underline pointer">
                                <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item,name)}}>Xóa</span>
                            </div>
                        </>
                    )
                }
            }
        } else if (![Constant.SALE_ORDER_DELETED, Constant.SALE_ORDER_ACTIVED, Constant.SALE_ORDER_INACTIVE, Constant.SALE_ORDER_CANCEL].includes(parseInt(sales_order.status))) {
            if (is_action) {
                return (
                    <>
                        <div className="text-underline pointer mt10 mb10">
                            <span className="text-bold text-primary" onClick={()=>{this.btnDuplicate(item,name)}}>Sao chép</span>
                        </div>
                        <div className="text-underline pointer">
                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item,name)}}>Xóa</span>
                        </div>
                    </>
                )
            }
        }
    }

    render() {
        let {data_list, show_detail, itemActive} = this.state;
        let {sales_order, is_action = true, isOutdated = false, channelCode, sys} = this.props;
        const listService = sys?.service?.items;
        const detailService = listService?.find(_=>_?.service_type === "jobbox_freemium");
        const total = data_list?.length;
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Đăng {detailService?.display_name_frontend || detailService?.display_name_contract} ({total})</span>
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
                                    {![
                                        Constant.SALE_ORDER_DELETED,
                                        Constant.SALE_ORDER_ACTIVED,
                                        Constant.SALE_ORDER_INACTIVE,
                                        Constant.SALE_ORDER_EXPIRED,
                                        Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                        Constant.SALE_ORDER_CANCEL,
                                    ].includes(parseInt(sales_order.status)) && (
                                        is_action && (
                                            <div className="left">
                                                <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                    {
                                                        (
                                                            ([Constant.CHANNEL_CODE_VL24H].includes(channelCode) && [Constant.CAMPAIGN_TYPE_DEFAULT, Constant.CAMPAIGN_TYPE_GIFT,Constant.CAMPAIGN_TYPE_EXCHANGE].includes(sales_order?.type_campaign)) ||
                                                            (![Constant.CHANNEL_CODE_VL24H].includes(channelCode) && [Constant.CAMPAIGN_TYPE_DEFAULT,Constant.CAMPAIGN_TYPE_EXCHANGE].includes(sales_order?.type_campaign))
                                                        ) &&
                                                        (
                                                            <button type="button"
                                                                    className="el-button el-button-primary el-button-small"
                                                                    onClick={() => this.btnBuy(detailService?.display_name_frontend || detailService?.display_name_contract)}>
                                                                    <span>Mua {detailService?.display_name_frontend || detailService?.display_name_contract} <i className="glyphicon glyphicon-plus"/>
                                                                    </span>
                                                            </button>
                                                        )
                                                    }

                                                </CanRender>
                                            </div>
                                        )
                                    )}
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
                                                <TableHeader tableType="TableHeader" width={300}>
                                                    Thông tin mua miễn phí
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={300}>
                                                    Thông tin mua hiệu ứng
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={300}>
                                                    Giá
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={220}>
                                                    Thành tiền
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Thao tác
                                                </TableHeader>
                                                <TableBody tableType="TableBody">
                                                    {data_list.map((item, key) => {
                                                        const effect_item = item?.items[0] || null;
                                                        return (
                                                            <React.Fragment key={key}>
                                                                <tr className={classnames("el-table-row pointer")}>
                                                                    <td onClick={() => {
                                                                        this.activeItem(item.id)
                                                                    }}>
                                                                        <div className="cell-custom">
                                                                            <div className="mb-6">
                                                                                <div>Mã mua dịch vụ: <span
                                                                                    className="text-bold">{item.id}</span>
                                                                                </div>
                                                                                <div>Mã SKU: <span
                                                                                    className="text-bold">{item?.sku_code_service}</span>
                                                                                </div>
                                                                                <div>Tên gói dịch vụ: <span
                                                                                    className="text-bold">{item.cache_service_name}</span>
                                                                                </div>
                                                                                <div>Loại gói: <span
                                                                                    className="text-bold text-red">
                                                                                        <SpanCommon
                                                                                            idKey={Constant.COMMON_DATA_KEY_items_type_campaign}
                                                                                            value={Number(item?.type_campaign)}
                                                                                            notStyle/>
                                                                                    </span>
                                                                                </div>
                                                                                <div>Số tin: <span
                                                                                    className="text-bold">{item.service_items_info.quantity < 0 ? "Không giới hạn" : utils.formatNumber(item.service_items_info.quantity, 0, ".", "tin")}</span>
                                                                                </div>
                                                                                <div>Thời gian mua: <span
                                                                                    className="text-bold">
                                                                                    {item.week_quantity} tuần &nbsp;
                                                                                    {item?.day_quantity > 0 &&
                                                                                        `${item?.day_quantity} ngày`
                                                                                    }
                                                                                    {item.start_date &&
                                                                                        <>({moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item.end_date).format("DD/MM/YYYY")})</>
                                                                                    }
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                {item.items.length > 0 && item.items.map((effect, key_effect) => {
                                                                                    return (
                                                                                        <div key={key_effect}>
                                                                                            <div>Mã dịch vu: <span className="text-bold">{effect.id}</span></div>
                                                                                            <div>Gói làm mới: <span
                                                                                                className="text-bold">{effect.cache_service_name}</span>
                                                                                            </div>
                                                                                            <div>Mã SKU: <span className="text-bold">{effect?.sku_code}</span></div>
                                                                                            <div>Thời gian mua: <span
                                                                                                className="text-bold">
                                                                                                {effect.week_quantity} tuần
                                                                                                {/*{effect.day_quantity} ngày */}
                                                                                                ({moment.unix(effect.start_date).format("DD/MM/YYYY")} - {moment.unix(effect.end_date).format("DD/MM/YYYY")})</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td onClick={() => {
                                                                        this.activeItem(item.id)
                                                                    }}>
                                                                        <div className="cell-custom">

                                                                        </div>
                                                                    </td>
                                                                    <td onClick={() => {
                                                                        this.activeItem(item.id)
                                                                    }}>
                                                                        <div className="cell-custom">
                                                                            {item.price_list_info && Object.keys(item.price_list_info).map((price, key_price) => {
                                                                                let displayed_area = item.service_items_info && item.service_items_info.displayed_area ? parseInt(item.service_items_info.displayed_area) : Constant.AREA_ALL;
                                                                                if (parseInt(price) === displayed_area || displayed_area === Constant.AREA_ALL) {
                                                                                    return (
                                                                                        <div key={key_price}
                                                                                             className="mb10-child">
                                                                                            {/*<div className="text-underline">- <span className="text-bold">{area[price]}</span></div>*/}
                                                                                            <div>Bảng giá: <span
                                                                                                className="text-bold">{item.price_list_info[price].title}</span>
                                                                                            </div>
                                                                                            <div>Giá niêm yết: <span
                                                                                                className="text-bold">{utils.formatNumber(item.price_list_info[price].based_price, 0, ".", "đ")} ({"1 tin / " + utils.formatNumber(item.price_list_info[price].unit_per_based, 0, ".", "ngày")})</span>
                                                                                            </div>
                                                                                            <div>Chiết khấu: <span
                                                                                                className="text-bold">{item.price_list_info[price].discount_rate} %</span>
                                                                                            </div>
                                                                                            <div>Khuyến mãi: <span
                                                                                                className="text-bold">{item.price_list_info[price].promotion_rate} %</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                } else {
                                                                                    return null;
                                                                                }
                                                                            })}
                                                                        </div>
                                                                    </td>
                                                                    <td onClick={() => {
                                                                        this.activeItem(item.id)
                                                                    }}>
                                                                        <div className="cell-custom">
                                                                            <div className="mb-8">
                                                                                <div>Thành tiền {detailService?.display_name_frontend || detailService?.display_name_contract}: <span
                                                                                    className="text-bold">{utils.formatNumber(item.original_amount, 0, ".", "đ")}</span>
                                                                                </div>
                                                                                {parseInt(item.discount_amount) > 0 && (
                                                                                    <div>Giảm giá chiết khấu: <span
                                                                                        className="text-bold">{utils.formatNumber((parseInt(item.discount_amount)), 0, ".", "đ")}</span>
                                                                                    </div>
                                                                                )}
                                                                                {parseInt(item.promotion_amount) > 0 && (
                                                                                    <div>Khuyến mãi: <span
                                                                                        className="text-bold">{utils.formatNumber((parseInt(item.promotion_amount)), 0, ".", "đ")}</span>
                                                                                    </div>
                                                                                )}
                                                                                {item.original_amount > 0 && (
                                                                                    <div>Thành tiền sau giảm: <span
                                                                                        className="text-bold">{utils.formatNumber(item.original_amount - item.discount_amount - item.promotion_amount, 0, ".", "đ")}</span>
                                                                                    </div>
                                                                                )}
                                                                                <div><span
                                                                                    className="textRed">Tổng tiền: </span>
                                                                                    <span
                                                                                        className="text-bold">{utils.formatNumber(parseInt(item.total_amount), 0, ".", "đ")}</span>
                                                                                </div>
                                                                            </div>
                                                                            {effect_item && (
                                                                                <div>
                                                                                    <div>Thành tiền hiệu ứng: <span className="text-bold">{utils.formatNumber(effect_item.original_amount,0,".","đ")}</span></div>
                                                                                    {parseInt(effect_item.discount_amount) > 0 && (
                                                                                        <div>Giảm giá chiết khấu: <span className="text-bold">{utils.formatNumber(effect_item.discount_amount,0,".","đ")}</span></div>
                                                                                    )}
                                                                                    {parseInt(effect_item.promotion_amount) > 0 && (
                                                                                        <div>Khuyến mãi: <span className="text-bold">{utils.formatNumber(effect_item.promotion_amount,0,".","đ")}</span></div>
                                                                                    )}
                                                                                    {item?.original_amount > 0 && (
                                                                                        <div>Thành tiền sau giảm: <span className="text-bold">{utils.formatNumber(effect_item.original_amount - effect_item.discount_amount - effect_item.promotion_amount,0,".","đ")}</span></div>
                                                                                    )}
                                                                                    <div><span className="textRed">Tổng tiền: </span> <span className="text-bold">{utils.formatNumber(parseInt(effect_item.total_amount) + parseInt(effect_item.effect_amount),0,".","đ")}</span></div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom">
                                                                            {this.renderButtons(item)}
                                                                            {/*<div className="text-underline pointer">*/}
                                                                            {/*    <span className="text-bold text-primary" onClick={()=>{this.activeItem(item.id)}}>Đăng ký dịch vụ</span>*/}
                                                                            {/*</div>*/}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {itemActive[item.id] && (
                                                                    <tr>
                                                                        <td colSpan={5}>
                                                                            <FreemiumSubItem
                                                                                isOutdated={isOutdated}
                                                                                sales_order_item={item}
                                                                                sales_order={sales_order}
                                                                                setTotal={this.setTotal}
                                                                                idKey={idKey}
                                                                                isFreemium
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </TableBody>
                                            </TableComponent>
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
