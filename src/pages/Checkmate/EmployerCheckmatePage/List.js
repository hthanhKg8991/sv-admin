import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import {bindActionCreators} from 'redux';
import {getList} from "api/employer";
import {publish} from "utils/event";
import {putToastSuccess} from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {Link} from "react-router-dom";
import queryString from "query-string";
import SpanCommon from "components/Common/Ui/SpanCommon";
import moment from "moment";

const idKey = "EmployerList";

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = {...props.query, ...{action: 'detail'}};
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 180,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({...paramsQuery, ...{id: row.id}})}`}>
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
                    title: "Phân loại NTD",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_class}
                                    value={row.employer_classification}/>
                    )
                },
                {
                    title: "Nhãn",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_company_kind}
                                    value={row?.company_kind || row.company_size}/>
                    )
                },
                {
                    title: "Ngày đăng ký",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Đăng nhập gần nhất",
                    width: 150,
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
                                        value={row.status_combine}/>{" "}
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status_suspect}
                                        value={row.suspect_status}/>
                        </>
                    )
                },
                {
                    title: "CSKH",
                    width: 130,
                    accessor: "assigned_staff_username"
                },
                {
                    title: "Hành động",
                    width: 130,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SALES_ORDER_BY_FIELD}?${queryString.stringify({employer_id: row.id})}`}
                            target="_blank">
                            <span>Xem danh sách</span>
                        </Link>
                    )
                }
            ],
            loading: false,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_EMPLOYER_CHECKMATE,
            search: '?action=edit&id=0'
        });
    }


    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, is_archived, is_search_employer, user, branch} = this.props;
        const {channel_code} = branch.currentBranch;
        // Nếu NTD là trường nhóm thì filter CSKH thuộc nhóm NTD đó.
        const staffFilter = user?.data?.division_code === Constant.DIVISION_TYPE_customer_care_leader ?
            {"assigned_staff_id[0]": user?.data?.id} : {};
        const defaultQuerySearch = {...query, ...staffFilter, channel_checkmate: channel_code};

        return (
            <Default
                left={(
                    <WrapFilter hideQuickFilter={!!is_search_employer} idKey={idKey}
                                is_search_employer={is_search_employer} query={query}
                                ComponentFilter={ComponentFilter} is_archived={is_archived}/>
                )}
                title={`Danh Sách Nhà Tuyển Dụng`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <div className="left btnExportNTD">
                        <CanRender actionCode={ROLES.sales_order_by_field_employer_checkmate_create}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                }>
                <Gird idKey={idKey}
                      fetchApi={getList}
                      query={defaultQuerySearch}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
