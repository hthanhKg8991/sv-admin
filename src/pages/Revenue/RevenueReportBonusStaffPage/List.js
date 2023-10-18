import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueReportBonusStaffPage/ComponentFilter";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {bindActionCreators} from 'redux';
import {
    createPopup,
    hideLoading,
    hideSmartMessageBox,
    putToastError,
    putToastSuccess,
    showLoading,
    SmartMessageBox
} from "actions/uiAction";
import {calculateCommissionKpiStaff, exportReportBonus, getListConfigKpi, getListConfigKPIStaff} from "api/commission";
import {formatNumber} from "utils/utils";

const idKey = "RevenueReportBonusStaff";

class List extends Component {
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
                    title: "Team",
                    width: 120,
                    accessor: "staff_group_info.name"
                },
                {
                    title: "Họ tên",
                    width: 160,
                    accessor: "staff_name"
                },
                {
                    title: "Mã nhân viên",
                    width: 100,
                    accessor: "staff_code"
                },
                {
                    title: "Vị trí",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_staff_position}
                                             value={row?.staff_position} notStyle/>
                },
                {
                    title: "Netsale JP/JP",
                    width: 100,
                    cell: row => formatNumber(row.commission_bonus_detail, 0, ".", "đ")
                },
                {
                    title: "Tổng thưởng",
                    width: 100,
                    cell: row => formatNumber(row.commission_bonus, 0, ".", "đ")
                },
            ],
            loading: false,
            configActive: null,
        };
        this.onExport = this._onExport.bind(this);
        this.onUpdate = this._onUpdate.bind(this);
    }

    async _onExport() {
        const {query, actions} = this.props;
        actions.showLoading();
        const res = await exportReportBonus(query);
        if (res) {
            window.open(res?.url);
        }
        actions.hideLoading();
    }

    async _onUpdate() {
        const {actions, query} = this.props;
        const {config_id} = query;
        actions.showLoading();
        const res = await calculateCommissionKpiStaff({config_id});
        if (res) {
            actions.putToastSuccess('Thao tác thành công');
            publish(".refresh", {}, idKey);
        }
        actions.hideLoading();
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
        const newQuery = {...query, config_id: configActive?.id, "order_by[ordering]": "asc"};

        return (
            <Default
                title="Danh Sách Báo Cáo Thưởng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                {configActive && <ComponentFilter idKey={idKey} query={newQuery}/>}
                <div className="mt10 mb10">
                    <button type="button" className="el-button el-button-primary el-button-small"
                            onClick={this.onExport}>
                        <span>Xuất Excel</span>
                    </button>
                </div>
                <p className="text-red">Do dữ liệu quá lớn nên không thể cập nhật theo realtime nên dữ liệu mới nhất sẽ được cập nhật tự động 1 giờ 1 lần.</p>
                {configActive && (
                    <Gird idKey={idKey}
                          fetchApi={getListConfigKPIStaff}
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
            showLoading,
            hideLoading,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
