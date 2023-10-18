import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {publish} from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "pages/Revenue/RevenueCashDataPage/ComponentFilter";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {createPopup, hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {exportDataCash, getListConfigKpi, getListDataCash} from "api/commission";
import {formatNumber} from "utils/utils";
import moment from "moment";
import * as Constant from "utils/Constant";
import FileImportPopup from './Popup/FileImportPopup'
import config from "config";

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
                    title: "Cash (trước thuế)",
                    width: 100,
                    cell: row => formatNumber(row?.amount, 0, ".", "đ")
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
            fileImport: null,
        };
        this.onExport = this._onExport.bind(this);
        this.onImportFile = this._onImportFile.bind(this);
    }

    async _onExport() {
        const {query} = this.props;
        const res = await exportDataCash(query);
        if (res) {
            window.open(res?.url);
        }
    }

    _onImportFile() {
        this.props.actions.createPopup(FileImportPopup, "Import Cash", {idKey: idKey});
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
                title="Quản Lý Data Cash"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                {configActive && <ComponentFilter idKey={idKey} query={newQuery}/>}
                <div className="mt10 mb10">
                    <CanRender actionCode={ROLES.revenue_cash_data_export_cash}>
                        <button type="button" className="el-button el-button-primary el-button-small"
                                onClick={this.onExport}>
                            <span>Xuất Excel</span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.revenue_cash_data_import_cash}>
                        <button type="button" className="el-button el-button-warning el-button-small mr5" onClick={this.onImportFile}>
                            <span>Import dữ liệu <i className="glyphicon glyphicon-upload"/> </span>
                        </button>
                    </CanRender>
                    <CanRender actionCode={ROLES.revenue_cash_data_download_template}>
                        <a 
                            className="el-button el-button-primary el-button-small" 
                            href={`${config.apiCommissionDomain}/template/template_import_cash.xlsx`}
                            download
                        >
                            Download Template
                        </a>
                    </CanRender>
                </div>
                {configActive && (
                    <Gird idKey={idKey}
                          fetchApi={getListDataCash}
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
        branch: state.branch,
        user: state.user,
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
