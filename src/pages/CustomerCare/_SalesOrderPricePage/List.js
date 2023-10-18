import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getListSalesOrderPrice} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/SalesOrderPricePage/ComponentFilter";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as utils from "utils/utils";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "SalesOrderRegistrationList",
            columns: [
                {
                    title: "Mã phiếu",
                    width: 60,
                    accessor: "id",
                },
                {
                    title: "Tên NTD",
                    width: 160,
                    accessor: "cache_employer_name",
                },
                {
                    title: "Trạng thái",
                    width: 160,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_quotation_status} value={row?.status}/>;
                    }
                },
                {
                    title: "Ngày tạo",
                    width: 160,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Tổng tiền",
                    width: 160,
                    cell: row => {
                        return <>{utils.formatNumber(row?.total_amount, 0, ".", "đ")}</>;
                    }
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    }
                },
            ],
            loading : false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: `${Constant.BASE_URL_SALES_SERVICE_PRICE}/add`,
        });
    }

    render() {
        const {columns, idKey} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh sách Phiếu Báo Giá"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <CanRender actionCode={ROLES.customer_care_sales_order_create}>
                        <div className="left btnCreateNTD">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </div>
                    </CanRender>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getListSalesOrderPrice}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
