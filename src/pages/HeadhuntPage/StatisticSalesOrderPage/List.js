import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "./ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import {getListHistoryStatisticSalesOrder} from "api/saleOrder";
import {formatNumber} from "utils/utils";
import {Link} from "react-router-dom";
import * as Constant from "utils/Constant";
import queryString from 'query-string';
import {publish} from "utils/event";
const idKey = "StatisticSalesOrderList";

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
                    title: "Số lượng đơn hàng",
                    width: 50,
                    cell: row => (<div className="text-center">
                        <Link
                            to={`${Constant.BASE_URL_HEADHUNT_STATISTIC_SALES_ORDER}?${queryString.stringify({
                                tax_code: row.tax_code,
                                channel_code: row.channel_code,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.total_sales_order}</span>
                        </Link>
                    </div>)
                },
                {
                    title: "Giá trị đơn hàng",
                    width: 50,
                    cell: row => (<div>{formatNumber(row.total_price_buy, 0, '.', 'đ')}</div>)
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
                      fetchApi={getListHistoryStatisticSalesOrder}
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
    };
}


export default connect(mapStateToProps, null)(List);
