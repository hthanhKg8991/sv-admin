import React from "react";
import {connect} from "react-redux";
import {
    putToastError,
    putToastSuccess,
    createPopup,
    deletePopup,
    SmartMessageBox,
    hideSmartMessageBox
} from "actions/uiAction";
import {bindActionCreators} from "redux";
import {publish} from "utils/event";
import {getListFieldRegistrationJobBoxPagination, exportFieldRegistrationJobBox} from "api/saleOrder";
import Default from "components/Layout/Page/Default";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Checkmate/FieldRegistrationPage/ComponentFilter";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";

const idKey = "FieldRegistration";

class SalesOrderSchedule extends React.Component {
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
                    title: "Mã phiếu",
                    width: 60,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            target="_blank"
                            to={`${Constant.BASE_URL_SALES_ORDER_BY_FIELD}?${queryString.stringify({
                                id: row.sales_order_id,
                                action: "detail"
                            })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Tin tuyển dụng",
                    width: 200,
                    onClick: () => {
                    },
                    cell: row => (
                        <Link
                            to={`${Constant.BASE_URL_JOB}?${queryString.stringify({
                                action: "detail",
                                id: row?.job_id
                            })}`}>
                            <span>{row?.job_id} - {row?.cache_job_title}</span>
                        </Link>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_field_registration_status}
                                             value={row?.status}/>
                },
                {
                    title: "Loại tin",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_type_campaign_job_by_field}
                                             value={row?.type_campaign}/>
                },
                {
                    title: "Ngày tạo",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.start_date).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Ngày hết hạn",
                    width: 100,
                    cell: row => {
                        return <>{moment.unix(row?.end_date).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
            ],
            loading: false,
        };

        this.onClickExport = this._onClickExport.bind(this);
    }

    async _onClickExport() {
        const {actions, query} = this.props;
        const res = await exportFieldRegistrationJobBox(query);
        if (res) {
            this.setState({loading: false}, () => {
                actions.putToastSuccess('Thao tác thành công');
            });
            window.open(res?.url);
        } else {
            this.setState({loading: false});
            actions.putToastError(res);
        }
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Danh Sách Tin Tuyển Dụng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={(
                    <>
                        <div className="left btnExportNTD">
                            <button type="button"
                                    className="el-button el-button-primary el-button-small"
                                    onClick={this.onClickExport}>
                                <span>Xuất Excel  <i
                                    className="glyphicon glyphicon-file"/></span>
                            </button>
                        </div>
                    </>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getListFieldRegistrationJobBoxPagination}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            putToastSuccess,
            putToastError,
            createPopup,
            deletePopup,
            hideSmartMessageBox,
            SmartMessageBox
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SalesOrderSchedule);
