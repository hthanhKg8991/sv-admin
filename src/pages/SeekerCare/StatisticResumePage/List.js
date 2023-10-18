import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SeekerCare/StatisticResumePage/ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastSuccess, putToastError, SmartMessageBox} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import {getStatisticResume} from "api/statistic";
import moment from "moment";

const idKey = "StatisticResume";

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
                    title: "Tổng HS",
                    width: 100,
                    accessor: "resume_total",
                },
                {
                    title: "HS đã duyệt",
                    width: 100,
                    accessor: "resume_active",
                },
                {
                    title: "HS chờ duyệt",
                    width: 100,
                    accessor: "resume_inactive",
                },
                {
                    title: "HS đã sửa chờ duyệt",
                    width: 100,
                    accessor: "resume_fixed",
                },
                {
                    title: "HS không duyệt",
                    width: 100,
                    accessor: "resume_reject",
                },
                {
                    title: "HS nháp",
                    width: 100,
                    accessor: "resume_draft",
                },
                {
                    title: "HS đã xóa",
                    width: 100,
                    accessor: "resume_delete",
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
                title="Danh Sách Thống Kê Trạng Thái Hồ Sơ"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getStatisticResume}
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
