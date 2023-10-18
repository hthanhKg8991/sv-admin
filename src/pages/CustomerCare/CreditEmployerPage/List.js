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
import {getListCreditEmployer} from "api/saleOrder";
import Default from "components/Layout/Page/Default";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/CreditEmployerPage/ComponentFilter";
import {Link} from "react-router-dom";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import {formatNumber} from "utils/utils";
import moment from "moment";

const idKey = "CreditEmployerList";

class CreditEmployerList extends React.Component {
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
                    width: 240,
                    cell: row => (
                        <>
                            <Link
                                to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                    id: row.employer_id,
                                    action: "detail"
                                })}`}>
                                <span className={"text-link"}>{row.employer_id}</span>
                            </Link>
                            <span className="ml5"> - {row?.employer_info?.email}</span>
                        </>
                    )
                },
                {
                    title: "Tổng credit",
                    width: 120,
                    cell: row => formatNumber(row?.total_amount, 0, '.', 'đ')
                },
                {
                    title: "Hạn dùng",
                    width: 130,
                    cell: row => (
                        <React.Fragment>
                            {row.expired_at && moment.unix(row.expired_at).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hành động",
                    width: 120,
                    cell: row => (
                        <span className="text-link text-blue font-bold mr10" onClick={() => this.onDetail(row?.employer_id)}>
                            Xem chi tiết
                        </span>
                    )
                }
            ],
            loading: false,
        };
        this.onDetail = this._onDetail.bind(this);
    }

    _onDetail(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_CREDIT_EMPLOYER,
            search: '?action=detail&employer_id=' + id
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
                <Gird idKey={idKey}
                      fetchApi={getListCreditEmployer}
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

export default connect(null, mapDispatchToProps)(CreditEmployerList);
