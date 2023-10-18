import React, {Component} from "react";
import {connect} from "react-redux";
import {publish, subscribe} from "utils/event";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import {
    approveHeadhuntContractAppendix,
    deleteHeadhuntContractAppendix,
    getListFullHeadhuntContractAppendix,
} from "api/headhunt";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Default from "components/Layout/Page/Default";
import AddContractAppendix from "pages/HeadhuntPage/ContractPage/Popup/AddContractAppendix";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import config from "config";

const idKey = "ContractDetailList";


class ListDetail extends Component {
    constructor(props) {
        super(props);
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
        this.state = {
            data_list: [],
        };
        this.onEdit = this._onEdit.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.asyncData = this._asyncData.bind(this);
        this.onDownloadCVPerfect = this._onDownloadCVPerfect.bind(this);
        this.onDownloadMassRecruiter = this._onDownloadMassRecruiter.bind(this);
    }

    async _asyncData() {
        const {contract_id} = this.props;
        const res = await getListFullHeadhuntContractAppendix({contract_id});
        if (res) {
            this.setState({data_list: res})
        }
    }

    _onClickAdd() {
        const {actions, history, contract_id} = this.props;
        actions.createPopup(AddContractAppendix, 'Thêm phụ lục hợp đồng', {idKey, history, contract_id})
    }

    _onEdit(id) {
        const {actions, history, contract_id} = this.props;
        actions.createPopup(AddContractAppendix, 'Chỉnh sửa phụ lục hợp đồng', {idKey, history, contract_id, id})
    }

    async _onApprove(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt phụ lục hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await approveHeadhuntContractAppendix({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn xóa phụ lục hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await deleteHeadhuntContractAppendix({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }
    _onDownloadCVPerfect() {
        window.open(`${config.apiHeadHuntDomain}/file-download/plhd-cv-perfect.docx`);
    }
    _onDownloadMassRecruiter() {
        window.open(`${config.apiHeadHuntDomain}/file-download/plhd-mass-recruitment-show-up.docx`);
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {data_list} = this.state;
        return (
            <Default
                title="Phụ lục hợp đồng"
                buttons={(
                    <div className="left btnCreateNTD">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                        <button type="button" className="el-button el-button-info el-button-small"
                                onClick={this.onDownloadCVPerfect}>
                            <span><i className="glyphicon glyphicon-download mr10"/>Tải mẫu PLHĐ CV Perfect</span>
                        </button>
                        <button type="button" className="el-button el-button-info el-button-small"
                                onClick={this.onDownloadMassRecruiter}>
                            <span><i className="glyphicon glyphicon-download mr10"/>Tải mẫu PLHĐ Mass Recruiter + Show Up</span>
                        </button>
                    </div>
                )}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <div className="body-table el-table crm-section">
                    <TableComponent>
                        <TableHeader tableType="TableHeader" width={50}>
                            ID
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}>
                            Tên phụ lục
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}>
                            File phụ lục
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}>
                            Trạng thái
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}>
                            Người tạo
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}>
                            Người ngày tạo
                        </TableHeader>
                        <TableHeader tableType="TableHeader" width={100}/>
                        <TableBody tableType="TableBody">
                            {data_list.map((item, key) => {
                                return (
                                    <React.Fragment key={key}>
                                        <tr>
                                            <td>
                                                <div className="cell">{item.id}</div>
                                            </td>
                                            <td>
                                                <div className="cell">{item.name}</div>
                                            </td>
                                            <td>
                                                <div className="cell"><a href={item.contract_appendix_url}
                                                                         target={"_blank"}>File</a></div>
                                            </td>
                                            <td>
                                                <div className="cell">
                                                    <SpanCommon
                                                        idKey={Constant.COMMON_DATA_KEY_headhunt_contract_status}
                                                        value={Number(item?.status)}/></div>
                                            </td>
                                            <td>
                                                <div className="cell">{item.created_at}</div>
                                            </td>
                                            <td>
                                                <div className="cell">{item.created_by}</div>
                                            </td>
                                            <td>
                                                <div className="cell">
                                                     <span className="text-blue font-bold mr10 cursor-pointer"
                                                           onClick={() => this.onEdit(item?.id)}>
                                                           Sửa
                                                     </span>
                                                    {item.status === Constant.HEADHUNT_CONTRACT_STATUS_INACTIVE && (
                                                        <span className="text-success font-bold mr10 cursor-pointer"
                                                              onClick={() => this.onApprove(item?.id)}>
                                                               Duyệt
                                                         </span>
                                                    )}
                                                    <span className="text-danger font-bold cursor-pointer"
                                                          onClick={() => this.onDelete(item?.id)}>
                                                           Xóa
                                                     </span>̵
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )
                            })}
                        </TableBody>
                    </TableComponent>
                </div>
            </Default>

        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDetail);
