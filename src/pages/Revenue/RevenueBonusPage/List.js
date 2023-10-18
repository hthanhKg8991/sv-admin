import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {getListBonus} from "api/commission";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {formatNumber} from "utils/utils";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueBonusPage/ComponentFilter";

const idKey = "RevenueBonusList";

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
                    title: "[ĐẠT]-Net Sale JP/JP",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_jp_divide_jp)}</>
                },
                {
                    title: "[ĐẠT]-Net Sale TB/Customer",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_average_divide_customer)}</>
                },
                {
                    title: "[ĐẠT]-Net Sale Tái Ký",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_resign)}</>
                },
                {
                    title: "[THƯỞNG]-Net Sale JP/JP",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_jp_divide_jp_bonus)}</>
                },
                {
                    title: "[THƯỞNG]-Net Sale TB/Customer",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_average_divide_customer_bonus)}</>
                },
                {
                    title: "[THƯỞNG]-Net Sale Tái Ký",
                    width: 100,
                    cell: row => <>{formatNumber(row?.net_sale_resign_bonus)}</>
                },
                {
                    title: "[THƯỞNG]-Tổng",
                    width: 100,
                    cell: row => <>{formatNumber(row?.bonus_total)}</>
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
                title="Danh Sách Thưởng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListBonus}
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
