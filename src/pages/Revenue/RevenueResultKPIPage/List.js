import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {getListKpiResult} from "api/commission";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueResultKPIPage/ComponentFilter";
import {formatNumber} from "utils/utils";

const idKey = "RevenueResultKPIList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Thời gian",
                    width: 100,
                    time: true,
                    accessor: "created_at"
                },
                {
                    title: "Phòng",
                    width: 120,
                    accessor: "room_name"
                },
                {
                    title: "Mã nhân viên",
                    width: 100,
                    accessor: "staff_code"
                },
                {
                    title: "Tên CSKH",
                    width: 100,
                    accessor: "staff_name"
                },
                {
                    title: "Vị trí",
                    width: 100,
                    accessor: "division_fullname"
                },
                {
                    title: "Cấp bậc",
                    width: 80,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_config_level} value={row?.level} notStyle/>
                    )
                },
                {
                    title: "Tiêu chí KPI",
                    width: 200,
                    cell: row => (
                        row?.conditions?.map((item, idx) => (
                            <p key={idx.toString()}>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_kpi_config_detail_condition_items}
                                            value={item?.left} notStyle/>
                                <span className="mr5 ml5">
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_kpi_config_detail_condition_operation}
                                                value={item?.operation} notStyle/>
                                 </span>
                                {formatNumber(item?.right)}
                            </p>
                        ))
                    )
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_config_rating} value={row?.rating}/>
                    )
                },
                {
                    title: "Thực trạng",
                    width: 140,
                    cell: row => (
                        row?.result_conditions?.map((item, idx) => (
                            <p key={idx.toString()}>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_kpi_config_detail_condition_items}
                                            value={item?.name} notStyle/>
                                <span className="mr5">:</span>
                                {formatNumber(item?.value)}
                            </p>
                        ))
                    )
                },
                {
                    title: "%Hoa hồng",
                    width: 80,
                    cell: row => <>{row?.percent_commission}%</>
                },
            ],
            loading: false,
        };
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Kết Quả KPI"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListKpiResult}
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

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
