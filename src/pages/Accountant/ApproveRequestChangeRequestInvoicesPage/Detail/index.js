import React from "react";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Tab from "components/Common/Ui/Tab";
import Info from "./Info";
import {subscribe} from "utils/event";
import {getDetailSalesOrder, getDetailSalesOrderRequestInvoices} from "api/saleOrder";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: true
        };

        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, props.idKey));
    }

    async asyncData() {
        const detailRequestInvoices = await getDetailSalesOrderRequestInvoices({ id: this.props.id });
        this.setState({
            detailRequestInvoices: detailRequestInvoices
        })
        const data = await getDetailSalesOrder({id: detailRequestInvoices?.sales_order_id, type: 1});
        if (data) {
            this.setState({
                data: data,
                loading: false
            });
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {history, idKey} = this.props;
        const {loading, data, detailRequestInvoices} = this.state;

        const items = [
            {
                title: "Thông tin chung",
                component: <Info data={data} history={history} detailRequestInvoices={detailRequestInvoices} idKey={idKey}/>
            },
        ];

        return (
            <React.Fragment>
                {loading
                    ? <LoadingSmall style={{textAlign: "center"}}/>
                    : <Tab items={items}/>
                }
            </React.Fragment>
        );
    }
}

export default Detail;
