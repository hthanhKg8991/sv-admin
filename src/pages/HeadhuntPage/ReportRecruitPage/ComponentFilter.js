import React, {Component} from "react";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import FilterLeft from "components/Common/Ui/Table/FilterLeft";
import {getListHeadhuntCustomer, getListStaffItemsHeadhunt} from "api/headhunt";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: [],
            sale: [],
        }
        this.getListCustomer = this._getListCustomer.bind(this);
        this.asyncData = this._asyncData.bind(this);
    }

    async _asyncData() {
        const res = await getListStaffItemsHeadhunt({
            status: Constant.STATUS_ACTIVED,
            division_code: Constant.DIVISION_TYPE_customer_headhunt_sale,
        });
        if (res) {
            const sale = res.map(v => ({value: v.email, title: v.email}));
            this.setState({sale});
        }
    }

    async _getListCustomer(q = null) {
        if (q && q.length > 0) {
            const res = await getListHeadhuntCustomer({q});
            if (res?.items) {
                const customer = res.items.map(v => ({value: v.id, title: v.company_name}));
                this.setState({customer});
            }
        }
    }

    componentDidMount() {
        const {query} = this.props;
        this.asyncData();
        if (query?.customer_id) {
            this.getListCustomer(query.customer_id);
        }

    }

    render() {
        const {query, menuCode, idKey} = this.props;
        const {customer, sale} = this.state;
        return (
            <FilterLeft idKey={idKey} query={query} menuCode={menuCode} showQtty={6}>
                <SearchField type="dropboxfetch" label="Khách hàng" name="customer_id"
                             data={customer}
                             fnFetch={this.getListCustomer}
                             timeOut={1000}/>
                <SearchField type="input" label="Hợp đồng" name="contract_id" timeOut={1000}/>
                <SearchField type="input" label="Yêu cầu tuyển dụng" name="contract_request_id" timeOut={1000}/>
                <SearchField type="dropbox" data={sale} label="Sale" name="customer_staff_login_name"/>
            </FilterLeft>
        )
    }
}

export default ComponentFilter;
