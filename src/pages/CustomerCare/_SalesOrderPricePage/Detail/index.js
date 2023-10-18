import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import _ from "lodash";
import queryString from "query-string";
import {subscribe} from "utils/event";

class index  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            accountant_customer:{},
            object: {}
        };
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this._refreshList();
            });
        }, props.idKey));

        this.refreshList = this._refreshList.bind(this);
        this.getCustomer = this._getCustomer.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnChangeSalesOrder = this._btnChangeSalesOrder.bind(this);
        this.btnPreview = this._btnPreview.bind(this);
        this.goBack = this._goBack.bind(this);
    }
    _refreshList(delay = 0){
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_DETAIL, {id: this.props.id, type: Constant.SALES_ORDER_TYPE_PRICE}, delay);
        });
    }
    _getCustomer(accountant_customer_id){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL, {id: accountant_customer_id});
    }
    _btnDelete(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phiếu báo giá ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALES_ORDER_DELETE, {id: this.props.id});
            }
        });
    }
    _btnChangeSalesOrder(){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn chuyển phiếu báo giá thành phiếu đăng ký ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION, {id: this.props.id});
            }
        });
    }
    _btnPreview(){
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW, {id: this.props.id});
    }
    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_DETAIL]) {
            let response_object = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_DETAIL];
            if (response_object.code === Constant.CODE_SUCCESS) {
                this.setState({object: response_object.data});
                if (response_object.data.accountant_customer_id){
                    this.getCustomer(response_object.data.accountant_customer_id);
                }
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_DETAIL);
            this.setState({loading: false});
        }
        if (newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL]) {
            let response_object = newProps.api[ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL];
            if (response_object.code === Constant.CODE_SUCCESS) {
                this.setState({accountant_customer: response_object.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_ACCOUNTANT_CUSTOMER_DETAIL);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW];
            if (response.code === Constant.CODE_SUCCESS) {
                if (response.data.url) {
                    window.open(response.data.url, "_blank");
                }
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_PREVIEW);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_DELETE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_SALES_ORDER_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('SalesOrderPricePage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALES_ORDER_DELETE);
        }
        if (newProps.api[ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION]) {
            let response = newProps.api[ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.props.uiAction.refreshList('SalesOrderPricePage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_CHANGE_PRICE_TO_REGISTRATION);
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
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div className="row content-box">
                    <div className="relative card-body text-center">
                        <LoadingSmall />
                    </div>
                </div>
            )
        }
        let {object} = this.state;
        let sales_order_payment_term_method = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_payment_term_method);

        let status = parseInt(object.status);

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
                            <div className="col-sm-5 col-xs-5 padding0"><span>Ngày tạo phiếu</span></div>
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
                            <div className="col-sm-5 col-xs-5 padding0">Tái ký</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {parseInt(object.recontract_status) === Constant.RECONTRACT_STATUS_ACTIVE ? <span>Có</span> : <span className="textRed">Không</span>}
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
                                {sales_order_payment_term_method[object.payment_term_method]}
                            </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 row-content padding0">
                            <div className="col-sm-5 col-xs-5 padding0">Ghi chú</div>
                            <div className="col-sm-7 col-xs-7 text-bold">
                                {object.note}
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
                    </div>
                    <div className="col-sm-7 col-xs-7">
                        <div className="col-sm-12 col-xs-12 row-content row-title padding0">
                            <span>Thành tiền ({object.total_amount_unit ? utils.formatNumber(object.total_amount_unit,0,".","đ") : "Không có"})</span>
                        </div>
                        {object.total_amount_info && (
                            <React.Fragment>
                                {object.total_amount_info && Object.keys(object.total_amount_info).map((item, key) => {
                                    if (!['discount_non_policy_info','recontract_info'].includes(item)) {
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
                                    }else{
                                        return <React.Fragment key={key}/>
                                    }
                                })}
                                {parseInt(object.recontract_discount_amount) > 0 && (
                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                        <div className="col-sm-6 col-xs-6 padding0">Giảm giá tái ký</div>
                                        <div className="col-sm-6 col-xs-6 number-money textRed">
                                            <span>- {utils.formatNumber(object.recontract_discount_amount,0,".","đ")}</span>
                                        </div>
                                    </div>
                                )}
                                {parseInt(object.non_policy_discount_amount) > 0 && (
                                    <div className="col-sm-12 col-xs-12 row-content padding0">
                                        <div className="col-sm-6 col-xs-6 padding0">GGNCS</div>
                                        <div className="col-sm-6 col-xs-5 number-money textRed">
                                            <span>- {utils.formatNumber(object.non_policy_discount_amount,0,".","đ")}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="col-sm-12 col-xs-12 row-content padding0">
                                    <div className="col-sm-6 col-xs-6 text-bold padding0">Tổng</div>
                                    <div className="col-sm-6 col-xs-6 number-money last">
                                        <span>{utils.formatNumber(object.total_amount_unit,0,".","đ")}</span>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                    <div className="col-sm-12 col-xs-12 mt15">
                        {keyPress.includes("1") && (
                            <a target="_blank" rel="noopener noreferrer" href={Constant.BASE_URL_EDIT_SALES_SERVICE_PRICE + "?id=" + object.id} className="el-button el-button-primary el-button-small">
                                <span>Chi tiết</span>
                            </a>
                        )}
                        {keyPress.includes("2") && (
                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnPreview}>
                                <span>In phiếu</span>
                            </button>
                        )}
                        {keyPress.includes("3") && (
                            <button type="button" className="el-button el-button-bricky el-button-small" onClick={this.btnDelete}>
                                <span>Xóa phiếu</span>
                            </button>
                        )}
                        {keyPress.includes("4") && (
                            <button type="button" className="el-button el-button-warning el-button-small" onClick={this.btnChangeSalesOrder}>
                                <span>Chuyển thành PĐK</span>
                            </button>
                        )}
                        <button type="button" className="el-button el-button-default el-button-small" onClick={this.goBack}>
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


export default connect(mapStateToProps,mapDispatchToProps)(index);
