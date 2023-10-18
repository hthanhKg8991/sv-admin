import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";

import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";

import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import ROLES from "utils/ConstantActionCode";

import {getListSalesOrderRequestInvoices} from "api/saleOrder";

import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupCreateRequestInvoices from 'pages/CustomerCare/SalesOrderPage/Popup/PopupCreateRequestInvoices'
import CanRender from "components/Common/Ui/CanRender";

class ListLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "ListLogEmailChangeInfo",
            columns: [
                {
                    title: "ID",
                    width: 40,
                    accessor: 'id'
                },
                {
					title: "Ngày tạo",
					width: 100,
					time: true,
                    accessor: "created_at",
				},
				{
					title: "Tạo bởi",
					width: 100,
					accessor: "created_by",
				},
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_invoices_status} value={row?.status}/>;
                    }
                },
                {
                    title: "Lý do",
                    width: 100,
                    accessor: "note",
                },
                {
                    title: "Hành động",
                    width: 100,
                    cell: row => {
                        return row?.status === Constant.NEED_APPROVE_REQUEST_INVOICES && [Constant.SALE_ORDER_INACTIVE].includes(parseInt(props?.object?.status)) &&
                            <CanRender actionCode={ROLES.customer_care_sales_order_request_change_email_receive_info_update}>
                                <span className="text-link text-warning font-bold" onClick={() => this.onUpdateRequest(row?.id, row?.accountant_customer_id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                    }
                },
            ],
            loading: false,
        };

        this.onCreateRequest = this._onCreateRequest.bind(this)
        this.onUpdateRequest = this._onUpdateRequest.bind(this)
    }

    _onCreateRequest() {
        const {object} = this.props
        
        this.props.actions.createPopup(
            PopupCreateRequestInvoices, 
            "Tạo yêu cầu thay đổi thông tin xuất hóa đơn", 
            {
                sales_order_id: object?.id
            }
        )
    }

    _onUpdateRequest(id, accountant_customer_id) {
        const {object} = this.props
        this.props.actions.createPopup(
            PopupCreateRequestInvoices, 
            "Cập nhật yêu cầu thay đổi thông tin xuất hóa đơn", 
            {
                email_e_invoices: object?.email_e_invoices,
                accountant_customer_id: accountant_customer_id,
                sales_order_id: object?.id,
                id: id
            }
        )
    }

    render() {
        const {columns, idKey} = this.state;
        const {query, defaultQuery, history, object} = this.props;

        return (
            <Default
                title="Lịch sử thay đổi thông tin xuất HĐ"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <span>* Đổi trạng thái của yêu cầu sang Không duyêt kèm lý do Phiếu đã duyệt nếu phiếu được duyệt mà yêu cầu đang chờ duyệt</span>
                {
                [Constant.SALE_ORDER_INACTIVE].includes(parseInt(object?.status)) && 
                <CanRender actionCode={ROLES.customer_care_sales_order_request_change_email_receive_info_create}>
                    <div className="mt10 mb10">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onCreateRequest}>
                            <span>Tạo yêu cầu thay đổi thông tin xuất hóa đơn</span>
                        </button>
                    </div>
                </CanRender>
                }
                <Gird 
                    idKey={idKey}
                    fetchApi={getListSalesOrderRequestInvoices}
                    query={{
                    ...query,
                    sales_order_id: object?.id
                    }}
                    columns={columns}
                    defaultQuery={{
                    ...defaultQuery, 
                    sales_order_id: object?.id
                    }}
                    history={history}
                    isPushRoute={false}
                    isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup}, dispatch)
    };
     
}

export default connect(null, mapDispatchToProps)(ListLog);
