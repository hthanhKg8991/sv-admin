import React from "react";
import * as Constant from "utils/Constant";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createPopup, hideLoading, putToastSuccess, showLoading, SmartMessageBox, hideSmartMessageBox} from 'actions/uiAction';
import _ from "lodash";
import {getListAccountantCustomerFull, approveSalesOrderRequestInvoices, getDetailAccountantCustomer} from "api/saleOrder";
import {publish} from "utils/event";
import SpanCommon from "components/Common/Ui/SpanCommon";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupCancelRequestInvoices  from 'pages/Accountant/ApproveRequestChangeRequestInvoicesPage/Popup/PopupRejectRequestInvoices'
import moment from "moment";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customer_old: {},
            customer_new: {},
        }
        this.goBack = this._goBack.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_ACCOUNTANT_SALES_ORDER_APPROVE_CHANGE_EMAIL_INVOICES,
            search: '?action=list'
        });
        return true;
    }

    async _getListAccountCustomer() {
        const {data, detailRequestInvoices} = this.props;
        if(data?.accountant_customer_id) {
            const resOld = await getDetailAccountantCustomer({id: data?.accountant_customer_id});
            this.setState({customer_old: resOld || {}});
        }
        if(detailRequestInvoices?.accountant_customer_id) {
            const resNew = await getDetailAccountantCustomer({id: detailRequestInvoices?.accountant_customer_id});
            this.setState({customer_new: resNew || {}});
        }
    }

    componentDidMount(){
        const args = {
            // tax_code: data?.accountant_customer_id,
            // status: Constant.STATUS_ACTIVED,
            per_page: 1000,
            page: 1
        };
        this._getListAccountCustomer(args)
    }

    _btnApprove() {
        const { actions, idKey, detailRequestInvoices } = this.props;
        actions.SmartMessageBox(
            {
              title: `Bạn có chắc muốn duyệt thay đổi ?`,
              content: "",
              buttons: ["No", "Yes"],
            },
            async (ButtonPressed) => {
              if (ButtonPressed === "Yes") {
                this.setState({ loading: true });
                const res = await approveSalesOrderRequestInvoices({ id: detailRequestInvoices?.id });
                if (res) {
                    actions.putToastSuccess("Thao tác thành công");
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
                this.setState({ loading: false });
              }
            }
        );
      }

      _btnReject() {
        const { actions, idKey,detailRequestInvoices  } = this.props;
        actions.createPopup(
            PopupCancelRequestInvoices,
            "Không Duyệt Yêu Cầu Hủy Phiếu Đăng Ký",
            {idKey: idKey, id: detailRequestInvoices?.id}
        );
      }

    render() {
        const {data, detailRequestInvoices} = this.props;
        const {customer_old, customer_new} = this.state;
        
        return (
            <div className="row">
                <div className="row-title col-sm-12 col-xs-12 mb10 mt20">
                    Trạng thái: <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_invoices_status} value={detailRequestInvoices?.status}/>
                </div>
                {detailRequestInvoices?.status === Constant.NEED_APPROVE_REQUEST_INVOICES && <div className="col-sm-6 col-xs-6">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin hiện tại</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã số thuế</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{(customer_old?.tax_code || "") + " - " + (customer_old?.name || "")}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên công ty</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {customer_old?.name}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{customer_old?.address}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email nhận hóa đơn</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{data?.email_e_invoices?.join(", ")}</div>
                    </div>
                </div>}
                <div className="col-sm-6 col-xs-6">
                    <div className="col-sm-12 col-xs-12 row-content row-title padding0">Thông tin thay đổi</div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Mã số thuế</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{(customer_new?.tax_code || "") + " - " + (customer_new?.name || "")}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Tên công ty</div>
                        <div className="col-sm-8 col-xs-8 text-bold">
                            {customer_new?.name}
                        </div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Địa chỉ</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{customer_new?.address}</div>
                    </div>
                    <div className="col-sm-12 col-xs-12 row-content padding0">
                        <div className="col-sm-4 col-xs-4 padding0">Email nhận hóa đơn</div>
                        <div className="col-sm-8 col-xs-8 text-bold">{detailRequestInvoices?.email_e_invoices?.join(", ")}</div>
                    </div>
                    {
                        detailRequestInvoices?.status !== Constant.NEED_APPROVE_REQUEST_INVOICES &&
                        <>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Xét duyệt lúc</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{moment.unix(detailRequestInvoices?.approved_at || detailRequestInvoices?.rejected_at).format("DD/MM/YYYY HH:mm:ss")}</div>
                            </div>
                            <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Người xét duyệt</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{detailRequestInvoices?.approved_by || detailRequestInvoices?.rejected_by}</div>
                            </div>
                            {detailRequestInvoices?.note && <div className="col-sm-12 col-xs-12 row-content padding0">
                                <div className="col-sm-4 col-xs-4 padding0">Lý do</div>
                                <div className="col-sm-8 col-xs-8 text-bold">{detailRequestInvoices?.note}</div>
                            </div>}
                        </>
                    }
                </div>
                <div className="col-sm-12 col-xs-12 mt15">
                    {
                        detailRequestInvoices?.status === Constant.NEED_APPROVE_REQUEST_INVOICES &&
                        <CanRender actionCode={ROLES.accountant_sales_order_request_change_email_receive_info_approve}>
                            <button type="button" className="el-button el-button-success el-button-small"
                                    onClick={this.btnApprove}>
                                <span>Duyệt</span>
                            </button>
                            <button type="button" className="el-button el-button-bricky el-button-small"
                                    onClick={this.btnReject}>
                                <span>Không duyệt</span>
                            </button>
                        </CanRender>
                    }
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={this.goBack}>
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({createPopup, putToastSuccess, showLoading, hideLoading, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
