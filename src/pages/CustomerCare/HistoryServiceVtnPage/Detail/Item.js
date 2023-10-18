import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import NumberFormat from 'react-number-format';

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Gói",
                    width: 150,
                    cell: row => row?.product_name
                },
                {
                    title: "Số lượng",
                    width: 150,
                    cell: row => row?.spot_quantity_text
                },
                {
                    title: "Thời gian",
                    width: 80,
                    cell: row => row?.week_quantity_text
                },
                {
                    title: "Doanh thu dịch vụ",
                    width: 100,
                    cell: row => (<NumberFormat value={row?.subtotal_due} displayType="text" thousandSeparator />)
                },
            ]
        };
    }

    render() {
        const {columns} = this.state
        const {sale_order_items} = this.props
        if(!sale_order_items || sale_order_items.length === 0) {
            return null
        }
        const listData = [...sale_order_items]

        return (
                <Gird idKey={"HistoryServiceVtnDetail"}
                    data={listData}
                    columns={columns}
                    history={history}
                    isPushRoute={false}
                    isRedirectDetail={false}/>
        )
    }
}

export default connect(null, null)(Item);

