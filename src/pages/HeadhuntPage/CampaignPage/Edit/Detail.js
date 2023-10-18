import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import Default from "components/Layout/Page/Default";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {getDetailContractRequestHeadhunt, getDetailHeadhuntCustomer, getListFullIndustryHeadhunt} from "api/headhunt";

class DetailCampaign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            industry: [],
            contract_request: null,
            customer_info: null,
        };
        this.asyncData = this._asyncData.bind(this);
    }

    async _asyncData() {
        const {detail} = this.props;
        const [resIndustry, resContractRequest, resCustomer] = await Promise.all([
            getListFullIndustryHeadhunt(),
            getDetailContractRequestHeadhunt({id: detail?.contract_request_id}),
            getDetailHeadhuntCustomer({id: detail?.customer_info?.id}),

        ])
        if (resIndustry) {
            this.setState({industry: resIndustry})
        }
        if (resContractRequest) {
            this.setState({contract_request: resContractRequest})
        }
        if (resCustomer) {
            this.setState({customer_info: resCustomer})
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {industry, contract_request, customer_info} = this.state;
        const {detail} = this.props;
        const {contract_info} = detail || {};
        const industry_name = customer_info && industry?.find(v => v.id === customer_info.industry_id)?.name;
        return (
            <Default
                title="Chi tiết"
            >
                {detail && (
                    <div className="content-box">
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="col-xs-12 row-content row-title">
                                    <span>Thông tin hợp đồng</span>
                                </div>
                                <div className="col-xs-12 mb10">
                                    <div className="col-xs-3">
                                        Hợp đồng
                                    </div>
                                    <div className="col-xs-9 font-bold">
                                        <span className="mr15">{contract_info?.code}</span>
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_contract_status}
                                                    value={contract_info?.status}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="col-xs-12 row-content row-title">
                                    <span>Thông tin khách hàng</span>
                                </div>
                                <div className="col-xs-12 mb10">
                                    <div className="col-xs-3">
                                        Khách hàng
                                    </div>
                                    <div className="col-xs-9 font-bold">
                                        {customer_info?.company_name}
                                    </div>
                                </div>
                                <div className="col-xs-12 mb10">
                                    <div className="col-xs-3">
                                        Ngành
                                    </div>
                                    <div className="col-xs-9 font-bold">
                                        {industry_name}
                                    </div>
                                </div>
                                <div className="col-xs-12 mb10">
                                    <div className="col-xs-3">
                                        Mã số thuế
                                    </div>
                                    <div className="col-xs-9 font-bold">
                                        {customer_info?.tax_code}
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="col-xs-12 row-content row-title">
                                    <span>Nhân viên chăm sóc</span>
                                </div>
                                <div className="col-xs-12 mb10">
                                    <div className="col-xs-3">
                                        Sale
                                    </div>
                                    <div className="col-xs-9 font-bold">
                                        {Array.isArray(customer_info?.customer_staff_info?.customer_headhunt_sale) && customer_info.customer_staff_info.customer_headhunt_sale.map((v, i) => (
                                            <div key={i}>{v}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {contract_request && (
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="card-body">
                                        <div className="crm-section">
                                            <div className="body-table el-table" style={{whiteSpace: "pre-line"}} >
                                                <TableComponent className="table-custom">
                                                    <TableHeader tableType="TableHeader" width={40}/>
                                                    <TableHeader tableType="TableHeader" width={80}>
                                                        Vị trí tuyển dụng
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={70}>
                                                        Số lượng cần tuyển
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={60}>
                                                        Địa điểm làm việc
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={80}>
                                                        Quy trình phỏng vấn
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={120}>
                                                        Yêu cầu kinh nghiệm
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={80}>
                                                        Yêu cầu khác
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={80}>
                                                        Gói dịch vụ
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={80}>
                                                        Mức phí ứng viên
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={50}>
                                                        Bảo hành
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={50}>
                                                        Điều khoản thanh toán
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={50}>
                                                        File JD
                                                    </TableHeader>
                                                    <TableHeader tableType="TableHeader" width={50}>
                                                        Link job
                                                    </TableHeader>
                                                    <TableBody tableType="TableBody">
                                                        <tr>
                                                            <td className="overflow-hidden">
                                                                <div
                                                                    className="cell-custom mb10 mt10 text-center">
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {contract_request.title}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {contract_request.quantity_needed}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {contract_request.work_location}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {contract_request.interview_process}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {contract_request.experience_required}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {contract_request.other_requirements}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {`${contract_request.sku_id} - ${contract_request.sku_info?.name}`}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {utils.formatNumber(contract_request.unit_price, 0, ".", "đ")}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                {contract_request.duration_guarantee > 0 && (
                                                                    <div className="cell-custom mb10 mt10">
                                                                        {`${contract_request.duration_guarantee} Ngày`}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div className="cell-custom mb10 mt10">
                                                                    {contract_request.terms_of_payment}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div
                                                                    className="cell-custom text-center mb10 mt10 font-bold">
                                                                    {contract_request.file_url && (
                                                                        <a href={contract_request.file_url}
                                                                           target={"_blank"}>Xem
                                                                            chi
                                                                            tiết</a>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="overflow-hidden">
                                                                <div
                                                                    className="cell-custom text-center mb10 mt10 font-bold">
                                                                    {contract_request.file_url && (
                                                                        <a href={contract_request.file_url}
                                                                           target={"_blank"}>Xem
                                                                            chi
                                                                            tiết</a>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </TableBody>
                                                </TableComponent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailCampaign);
