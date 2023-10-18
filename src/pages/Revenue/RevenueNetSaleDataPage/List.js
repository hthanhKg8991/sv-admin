import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueNetSaleDataPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {exportListDataNetSale, getListConfigKpi, getListDataNetSale} from "api/commission";
import ROLES from "utils/ConstantActionCode";
import {formatNumber} from "utils/utils";
import moment from "moment";
import * as Constant from "utils/Constant";

const idKey = "DataNetSale";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "ID",
                    width: 100,
                    accessor: "id"
                },
                {
                    title: "Uid",
                    width: 100,
                    accessor: "uid"
                },
                {
                    title: "Mã phiếu",
                    width: 100,
                    accessor: "sales_order_id"
                },
                {
                    title: "ID NTD",
                    width: 100,
                    accessor: "employer_id"
                },
                {
                    title: "ID Company",
                    width: 100,
                    accessor: "customer_id"
                },
                {
                    title: "Net sale (trước thuế)",
                    width: 100,
                    cell: row => formatNumber(row?.amount, 0, ".", "đ")
                },
                {
                    title: "Net sale (sau thuế)",
                    width: 100,
                    cell: row => formatNumber(row?.amount_including_taxes, 0, ".", "đ")
                },
                {
                    title: "Số lượng Jobbox",
                    width: 100,
                    cell: row => row?.amount_infos?.items?.j?.quantity
                },
                {
                    title: "Net sale JP",
                    width: 100,
                    cell: row => formatNumber(row?.amount_infos?.items?.j?.amount, 0, ".", "đ")
                },
                {
                    title: "Số phiếu",
                    width: 100,
                    accessor: "count_so"
                },
                {
                    title: "Mã nhân viên",
                    width: 100,
                    accessor: "staff_code"
                },
                {
                    title: "Ngày ghi nhận",
                    width: 100,
                    cell: row => moment.unix(row?.receive_at).format("DD-MM-YYYY")
                },
            ],
            loading: false,
            calculateInfo: null,
        };
        this.onExport = this._onExport.bind(this);
    }

    async _onExport() {
        const {query} = this.props;
        const res = await exportListDataNetSale(query);
        if (res) {
            window.open(res?.url);
        }
    }

    async _getConfigActive() {
        const res = await getListConfigKpi({status: Constant.STATUS_ACTIVED});
        if (res && Array.isArray(res.items)) {
            const [itemActive] = res.items;
            this.setState({
                configActive: itemActive
            });
        }
    }

    componentDidMount() {
        this._getConfigActive();
    }

    render() {
        const {columns, configActive} = this.state;
        const {query, defaultQuery, history} = this.props;
        const startOfMonth = moment().clone().startOf('month').unix();
        const endOfMonth = moment().clone().endOf('month').unix();
        const newQuery = {
            ...query,
            config_id: configActive?.id,
            "receive_at[from]": startOfMonth,
            "receive_at[to]": endOfMonth
        };

        return (
            <Default
                title="Quản Lý Data Net Sale"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {configActive && <ComponentFilter idKey={idKey} query={newQuery}/>}
                <div className="mt10 mb10">
                    <CanRender actionCode={ROLES.revenue_netsale_data_crud}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onExport}>
                            <span>Xuất Excel</span>
                        </button>
                    </CanRender>
                </div>
                {configActive && (
                    <Gird idKey={idKey}
                          fetchApi={getListDataNetSale}
                          query={newQuery}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                          isRedirectDetail={false}
                          isReplaceRoute
                    />
                )}
            </Default>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            SmartMessageBox,
            hideSmartMessageBox,
            createPopup,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
