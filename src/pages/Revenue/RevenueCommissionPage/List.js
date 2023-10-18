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
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueCommissionPage/ComponentFilter";

const idKey = "RevenueCommissionList";

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
                    title: "%Hoa hồng",
                    width: 100,
                    cell: row => <>{row?.kpi_commission_percent}%</>
                },
                {
                    title: "Net Sale",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale)}</>
                },
                {
                    title: "Hoa hồng Net Sale",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_commission)}</>
                },
                {
                    title: "Net Sale JP/JP",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_jp)}</>
                },
                {
                    title: "Hoa hồng Net Sale JP/JP",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_jp_commission)}</>
                },
                {
                    title: "Revenue",
                    width: 100,
                    cell: row => <>{formatNumber(row?.revenue)}</>
                },
                {
                    title: "Hoa hồng Revenue",
                    width: 100,
                    cell: row => <>{formatNumber(row?.revenue_commission)}</>
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
                title="Danh Sách Hoa Hồng"
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
