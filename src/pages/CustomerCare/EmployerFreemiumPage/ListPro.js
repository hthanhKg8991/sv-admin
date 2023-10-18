import React, { Component } from "react";
import * as uiAction from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import ComponentFilterPro from "pages/CustomerCare/EmployerFreemiumPage/ComponentFilterPro";
import { getListEmployerFreemiumPro, getDetailEmployerFreemiumPro } from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import PopupDetailPro from "pages/CustomerCare/EmployerFreemiumPage/Popup/PopupDetailPro";
import PopupChangeStatus from "pages/CustomerCare/EmployerFreemiumPage/Popup/PopupChangeStatus";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import Default from "components/Layout/Page/Default";
import { publish } from "utils/event";

const idKey = "EmployerFreemiumProList";
class ListPro extends Component {
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
                    title: "Ngày đăng ký",
                    width: 100,
                    accessor: "created_at",
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_freemium_pro_status}
                                value={row?.status} />
                        </>
                    )
                },
                {
                    title: "CSKH",
                    width: 120,
                    accessor: "assigned_staff_username",
                },
                {
                    title: "Hành động",
                    width: 210,
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.customer_care_employer_freemium_view_pro_detail}>
                                <span className="text-link text-warning font-bold mr10"
                                onClick={() => { this.btnDetail(row) }}>
                                    Xem chi tiết
                                 </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.customer_care_employer_freemium_update_pro_status}>
                                <span className="text-link text-warning font-bold mr10"
                                    onClick={() => { this.btnChangeStatus(row) }}>
                                    Thay đổi trạng thái
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
        };
        
        this.btnChangeStatus = this._btnChangeStatus.bind(this);
        this.btnDetail = this._btnDetail.bind(this);
    }

    _btnChangeStatus(row) {
        const {uiAction} = this.props
        uiAction.createPopup(PopupChangeStatus, "Thay đổi trạng thái", { id: row?.id,status: row?.status,idKey:idKey });
    }

    async _btnDetail(row) {
        const res = await getDetailEmployerFreemiumPro({ id: row.id });

        this.props.uiAction.createPopup(PopupDetailPro, "Thông tin chi tiết đăng ký pro", { items: res || [] });
    }

    render() {
        const { columns } = this.state;
        const { query, history } = this.props;

        return (
            <React.Fragment>
                <div className={"row mt15"}>
                    <div className={"col-md-12 paddingLeft0 paddingRight30"}>
                        <Default
                            titleActions={(
                                <button type="button" className="bt-refresh el-button" onClick={() => {
                                    publish(".refresh", {}, idKey)
                                }}>
                                    <i className="fa fa-refresh" />
                                </button>
                            )}
                            title="Danh Sách NTD Freemium Gói Pro"
                        >
                            <ComponentFilterPro idKey={idKey} query={query} />
                            <Gird idKey={idKey}
                                fetchApi={getListEmployerFreemiumPro}
                                query={query}
                                columns={columns}
                                defaultQuery={{}}
                                history={history}
                                isRedirectDetail={false}
                            />
                        </Default>
                    </div>
                </div>
            </React.Fragment>
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPro);
