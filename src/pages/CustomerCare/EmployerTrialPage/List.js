import React, { Component } from "react";
import { publish } from "utils/event";
import * as uiAction from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerTrialPage/ComponentFilter";
import { getListEmployerTrial } from "api/employer";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import PopupActivatedTrial from "pages/CustomerCare/EmployerTrialPage/Popup/PopupActivatedTrial";
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import Statistic from "pages/CustomerCare/EmployerTrialPage/Detail/statistic";

const idKey = Constant.IDKEY_EMPLOYER_TRIAL_LIST;
class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = {...{action: 'detail'}};

        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 140,
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
                    width: 130,
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
                // {
                //     title: "Loại Trial",
                //     width: 60,
                //     cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_ldp_type} value={row.type} notStyle />
                // },
                {
                    title: "Ngày đăng ký",
                    width: 120,
                    time: true,
                    accessor: "created_at",
                },
                {
                    title: "Trạng thái tài khoản",
                    width: 220,
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
                    title: "CSKH",
                    width: 120,
                    accessor: "assigned_staff_username",
                },
                {
                    title: "DS phiếu trial",
                    width: 150,
                    cell: row => (
                        <span className="text-link text-warning font-bold"
                            onClick={() => { this.onRedirect(row) }}>
                            Xem danh sách
                        </span>
                    )
                },
                {
                    title: "Trạng thái trial",
                    width: 120,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_status_trial}
                                value={row?.status} />
                        </>
                    )
                },
                {
                    title: "Ngày hết hạn trial",
                    width: 120,
                    time: true,
                    accessor: "expired_at",
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => {
                        if (row?.status !== Constant.STATUS_TRIAL_ACTIVE) {
                            return (
                                <span className="text-link text-warning font-bold"
                                    onClick={() => { this.onActivatedTrial(row) }}>
                                    Kích hoạt
                                </span>
                            )
                        }
                    }
                },
            ],
            loading: false,
        };

        this.onRedirect = this._onRedirect.bind(this);
        this.onActivatedTrial = this._onActivatedTrial.bind(this);
    }

    _onRedirect = (row) => {
        const { history } = this.props;
        history.push({
            pathname: Constant.BASE_URL_SALES_ORDER,
            search: `?page=1&per_page=10&q=${row?.employer_id}`
        });
    }

    _onActivatedTrial(employer) {
        this.props.uiAction.createPopup(PopupActivatedTrial, "Kích hoạt trial", {
            employer,
        });
    }

    render() {
        const { columns } = this.state;
        const { query, history } = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter} />
                )}
                title="Danh Sách NTD Đăng Ký Trial"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh" />
                    </button>
                )}>
                <Gird idKey={idKey}
                    fetchApi={getListEmployerTrial}
                    query={query}
                    columns={columns}
                    defaultQuery={{}}
                    history={history}
                    isRedirectDetail={false}
                    expandRow={row => <Statistic {...row}/>}/>
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
