import React, { Component } from "react";
import moment from "moment";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import PopupAddEdit from "./PopupAddEdit";
import PopupChangeStatus from "./PopupUpdateStatus";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { publish } from "utils/event";
import { getAccountServiceCampaignList, changeStatusAccountServiceCampaign } from "api/mix";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup } from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

const idKey = Constant.IDKEY_ACCOUNT_SERVICE_CAMPAIGN_LIST;

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = { ...{ action: 'detail' } };
        this.state = {
            columns: [
                {
                    title: "Id",
                    width: 40,
                    accessor: "id"
                },
                {
                    title: "Tên campaign",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Kênh",
                    width: 110,
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
                    title: "Thông tin gói dịch vụ",
                    width: 250,
                    cell: row => (
                        <>
                            <span>{row?.registration_account_service_id} - {Constant.NAME_ACCOUNT_SERVICE} - </span>
                            <Link to={`${Constant.BASE_URL_JOB}?${queryString.stringify({ ...paramsQuery, ...{ id: row?.job_id } })}`}>
                                <span>{row?.job_name}</span>
                            </Link>
                        </>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row => {
                        return (<SpanCommon idKey={Constant.COMMON_DATA_KEY_status_campaign} value={row?.status} />)
                    }
                },
                {
                    title: "Ghi chú",
                    width: 150,
                    accessor: "note"
                },
                {
                    title: "Ngày bắt đầu",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.start_at).format("DD-MM-YYYY")}</>
                    }
                },
                {
                    title: "Ngày kết thúc",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.end_at).format("DD-MM-YYYY")}</>
                    }
                },
                {
                    title: "Applicant",
                    width: 80,
                    cell: row => (
                        <>
                            <Link to={`${Constant.BASE_URL_ACCOUNT_SERVICE_APPLICANT}?${queryString.stringify({ campaign_id: row?.id })}`}>
                                <span>{row?.total_applicant}</span>
                            </Link>
                        </>
                    )
                },
                {
                    title: "Hành động",
                    width: 165,
                    cell: row => (
                        <>
                            {
                                row.status == Constant.CAMPAIGN_NEW &&
                                <span className="text-link text-warning font-bold mr10"
                                    onClick={() => { this.onClickEdit(row) }}>
                                    Chỉnh sửa
                                </span>
                            }
                            {
                                row.status == Constant.CAMPAIGN_NEW &&
                                <span className="text-link text-green font-bold mr10" onClick={() => this.changeStatus(row?.id, Constant.CAMPAIGN_DOING)}>
                                    Đang xử lý
                                </span>
                            }
                            {
                                row.status == Constant.CAMPAIGN_DOING &&
                                <span className="text-link text-brown font-bold mr10" onClick={() => this.changeStatus(row?.id, Constant.CAMPAIGN_DONE)}>
                                    Hoàn thành
                                </span>
                            }
                        </>
                    )
                }
            ],
            loading: false,
        };
        this.changeStatus = this._changeStatus.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
		  this.onChangeStatus = this._onChangeStatus.bind(this);
        this.onClickEdit = this._onClickEdit.bind(this);
    }

    _onClickAdd() {
        const { actions } = this.props;
        actions.createPopup(PopupAddEdit, "Thêm campaign", { isEdit: false, idKey: idKey });
    }

	 _onChangeStatus() {
		const { actions } = this.props;
		actions.createPopup(PopupChangeStatus, "Cập nhật trạng thái campaign", { idKey: idKey });
  }

    _onClickEdit(detail) {
        const { actions } = this.props;
        actions.createPopup(PopupAddEdit, "Chỉnh sửa campaign", { isEdit: true, detail: detail, idKey: idKey });
    }

    _changeStatus(id, status) {
        const { actions } = this.props;
        const name = (status === Constant.CAMPAIGN_DOING) ? "đang xử lý" : (status === Constant.CAMPAIGN_DONE) ? "hoàn thành" : ""
        actions.SmartMessageBox({
            title: `Bạn có chắc muốn ${name} campaign Id: ${id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await changeStatusAccountServiceCampaign({ id, status });
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
						<>
						<div className="left btnCreateNTD">
                        <button
                            type="button"
                            className="el-button el-button-primary el-button-small"
                            onClick={this.onClickAdd}
                        >
                            <span>Thêm mới <i className="glyphicon glyphicon-plus" /></span>
                        </button>
                    </div>
						  <CanRender  actionCode={ROLES.account_service_campaign_change_status}>
								<div className="left btnCreateNTD">
										<button
											type="button"
											className="el-button el-button-bricky el-button-small"
											onClick={this.onChangeStatus}
										>
											<span>Cập nhật trạng thái</span>
										</button>
								</div>
						  </CanRender>
						</>
                    
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
                    fetchApi={getAccountServiceCampaignList}
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
