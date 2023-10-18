import React, { Component } from "react";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import PopupAddEdit from "./PopupAddEdit";
import PopupReject from "./PopupRejectCampaign";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { publish } from "utils/event";
import { getAccountServiceSearchResumeCampaignList, changeStatusAccountServiceSearchResumeCampaign } from "api/mix";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup } from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import * as Constant from "utils/Constant";
const idKey = Constant.IDKEY_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN;
import * as utils from "utils/utils";

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = { ...{ action: 'detail' } };
        this.state = {
            columns: [
                {
                    title: "Id",
                    width: 70,
                    accessor: "id"
                },
                {
                    title: "Tên campaign",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Kênh",
                    width: 100,
                    cell: row => (
                        <span>
                            {row?.channel_code && Constant.CHANNEL_LIST[row?.channel_code]}
                        </span>
                    )
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 250,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({ ...paramsQuery, ...{ id: row?.employer_id } })}`}>
                            <span>{row?.employer_id} - {row?.employer_name}</span>
                        </Link>
                    )
                },
                {
                    title: "CSKH Account Service",
                    width: 150,
                    accessor: "account_service_assigned_username"
                },
                {
                    title: "Số CVs yêu cầu",
                    width: 110,
                    accessor: "quantity_cv",
                    cell: row => {
                        return utils.formatNumber(row?.quantity_cv, 0, ",", "")
                    }
                },
                {
                    title: "Số CVs đã gửi",
                    width: 110,
                    cell: row => {
                        return utils.formatNumber(row?.total_sent, 0, ",", "")
                    }
                },

                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row => {
                        return (<SpanCommon idKey={Constant.COMMON_DATA_KEY_status_campaign_search_resume} value={row?.status} />)
                    }
                },
                {
                    title: "Hành động",
                    width: 280,
                    cell: row => (
                        <>
                            {
                                <Link
                                    to={`${Constant.BASE_URL_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN}?${queryString.stringify({ ...paramsQuery, ...{ id: row.id } })}`}>
                                    <span className="text-link text-blue font-bold mr10"
                                    >
                                        Chi tiết
                                    </span>
                                </Link>
                            }
                            {
                                (row.status == Constant.AS_FILTER_RESUME_CAMPAIGN_INACTIVE || row.status == Constant.AS_FILTER_RESUME_CAMPAIGN_ACTIVE) &&
                                <span className="text-link text-blue font-bold mr10"
                                    onClick={() => { this.onClickEdit(row) }}>
                                    Chỉnh sửa
                                </span>
                            }
                            {
                                row.status == Constant.AS_FILTER_RESUME_CAMPAIGN_INACTIVE &&
                                <span className="text-link text-green font-bold mr10" onClick={() => this.changeStatus(row?.id, Constant.AS_FILTER_RESUME_CAMPAIGN_ACTIVE)}>
                                    Duyệt
                                </span>
                            }
                            {
                                row.status == Constant.AS_FILTER_RESUME_CAMPAIGN_INACTIVE &&
                                <span className="text-link text-red font-bold mr10" onClick={() => this._rejectCampaign(row)}>
                                    Không duyệt
                                </span>
                            }
                        </>
                    )
                }
            ],
            loading: false,
        };
        this.changeStatus = this._changeStatus.bind(this);
        this.rejectCampaign = this._rejectCampaign.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
        this.onClickDetail = this._onClickDetail.bind(this);
    }

    _onClickDetail(id) {

    }

    _onClickAdd() {
        const { actions } = this.props;
        actions.createPopup(PopupAddEdit, "Thêm campaign", { idKey: idKey });
    }

    _onClickEdit(detail) {
        const { actions } = this.props;
        actions.createPopup(PopupAddEdit, "Chỉnh sửa campaign", { detail: detail, idKey: idKey });
    }

    _rejectCampaign(detail) {
        const { actions } = this.props;
        actions.createPopup(PopupReject, "Không duyệt campagin", { id: detail?.id, idKey: idKey });
    }

    _changeStatus(id, status) {
        const { actions } = this.props;
        const name = (status === Constant.AS_FILTER_RESUME_CAMPAIGN_ACTIVE) ? "duyệt" : "không duyệt";
        actions.SmartMessageBox({
            title: `Bạn có chắc muốn ${name} campaign Id: ${id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await changeStatusAccountServiceSearchResumeCampaign({ id, status });
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey)
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    render() {
        const { columns } = this.state;
        const { query, defaultQuery, history } = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter} />
                )}
                title="Danh sách campaign"
                buttons={(

                    <div className="left btnCreateNTD">
                        <button
                            type="button"
                            className="el-button el-button-primary el-button-small"
                            onClick={this.onClickAdd}
                        >
                            <span>Thêm mới <i className="glyphicon glyphicon-plus" /></span>
                        </button>
                    </div>
                )}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh" />
                    </button>
                )}
            >
                <Gird
                    idKey={idKey}
                    fetchApi={getAccountServiceSearchResumeCampaignList}
                    columns={columns}
                    query={query}
                    defaultQuery={defaultQuery}
                    history={history}
                    isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
