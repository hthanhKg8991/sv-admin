import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Checkmate/SalesOrderByFieldPage/ComponentFilter";
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import ROLES from "utils/ConstantActionCode";
import queryString from "query-string";
import CanRender from "components/Common/Ui/CanRender";
import {Link} from "react-router-dom";
import {deleteSalesOrderByField, getListSalesOrderByField} from "api/saleOrder";

const idKey = "SalesOrderByField";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Mã phiếu",
                    width: 90,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_SALES_ORDER_BY_FIELD}?${queryString.stringify({
                                id: row.id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.id}</span>
                        </Link>
                    )
                },
                {
                    title: "Tên NTD",
                    width: 200,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({
                                action: "detail",
                                id: row?.employer_info?.id
                            })}`}>
                            <span>{row?.employer_info?.id} - {row?.employer_info?.name}</span>
                        </Link>
                    )
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    }
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_by_field_status}
                                             value={row?.status}/>
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
                    accessor: "created_by",
                },
                {
                    title: "Hành động",
                    width: 80,
                    onClick: () => {},
                    cell: row => (
                        <>
                            <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_update}>
                                <span className="text-link text-blue font-bold mr10"
                                      onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            {row?.status === Constant.SALE_ORDER_NOT_COMPLETE &&
                                <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_delete}>
                                    <span className="text-link text-red font-bold"
                                          onClick={() => this.onDelete(row?.id)}>
                                        Xóa
                                    </span>
                                </CanRender>
                            }
                        </>
                    )
                },
            ],
            loading: false,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SALES_ORDER_BY_FIELD,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_SALES_ORDER_BY_FIELD,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteSalesOrderByField({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
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
                title="Danh sách Phiếu Đăng Ký"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <CanRender actionCode={ROLES.sales_order_by_field_sales_order_by_field_create}>
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
                      fetchApi={getListSalesOrderByField}
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
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
