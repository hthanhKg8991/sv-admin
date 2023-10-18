import React from "react";
import ComponentFilter from "../ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import {getListHistoryServiceVtn} from 'api/saleOrder';
import {connect} from 'react-redux';
import moment from "moment";
import Item from "pages/CustomerCare/HistoryServiceVtnPage/Detail/Item";
import NumberFormat from 'react-number-format';

class ListHistoryServiceVtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Mã phiếu",
                    width: 150,
                    cell: row => `MP - ${row?.id}`
                },
                {
                    title: "Loại phiếu",
                    width: 150,
                    cell: row => row?.type_order
                },
                {
                    title: "Ngày ghi nhận",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {row?.actived_at && moment(row.actived_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Doanh thu phiếu",
                    width: 100,
                    cell: row => (<NumberFormat value={row.subtotal} displayType="text" thousandSeparator />)
                },
            ]
        };
    }

    render() {
        const {history, query} = this.props;
        const {columns} = this.state;

        return (
            <React.Fragment>
                <ComponentFilter idKey="HistoryServiceVtn" />
                <div className="row mt15">
                    <div className="col-md-12">
                        <Gird idKey="HistoryServiceVtn" fetchApi={getListHistoryServiceVtn}
                            defaultQuery={{}}
                            query={query}
                            columns={columns}
                            history={history}
                            isPushRoute={false}
                            isRedirectDetail={false}
                            expandRow={row => <Item {...row}/>} />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default connect(null, null)(ListHistoryServiceVtn)

