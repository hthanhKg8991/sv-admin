import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from 'redux';
import Gird from "components/Common/Ui/Table/Gird";
import SpanText from "components/Common/Ui/SpanText";
import {
    deleteSalesOrderItemList,
    getSalesOrderItemList
} from "api/saleOrder";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import * as Constant from "utils/Constant";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import PopupBuyRecruiterAssistant from './Popup/PopupBuyRecruiterAssistant'
import moment from 'moment'
import AccountServiceSubItem from './Popup/AccountServiceSubItem'
import {publish} from "utils/event";

const idKey = "RecruiterAssistantPackage";

class RecruiterAssistantPackage extends Component {

    constructor(props){
        super(props);
        this.state = {
            isShow: false,
            isLoading: true,
            columns: [
                {
                    title: "Thông tin mua gói Quản lý tài khoản NTD",
                    width: 200,
                    cell: item => (<div className="cell-custom mt20 mb20">
                        <div>Mã mua dịch vụ: <span className="text-bold">{item.id}</span></div>
                        <div>Tên gói dịch vụ: <span className="text-bold">{item.cache_service_name}</span></div>
                        <div>Mã SKU: <span className="text-bold">{item.sku_code_service}</span></div>
                        <div><span>Loại gói:</span> <SpanText cls="text-bold text-red" idKey={Constant.COMMON_DATA_KEY_BUNDLES_TYPE_CAMPAIGN} value={item?.type_campaign}/></div>
                        <div>Số tin: <span className="text-bold">{item.quantity_buy}</span></div>
                        <div>Thời gian mua: <span className="text-bold">
                            {item.week_quantity} tuần &nbsp;
                            {/*{item.day_quantity} ngày */}
                            ({moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item.end_date).format("DD/MM/YYYY")})</span>
                        </div>
                    </div>)
                },
                {
                    title: "Giá",
                    width: 140,
                    cell: item => {
                        const area = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_area);
                        return (
                        <div className="cell-custom">
                            {item.price_list_info && Object.keys(item.price_list_info).map((price,key_price) => {
                                const displayed_area = item.service_items_info && item.service_items_info.displayed_area ? parseInt(item.service_items_info.displayed_area) : Constant.AREA_ALL;
                                if (parseInt(price) === displayed_area || displayed_area === Constant.AREA_ALL) {
                                    return (
                                        <div key={key_price} className="mb10-child">
                                            <div className="text-underline">- <span className="text-bold">{area[price]}</span></div>
                                            <div>Bảng giá: <span className="text-bold">{item.price_list_info[price].title}</span></div>
                                            <div>
                                                Giá niêm yết: <span className="text-bold">{utils.formatNumber(item.price_list_info[price].based_price, 0, ".", "đ")} ({utils.formatNumber(item.price_list_info[price].unit_per_based, 0, ".", "ngày")})</span>
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
                    )}
                },
                {
                    title: "Thành tiền",
                    width: 100,
                    cell: item => (
                        <div className="cell-custom">
                            <div>Thành tiền gói QLTK NTD: <span className="text-bold">{utils.formatNumber(item.original_amount,0,".","đ")}</span></div>
                            {parseInt(item.discount_amount) > 0 && (
                                <div>Giảm giá chiết khấu: <span className="text-bold">{utils.formatNumber(item.discount_amount,0,".","đ")}</span></div>
                            )}
                            {parseInt(item.promotion_amount) > 0 && (
                                <div>Khuyến mãi: <span className="text-bold">{utils.formatNumber(item.promotion_amount,0,".","đ")}</span></div>
                            )}
                            {item?.original_amount > 0 && (
                                <div>Thành tiền sau giảm: <span className="text-bold">{utils.formatNumber(item?.original_amount - item.discount_amount - item.promotion_amount,0,".","đ")}</span></div>
                            )}
                            <div><span className="textRed">Tổng tiền: </span> <span className="text-bold">{utils.formatNumber(parseInt(item.total_amount) + parseInt(item.effect_amount),0,".","đ")}</span></div>
                        </div>
                    )
                },
                {
                    title: "Thao tác",
                    width: 80,
                    cell: (row) =>
                        {
                            const {sales_order, is_action = true} = this.props;

                            if(is_action && ![
                                Constant.SALE_ORDER_DELETED,
                                Constant.SALE_ORDER_ACTIVED,
                                Constant.SALE_ORDER_INACTIVE,
                                Constant.SALE_ORDER_EXPIRED,
                                Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                Constant.SALE_ORDER_CANCEL,
                            ].includes(parseInt(sales_order.status)) ) {
                                return (
                                    <React.Fragment>
                                        <div className="text-underline pointer">
                                            <span className="text-bold text-primary" onClick={()=>{this.btnCopy(row)}}>Sao chép</span>
                                        </div>
                                        <div className=" pointer">
                                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(row)}}>Xoá</span>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        }
                },
            ]
        }

        this.toggleShow = this._toggleShow.bind(this);
        this.btnCopy = this._btnCopy.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.onBuyRecruiterAssistant = this._onBuyRecruiterAssistant.bind(this);
        this.onBuyRecruiterAssistantGift = this._onBuyRecruiterAssistantGift.bind(this);
    }

    _toggleShow() {
        const {isShow} = this.state;
        this.setState({isShow: !isShow});
    }

    _onBuyRecruiterAssistant(item) {
        this.props.uiAction.createPopup(PopupBuyRecruiterAssistant, "Mua gói Quản lý tài khoản NTD", {
            item: {...item,type_campaign:Constant.RECRUITER_ASSISTANT_BUY_TYPE},
            idKey: idKey,
            fallback: () => {
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                this._getAccountServiceItemList();
            }
        });
    }

    _onBuyRecruiterAssistantGift(item) {
        this.props.uiAction.createPopup(PopupBuyRecruiterAssistant, "Mua gói Quản lý tài khoản NTD (Tặng)", {
            item: {...item,type_campaign:Constant.RECRUITER_ASSISTANT_GIFT_TYPE},
            idKey: idKey,
            fallback: () => {
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                this._getAccountServiceItemList();
            }
        });
    }

    async _getAccountServiceItemList(){
        this.setState({isLoading:true});
        
        const res = await getSalesOrderItemList({
            service_type: Constant.SERVICE_TYPE_ACCOUNT_SERVICE,
            sales_order_id: this.props.sales_order.id,
            combo_group_id: this.props?.combo?.id || this.props?.subscription?.id
        });
        if (res && Array.isArray(res)) {
            this.setState({isLoading:false,account_service_list: res});
        }
    }

    _btnCopy(item){
        const copyData = {
            service_code: item?.service_code,
            quantity: item?.quantity_buy,
            start_date: item?.start_date,
            week_quantity: item?.week_quantity,
            sku_code_service: item?.sku_code_service,
            id: this.props.sales_order.id,
            type_campaign: item?.type_campaign
        }
        this.props.uiAction.createPopup(PopupBuyRecruiterAssistant, `Mua gói Quản lý tài khoản NTD ${item?.type_campaign === Constant.RECRUITER_ASSISTANT_GIFT_TYPE ? '(Tặng)' : "" }`, {
            item: copyData,
            idKey: idKey,
            fallback: () => {
                publish(".refresh", {}, 'SalesOrderEditPage');
                publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                this._getAccountServiceItemList();
            }
        });
    }

    _btnDelete(row){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa lệnh mua ?",
            content: "",
            buttons: ['No','Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                const res = await deleteSalesOrderItemList({
                    id: row?.id,
                    sales_order_id: this.props.sales_order.id,
                    service_type: Constant.SERVICE_TYPE_ACCOUNT_SERVICE,
                })
                
                if(res){
                    this.props.uiAction.hideSmartMessageBox();
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, 'SalesOrderEditPage');
                    publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                    this._getAccountServiceItemList();
                }else{
                    this.props.uiAction.hideSmartMessageBox();
                }
            }
            this.props.uiAction.hideLoading();
        });
    }

    componentDidMount() {
        this._getAccountServiceItemList();
    }

    render() {
        const {isShow,columns,isLoading,account_service_list} = this.state;
        const {sales_order, is_action = true, isOutdated = false} = this.props;

        return(
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.toggleShow}>
                        <span className="title left">Gói Quản lý tài khoản NTD ({account_service_list?.length || 0})</span>
                        <div className={classnames("right", isShow ? "active" : "")}>
                            <button type="button" className="bt-refresh el-button">
                                <i className="v-icon v-icon-append fa fa-chevron-down fs20"/>
                            </button>
                        </div>
                    </div>
                    {isShow ? <Collapse in={isShow}>
                        <div>
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
                                            {sales_order?.type_campaign !== Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.gift && <CanRender actionCode={ROLES.customer_care_sales_order_recruiter_assistant_buy}>
                                                <button type="button"
                                                        className="el-button el-button-primary el-button-small mb20"
                                                        onClick={() => {
                                                            this.onBuyRecruiterAssistant(sales_order)
                                                        }}
                                                >
                                                    <span>Mua gói Quản lý tài khoản NTD<i className="glyphicon glyphicon-plus ml5"/></span>
                                                </button>
                                            </CanRender>}
                                            <CanRender actionCode={ROLES.customer_care_sales_order_recruiter_assistant_buy_gift}>
                                                <button type="button"
                                                        className="el-button el-button-primary el-button-small mb20"
                                                        onClick={() => {
                                                            this.onBuyRecruiterAssistantGift(sales_order)
                                                        }}
                                                >
                                                    <span>Mua gói Quản lý tài khoản NTD (Tặng)<i className="glyphicon glyphicon-plus ml5"/></span>
                                                </button>
                                            </CanRender>
                                        </div>
                                    )
                                )}
                                <div className="right">
                                    <button type="button" className="bt-refresh el-button" onClick={()=>this._getAccountServiceItemList()}>
                                        <i className="fa fa-refresh"/>
                                    </button>
                                </div>
                                {isLoading ? <div className="text-center">
                                    <LoadingSmall />
                                </div>
                                : <div className="row">
                                    <div className="col-sm-12 col-xs-12">
                                        <Gird idKey={idKey}
                                            data={account_service_list}
                                            columns={columns}
                                            history={history}
                                            expandRow={row => <AccountServiceSubItem isOutdated={isOutdated} data={row} sales_order={sales_order} idKey={idKey} sales_order_id={this.props.sales_order.id}/>}
                                            isRedirectDetail={false}
                                            isPushRoute={false}
                                            isPagination={false}
                                            isOpenExpand={true}
                                        />
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </Collapse> : <></>}
                </div>
            </div>
        )   
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecruiterAssistantPackage);
