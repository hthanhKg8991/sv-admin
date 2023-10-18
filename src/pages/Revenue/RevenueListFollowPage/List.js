import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {getListCommission} from "api/commission";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {formatNumber} from "utils/utils";

const idKey = "RevenueListFollow";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Thời gian",
                    width: 100,
                    accessor: "commission_created"
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
                    title: "Tỉ lệ hoa hồng KPI",
                    width: 100,
                    cell: row => <>{row?.kpi_commission_percent}%</>
                },
                {
                    title: "Tổng",
                    width: 100,
                    cell: row => <>{formatNumber(row?.commission_total)}</>
                },
            ],
            columnsRevenue: [
                {
                    title: "Tỉ lệ",
                    width: 100,
                    cell: row => <>{row?.kpi_commission_percent}%</>
                },
                {
                    title: "Net sale",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale)}</>
                },
                {
                    title: "Revenue",
                    width: 100,
                    cell: row => <>{formatNumber(row?.revenue)}</>
                },
            ],
            columnsGift: [
                {
                    title: "Tỉ lệ",
                    width: 100,
                    cell: row => <>{row?.bonus_percent}%</>
                },
                {
                    title: "Net sale tái ký",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_resign_bonus)}</>
                },
                {
                    title: "Thưởng khác",
                    width: 100,
                    cell: row => <>{formatNumber(row?.bonus_other)}</>
                },
            ],
            columnsTotal: [
                {
                    title: "HH theo Net sale",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_commission)}</>
                },
                {
                    title: "HH theo revenue",
                    width: 100,
                    cell: row => <>{formatNumber(row?.revenue_commission)}</>
                },
                {
                    title: "Thưởng theo Net sale tái ký",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_resign_bonus)}</>
                },
                {
                    title: "Thưởng khác",
                    width: 100,
                    cell: row => <>{formatNumber(row?.bonus_other_total)}</>
                },
            ],

            loading: false,
        };
        this.expandRow = this._expandRow.bind(this);
    }

    _expandRow(row) {
        const {history} = this.props;
        const {columnsRevenue, columnsGift, columnsTotal} = this.state;

        return (
            <div className="row">
                <div className="col-md-3 px-1">
                    <p className="text-center fs12"><b>Tỉ lệ hoa hồng</b></p>
                    <Gird idKey={"RevenueListFollowDetail"}
                          data={[row]}
                          columns={columnsRevenue}
                          history={history}
                          isPushRoute={false}
                          isRedirectDetail={false}
                          isPagination={false}/>
                </div>
                <div className="col-md-3 px-1">
                    <p className="text-center fs12"><b>Tỉ lệ thưởng</b></p>
                    <Gird idKey={"RevenueListFollowDetail"}
                          data={[row]}
                          columns={columnsGift}
                          history={history}
                          isPushRoute={false}
                          isRedirectDetail={false}
                          isPagination={false}/>
                </div>
                <div className="col-md-6 px-1">
                    <p className="text-center fs12"><b>Hoa hồng</b></p>
                    <Gird idKey={"RevenueListFollowDetail"}
                          data={[row]}
                          columns={columnsTotal}
                          history={history}
                          isPushRoute={false}
                          isRedirectDetail={false}
                          isPagination={false}/>
                </div>
            </div>
        )
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                title="Danh Sách Theo Dõi Kết Qua Hoa Hồng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListCommission}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      expandRow={row => this.expandRow(row)}
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
