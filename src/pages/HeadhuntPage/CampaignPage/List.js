import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/HeadhuntPage/CampaignPage/ComponentFilter";
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
import {getListHeadhuntCampaign, deleteHeadhuntCampaign, toggleHeadhuntCampaign} from "api/headhunt";
import {Link} from "react-router-dom";
import queryString from 'query-string';
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import PopupSourcer from "pages/HeadhuntPage/CampaignPage/Popup/PopupSourcer";

const idKey = "CampaignList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Mã campaign",
                    width: 100,
                    accessor: "name"
                },
                {
                    title: "Hợp đồng",
                    width: 150,
                    cell: row => (<div>
                        <Link
                            to={`${Constant.BASE_URL_HEADHUNT_CONTRACT}?${queryString.stringify({
                                q: row.contract_info?.id,
                                action: "list"
                            })}`}>
                            <span
                                className={"text-link"}>{row.contract_info?.code}</span>
                        </Link>
                    </div>)
                },
                {
                    title: "Recruiter",
                    width: 150,
                    cell: row => <div>
                        <div>{row.campaign_group_member_recruiter_main}</div>
                        {row.list_campaign_group_member_recruiter?.map((v, i) => <div key={i}>{v}</div>)}
                    </div>
                },
                {
                    title: "Source",
                    width: 100,
                    cell: row => row?.list_campaign_group_member_sourcer?.map((member, index) => <p className="mb0"
                                                                                                    key={index.toString()}>{member}</p>)
                },
                {
                    title: "Pass Warranty/Total",
                    width: 80,
                    cell: row => <div
                        className="text-center">{`${row.total_applicant_pass_warranty}/${row.total_applicant}`}</div>
                },
                {
                    title: "Hiệu quả sourcer",
                    width: 80,
                    onClick: () => {
                    },
                    cell: row => <div className="text-center"><span className="text-link"
                                                                    onClick={() => this.onClickViewSourcer(row.id)}>Xem</span>
                    </div>
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_campaign_status}
                                    value={row?.status}/>,
                },
                {
                    title: "Hành động",
                    width: 240,
                    cell: row => (
                        <>
                             <span className="text-link text-blue font-bold mr10"
                                   onClick={() => this.onEdit(row.id)}>
                                   Sửa
                             </span>
                            {row.status === Constant.EXPERIMENT_STATUS_ACTIVE && (
                                <span className="text-underline cursor-pointer text-warning font-bold mr10"
                                      onClick={() => this.onToggle(row?.id)}>
                                   Tắt
                                </span>
                            )}
                            {row.status !== Constant.EXPERIMENT_STATUS_ACTIVE && (
                                <>
                                    <span className="text-underline cursor-pointer text-success font-bold mr10"
                                          onClick={() => this.onToggle(row?.id)}>
                                        Bật
                                    </span>
                                    <span className="text-link text-red font-bold mr10"
                                          onClick={() => this.onDelete(row?.id)}>
                                        Xóa
                                    </span>
                                </>
                            )}
                            <CanRender actionCode={ROLES.headhunt_campaign_report}>
                                <Link
                                    to={`${Constant.BASE_URL_HEADHUNT_CAMPAIGN}?${queryString.stringify({
                                        id: row.id,
                                        action: "report"
                                    })}`}>
                                    <span className={"text-link mr10 font-bold"}>Xem báo cáo</span>
                                </Link>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };
        this.onEdit = this._onEdit.bind(this);
        this.onToggle = this._onToggle.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickViewSourcer = this._onClickViewSourcer.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_HEADHUNT_CAMPAIGN,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteHeadhuntCampaign({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _onToggle(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn thay đổi: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await toggleHeadhuntCampaign({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _onClickViewSourcer(id) {
        const {actions} = this.props;
        actions.createPopup(PopupSourcer, "Hiệu quả Sourcer", {id});
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Campaign"
                buttons={(
                    <div className="left btnCreateNTD">
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
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
                      fetchApi={getListHeadhuntCampaign}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
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
