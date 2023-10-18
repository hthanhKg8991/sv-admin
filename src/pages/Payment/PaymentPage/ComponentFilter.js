import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import SearchField from "components/Common/Ui/BoxSearch/SearchField";
import Filter from "components/Common/Ui/Table/Filter";
import * as utils from "utils/utils";
import * as Constant from "utils/Constant";

class ComponentFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.query
        }
    }
    componentWillMount(){
        const {query} = this.state;
        if (!query["sales_order_status[0]"]) {
            query["sales_order_status[0]"] = Constant.SALE_ORDER_ACTIVED;
            query["sales_order_status[1]"] = Constant.SALE_ORDER_EXPIRED_ACTIVE;
            this.setState({query})
        }
    }
    render() {
        const {menuCode, idKey} = this.props;
        const {query} = this.state;
        const payment_status = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_payment_status);
        const commonSaleStatus = utils.convertArrayValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_status);
        const sales_order_status = commonSaleStatus.filter(_ => _?.value !== Constant.STATUS_DELETED);

        return (
            <div className="row mt-15 mb5 d-flex">
                <Filter idKey={idKey} query={query} menuCode={menuCode}>
                    <SearchField type="input" className="col-md-2" label="ID SO, ID Payment, QR code" name="q"
                                 timeOut={1000}/>
                    <SearchField type="input" className="col-md-2" label="Mã nhân viên" name="revenue_by_staff_code"
                                 timeOut={1000}/>
                    <SearchField type="dropboxmulti" className="col-md-3" label="Trạng thái SO"
                                 name="sales_order_status"
                                 data={sales_order_status}/>
                    <SearchField type="dropbox" className="col-md-2" label="Trạng thái payment" name="status"
                                 data={payment_status}/>
                </Filter>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentFilter);
