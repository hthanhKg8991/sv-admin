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
import AccountServiceSubItemRow from "./AccountServiceSubItemRow";
import PopupRegisRecruiterAssistant from "pages/CustomerCare/SalesOrderEditPage/Package/RecruiterAssistantPackage/Popup/PopupRegisRecruiterAssistant";
import moment from 'moment';

class AccountServiceSubItem extends Component {
    constructor() {
        super();
        this.state = {
            items: null,
            isLoading:true,
        };
        this.onRegisRecruiterAssistant = this._onRegisRecruiterAssistant.bind(this);
    }

    _onRegisRecruiterAssistant(){
        const {data,sales_order_id} = this.props
        this.props.uiAction.createPopup(PopupRegisRecruiterAssistant, "Đăng ký Quản lý tài khoản NTD", {
            item: {
                sales_order_items_id: data?.id,
                sales_order_id: sales_order_id,
                start_date: data?.start_date,
                end_date: data?.end_date
            },
            sales_order:this.props.sales_order,
            data: this.props.data,
            idKey: this.props.idKey,
            fallback: () => this._getListSubItem()
        });
    }

    async _getListSubItem() {

        this.setState({
            isLoading:true,
        });

        const res = await getListSalesOrderSub({
            sales_order_id: this.props.sales_order_id,
            sales_order_items_id: this.props.data.id,
        });

        if (res) {
            this.setState({
                isLoading:false,
                items: res
            });
        }
    }

    componentDidMount() {
        this._getListSubItem();
    }

    render() {
        const {items,isLoading} = this.state;
        const {data, isOutdated = false} = this.props;
        if(!items) {
            return null;
        }
        
        return (
            <div className="">
                <div className="">
                    {parseInt(this.props.sales_order.status) === Constant.STATUS_ACTIVED && !isOutdated && (<CanRender actionCode={ROLES.customer_care_sales_order_recruiter_assistant_subitem_create}>
                        <button type="button"
                                className="el-button el-button-primary el-button-small "
                                onClick={() => {
                                    this.onRegisRecruiterAssistant(data)
                                }}
                        >
                            <span>Đăng ký Quản lý tài khoản NTD <i className="glyphicon glyphicon-plus ml5"/></span>
                        </button>
                    </CanRender>)}
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
                                        {_?.status === Constant.SALE_ORDER_REVERSE_PROCCESS && <span className="title w-30 ml30">Số ngày bảo lưu thực tế: {remainingExpiredDay ? `${remainingExpiredDay} ngày` : ''}</span>}
                                    </div>
                                    <div className="collapse in">
                                        <AccountServiceSubItemRow {...this.props} isNonEditable={_?.status === Constant.SALE_ORDER_REVERSE_PROCCESS} isLoading={isLoading} fallback={() => this._getListSubItem()} sub_item={_} data_list={_?.registration_info}/>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountServiceSubItem);