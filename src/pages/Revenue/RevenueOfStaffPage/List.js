import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueOfStaffPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import moment from "moment";
import * as Constant from "utils/Constant";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {exportKpiStaff, getListKpiStaff} from "api/commission";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {formatNumber} from "utils/utils";
import PopupUpdateConfig from "pages/Revenue/RevenueOfStaffPage/Popup/Update";

const idKey = "RevenueOfStaff";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Thời gian áp dụng",
                    width: 100,
                    cell: row => (
                        <>Từ {moment.unix(row?.start_at).format("DD-MM-YYYY")} <br/>
                            Đến {moment.unix(row?.end_at).format("DD-MM-YYYY")}</>
                    )
                },
                {
                    title: "Phòng",
                    width: 100,
                    accessor: "room_name"
                },
                {
                    title: "Vị trí",
                    width: 160,
                    accessor: "division_fullname"
                },
                {
                    title: "Cấp bậc",
                    width: 80,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_config_level} value={row?.level} notStyle/>
                    )
                },
                {
                    title: "Mã NV",
                    width: 80,
                    accessor: "staff_code"
                },
                {
                    title: "Tên",
                    width: 160,
                    accessor: "staff_name"
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_config_rating} value={row?.rating}/>
                    )
                },
                {
                    title: "Tiêu chí KPI",
                    width: 200,
                    cell: row => (
                        row?.conditions?.map((item, idx) => (
                            <p key={idx.toString()}>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_kpi_config_detail_condition_items}
                                            value={item?.left} notStyle/>
                                <span className="mr5 ml5">
                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_kpi_config_detail_condition_operation}
                                                value={item?.operation} notStyle/>
                                 </span>
                                {formatNumber(item?.right)}
                            </p>
                        ))
                    )
                },
                {
                    title: "%Hoa hồng",
                    width: 80,
                    cell: row => <>{row?.percent_commission}%</>
                },
                {
                    title: "Hành động",
                    width: 80,
                    cell: row => (
                        <CanRender actionCode={ROLES.revenue_revenue_of_staff_update_config}>
                            <span className="text-link" onClick={() => this.onUpdate(row)}>Thay đổi</span>
                        </CanRender>
                    )
                }
            ],
            loading: false,
            isImport: true,
        };

        this.onRefresh = this._onRefresh.bind(this);
        this.onUpdate = this._onUpdate.bind(this);
        this.onClickExport = this._onClickExport.bind(this);
    }

    _onRefresh() {
        publish(".refresh", {}, idKey);
    }

    _onUpdate(item) {
        const {actions} = this.props;
        actions.createPopup(PopupUpdateConfig, "Cập nhật tiêu chí & hoa hồng", {
            item: item,
            idKey: idKey
        });
    }

    async asyncExport() {
        const {actions, query} = this.props;
        const res = await exportKpiStaff(query);
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess('Thao tác thành công');
            });
        } else {
            this.setState({loading: false});
        }
    }

    _onClickExport() {
        this.setState({loading: true}, () => {
            this.asyncExport();
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
                title="Danh Sách KPI Theo Từng CSKH"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left">
                        <button type="button" className="el-button el-button-primary el-button-small mr5"
                                onClick={this.onRefresh}>
                            <span> <i className="fa fa-refresh mr5"/>Cập nhật</span>
                        </button>
                        <CanRender actionCode={ROLES.revenue_revenue_of_staff_export}>
                            <button type="button"
                                    className="el-button el-button-bricky el-button-small"
                                    onClick={this.onClickExport}>
                                <span>Xuất Excel <i className="glyphicon glyphicon-file"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListKpiStaff}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                />
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
            createPopup
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
