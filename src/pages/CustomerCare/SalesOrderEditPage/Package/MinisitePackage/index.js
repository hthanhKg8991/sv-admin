import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import PopupMinisitePackage from 'pages/CustomerCare/SalesOrderEditPage/Package/Popup/PopupMinisitePackage';
import {bindActionCreators} from "redux";
import moment from "moment";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import MinisitePackageRegistration from "./MinisitePackageRegistration";
import config from 'config';
import ROLES from "utils/ConstantActionCode";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {publish, subscribe} from "utils/event";
import CanRender from "components/Common/Ui/CanRender";

const idKey = "MiniSitePackageList";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: false,
            total_item : {},
            itemActive: {}
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.refreshList();
        }, idKey));

        this.btnBuy = this._btnBuy.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.showHide = this._showHide.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.setTotal = this._setTotal.bind(this);
    }

    _btnBuy(){
        this.props.uiAction.createPopup(PopupMinisitePackage, "Mua Minisite", {sales_order: this.props.sales_order});
    }
    _refreshList(delay = 0){
        let args = {
            service_type: Constant.SERVICE_TYPE_FILTER_MINISITE,
            sales_order_id: this.props.sales_order.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST, args, delay);
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupMinisitePackage, "Chỉnh Sửa Mua Minisite", {
            sales_order: this.props.sales_order,
            object: object
        });
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa gói minisite ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS, {
                    id: object.id,
                    sales_order_id: object.sales_order_id,
                    service_type: Constant.SERVICE_TYPE_FILTER_MINISITE,
                });
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
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST];
            if (response.info?.args?.service_type === Constant.SERVICE_TYPE_FILTER_MINISITE) {
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
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_ITEMS_LIST);
            }
        }
        if (newProps.api[ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS]){
            let response = newProps.api[ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS];
            if (response.info?.args?.service_type === Constant.SERVICE_TYPE_FILTER_MINISITE) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.props.uiAction.hideSmartMessageBox();
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    this.refreshList();
                    publish(".refresh", {}, Constant.IDKEY_SALES_ORDER_EDIT_PAGE);
                    publish(".refresh", {}, Constant.IDKEY_DISCOUNT_RECONTRACT);
                }
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DELETE_SALES_ORDER_ITEMS);
            }
        }
        if (newProps.refresh['MinisitePackage']){
            let delay = newProps.refresh['MinisitePackage'].delay ? newProps.refresh['MinisitePackage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('MinisitePackage');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render () {
        let {data_list, show_detail, itemActive, total_item} = this.state;
        let {sales_order} = this.props;
        let area = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_area);
        let total = 0;
        Object.keys(total_item).forEach((name) => {
            total += total_item[name];
        });
        return (
            <div className="col-result-full crm-section">
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Minisite ({total})</span>
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
                                    {![Constant.SALE_ORDER_DELETED, Constant.SALE_ORDER_ACTIVED, Constant.SALE_ORDER_INACTIVE, Constant.SALE_ORDER_CANCEL].includes(parseInt(sales_order.status)) &&(
                                        <div className="left">
                                            {/*{sales_order?.type_campaign === Constant.CAMPAIGN_TYPE_DEFAULT &&*/}
                                                <CanRender
                                                    actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                    <button type="button"
                                                            className="el-button el-button-primary el-button-small"
                                                            onClick={this.btnBuy}>
                                                        <span>Mua minisite <i className="glyphicon glyphicon-plus"/></span>
                                                    </button>
                                                </CanRender>
                                            {/*}*/}
                                        </div>
                                    )}
                                    <div className="right">
                                        <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                            <i className="fa fa-refresh"/>
                                        </button>
                                    </div>
                                    <div className="crm-section">
                                        <div className="body-table el-table">
                                            <TableComponent className="table-custom">
                                                <TableHeader tableType="TableHeader" width={400}>
                                                    Thông tin mua minisite
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={400}>
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
                                                        return (
                                                            <React.Fragment key={key}>
                                                                <tr className={classnames("el-table-row pointer")}>
                                                                    <td onClick={()=>{this.activeItem(item.id)}}>
                                                                        <div className="cell-custom">
                                                                            <div>Mã mua dịch vụ: <span className="text-bold">{item.id}</span></div>
                                                                            <div>Tên gói dịch vụ: <span className="text-bold">{item.cache_service_name}</span></div>
                                                                            <div>Thời gian mua: <span className="text-bold">
                                                                                {item.week_quantity} tuần &nbsp;
                                                                                {/*{item.day_quantity} ngày */}
                                                                                ({moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item.end_date).format("DD/MM/YYYY")})</span>
                                                                            </div>
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
                                                                    </td>
                                                                    <td onClick={()=>{this.activeItem(item.id)}}>
                                                                        <div className="cell-custom">
                                                                            <div>Thành tiền minisite: <span className="text-bold">{utils.formatNumber(item.original_amount,0,".","đ")}</span></div>
                                                                            {parseInt(item.discount_amount) > 0 && (
                                                                                <div>Giảm giá chiết khấu: <span className="text-bold">{utils.formatNumber(item.discount_amount,0,".","đ")}</span></div>
                                                                            )}
                                                                            {item?.original_amount > 0 && (
                                                                                <div>Thành tiền sau giảm: <span className="text-bold">{utils.formatNumber(item?.original_amount - item.discount_amount - item.promotion_amount,0,".","đ")}</span></div>
                                                                            )}
                                                                            {parseInt(item.promotion_amount) > 0 && (
                                                                                <div>Khuyến mãi: <span className="text-bold">{utils.formatNumber(item.promotion_amount,0,".","đ")}</span></div>
                                                                            )}
                                                                            <div><span className="textRed">Tổng tiền: </span> <span className="text-bold">{utils.formatNumber(parseInt(item.total_amount) + parseInt(item.effect_amount),0,".","đ")}</span></div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="cell-custom">
                                                                            {![Constant.SALE_ORDER_DELETED, Constant.SALE_ORDER_ACTIVED, Constant.SALE_ORDER_INACTIVE, Constant.SALE_ORDER_CANCEL].includes(parseInt(sales_order.status)) &&(
                                                                                <>
                                                                                    {/*{total_item[item.id] === 0 && (*/}
                                                                                    {/*    <div className="text-underline pointer">*/}
                                                                                    {/*        <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>*/}
                                                                                    {/*    </div>*/}
                                                                                    {/*)}*/}
                                                                                    {![Constant.SALE_ORDER_INACTIVE].includes(parseInt(sales_order.status)) && (
                                                                                        <div className="text-underline pointer">
                                                                                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                            {/*<div className="text-underline pointer">*/}
                                                                            {/*    <span className="text-bold text-primary" onClick={()=>{this.activeItem(item.id)}}>Đăng ký dịch vụ</span>*/}
                                                                            {/*</div>*/}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {itemActive[item.id]&& (
                                                                    <tr>
                                                                        <td colSpan={4}>
                                                                            <MinisitePackageRegistration sales_order_item={item}
                                                                                                         sales_order={sales_order}
                                                                                                         setTotal={this.setTotal}
                                                                                                         idKey={idKey}
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

export default connect(mapStateToProps,mapDispatchToProps)(index);
