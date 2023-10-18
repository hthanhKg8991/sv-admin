import React, { Component } from "react";
import { publish } from "utils/event";
import * as uiAction from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerFreemiumPage/ComponentFilter";
import { getListEmployerFreemium, approveEmployerFreemium } from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import PopupAddEmployerFreemium from "pages/CustomerCare/EmployerFreemiumPage/Popup/PopupAddEmployerFreemium";
import PopupDetailHistory from "pages/CustomerCare/EmployerFreemiumPage/Popup/PopupDetailHistory";
import PopupRemoveFreemium from "pages/CustomerCare/EmployerFreemiumPage/Popup/PopupRemoveFreemium";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import { hideSmartMessageBox, SmartMessageBox } from 'actions/uiAction';

const idKey = Constant.IDKEY_EMPLOYER_FREEMIUM_LIST;
class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = { ...{ action: 'detail' } };

        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 150,
                    onClick: () => { },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({ ...paramsQuery, ...{ id: row?.employer_id } })}`}>
                            <span>{row?.employer_id} - {row?.employer_name}</span>
                        </Link>
                    )
                },
                {
                    title: "Loại NTD",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                            value={row?.premium_status} />
                    )
                },
                {
                    title: "Nhãn",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                            value={row?.company_kind || row?.company_size} />
                    )
                },
                {
                    title: "Ngày đăng ký tài khoản",
                    width: 150,
                    time: true,
                    accessor: "employer_created_at",
                },
                {
                    title: "Ngày đăng ký Freemium",
                    width: 150,
                    time: true,
                    accessor: "created_at",
                },
                {
                    title: "Ngày vào giỏ",
                    width: 150,
                    time: true,
                    accessor: "assigning_changed_at",
                },
                {
                    title: "Mã số thuế",
                    width: 100,
                    accessor: "tax_code",
                },
                {
                    title: "Loại đăng ký",
                    width: 100,
                    time: true,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_freemium_is_new} value={row.is_new} />
                    )
                },
                {
                    title: "Trạng thái tài khoản",
                    width: 130,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                value={row?.employer_status} />{" "}
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status_suspect}
                                value={row?.suspect_status} />
                        </>
                    )
                },
                {
                    title:"Nguồn",
                    width:80,
                    cell:row=>(
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_is_type} value={row?.type}/>
                    )
                },
                {
                    title: "Trạng thái gán company",
                    width: 160,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_customer_status}
                            value={row.customer_status} />
                    )
                },
                {
                    title: "CSKH",
                    width: 120,
                    accessor: "assigned_staff_username",
                },
                {
                    title: "CSKH Account Service",
                    width: 120,
                    accessor: "account_service_username",
                },
                {
                    title: "Trạng thái freemium",
                    width: 120,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_freemium_status}
                                value={row?.status} />
                        </>
                    )
                },
                {
                    title: "Hành động",
                    width: 210,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.customer_care_employer_freemium_history}>
                                <span className="text-link text-warning font-bold mr10"
                                    onClick={() => { this.btnDetail(row) }}>
                                    Xem
                                </span>
                            </CanRender>
                            {
                                (row?.status === Constant.EMPLOYER_FREEMIUM_REMOVE) &&
                                <CanRender actionCode={ROLES.customer_care_employer_freemium_approve}>
                                    <span className="text-link text-blue font-bold mr10"
                                        onClick={() => { this.btnApprove(row) }}>
                                        Bật freemium
                                    </span>
                                </CanRender>
                            }
                            {
                                row?.status !== Constant.EMPLOYER_FREEMIUM_REMOVE &&
                                <CanRender actionCode={ROLES.customer_care_employer_freemium_remove}>
                                    <span className="text-link text-red font-bold"
                                        onClick={() => { this.btnRemove(row) }}>
                                        Hạ Freemium
                                    </span>
                                </CanRender>
                            }
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onRedirect = this._onRedirect.bind(this);
        this.onClickAdd = this._onClickAdd.bind(this);
        this.btnApprove = this._btnApprove.bind(this);
        this.btnRemove = this._btnRemove.bind(this);
        this.btnDetail = this._btnDetail.bind(this);
    }

    _onRedirect = (row) => {
        const { history } = this.props;
        history.push({
            pathname: Constant.BASE_URL_SALES_ORDER,
            search: `?page=1&per_page=10&q=${row?.employer_id}`
        });
    }

    _onClickAdd() {
        this.props.uiAction.createPopup(PopupAddEmployerFreemium, "Thêm NTD Freemium", {});
    }

    _btnApprove(row) {
        const { uiAction } = this.props;
        uiAction.SmartMessageBox({
            title: `Bạn có chắc muốn xác nhận NTD này đủ điều kiện tiếp tục tham gia Freemium ID: ${row.employer_id}`,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                uiAction.showLoading();
                uiAction.hideSmartMessageBox();
                const res = await approveEmployerFreemium({
                    employer_id: row.employer_id,
                    reason: ""
                });
                if (res) {
                    uiAction.putToastSuccess("Thao tác thành công!");
                    publish('.refresh', {}, idKey);
                }

                uiAction.hideLoading();
            }
        });
    }

    _btnRemove(row) {
        this.props.actions.SmartMessageBox({
            title: 'Thông báo nhắc nhở',
            content: "Khi hạ tài khoản NTD Freemium, hệ thống sẽ hạ TẤT CẢ tin đăng Freemium của NTD",
            buttons: ['Đóng', 'Xác Nhận']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Xác Nhận") {
                this.props.uiAction.createPopup(PopupRemoveFreemium, "Hạ Freemium", { employer_id: row?.employer_id || [] });
            }
            this.props.actions.hideSmartMessageBox();
        });
    }

    async _btnDetail(row) {
        const { query } = this.props;
        this.props.uiAction.createPopup(PopupDetailHistory, "Lịch sử thao tác", { employer_id: row.employer_id, nameEmployer: row?.employer_name, query: query });
    }

    render() {
        const { columns } = this.state;
        const { query, history } = this.props;

        return (
            <div className={"row mt15"}>
                <div className={"col-md-12"}>
                    <Default
                        left={(
                            <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter} />
                        )}
                        title="Danh Sách NTD Freemium"
                        titleActions={(
                            <button type="button" className="bt-refresh el-button" onClick={() => {
                                publish(".refresh", {}, idKey)
                            }}>
                                <i className="fa fa-refresh" />
                            </button>
                        )}
                        buttons={
                            <CanRender actionCode={ROLES.customer_care_employer_freemium_create}>
                                <div className="left btnCreateNTD">
                                    <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                        <span>Thêm NTD Freemium <i className="glyphicon glyphicon-plus" /></span>
                                    </button>
                                </div>
                            </CanRender>
                        }>
                        <Gird idKey={idKey}
                            fetchApi={getListEmployerFreemium}
                            query={query}
                            columns={columns}
                            defaultQuery={{}}
                            history={history}
                            isRedirectDetail={false}
                        />
                    </Default>
                </div>
            </div>
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
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
