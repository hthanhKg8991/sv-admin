import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import PopupJobPackage from 'pages/CustomerCare/SalesOrderEditPage/Package/Popup/PopupJobPackage';
import PopupEditJobPackage from 'pages/CustomerCare/SalesOrderEditPage/Package/Popup/PopupEditJobPackage';
import {bindActionCreators} from "redux";
import moment from "moment";
import classnames from 'classnames';
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
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
import JobSubItem from "pages/CustomerCare/SalesOrderEditPage/SubItem/JobSubItem";
import TableComponent from "components/Common/Ui/Table";

const idKey = Constant.IDKEY_JOB_PACKAGE;

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: false,
            total_item : {},
            itemActive: {},
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.refreshList();
        },idKey));
        this.refreshList = this._refreshList.bind(this);
        this.btnBuy = this._btnBuy.bind(this);
        this.btnGift = this._btnGift.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnDuplicate = this._btnDuplicate.bind(this);
        this.showHide = this._showHide.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.setTotal = this._setTotal.bind(this);
    }

    _refreshList(delay = 0){
        let args = {
            service_type: Constant.SERVICE_TYPE_JOB_BOX,
            sales_order_id: this.props.sales_order.id
        };
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
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST, args, delay, true, prefix);
    }

    _btnBuy(){
        this.props.uiAction.createPopup(PopupJobPackage, "Mua Tin Tính Phí", {
            sales_order: this.props.sales_order,
            type_campaign: Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.default,
            items_group_id: this.props?.items?.id || null,
        });
    }

    _btnGift() {
        this.props.uiAction.createPopup(PopupJobPackage, "Mua Tin Tính Phí (Tặng)", {
            sales_order: this.props.sales_order,
            type_campaign: Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift,
            items_group_id: this.props?.items?.id || null,
        });
    }

    _btnEdit(object){
        this.props.uiAction.createPopup(PopupEditJobPackage, "Chỉnh Sửa Mua Tin Tính Phí", {
            sales_order: this.props.sales_order,
            object: object,
            type_campaign: object?.type_campaign
        });
    }

    _btnDuplicate(object) {
        this.props.uiAction.createPopup(PopupJobPackage, "Mua Tin Tính Phí", {
            sales_order: this.props.sales_order,
            type_campaign: object.type_campaign,
            items_group_id: this.props?.items?.id || null,
            object: object,
            is_duplicate: true,
        });
    }

    _btnDelete(object){
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
            title: "Bạn có chắc muốn xóa gói phí ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS, {
                    id: object.id,
                    sales_order_id: object.sales_order_id,
                    service_type: Constant.SERVICE_TYPE_JOB_BOX,
                },0,true, prefix);
            }
        });
    }
    _showHide(){
        this.setState({show_detail: !this.state.show_detail});
    }
    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }
    _setTotal(total, key){
        let total_item = Object.assign({},this.state.total_item);
        total_item[key] = total;
        this.setState({total_item: total_item});
    }
    componentWillMount(){
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
        if (newProps.api[keyApi]){
            let response = newProps.api[keyApi];
            if (response.info?.args?.service_type === Constant.SERVICE_TYPE_JOB_BOX) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                    if (response.data.length){
                        this.setState({show_detail: !!response.data.length});
                        let itemActive = Object.assign({},this.state.itemActive);
                        response.data.forEach((item)=>{
                            itemActive[item.id] = itemActive[item.id] || itemActive[item.id] === false ? itemActive[item.id] : true;
                        });
                        this.setState({itemActive: itemActive});
                    }
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(keyApi);
            }
        }
        if (newProps.api[keyApiDelete]){
            let response = newProps.api[keyApiDelete];
            if (response.info?.args?.service_type === Constant.SERVICE_TYPE_JOB_BOX) {
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
        const keyRefresh = this.props?.items?.id ? `JobProductGroupPackage${this.props?.items?.id}`:"JobPackage";
        if (newProps.refresh[keyRefresh]){
            let delay = newProps.refresh[keyRefresh].delay ? newProps.refresh[keyRefresh].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList(keyRefresh);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state)) || !(JSON.stringify(nextProps) === JSON.stringify(this.props));
    }

    renderButtons = (item) => {
        let {sales_order, is_action = true, channelCode, is_sub = false, subscription, combo} = this.props;
        const channel = this.props.branch.currentBranch.channel_code;
        // task VHCRMV2-1300
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
                            <span className="text-bold text-primary" onClick={()=>{this.btnDuplicate(item)}}>Sao chép</span>
                        </div>
                        <div className="text-underline pointer">
                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
                        </div>
                    </>
                    )
                }
                if (((is_sub && [Constant.SUBSCRIPTION_TYPE_PRO_VALUE, Constant.SUBSCRIPTION_TYPE_PLUS_VALUE].includes(subscription?.type_campaign)) ||  [Constant.COMBO_SERVICE_POINT_TYPE].includes(combo?.type)) && channel !== Constant.CHANNEL_CODE_TVN){
                    return(
                        <>
                            <CanRender actionCode={ROLES.customer_care_sales_order_jobbox_update}>
                                <div className="text-underline pointer mt10 mb10">
                                    <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                                </div>
                            </CanRender>
                        </>
                    )
                }
            }
        } else if (![Constant.SALE_ORDER_DELETED, Constant.SALE_ORDER_ACTIVED, Constant.SALE_ORDER_INACTIVE, Constant.SALE_ORDER_CANCEL].includes(parseInt(sales_order.status))) {
            if (is_action) {
                return (
                <>
                    <div className="text-underline pointer mt10 mb10">
                        <span className="text-bold text-primary" onClick={()=>{this.btnDuplicate(item)}}>Sao chép</span>
                    </div>
                    <div className="text-underline pointer">
                        <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
                    </div>
                </>
                )
            }
            if (((is_sub && [Constant.SUBSCRIPTION_TYPE_PRO_VALUE, Constant.SUBSCRIPTION_TYPE_PLUS_VALUE].includes(subscription?.type_campaign)) ||  [Constant.COMBO_SERVICE_POINT_TYPE].includes(combo?.type)) && channel !== Constant.CHANNEL_CODE_TVN){
                return(
                    <>
                        <CanRender actionCode={ROLES.customer_care_sales_order_jobbox_update}>
                            <div className="text-underline pointer mt10 mb10">
                                <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                            </div>
                        </CanRender>
                    </>
                )
            }
        }
    }

    render () {
        let {data_list, show_detail, itemActive} = this.state;
        let {sales_order, is_action = true, isOutdated = false, isChangeArea = false} = this.props;
        let area = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_area);
        let display_method = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_display_method);
        const total = data_list?.length;
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Tin tính phí và hiệu ứng ({total})</span>
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
                                    <LoadingSmall />
                                </div>
                            ): (
                                <div className="card-body">
                                    {![
                                        Constant.SALE_ORDER_DELETED,
                                        Constant.SALE_ORDER_ACTIVED,
                                        Constant.SALE_ORDER_INACTIVE,
                                        Constant.SALE_ORDER_EXPIRED,
                                        Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                        Constant.SALE_ORDER_CANCEL,
                                    ].includes(parseInt(sales_order.status)) &&(
                                        is_action && (
                                            <div className="left">
                                                <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                    {[Constant.CAMPAIGN_TYPE_DEFAULT, Constant.CAMPAIGN_TYPE_EXCHANGE].includes(sales_order?.type_campaign) &&
                                                    <button type="button"
                                                            className="el-button el-button-primary el-button-small"
                                                            onClick={this.btnBuy}>
                                                    <span>Mua tin tính phí <i
                                                        className="glyphicon glyphicon-plus"/></span>
                                                    </button>
                                                    }
                                                    <button type="button"
                                                            className="el-button el-button-primary el-button-small"
                                                            onClick={this.btnGift}>
                                                    <span>Mua tin tính phí (Tặng) <i
                                                        className="glyphicon glyphicon-plus"/></span>
                                                    </button>
                                                </CanRender>
                                            </div>
                                        )
                                    )}
                                    <div className="right">
                                        <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                            <i className="fa fa-refresh"/>
                                        </button>
                                    </div>
                                    <div className="crm-section">
                                        <div className="body-table el-table">
                                            <TableComponent className="table-custom">
                                                <TableHeader tableType="TableHeader" width={300}>
                                                    Thông tin mua tin tính phí
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
                                                    {data_list.map((item, key)=> {
                                                        const effect_item = item?.items[0] || null;
                                                        return (
                                                            <React.Fragment key={key}>
                                                                <tr className={classnames("el-table-row pointer")}>
                                                                    <td onClick={()=>{this.activeItem(item.id)}}>
                                                                        <div className="cell-custom">
                                                                            <div className="mb-6">
                                                                                <div>Mã mua dịch vụ: <span className="text-bold">{item.id}</span></div>
                                                                                <div>Mã SKU: <span
                                                                                    className="text-bold">{item?.sku_code_service}</span>
                                                                                </div>
                                                                                <div>Tên gói dịch vụ: <span className="text-bold">{item.cache_service_name}</span></div>
                                                                                <div>Loại gói: <span className="text-bold text-red">
                                                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_items_type_campaign} value={Number(item?.type_campaign)} notStyle />
                                                                                </span>
                                                                                </div>
                                                                                <div>Số tin: <span className="text-bold">{utils.formatNumber(item.service_items_info.quantity,0,".","tin")}</span></div>
                                                                                <div>Khu vực hiển thị: <span className="text-bold">{area[item.service_items_info.displayed_area]}</span></div>
                                                                                <div>Hình thức hiển thị: <span className="text-bold">{display_method[item.service_items_info.displayed_method]}</span></div>
                                                                                <div>Thời gian mua: <span className="text-bold">
                                                                                {item.week_quantity} tuần &nbsp;
                                                                                    {/*{item.day_quantity} ngày*/}
                                                                                    {item.start_date &&
                                                                                    <>({moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item.end_date).format("DD/MM/YYYY")})</>
                                                                                    }
                                                                                </span>
                                                                                </div>
                                                                                {item.service_items_info?.split_details && (
                                                                                    <div><span className="text-red mr5">Ghi chú:</span>
                                                                                        {item.service_items_info?.split_details.map((split, indexSplit) => (
                                                                                            <span className="text-red font-bold" key={indexSplit.toString()}>
                                                                                            <i>{split.quantity} tin {split.week_quantity} tuần
                                                                                                {(indexSplit + 1) < item.service_items_info?.split_details.length && (
                                                                                                    <>, </>
                                                                                                )}
                                                                                            </i>
                                                                                        </span>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                {item?.items?.length > 0 && item.items.map((effect,key_effect) => {
                                                                                    return (
                                                                                        <div key={key_effect} >
                                                                                            <div>Mã dịch vu: <span className="text-bold">{effect.id}</span></div>
                                                                                            <div>Hiệu ứng: <span className="text-bold">{effect.cache_service_name}</span></div>
                                                                                            <div>Mã SKU: <span className="text-bold">{effect?.sku_code}</span></div>
                                                                                            <div>Thời gian mua: <span className="text-bold">
                                                                                            {effect.week_quantity} tuần
                                                                                                {effect?.day_quantity > 0 &&
                                                                                                `${effect?.day_quantity} ngày`
                                                                                                }
                                                                                                ({moment.unix(effect.start_date).format("DD/MM/YYYY")} - {moment.unix(effect.end_date).format("DD/MM/YYYY")})</span></div>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td onClick={()=>{this.activeItem(item.id)}}>
                                                                        <div className="cell-custom">

                                                                        </div>
                                                                    </td>
                                                                    <td onClick={()=>{this.activeItem(item.id)}}>
                                                                        <div className="cell-custom">
                                                                            {item.price_list_info && Object.keys(item.price_list_info).map((price,key_price) => {
                                                                                let displayed_area = item.service_items_info && item.service_items_info.displayed_area ? parseInt(item.service_items_info.displayed_area) : Constant.AREA_ALL;
                                                                                if (parseInt(price) === displayed_area || displayed_area === Constant.AREA_ALL) {
                                                                                    return (
                                                                                        <div key={key_price} className="mb10-child">
                                                                                            <div className="text-underline">- <span className="text-bold">{area[price]}</span></div>
                                                                                            <div>Bảng giá: <span className="text-bold">{item.price_list_info[price].title}</span></div>
                                                                                            <div>
                                                                                                Giá niêm yết: <span className="text-bold">{utils.formatNumber(item.price_list_info[price].based_price, 0, ".", "đ")} ({utils.formatNumber(item.price_list_info[price].unit_per_based, 0, ".", item.price_list_info[price].unit_type === "point" ? "điểm" : "ngày")})</span>
                                                                                            </div>
                                                                                            <div>Chiết khấu: <span className="text-bold">{item.price_list_info[price].discount_rate} %</span></div>
                                                                                            <div>Khuyến mãi: <span className="text-bold">{item.price_list_info[price].promotion_rate} %</span></div>
                                                                                        </div>
                                                                                    )
                                                                                }else{
                                                                                    return null;
                                                                                }
                                                                            })}
                                                                        </div>
                                                                    </td>
                                                                    <td onClick={()=>{this.activeItem(item.id)}}>
                                                                        <div className="cell-custom">
                                                                            <div className="mb-8">
                                                                               <div>Thành tiền tin tính phí và hiệu ứng: <span className="text-bold">{utils.formatNumber(item.original_amount,0,".","đ")}</span></div>
                                                                               {parseInt(item.discount_amount) > 0 && (
                                                                                   <div>Giảm giá chiết khấu: <span className="text-bold">{utils.formatNumber((parseInt(item.discount_amount)),0,".","đ")}</span></div>
                                                                               )}
                                                                               {parseInt(item.promotion_amount) > 0 && (
                                                                                   <div>Khuyến mãi: <span className="text-bold">{utils.formatNumber((parseInt(item.promotion_amount)),0,".","đ")}</span></div>
                                                                               )}
                                                                               {item?.original_amount > 0 && (
                                                                                   <div>Thành tiền sau giảm: <span className="text-bold">{utils.formatNumber(item.original_amount - item.discount_amount - item.promotion_amount,0,".","đ")}</span></div>
                                                                               )}
                                                                               <div><span className="textRed">Tổng tiền: </span> <span className="text-bold">{utils.formatNumber(parseInt(item.total_amount),0,".","đ")}</span></div>
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
                                                                {itemActive[item.id]&& (
                                                                    <tr>
                                                                        <td colSpan={5}>
                                                                            <JobSubItem
                                                                                isChangeArea={isChangeArea}
                                                                                sales_order_item={item}
                                                                                sales_order={sales_order}
                                                                                setTotal={this.setTotal}
                                                                                idKey={idKey}
                                                                                isOutdated={isOutdated}
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
