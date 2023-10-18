import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "./ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {getListHistoryStatisticSalesOrderItem} from "api/saleOrder";
import {formatNumber} from "utils/utils";
import moment from "moment";
import {publish} from "utils/event";

const idKey = "StatisticSalesOrderListDetail";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Website",
                    width: 50,
                    cell: row => (<span>{props.channel?.find(v => v.code === row.channel_code)?.display_name}</span>)
                },
                {
                    title: "Mã đơn hàng",
                    width: 50,
                    accessor: "sales_order_code"
                },
                {
                    title: "Giá trị đơn hàng",
                    width: 50,
                    cell: row => (<div className="text-center">{formatNumber(row.total_amount, 0, '.', 'đ')}</div>)
                },
                {
                    title: "Order On",
                    width: 50,
                    cell: row => (<div>{moment.unix(row.ordered_on).format("DD-MM-YYYY")}</div>)
                },
                {
                    title: "Seller",
                    width: 50,
                    accessor: "revenue_by_staff_name"
                },
                {
                    title: "Items",
                    width: 50,
                    cell: row => row.sales_order_items_info?.map((v, i) => (
                        <div
                            key={i}>{`${v.cache_service_name} - ${v.quantity_buy} ${props.service_code?.find(s => s.code === v.service_code)?.unit} - ${v.week_quantity} tuần`}</div>
                    ))
                },
            ],
            loading: false,
        };
    }

    render() {
        const {columns} = this.state;
        const {query, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Tra cứu lịch sử đơn hàng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getListHistoryStatisticSalesOrderItem}
                      query={query}
                      columns={columns}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        channel: state.sys?.channel?.items,
        service_code: state.sys?.service?.list,
        sys: state.sys,
    };
}


export default connect(mapStateToProps, null)(List);
