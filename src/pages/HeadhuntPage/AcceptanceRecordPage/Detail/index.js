import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {publish, subscribe} from "utils/event";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {
    approveHeadhuntAcceptanceRecord,
    confirmHeadhuntAcceptanceRecord,
    deleteHeadhuntAcceptanceRecord,
    deleteHeadhuntAcceptanceRecordDetail,
    getListFullHeadhuntAcceptanceRecordDetail, getListFullHeadhuntSalesOrderItem, printHeadhuntAcceptanceRecord,
    rejectHeadhuntAcceptanceRecord,
    submitHeadhuntAcceptanceRecord,
} from "api/headhunt";
import moment from "moment";
import config from "config";
import PopupAcceptanceRecordPackage from "pages/HeadhuntPage/AcceptanceRecordPage/Popup/PopupAcceptanceRecordPackage";
import PopupPrint from ".././Popup/PopupPrint";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {HEADHUNT_ACCEPTANCE_RECORD_TYPE_GUARANTEE} from "utils/Constant";
import UploadFile from "pages/HeadhuntPage/AcceptanceRecordPage/Detail/UploadFile";

const idKey = "AcceptanceList"

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: true,
            sales_order_item: [],
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.refreshList();
        }, idKey));
        this.btnDelete = this._btnDelete.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnSubmit = this._btnSubmit.bind(this);
        this.btnConfirm = this._btnConfirm.bind(this);
        this.btnReject = this._btnReject.bind(this);
        this.btnAddDetail = this._btnAddDetail.bind(this);
        this.btnEditDetail = this._btnEditDetail.bind(this);
        this.btnDeleteDetail = this._btnDeleteDetail.bind(this);
        this.showHide = this._showHide.bind(this);
        this.btnDownload = this._btnDownload.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.btnPrint = this._btnPrint.bind(this);
    }

    _btnAddDetail() {
        const {uiAction, sales_order, item} = this.props;
        const {sales_order_item} = this.state;
        uiAction.createPopup(PopupAcceptanceRecordPackage, "Thêm Applicant", {
            sales_order,
            acceptance_record_id: item.id,
            idKey,
            sales_order_item
        });
    }

    _btnEditDetail(id) {
        const {uiAction, sales_order, item} = this.props;
        const {sales_order_item} = this.state;
        uiAction.createPopup(PopupAcceptanceRecordPackage, "Chỉnh sửa Applicant", {
            sales_order,
            acceptance_record_id: item.id,
            idKey,
            id,
            sales_order_item
        });
    }

    _btnDownload() {
        window.open(`${config.apiHeadHuntDomain}/file-download/mau-bbnt.docx`);
    }

    async _btnPrint() {
        const {uiAction, id} = this.props;
        uiAction.showLoading();
        const res = await printHeadhuntAcceptanceRecord({id, type: "html"});
        if (res) {
            uiAction.createPopup(PopupPrint, "Xem trước biên bản nghiệm thu", {id, html: res}, 'popup-preview-a4');
        }
        uiAction.hideLoading();
    }

    async _btnDelete(id) {
        const {uiAction, history} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa biên bản nghiệm thu?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteHeadhuntAcceptanceRecord({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    history.push({
                        pathname: Constant.BASE_URL_HEADHUNT_ACCEPTANCE_RECORD,
                    })
                }
                uiAction.hideLoading();
            }
        });
    }

    async _btnSubmit(id) {
        const {uiAction, idKeyDetail} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn hoàn thành biên bản nghiệm thu?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await submitHeadhuntAcceptanceRecord({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKeyDetail);
                }
                uiAction.hideLoading();
            }
        });
    }

    async _btnConfirm(id) {
        const {uiAction, idKeyDetail} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn gửi YC duyệt biên bản nghiệm thu?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await confirmHeadhuntAcceptanceRecord({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKeyDetail);
                }
                uiAction.hideLoading();
            }
        });
    }

    async _btnApprove(id) {
        const {uiAction, idKeyDetail} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt biên bản nghiệm thu?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await approveHeadhuntAcceptanceRecord({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKeyDetail);
                }
                uiAction.hideLoading();
            }
        });
    }

    async _btnReject(id) {
        const {uiAction, idKeyDetail} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn không duyệt biên bản nghiệm thu?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await rejectHeadhuntAcceptanceRecord({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKeyDetail);
                }
                uiAction.hideLoading();
            }
        });
    }

    async _btnDeleteDetail(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa biên bản nghiệm thu của ứng viên này?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteHeadhuntAcceptanceRecordDetail({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKey);
                }
                uiAction.hideLoading();
            }
        });
    }

    async _refreshList() {
        this.setState({loading: true});
        const {id, sales_order} = this.props;

        const [resListDetail, resSOItem] = await Promise.all([
            getListFullHeadhuntAcceptanceRecordDetail({acceptance_record_id: id}),
            getListFullHeadhuntSalesOrderItem({sales_order_id: sales_order.id})
        ])
        if (resListDetail) {
            this.setState({data_list: resListDetail, loading: false})
        }
        if (resSOItem) {
            const sales_order_item = resSOItem.map(v => ({value: v.id, label: `${v.id} - ${v.sku_info?.name} - ${v.amount_total_due > 0 ? utils.formatNumber(v.amount_total_due, 0, ".", "đ") : "0đ"}`}));
            this.setState({sales_order_item});
        }
    }

    _showHide() {
        this.setState({show_detail: !this.state.show_detail});
    }

    componentDidMount() {
        this.refreshList();
    }

    render() {
        let {data_list, show_detail, sales_order_item} = this.state;
        let {item, id, sales_order} = this.props;

        return (
            <div className="col-result-full crm-section mt20">
                <CanRender actionCode={ROLES.headhunt_acceptance_record_submit}>
                    {[
                        Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_DRAFT,
                    ].includes(parseInt(item.status)) && (
                        <button type="button"
                                className="el-button el-button-success el-button-small"
                                onClick={() => this.btnSubmit(item.id)}>
                            <span>Hoàn thành</span>
                        </button>
                    )}
                </CanRender>
                <CanRender actionCode={ROLES.headhunt_acceptance_record_delete}>
                    {[
                        Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_DRAFT,
                        Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_SUBMITTED,
                        Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_CONFIRMED,
                    ].includes(parseInt(item.status)) && (
                        <button type="button"
                                className="el-button el-button-bricky el-button-small"
                                onClick={() => this.btnDelete(item.id)}>
                            <span>Xóa</span>
                        </button>
                    )}
                </CanRender>
                <CanRender actionCode={ROLES.headhunt_acceptance_record_confirm}>
                    {[
                        Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_SUBMITTED,
                    ].includes(parseInt(item.status)) && (
                        <button type="button"
                                className="el-button el-button-success el-button-small"
                                onClick={() => this.btnConfirm(item.id)}>
                            <span>Gửi YC duyệt</span>
                        </button>
                    )}
                </CanRender>
                <CanRender actionCode={ROLES.headhunt_acceptance_record_approve}>
                    {[
                        Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_CONFIRMED,
                    ].includes(parseInt(item.status)) && (
                        <button type="button"
                                className="el-button el-button-success el-button-small"
                                onClick={() => this.btnApprove(item.id)}>
                            <span>Duyệt</span>
                        </button>
                    )}
                </CanRender>
                <CanRender actionCode={ROLES.headhunt_acceptance_record_reject}>
                    {[
                        Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_CONFIRMED,
                    ].includes(parseInt(item.status)) && (
                        <button type="button"
                                className="el-button el-button-bricky el-button-small"
                                onClick={() => this.btnReject(item.id)}>
                            <span>Không duyệt</span>
                        </button>
                    )}
                </CanRender>
                <div className="box-card box-full">
                    <div className="box-card-title pointer box-package" onClick={this.showHide}>
                        <span className="title left">Biên bản nghiệm thu</span>
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
                                    <LoadingSmall/>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <div className="left">
                                        <CanRender actionCode={ROLES.headhunt_acceptance_record_update}>
                                            {[
                                                Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_DRAFT,
                                            ].includes(parseInt(this.props.item.status)) && (
                                                <button type="button"
                                                        className="el-button el-button-primary el-button-small"
                                                        onClick={this.btnAddDetail}>
                                                    <span>Thêm ứng viên <i className="glyphicon glyphicon-plus"/></span>
                                                </button>
                                            )}
                                        </CanRender>
                                        <button type="button"
                                                className="el-button el-button-info el-button-small"
                                                onClick={this.btnDownload}>
                                            <span>Tải mẫu biên bản nghiệm thu <i
                                                className="glyphicon glyphicon-download"/></span>
                                        </button>
                                        <CanRender actionCode={ROLES.headhunt_acceptance_record_print}>
                                            <button type="button"
                                                    className="el-button el-button-warning el-button-small"
                                                    onClick={this.btnPrint}>
                                                <span>In biên bản nghiệm thu <i className="glyphicon glyphicon-print"/></span>
                                            </button>
                                        </CanRender>
                                    </div>
                                    <div className="right">
                                        <button type="button" className="bt-refresh el-button" onClick={() => {
                                            this.refreshList()
                                        }}>
                                            <i className="fa fa-refresh"/>
                                        </button>
                                    </div>
                                    <div className="crm-section">

                                        <div className="body-table el-table">
                                            <div>
                                                <UploadFile item={item} sales_order_id={sales_order.id} id={id}/>
                                            </div>
                                            <TableComponent className="table-custom">
                                                <TableHeader tableType="TableHeader" width={200}>
                                                    Tên ứng viên
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={200}>
                                                    Vị trí ứng tuyển
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={80}>
                                                    ID Hợp đồng
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={100}>
                                                    Mã Recruitment Request
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Ngày hoàn thành
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Tình trạng
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Thông tin bảo hành
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Recruiter
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Mức phí dịch vụ
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}>
                                                    Item
                                                </TableHeader>
                                                <TableHeader tableType="TableHeader" width={120}/>
                                                <TableBody tableType="TableBody">
                                                    {data_list?.map((item, key) => {
                                                        return (
                                                            <React.Fragment key={key}>
                                                                <tr>
                                                                    <td className="overflow-hidden">
                                                                        <div className="cell-custom mb10 mt10">
                                                                            {item.applicant_info?.seeker_name}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div className="cell-custom mb10 mt10">
                                                                            {item.contract_request_info ? `${item.contract_request_info.id} - ${item.contract_request_info.title}` :  item.acceptance_position}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div
                                                                            className="cell-custom mb10 mt10 text-center">
                                                                            {item.contract_id}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div
                                                                            className="cell-custom mb10 mt10 text-center">
                                                                            {item.recruitment_request_id > 0 ? item.recruitment_request_id : ""}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div
                                                                            className="cell-custom text-center mb10 mt10">
                                                                            {item.acceptance_date_confirmed ? moment.unix(item.acceptance_date_confirmed).format("DD/MM/YYYY") : ""}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div
                                                                            className="cell-custom text-center mb10 mt10">
                                                                            {item.acceptance_status}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        {item.guarantee_applicant_info ? (
                                                                            <div
                                                                                className="cell-custom text-center mb10 mt10">
                                                                                <SpanCommon
                                                                                    idKey={Constant.COMMON_DATA_KEY_headhunt_acceptance_record_type}
                                                                                    value={item?.type} notStyle/>
                                                                                {item.type === Constant.HEADHUNT_ACCEPTANCE_RECORD_TYPE_GUARANTEE && (
                                                                                    <span>
                                                                                    {` - ${item.guarantee_applicant_info.id} - ${item.guarantee_applicant_info.seeker_name}`}
                                                                                </span>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                className="cell-custom text-center mb10 mt10">
                                                                                Nghiệm thu mới
                                                                            </div>
                                                                        )}

                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div
                                                                            className="cell-custom text-center mb10 mt10">
                                                                            {item.recruiter_staff_login_name}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div
                                                                            className="cell-custom text-center mb10 mt10">
                                                                            {item.acceptance_fee > 0 ? utils.formatNumber(item.acceptance_fee, 0, ".", "đ") : "0đ"}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        <div
                                                                            className="cell-custom text-center mb10 mt10">
                                                                            {sales_order_item?.find(v => v.value === item.sales_order_item_id)?.label}
                                                                        </div>
                                                                    </td>
                                                                    <td className="overflow-hidden">
                                                                        {[
                                                                            Constant.HEADHUNT_ACCEPTANCE_RECORD_STATUS_DRAFT,
                                                                        ].includes(parseInt(this.props.item.status)) && (
                                                                            <div
                                                                                className="cell-custom text-center mb10 mt10">
                                                                            <span
                                                                                className="text-link text-blue font-bold"
                                                                                onClick={() => this.btnEditDetail(item?.id)}>
                                                                                Chỉnh sửa
                                                                            </span>
                                                                                <span
                                                                                    className="text-danger font-bold ml10 cursor-pointer text-underline"
                                                                                    onClick={() => this.btnDeleteDetail(item?.id)}>
                                                                                Xóa
                                                                            </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                </tr>
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

export default connect(mapStateToProps, mapDispatchToProps)(index);
