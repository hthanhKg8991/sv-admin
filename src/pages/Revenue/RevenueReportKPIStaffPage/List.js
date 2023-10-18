import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueReportKPIStaffPage/ComponentFilter";
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
import {
    calculateCommissionKpiStaff,
    exportReportKpiCommission,
    getListConfigKpi,
    getListConfigKPIStaff,
    getListCommisionRateConfig, 
    getListConfigGroup, 
} from "api/commission";
import {formatNumber} from "utils/utils";
import PopupCalculateRevenue from "./PopupCalculateRevenue";


const idKey = "RevenueReportKPIStaff";

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
                    title: "Tiêu chí KPI",
                    width: 160,
                    accessor: "kpi_type_info.name"
                },
                {
                    title: "Commit",
                    width: 120,
                    cell: row => formatNumber(row.commit, 0, ".", Constant.REVENUE_UNIT[Number(row?.kpi_type_info?.type)])
                },
                {
                    title: "Thực đạt",
                    width: 120,
                    cell: row => formatNumber(row.actual, 0, ".", Constant.REVENUE_UNIT[Number(row?.kpi_type_info?.type)])
                },
                {
                    title: "Kết quả",
                    width: 200,
                    cell: row => (
                        <>
                            {formatNumber(row.actual_percent, 0, ".", "%")}
                            {` - `}
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_kpi_result} value={row?.kpi_result} notStyle/>
                        </>
                    )
                },
                {
                    title: "Net sale",
                    width: 100,
                    cell: row => formatNumber(row.netsale, 0, ".", "đ")
                },
                {
                    title: "Tỉ lệ HH",
                    width: 100,
                    cell: row => `${row.commission_rate_percent}%`
                },
            ],
            loading: false,
            configActive: null,
            config_list: [],
            group_list: [],
            commission_rates_list: []
        };
        this.getListStaffGroupCode = this._getListStaffGroupCode.bind(this);
        this.getListCommissionRate = this._getListCommissionRate.bind(this);
        this.getListConfig = this._getListConfig.bind(this);
        this.onExport = this._onExport.bind(this);
        this.onUpdate = this._onUpdate.bind(this);
        this.onOpenCronPopup = this._onOpenCronPopup.bind(this);
    }
    

    async _getListStaffGroupCode(config_id) {
        const res = await getListConfigGroup({
            config_id: config_id,
            per_page: 100
        });

        if (res && Array.isArray(res.items)) {
            const groupList = res.items.map(item => {
                return {
                    title: item?.name,
                    value: item?.code
                }
            });
            this.setState({group_list: groupList});
        }
    }

    async _getListCommissionRate(config_id) {
        const res = await getListCommisionRateConfig({
            config_id: config_id,
            per_page: 100
        });

        if (res && Array.isArray(res)) {
            const commissionRateList = res.map(item => {
                return {
                    title: item?.name,
                    value: item?.code
                }
            });
            this.setState({commission_rates_list: commissionRateList});
        }
    }

    async _getListConfig() {
        const res = await getListConfigKpi({per_page: 100});
        if (res && Array.isArray(res.items)) {
            const configList = res.items.map(item => {
                return {
                    title: item?.name,
                    value: item?.id
                }
            });
            this.setState({config_list: configList});
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps?.query?.config_id !== this.props?.query?.config_id && newProps?.query?.config_id > 0) {
            this.getListStaffGroupCode(newProps?.query?.config_id);
            this.getListCommissionRate(newProps?.query?.config_id);
        }
    }

    async _onExport() {
        const {query, actions} = this.props;
        actions.showLoading();
        const res = await exportReportKpiCommission(query);
        if (res) {
            window.open(res?.url);
        }
        actions.hideLoading();
    }

    _onOpenCronPopup(){
        const { actions } = this.props;
        actions.createPopup(
            PopupCalculateRevenue, 
            "Chọn cấu hình tính hoa hồng", 
            {
                config_list: this.state.config_list
            }
        );
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
        const {config_id} = this.props.query;
        if (Number(config_id) > 0) {
            this.getListStaffGroupCode(config_id);
            this.getListCommissionRate(config_id);
        }
        this.getListConfig();
    }

    render() {
        const {columns, configActive, commission_rates_list, config_list, group_list} = this.state;
        const {query, defaultQuery, history} = this.props;
        const newQuery = {...query, config_id: configActive?.id, "order_by[ordering]": "asc"};

        return (
            <Default
                title="Danh Sách Báo Cáo KPI & Hoa Hồng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                {configActive && <ComponentFilter idKey={idKey} query={newQuery} config_list={config_list} commission_rates_list={commission_rates_list} group_list={group_list}/>}
                <div className="mt10 mb10">
                    <button type="button" className="el-button el-button-primary el-button-small"
                            onClick={this.onExport}>
                        <span>Xuất Excel</span>
                    </button>
                    <button type="button" className="el-button el-button-warning el-button-small"
                            onClick={this.onOpenCronPopup}>
                        <span>Tính hoa hồng</span>
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
