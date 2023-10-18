import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SeekerCare/StatisticSeekerPage/ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastSuccess, putToastError, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import {getStatisticSeeker} from "api/statistic";
import moment from "moment";
import SpanBranch from "components/Common/Ui/SpanBranch";

const idKey = "StatisticSeeker";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "CSKH",
                    with: 160,
                    accessor: "staff_email"
                },
                {
                    title: "Miền TK CSNTV",
                    with: 160,
                    cell: row => (
                        <SpanBranch value={row?.branch_code || ""}/>
                    )
                },
                {
                    title: "Tổng TK",
                    width: 100,
                    accessor: "seeker_total",
                },
                {
                    title: "TK đã duyệt",
                    width: 100,
                    accessor: "seeker_active",
                },
                {
                    title: "TK chờ duyệt",
                    width: 100,
                    accessor: "seeker_inactive",
                },
                {
                    title: "TK đã sửa chờ duyệt",
                    width: 100,
                    accessor: "seeker_fixed",
                },
                {
                    title: "TK không duyệt",
                    width: 100,
                    accessor: "seeker_reject",
                },
                {
                    title: "TK đã xóa",
                    width: 100,
                    accessor: "seeker_delete",
                },
            ],
            loading : false,
        };
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        const now = moment().unix();

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Thống Kê Trạng Thái Người Tìm Việc"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getStatisticSeeker}
                      query={{...query, "statistic_date[from]": now, "statistic_date[to]": now}}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isPagination={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
