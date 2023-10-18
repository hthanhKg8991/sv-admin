import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {getListFieldQuotationRequest} from "api/saleOrder";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import SpanCommon from "components/Common/Ui/SpanCommon";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import ChangeStatusPopup from "pages/CustomerCare/FieldQuotationRequestPage/Popup/ChangeStatus";

const idKey = "FieldQuotationRequest";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 160,
                    cell: (row) => (
                        <a href={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${row?.employer_info?.id}`}
                           rel="noopener noreferrer"
                           target="_blank">{row?.employer_id} - {row?.employer_info?.name}</a>
                    )
                },
                {
                    title: "Tin tuyển dụng",
                    width: 160,
                    cell: (row) => (
                        <a href={`${Constant.BASE_URL_JOB}?action=detail&id=${row?.job_info?.id}`}
                           rel="noopener noreferrer"
                           target="_blank">{row?.job_info?.id} - {row?.job_info?.title}</a>
                    )
                },
                {
                    title: "Ngày đăng ký",
                    width: 120,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_quotation_request_status}
                                             value={row?.status}/>
                },
                {
                    title: "Lọai",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_by_field_items_guarantee}
                                             value={row?.type}/>
                },
                {
                    title: "CSKH",
                    width: 160,
                    accessor: "employer_info.assigned_staff_username"
                },
                {
                    title: "Hành động",
                    width: 160,
                    cell: row => (
                        <>
                            <span className="text-link text-blue font-bold mr5" onClick={() => this.onDetail(row)}>Xem danh sách</span>
                            <CanRender actionCode={ROLES.customer_care_quotation_request_change_status}>
                                <span className="text-link text-warning font-bold"
                                      onClick={() => this.onChangeStatus(row)}>Thay đổi trạng thái</span>
                            </CanRender>
                        </>
                    )
                }
            ]
        };
        this.onDetail = this._onDetail.bind(this);
        this.onChangeStatus = this._onChangeStatus.bind(this);
    }

    _onChangeStatus(row) {
        this.props.actions.createPopup(ChangeStatusPopup, "Thay Đổi Trạng Thái", {
            object: row,
            idKey: idKey
        });
    }

    _onDetail(row) {
        const {history} = this.props;
        const {id} = row;
        history.push({
            pathname: Constant.BASE_URL_FIELD_QUOTATION_REQUEST,
            search: '?action=detail&id=' + id || 0,
        });
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách NTD Đăng Ký Gói Hổ Trợ Từ Bảng Giá"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListFieldQuotationRequest}
                      query={query}
                      columns={columns}
                      defaultQuery={{}}
                      history={history}
                      isReplaceRoute={true}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
