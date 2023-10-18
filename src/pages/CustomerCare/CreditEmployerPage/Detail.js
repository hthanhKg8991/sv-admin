import React from "react";
import {connect} from "react-redux";
import {
    createPopup,
    deletePopup,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    SmartMessageBox
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {getListCreditEmployerDetail} from "api/saleOrder";
import Default from "components/Layout/Page/Default";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/CreditEmployerPage/ComponentFilterDetail";
import {Link} from "react-router-dom";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import {formatNumber} from "utils/utils";

const idKey = "CreditEmployerDetail";

class CreditEmployerDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 60,
                    accessor: "id"
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 120,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                id: row.employer_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.employer_id}</span>
                        </Link>
                    )
                },
                {
                    title: "ID quy đổi",
                    width: 120,
                    cell: row => row.exchange_sales_order_id > 0 && (
                        <Link
                            to={`${Constant.BASE_URL_EXCHANGE_SALES_ORDER}?${queryString.stringify({
                                id: row.exchange_sales_order_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.exchange_sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "ID SO",
                    width: 120,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
                                id: row.sales_order_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Credit",
                    width: 120,
                    cell: row =>  (
                        <span className={parseInt(row?.total_amount) < 0 ? 'text-red': ''}>
                            {formatNumber(row?.total_amount, 0, '.', 'đ')}
                        </span>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 200,
                    time: true,
                    accessor: "created_at",
                },
            ],
            loading: false,
        };
        this.onDetail = this._onDetail.bind(this);
    }

    _onDetail(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_CREDIT_EMPLOYER,
            search: '?action=detail&id=' + id
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Credit Khách Hàng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <p>Dòng (-) giá trị credit sử dụng quy đổi | (+) giá trị credit quy đổi</p>
                <Gird idKey={idKey}
                      fetchApi={getListCreditEmployerDetail}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isPushRoute
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            createPopup,
            deletePopup,
            hideSmartMessageBox,
            SmartMessageBox
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(CreditEmployerDetail);
