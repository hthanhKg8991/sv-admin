import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueDataPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {exportDataRevenue, getListConfigKpi, getListDataRevenue} from "api/commission";
import ROLES from "utils/ConstantActionCode";
import {formatNumber} from "utils/utils";
import moment from "moment";
import * as Constant from "utils/Constant";

const idKey = "DataRevenue";

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
                    title: "Revenue (trước thuế)",
                    width: 100,
                    cell: row => formatNumber(row?.amount, 0, ".", "đ")
                },
                {
                    title: "Revenue (sau thuế)",
                    width: 100,
                    cell: row => formatNumber(row?.amount_including_taxes, 0, ".", "đ")
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
        };
        this.onExport = this._onExport.bind(this);
    }

    async _onExport() {
        const {query, actions} = this.props;
        if (!query["receive_at[from]"] && !query["receive_at[from]"]){
            actions.putToastError("Chưa chọn ngày ghi nhận");
            return;
        }
        const res = await exportDataRevenue(query);
        if (res) {
            window.open(res?.url, "_blank");
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
                title="Quản Lý Data Revenue"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {configActive && <ComponentFilter idKey={idKey} query={newQuery}/>}
                <div className="mt10 mb10">
                    <CanRender actionCode={ROLES.revenue_revenue_data_crud}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onExport}>
                            <span>Xuất Excel</span>
                        </button>
                    </CanRender>
                </div>
                <div className={"text-red mb30"}>
                    *** Lưu ý:
                    <ul>
                        <li>Kiểm tra 10 dữ liệu mẫu trước khi truy xuất. Không thể tải dữ liệu khi lớn hơn 50.000 dòng.</li>
                        <li>Sau khi chọn bộ lọc, vui lòng chờ 5 - 10 phút để hệ thống hoàn tất dữ liệu.</li>
                    </ul>
                </div>
                {configActive && (
                    <Gird idKey={idKey}
                          fetchApi={getListDataRevenue}
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
