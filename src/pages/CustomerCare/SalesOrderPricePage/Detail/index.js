import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import _ from "lodash";
import queryString from "query-string";
import {subscribe} from "utils/event";
import {
    changePriceToRegisTration,
    deleteSalesOrder,
    getDetailAccountCustomer,
    getDetailSalesOrder,
    getPromotionProgramAppliedsBySalesOrder,
    previewSalesOrder,
    salesOrderRequestDropDetail
} from "api/saleOrder";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupChangeBranch from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeBranch";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            accountant_customer: {},
            object: {}
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.setState({loading: true}, () => {
                this._refreshList();
            });
        }, props.idKey));

        this.refreshList = this._refreshList.bind(this);
        this.getCustomer = this._getCustomer.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnChangeSalesOrder = this._btnChangeSalesOrder.bind(this);
        this.getAppliedPromotions = this._getAppliedPromotions.bind(this);
        this.getRequestDropItem = this._getRequestDropItem.bind(this);
        this.btnPreview = this._btnPreview.bind(this);
        this.btnChangeBranch = this._btnChangeBranch.bind(this);
        this.goBack = this._goBack.bind(this);
    }

    _refreshList() {
        const {id} = this.props;
        this.setState({loading: true}, async () => {
            const res = await getDetailSalesOrder({
                id: id,
                type: Constant.SALES_ORDER_TYPE_PRICE
            });
            if (res) {
                this.setState({object: res, loading: false});
                if (res.accountant_customer_id) {
                    this.getCustomer(res.accountant_customer_id);
                }
            }
        });
        this.getAppliedPromotions(id);
        this.getRequestDropItem();
    }

    async _getCustomer(accountant_customer_id) {
        const res = await getDetailAccountCustomer({id: accountant_customer_id});
        if (res) {
            this.setState({accountant_customer: res});
        }
    }

    _btnDelete() {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phiếu báo giá ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteSalesOrder({id: this.state.object.id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    this.refreshList();
                }
                uiAction.hideLoading();
                uiAction.hideSmartMessageBox();
            }
        });
    }

    async _btnPreview() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await previewSalesOrder({id: this.state.object.id});
        if (res) {
            window.open(res?.url, "_blank");
        }
        uiAction.hideLoading();
    }

    _btnChangeBranch() {
        const {uiAction} = this.props;
        uiAction.createPopup(PopupChangeBranch, "Chọn thông tin công ty", {sales_order: this.state.object});
    }

    _btnChangeSalesOrder() {
        const {uiAction, history} = this.props;
        const {id} = this.state.object;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn chuyển phiếu báo giá thành phiếu đăng ký ?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await changePriceToRegisTration({id: id});
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    history.push(Constant.BASE_URL_EDIT_SALES_ORDER + '?id=' + id);
                }
                uiAction.hideSmartMessageBox();
                uiAction.hideLoading();
            }
        });
    }

    async _getAppliedPromotions(id) {
        const res = await getPromotionProgramAppliedsBySalesOrder({sales_order_id: id});
        if(res) {
            this.setState({applied: res});
        }
    }

    async _getRequestDropItem() {
        const args = {
            sales_order_id: this.props.id,
            request_type: Constant.REQUEST_DROP_SALES_ORDER
        };
        const res = await salesOrderRequestDropDetail(args);
        if (res) {
            this.setState({requestDropItem: res});
        }
    }

    _goBack() {
        const {history} = this.props;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SALES_SERVICE_PRICE,
                search: '?action=list'
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            delete search['action'];
            delete search['id'];

            history.push({
                pathname: Constant.BASE_URL_SALES_SERVICE_PRICE,
                search: '?' + queryString.stringify(search)
            });

            return true;
        }
    }

    componentWillMount() {
        this.refreshList();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="row content-box">
                    <div className="relative card-body text-center">
                        <LoadingSmall/>
                    </div>
                </div>
            )
        }
        const {object, applied} = this.state;
        const status = parseInt(object?.status);

        const taxRate = (100 + Number(object.vat_percent))/100;
        const totalAmount =  object.is_include_tax === true ?  object.total_amount_unit/taxRate : object.total_amount_unit;
        const totalAmountIncludedTax = object.is_include_tax === true ? object.total_amount_unit : object.total_amount_unit*taxRate;
        const totalTax = totalAmountIncludedTax - totalAmount;

        let keyPress = [];
        if (status) {
            keyPress.push("1");
            if (![Constant.STATUS_DELETED].includes(status)) {
                keyPress.push("2");
                keyPress.push("3");
                keyPress.push("4");
            }
        }
        return (
            <div className="content-box">
                <div className="row mt10">
                    <div className="col-sm-5 col-xs-5">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            <span>Thông tin phiếu</span>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Trạng thái</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_quotation_status} value={object?.status}
                                            notStyle/>
                            </div>
                        </div>
                        {/*lý do không duyệt phiếu*/}
                        {[Constant.STATUS_DISABLED, Constant.STATUS_LOCKED].includes(status) && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Lý do</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {object.rejected_note}
                                </div>
                            </div>
                        )}

                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ngày tạo phiếu</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {moment.unix(object.created_at).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ngày ghi nhận</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {moment.unix(object.ordered_on).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Người tạo</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {_.get(object, 'created_by', null)}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">CSKH ghi nhận doanh thu</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object?.revenue_by_staff_code} - {object?.revenue_by_staff_name}
                            </div>
                        </div>
                        {object.approved_at && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày duyệt phiếu</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object.approved_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        )}

                        {object.expired_at && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Ngày hết hạn</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {moment.unix(object.expired_at).format("DD/MM/YYYY")}
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Tái ký</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {parseInt(object.recontract_status) === Constant.RECONTRACT_STATUS_ACTIVE ?
                                    <span>Có</span> : <span className="textRed">Không</span>}
                            </div>
                        </div>
                        {parseInt(object.payment_method) === Constant.PAYMENT_TERM_METHOD_TM && object.payment_info &&
                        (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Địa chỉ thu tiền mặt</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {object.payment_info}
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Hạn thanh toán</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_payment_term_method}
                                            value={object.payment_term_method} notStyle/>
                            </div>
                        </div>
                        {!(Object.entries(this.state.accountant_customer).length === 0) && (
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-5 col-xs-5 padding0">Khách hàng kế toán</div>
                                <div className="col-sm-7 col-xs-7 text-bold">
                                    {this.state.accountant_customer.name}
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ghi chú</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.note}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-7 col-xs-7">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            <span>Thành tiền ({object.total_amount_unit ? utils.formatNumber(totalAmountIncludedTax, 0, ".", "đ") : "Không có"})</span>
                        </div>
                        {object.total_amount_info && (
                            <React.Fragment>
                                {object.total_amount_info && Object.keys(object.total_amount_info).map((item, key) => {
                                    if (!['discount_non_policy_info', 'recontract_info'].includes(item)) {
                                        return (
                                            <div className="col-sm-12 col-xs-12 row-content padding0" key={key}>
                                                <div className="col-sm-6 col-xs-6 padding0">
                                                    <span>{object.total_amount_info[item].cache_service_name}</span>
                                                </div>
                                                <div className="col-sm-6 col-xs-6 number-money">
                                                    <span>{utils.formatNumber(object.total_amount_info[item].total_amount, 0, ".", "đ")}</span>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return <React.Fragment key={key}/>
                                    }
                                })}
                                {applied.map((a, idx) => (
                                    <div className="col-sm-12 col-xs-12 row-content padding0" key={idx.toString()}>
                                        <div className="col-sm-6 col-xs-6 padding0">
                                            <span>{a?.title}</span>
                                        </div>
                                        <div className="col-sm-6 col-xs-6 number-money textRed">
                                            <span>- {utils.formatNumber(a?.discount_amount, 0, ".", "đ")}</span>
                                        </div>
                                    </div>
                                ))}
                                {parseInt(object.recontract_discount_amount) > 0 && (
                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                        <div className="col-sm-6 col-xs-6 padding0">Giảm giá tái ký</div>
                                        <div className="col-sm-6 col-xs-6 number-money textRed">
                                            <span>- {utils.formatNumber(object.recontract_discount_amount, 0, ".", "đ")}</span>
                                        </div>
                                    </div>
                                )}
                                {parseInt(object.non_policy_discount_amount) > 0 && (
                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                        <div className="col-sm-6 col-xs-6 padding0">GGNCS</div>
                                        <div className="col-sm-6 col-xs-5 number-money textRed">
                                            <span>- {utils.formatNumber(object.non_policy_discount_amount, 0, ".", "đ")}</span>
                                        </div>
                                    </div>
                                )}
                                
                            {object.is_include_tax === false && <>
                                <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                    <div className="col-sm-6 col-xs-6 px-0 pt-10">Tiền trước thuế</div>
                                    <div className="col-sm-6 col-xs-6 number-money last pt-10">
                                        <span>{utils.formatNumber(totalAmount, 0, ".", "đ")}</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                    <div className="col-sm-6 col-xs-6 padding0">Thuế VAT</div>
                                    <div className="col-sm-6 col-xs-6 number-money">
                                        <span>{utils.formatNumber(totalTax ,0,".","đ")}</span>
                                    </div>
                                </div>
                            </>}
                            
                            <div className="col-sm-12 col-xs-12 row-content padding0 mb10">
                                <div className="col-sm-6 col-xs-6 text-bold px-0 pt-10">Tổng tiền {object.is_include_tax === false && 'sau thuế'}</div>
                                <div className="col-sm-6 col-xs-6 number-money last pt-10">
                                    <span>{utils.formatNumber(totalAmountIncludedTax, 0, ".", "đ")}</span>
                                </div>
                            </div>
                            </React.Fragment>
                        )}
                    </div>
                    <div className="col-sm-12 col-xs-12 mt15">
                        {keyPress.includes("1") && (
                            <a target="_blank" rel="noopener noreferrer"
                               href={Constant.BASE_URL_EDIT_SALES_SERVICE_PRICE + "?id=" + object.id}
                               className="el-button el-button-primary el-button-small">
                                <span>Chi tiết</span>
                            </a>
                        )}
                        {keyPress.includes("2") && (
                            <CanRender actionCode={ROLES.customer_care_sales_order_preview_sales_order}>
                                <button type="button" className="el-button el-button-primary el-button-small"
                                        onClick={this.btnPreview}>
                                    <span>In phiếu</span>
                                </button>
                            </CanRender>
                        )}
                        {keyPress.includes("3") && (
                            <button type="button" className="el-button el-button-bricky el-button-small"
                                    onClick={this.btnDelete}>
                                <span>Xóa phiếu</span>
                            </button>
                        )}
                        {keyPress.includes("4") && (
                            <button type="button" className="el-button el-button-warning el-button-small"
                                    onClick={this.btnChangeSalesOrder}>
                                <span>Chuyển thành PĐK</span>
                            </button>
                        )}
                        <button type="button" className="el-button el-button-default el-button-small"
                                onClick={this.goBack}>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(index);
