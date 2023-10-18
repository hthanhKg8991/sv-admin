import React, { Component } from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import { getEmployerFilter } from "api/employer";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerPage/ComponentFilter";
import { putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import SpanCommon from 'components/Common/Ui/SpanCommon';
import moment from 'moment';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 140,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({action: "detail", id: row.id})}`}>
                            <span>{row.id} - {row.name}</span>
                        </Link>
                    )
                },
                {
                    title: "Loại tài khoản",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_premium_status}
                                    value={row.premium_status}/>
                    )
                },
                {
                    title: "Nhãn",
                    width: 130,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                    value={row?.company_kind || row.company_size}/>
                    )
                },
                {
                    title: "Ngày đăng ký",
                    width: 130,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Đăng nhập gần nhất",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            {row.last_logged_in_at && moment.unix(row.last_logged_in_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái tài khoản",
                    width: 180,
                    cell: row => (
                        <>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                        value={row.status_combine}/>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status_suspect}
                                        value={row.suspect_status}/>
                        </>
                    )
                },
                {
                    title: "Thông báo hồ sơ",
                    width: 160,
                    onClick: () => {
                    },
                    cell: row => {
                        if (row?.email_marketing_info?.status === Constant.EMAIL_MARKETING_STATUS_EMPTY) {
                            return null;
                        }
                        return <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                            action: "email_marketing",
                            email_marketing_id: row?.email_marketing_info?.id
                        })}`}>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status_marketing}
                                        value={row?.email_marketing_info?.token_email_status}/>
                        </Link>
                    }
                },
                {
                    title: "CSKH",
                    width: 130,
                    accessor: "assigned_staff_username"
                }
            ],
            loading: false,
        };
    }


    render() {
        const { columns } = this.state;
        const { query, history, is_archived, is_search_employer } = this.props;
        const idKey = "EmployerList";
        return (
            <Default
                left={(
                    <WrapFilter hideQuickFilter={!!is_search_employer} idKey={idKey}
                                is_search_employer={is_search_employer} query={query}
                                ComponentFilter={ComponentFilter} is_archived={is_archived}/>
                )}
                title={`Danh Sách Nhà Tuyển Dụng thanh lọc`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Gird idKey={idKey} fetchApi={getEmployerFilter}
                      query={query} columns={columns}
                      defaultQuery={{}}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ putToastSuccess }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
