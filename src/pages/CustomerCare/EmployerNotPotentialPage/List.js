import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getEmployerNotPotential} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/EmployerNotPotentialPage/ComponentFilter";
import {createPopup, putToastSuccess} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "EmployerNotPotentialList";

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
                    title: "Email",
                    width: 140,
                    accessor: "email"
                },
                {
                    title: "Địa chỉ",
                    width: 140,
                    accessor: "address"
                },
                {
                    title: "Ngày đăng ký",
                    width: 130,
                    cell: row => (
                        <>
                            {row.created_at && moment.unix(row.created_at)
                                .format("DD/MM/YYYY HH:mm:ss")}
                        </>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                    value={row.status_combine}/>
                    )
                },
                {
                    title: "CSKH",
                    width: 180,
                    cell: row => (
                        <>
                            {row?.assigned_staff_username} <br/>
                            {moment.unix(row?.assigning_changed_at).format("DD-MM-YYYY HH:mm:ss")}
                        </>
                    )
                },
                {
                    title: "Tình trạng Email",
                    width: 130,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_email_verified_status} value={row?.email_verified_status}/>
                },
                {
                    title: "Đăng nhập gần nhất",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            {row?.last_logged_in_at && moment.unix(row?.last_logged_in_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
            ],
            loading : false,
        };
        this.onClickExport = this._onClickExport.bind(this);
    }

    _onClickExport() {
        window.alert("Chức năng đang xây dựng. Đợi API để hoàn thành!");
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách NTD không tiềm năng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getEmployerNotPotential}
                      query={query}
                      columns={columns}
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
        actions: bindActionCreators({putToastSuccess}, dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
