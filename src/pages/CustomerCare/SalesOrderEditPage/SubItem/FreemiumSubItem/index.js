import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import {getListSalesOrderSub} from "api/saleOrder";
import ROLES from "utils/ConstantActionCode";
import SpanCommon from "components/Common/Ui/SpanCommon";
import CanRender from "components/Common/Ui/CanRender";
import FreemiumSubItemRow from "pages/CustomerCare/SalesOrderEditPage/SubItem/FreemiumSubItem/Row";
import PopupFreemiumRegistration from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupFreemiumRegistration";
import moment from "moment";

class FreemiumSubItem extends Component {
    constructor() {
        super();
        this.state = {
            items: null
        };
        this.btnAdd = this._btnAdd.bind(this);
    }

    _btnAdd() {
        this.props.uiAction.createPopup(PopupFreemiumRegistration, this.props.isFreemium ? "Đăng Ký Tin Freemium" : "Đăng Ký Tin Cơ Bản" , {
            sales_order: this.props.sales_order,
            sales_order_item: this.props.sales_order_item,
            isFreemium: this.props.isFreemium || false
        });
    }

    async _getListSubItem() {
        const res = await getListSalesOrderSub({
            sales_order_id: this.props.sales_order.id,
            sales_order_items_id: this.props.sales_order_item.id,
        });

        if (res) {
            this.setState({
                items: res
            });
        }
    }

    componentDidMount() {
        this._getListSubItem();
    }

    render() {
        const {items} = this.state;
        const {isOutdated = false} = this.props;
        if(!items) {
            return null;
        }
        return (
            <div className="padding30">
                <div className="mb10">
                    {parseInt(this.props.sales_order.status) === Constant.STATUS_ACTIVED && !isOutdated &&
                    (
                        <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.btnAdd}>
                                <span>{this.props.isFreemium ? "Đăng ký tin Freemium " : "Đăng ký tin cơ bản "}<i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    )}
                </div>
                <div className="list-sub-items">
                    {items.map((_, idx) => {
                        const remainingExpiredDay = _?.remaining_expired_day ? _?.remaining_expired_day : _?.remaining_day;
                        return (
                            <div key={idx.toString()} className="mb20">
                                <div className="box-card box-full">
                                    <div className="box-card-title pointer box-package d-flex">
                                        <span className="title left w-40">Sub_item: {_?.id}</span>
                                        <span className="title w-30">Trạng thái:{" "}
                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_items_sub_status}
                                                        value={_?.status} notStyle/>
                                            {_?.status === Constant.SALE_ORDER_REVERSE_PROCCESS && ` (${moment.unix(_?.reserve_expired_at).format("DD/MM/YYYY HH:mm:ss")})`}
                                        </span>
                                        {_?.status === Constant.SALE_ORDER_REVERSE_PROCCESS && <span className="title w-30">Số ngày bảo lưu thực tế: {remainingExpiredDay ? `${remainingExpiredDay} ngày` : ''}</span>}
                                    </div>
                                    <div className="collapse in">
                                        <div className="card-body">
                                            <FreemiumSubItemRow {...this.props} sub_item={_} data_list={_?.registration_info}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    )})}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(FreemiumSubItem);
