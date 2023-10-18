import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/HeadhuntPage/ContractPage/ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
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
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {
    approveHeadhuntContract, confirmHeadhuntContract, createByContractCampaignHeadhunt,
    deleteHeadhuntContract, getListFullContractFormHeadhunt,
    getListHeadhuntContract, rejectHeadhuntContract, submitHeadhuntContract,
} from "api/headhunt";
import moment from "moment";
import config from "config";
import {Link} from "react-router-dom";
import queryString from "query-string";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import ListDetail from "./ListDetail";

const idKey = "CampaignDetailList";


class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 50,
                    accessor: "id"
                },
                {
                    title: "Khách hàng",
                    width: 200,
                    cell: row => <>{row.customer_id} - {row.customer_info?.company_name}</>
                },
                {
                    title: "Mã hợp đồng",
                    width: 90,
                    accessor: "code"
                },
                {
                    title: "Mẫu hợp đồng",
                    width: 110,
                    cell: row =>
                        <span>{this.state.contract_form.find(v => v.id === row.contract_form_id)?.name || ""}</span>
                },
                {
                    title: "Campaign",
                    width: 100,
                    cell: row => <>
                        {row.campaign_info?.map((v, i) => (
                            <div key={i}>
                                <Link
                                    to={`${Constant.BASE_URL_HEADHUNT_CAMPAIGN}?${queryString.stringify({
                                        q: v.name,
                                        action: "list"
                                    })}`}>
                                    <span className={"text-link"}>{`${v.id} - ${v.name}`}</span>
                                </Link>
                            </div>
                        ))}
                    </>
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_contract_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Người tạo",
                    width: 180,
                    accessor: "created_by"
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at)
                                .format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hành động",
                    width: 180,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.headhunt_contract_update}>
                             <span className="text-blue font-bold mr10 cursor-pointer"
                                   onClick={() => this.onEdit(row?.id)}>
                                   Sửa
                             </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_contract_approve}>
                                {row.status === Constant.HEADHUNT_CONTRACT_STATUS_CONFIRMED && (
                                    <span className="text-success font-bold mr10 cursor-pointer"
                                          onClick={() => this.onApprove(row?.id)}>
                                   Duyệt
                             </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_contract_submit}>
                                {row.status === Constant.HEADHUNT_CONTRACT_STATUS_DRAFT && (
                                    <span className="text-green font-bold mr10 cursor-pointer"
                                          onClick={() => this.onSubmit(row?.id)}>
                                   Hoàn thành
                             </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_contract_confirm}>
                                {row.status === Constant.HEADHUNT_CONTRACT_STATUS_SUBMITTED && (
                                    <span className="text-blue font-bold mr10 cursor-pointer"
                                          onClick={() => this.onConfirm(row?.id)}>
                                   Gửi y/c duyệt
                             </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_contract_reject}>
                                {row.status === Constant.HEADHUNT_CONTRACT_STATUS_CONFIRMED && (
                                    <span className="text-red font-bold mr10 cursor-pointer"
                                          onClick={() => this.onReject(row?.id)}>
                                   Không duyệt
                             </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_contract_send_recruiter}>
                                {[
                                    Constant.HEADHUNT_CONTRACT_STATUS_SUBMITTED,
                                    Constant.HEADHUNT_CONTRACT_STATUS_CONFIRMED,
                                    Constant.HEADHUNT_CONTRACT_STATUS_APPROVED
                                ].includes(row.status) && row.campaign_info.length === 0 && (
                                    <span className="text-green font-bold mr10 cursor-pointer"
                                          onClick={() => this.onSendRecruiter(row?.id)}>
                                  Gửi cho recruiter
                             </span>
                                )}
                            </CanRender>
                            <CanRender actionCode={ROLES.headhunt_contract_delete}>
                            <span className="text-danger font-bold cursor-pointer"
                                  onClick={() => this.onDelete(row?.id)}>
                                   Xóa
                             </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            contract_form: [],
        };
        this.onEdit = this._onEdit.bind(this);
        this.onApprove = this._onApprove.bind(this);
        this.onReject = this._onReject.bind(this);
        this.onSubmit = this._onSubmit.bind(this);
        this.onConfirm = this._onConfirm.bind(this);
        this.onSendRecruiter = this._onSendRecruiter.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onDownloadCVPerfect = this._onDownloadCVPerfect.bind(this);
        this.onDownloadMassRecruiter = this._onDownloadMassRecruiter.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_CONTRACT,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_CONTRACT,
            search: '?action=edit&id=' + id
        });
    }

    async _onSendRecruiter(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc chắn muốn gửi yêu cầu tuyển dụng hợp đồng này cho Recruiter?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await createByContractCampaignHeadhunt({contract_id: id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onApprove(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await approveHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onReject(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn không duyệt hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await rejectHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onSubmit(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn hoàn thành hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await submitHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    async _onConfirm(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: "Bạn có chắc muốn gửi yêu cầu duyệt hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await confirmHeadhuntContract({id});
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
            title: "Bạn có chắc muốn xóa hợp đồng?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.setState({loading: true});
                const res = await deleteHeadhuntContract({id});
                if (res) {
                    actions.putToastSuccess(("Thao tác thành công"));
                    actions.hideSmartMessageBox();
                    publish(".refresh", {}, idKey)
                }
            }
        });
    }

    _onDownloadCVPerfect() {
        window.open(`${config.apiHeadHuntDomain}/file-download/hd-cv-perfect.docx`);
    }

    _onDownloadMassRecruiter() {
        window.open(`${config.apiHeadHuntDomain}/file-download/hd-mass-recruitment-show-up.docx`);
    }

    async _asyncData() {
        const res = await getListFullContractFormHeadhunt();
        if (res) {
            this.setState({contract_form: res})
        }
    }

    componentDidMount() {
        this._asyncData();
    }

    render() {
        const {columns, contract_form} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}
                                options={{contract_form}}/>
                )}
                title="Danh Sách Hợp Đồng"
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.headhunt_contract_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                        <button type="button" className="el-button el-button-info el-button-small"
                                onClick={this.onDownloadCVPerfect}>
                            <span><i className="glyphicon glyphicon-download mr10"/>Tải mẫu hợp đồng CV Perfect</span>
                        </button>
                        <button type="button" className="el-button el-button-info el-button-small"
                                onClick={this.onDownloadMassRecruiter}>
                            <span><i className="glyphicon glyphicon-download mr10"/>Tải mẫu hợp đồng Mass Recruiter + Show Up</span>
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
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntContract}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                      expandRow={row => <ListDetail contract_id={row.id} />}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(List);
