import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import {publish, subscribe} from "utils/event";
import {
    deleteContractRequestHeadhunt,
    getListFullContractRequestHeadhunt,
} from "api/headhunt";
import PopupAddContractRequest from "pages/HeadhuntPage/ContractPage/Popup/PopupAddContractRequest";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

const idKey = "ContractRequestItemsList"

class ContractRequestItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data_list: [],
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', () => {
            this.refreshList();
        }, idKey));
        this.refreshList = this._refreshList.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
    }

    async _refreshList(firstFetch) {
        const {id, asyncData} = this.props;
        if (!firstFetch) {
            asyncData();
        }
        const resList = await getListFullContractRequestHeadhunt({contract_id: id});
        if (resList) {
            this.setState({data_list: resList})
        }
        this.setState({loading: false})
    }

    _btnAdd() {
        const {uiAction, id: contract_id, detail} = this.props;
        uiAction.createPopup(PopupAddContractRequest, "Thêm yêu cầu tuyển dụng", {
            contract_id,
            idKey,
            contract_detail: detail
        })
    }

    _btnEdit(id) {
        const {uiAction, id: contract_id, detail} = this.props;
        uiAction.createPopup(PopupAddContractRequest, "Sửa yêu cầu tuyển dụng", {
            contract_id,
            id,
            idKey,
            contract_detail: detail,
        })
    }

    async _btnDelete(id) {
        const {uiAction} = this.props;
        uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa yêu cầu tuyển dụng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                const res = await deleteContractRequestHeadhunt({id});
                if (res) {
                    uiAction.hideSmartMessageBox();
                    uiAction.putToastSuccess("Thao tác thành công");
                    publish(".refresh", {}, idKey)
                }
                uiAction.hideLoading();
            }
        });
    }

    componentDidMount() {
        this.refreshList(true);
    }

    render() {
        let {data_list} = this.state;
        let {detail} = this.props;
        return (
            <div>
                {this.state.loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <div className="card-body">
                        <div className="left">
                            {detail?.status === Constant.HEADHUNT_CONTRACT_STATUS_DRAFT && (
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.btnAdd}>
                                    <span>Thêm <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            )}

                        </div>
                        <div className="crm-section">
                            <div className="body-table el-table">
                                <TableComponent className="table-custom">
                                    <TableHeader tableType="TableHeader" width={40}/>
                                    <TableHeader tableType="TableHeader" width={50}>
                                        ID
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={100}>
                                        Vị trí tuyển dụng
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Gói dịch vụ
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Số lượng cần tuyển
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={120}>
                                        Đơn giá ứng viên (Chưa bao gồm thuế)
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Thành tiền
                                    </TableHeader>
                                    <TableHeader tableType="TableHeader" width={80}>
                                        Chi tiết JD
                                    </TableHeader>
                                    <TableBody tableType="TableBody">
                                        {data_list?.map((item, key) => {
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr>
                                                        <td>

                                                            <div className="cell-custom mb10 mt10 text-center">
                                                                <i className="fa fa-edit cursor-pointer text-blue mr15"
                                                                   onClick={() => this.btnEdit(item.id)}/>
                                                                {detail?.status === Constant.HEADHUNT_CONTRACT_STATUS_DRAFT && (
                                                                    <i className="fa fa-trash cursor-pointer text-red"
                                                                       onClick={() => this.btnDelete(item.id)}/>
                                                                )}
                                                            </div>

                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {item.id}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {item.title}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {`${item.sku_id} - ${item.sku_info?.name}`}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {item.quantity_needed}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {utils.formatNumber(item.unit_price, 0, ".", "đ")}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell-custom mb10 mt10">
                                                                {utils.formatNumber(Number(item.amount_total), 0, ".", "đ")}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className="cell-custom text-center mb10 mt10 font-bold">
                                                                {item.file_url && (
                                                                    <a href={item.file_url} target={"_blank"}>Xem chi
                                                                        tiết</a>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </TableComponent>
                            </div>
                            {detail && (
                                <div className="mt30">
                                    <div className="row font-bold mb10">
                                        <div className="col-sm-9"/>
                                        <div className="col-sm-2">
                                            Tổng
                                        </div>
                                        <div className="col-sm-1 text-right">
                                            {utils.formatNumber(detail.amount_total, 0, ".", "đ")}
                                        </div>
                                    </div>
                                    <div className="row font-bold mb10">
                                        <div className="col-sm-9"/>
                                        <div className="col-sm-2">
                                            Thuế VAT 8%
                                        </div>
                                        <div className="col-sm-1 text-right">
                                            {utils.formatNumber(detail.amount_total_vat, 0, ".", "đ")}
                                        </div>
                                    </div>
                                    <div className="row font-bold mb10 text-red">
                                        <div className="col-sm-9"/>
                                        <div className="col-sm-2">
                                            Tổng giá trị hợp đồng (Tạm tính)
                                        </div>
                                        <div className="col-sm-1 text-right">
                                            {utils.formatNumber(detail.amount_total_due, 0, ".", "đ")}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(ContractRequestItems);
