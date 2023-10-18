import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueConfigKPIMonthPage/ComponentFilter";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {copyConfigKpi, deleteConfigKpi, getListConfigKpi} from "api/commission";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "RevenueConfigKpi";

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
                    title: "Tên cấu hình",
                    width: 200,
                    accessor: "name"
                },
                {
                    title: "Thời gian áp dụng",
                    width: 200,
                    cell: row => (
                        <>
                            Bắt đầu: {moment.unix(row?.date_from).format("DD-MM-YYYY")} <br/>
                            Kết thúc: {moment.unix(row?.date_to).format("DD-MM-YYYY")}
                        </>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 200,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_revenue_config_status}
                                             value={row?.status}/>
                },
                {
                    title: "Hành động",
                    width: 160,
                    cell: row => (
                        row?.status !== Constant.STATUS_DELETED &&
                        <>
                            <CanRender actionCode={ROLES.revenue_config_kpi_month_crud}>
                                <span className="text-link text-blue font-bold" onClick={() => this.onEdit(row?.id)}>
                                    Chỉnh sửa
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.revenue_config_kpi_month_crud}>
                                <span className="text-link text-green font-bold ml5" onClick={() => this.onCopy(row?.id)}>
                                    Sao chép
                                </span>
                            </CanRender>
                            <CanRender actionCode={ROLES.revenue_config_kpi_month_crud}>
                                 <span className="text-link text-red font-bold ml5"
                                       onClick={() => this.onDelete(row?.id, row?.name)}>
                                     Xóa
                                 </span>
                            </CanRender>
                        </>
                    )
                },
            ],
            loading: false,
            isImport: true,
        };

        this.onClickAdd = this._onClickAdd.bind(this);
        this.onEdit = this._onEdit.bind(this);
        this.onCopy = this._onCopy.bind(this);
        this.onDelete = this._onDelete.bind(this);
    }

    _onClickAdd() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_OF_MONTH,
            search: '?action=edit&id=0'
        });
    }

    _onEdit(id) {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_REVENUE_CONFIG_OF_MONTH,
            search: '?action=edit&id=' + id
        });
    }

    _onDelete(id, name) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn xóa cấu hình: ' + name,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await deleteConfigKpi({id});
                if (res) {
                    actions.putToastSuccess('Thao tác thành công');
                    publish(".refresh", {}, idKey);
                }
                actions.hideSmartMessageBox();
            }
        });
    }

    _onCopy(id) {
        const {actions} = this.props;
        actions.SmartMessageBox({
            title: 'Bạn có chắc muốn copy ID: ' + id,
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const res = await copyConfigKpi({id});
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
                title="Danh Sách Cấu Hình KPI Theo Tháng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <div className="left btnCreateNTD">
                        <CanRender actionCode={ROLES.revenue_config_kpi_month_crud}>
                            <button type="button" className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickAdd}>
                                <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    </div>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListConfigKpi}
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
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
