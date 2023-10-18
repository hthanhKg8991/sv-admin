import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueConfigKPIStaffPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupCreateByConfig from "pages/Revenue/RevenueConfigKPIStaffPage/Popup/PopupCreateByConfig";
import PopupUpdateConfig from "pages/Revenue/RevenueConfigKPIStaffPage/Popup/PopupUpdateConfig";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {deleteConfigKPIStaff, getListConfigKpi, getListConfigKPIStaff,} from "api/commission";
import ROLES from "utils/ConstantActionCode";
import {formatNumber} from "utils/utils";
import PopupDeleteConfigKPI from './Popup/PopupDeleteConfigKPI'
import moment from 'moment';

const idKey = "RevenueConfigKPIStaff";

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
                    width: 160,
                    cell: row => formatNumber(row.commit, 0, ".", Constant.REVENUE_UNIT[Number(row?.kpi_type_info?.type)])
                },
                {
                    title: "Mã config tỉ lệ HH",
                    width: 200,
                    accessor: "commission_rate_info.name"
                },
                {
                    title: "Mã config loại HH",
                    width: 200,
                    cell: row => row?.commission_formula_info?.map((commission, idx) => (
                        <React.Fragment key={idx.toString()}>{commission?.name}<br/></React.Fragment>
                    ))
                },
                {
                    title: "Mã config thưởng",
                    width: 140,
                    cell: row => row?.commission_bonus_info?.map((commission, idx) => (
                        <React.Fragment key={idx.toString()}>{commission?.name}<br/></React.Fragment>
                    ))
                },
                {
                    title: "Ngày ngừng tính hoa hồng",
                    width: 200,
                    cell: row => <span>{row?.commission_end_date ? moment.unix(row?.commission_end_date).format("DD/MM/YYYY") : ""}</span>
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_config_status}
                                             value={row?.status}/>
                },
                {
                    title: "Hành động",
                    width: 200,
                    cell: row => (
                        row?.status !== Constant.STATUS_DELETED &&
                        <>
                            <CanRender actionCode={ROLES.revenue_config_kpi_staff_detail}>
                                <span className="text-link text-green font-bold" onClick={() => this.onChangeConfig(row)}>
                                    Thay đổi
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.revenue_config_kpi_staff_detail}>
                                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.revenue_config_kpi_staff_delete}>
                                <span className="text-link text-red font-bold ml5"
                                      onClick={() => this.onDelete(row?.id)}>
                                    Xóa
                                </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            configActive: null,
        };
        this.onClickAdd = this._onClickAdd.bind(this);
        this.onClickAddByConfig = this._onClickAddByConfig.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onDelete = this._onDelete.bind(this);
        this.onChangeConfig = this._onChangeConfig.bind(this);
        this.onDeleteKPI = this._onDeleteKPI.bind(this)
    }

    _onChangeConfig(item) {
        const {actions} = this.props;
        actions.createPopup(PopupUpdateConfig, "Thay đổi cấu hình", {item, idKey});
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_KPI_STAFF,
            search: '?action=edit&id=0'
        });
    }

    _onClickAddByConfig() {
        const {actions} = this.props;
        actions.createPopup(PopupCreateByConfig, "Tạo từ Cấu hình", {idKey});
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_KPI_STAFF,
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
                const res = await deleteConfigKPIStaff({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
                publish(".refresh", {}, idKey)
            }
        });
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

    _onDeleteKPI(){
        // deleteConfigKPI
        const {actions} = this.props;

        actions.createPopup(PopupDeleteConfigKPI, "Chọn cấu hình xoá KPI", {idKey:idKey});
    }

    componentDidMount() {
        this._getConfigActive();
    }

    render() {
        const {columns, configActive} = this.state;
        const {query, defaultQuery, history} = this.props;
        const newQuery = {...query, config_id: query?.config_id || configActive?.id, "order_by[ordering]": "asc"};

        return (
            <Default
                title="Danh Sách Cấu Hình KPI"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {configActive && <ComponentFilter idKey={idKey} query={newQuery} />}
                <div className="mt10 mb10">
                    <CanRender actionCode={ROLES.revenue_config_kpi_staff_create}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onClickAdd}>
                            <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                        <button type="button" className="el-button el-button-success el-button-small"
                                onClick={this.revenue_config_kpi_staff_create_by_config}>
                            <span>Tạo từ Cấu hình <i className="glyphicon glyphicon-plus"/></span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.revenue_config_kpi_staff_delete_kpi}>
                        <button type="button" className="el-button el-button-bricky el-button-small"
                                onClick={this.onDeleteKPI}
                                >
                            <span>Xoá KPI</span>
                        </button>
                    </CanRender>
                </div>
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
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
