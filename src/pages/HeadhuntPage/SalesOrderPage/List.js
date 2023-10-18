import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/HeadhuntPage/SalesOrderPage/ComponentFilter";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import queryString from "query-string";
import {Link} from "react-router-dom";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {getListHeadhuntSalesOrder} from "api/headhunt";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "SalesOrder",
            columns: [
                {
                    title: "Mã phiếu",
                    width: 90,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EDIT_HEADHUNT_SALES_ORDER}?${queryString.stringify({
                                id: row.id,
                            })}`}>
                            <span className={"text-link"}>{row.id}</span>
                        </Link>
                    )
                },
                {
                    title: "Tên NTD",
                    width: 200,
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_HEADHUNT_CUSTOMER}?${queryString.stringify({
                                q: row.customer_id,
                                action: "list"
                            })}`}>
                            <span className={"text-link"}>{row.customer_id} - {row?.customer_info?.company_name}</span>
                        </Link>
                    )
                },
                {
                    title: "CSKH",
                    width: 160,
                    accessor: "customer_staff_info"
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status_headhunt} value={row?.status}/>;
                    }
                },
                {
                    title: "Ngày tạo",
                    width: 140,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Người tạo",
                    width: 140,
                    accessor: "created_by"
                },
                {
                    title: "Hành động",
                    width: 140,
                    cell: row => {

                        return  <Link
                            to={`${Constant.BASE_URL_EDIT_HEADHUNT_SALES_ORDER}?${queryString.stringify({
                                id: row.id,
                            })}`}>
                            <span className={"text-link"}>Chỉnh sửa</span>
                        </Link>
                    }
                },

            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_ADD_HEADHUNT_SALES_ORDER,
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
                title="Danh sách Phiếu Đăng Ký"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <>
                        <CanRender actionCode={ROLES.customer_care_sales_order_create}>
                            <div className="left btnCreateNTD">
                                <button type="button"
                                        className="el-button el-button-primary el-button-small"
                                        onClick={this.onClickAdd}>
                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                </button>
                            </div>
                        </CanRender>
                    </>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntSalesOrder}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isReplaceRoute
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox, createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
