import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";

import CommonText from "components/Common/Ui/CommonText";
import PopOver from "components/Common/Ui/PopOver";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import {getListSalesOrderRegistration} from "api/saleOrder";
import {getListConfig} from "api/system";

import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";
import * as utils from "utils/utils";

import ComponentFilter from "pages/Accountant/SalesOrderApprovePage/ComponentFilter";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idKey: "SalesOrderApproveList",
            columns: [
                {
                    title: "Mã phiếu",
                    width: 100,
                    accessor: "id",
                },
                {
                    title: "Tên NTD",
                    width: 200,
                    accessor: "employer_info.name",
                },
                {
                    title: "Email NTD",
                    width: 200,
                    accessor: "employer_info.email",
                },
                {
                    title: "Ngày duyệt",
                    width: 140,
                    cell: row => {
                        return <>{row?.approved_at && moment.unix(row?.approved_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Ngày tạo",
                    width: 160,
                    cell: row => {
                        return <>{moment.unix(row?.created_at).format("DD-MM-YYYY hh:mm:ss")}</>;
                    }
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => {
                        return <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_status} value={row?.status}/>;
                    }
                },
                {
                    title: "Trạng thái thanh toán",
                    width: 100,
                    cell: row => {
                        return (
                            <>
                                <SpanCommon idKey={Constant.COMMON_DATA_KEY_payment_status}
                                            value={row?.payment_status}/>
                                {row?.confirm_payment_status &&
                                    (<>
                                            <br/>
                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_confirm_payment_status}
                                                        value={row?.confirm_payment_status}/>
                                        </>
                                    )}
                                {row?.request_approve_status && (
                                    <>
                                        <br/>
                                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_request_approve_status}
                                                    value={row?.request_approve_status}/>
                                    </>
                                )

                                }

                            </>
                        )
                    }
                },
                {
                    title: "Tổng tiền",
                    width: 120,
                    cell: row => {
                        const taxRate = (100 + Number(row?.vat_percent)) / 100;
                        const totalAmount = row?.is_include_tax === true ? row?.total_amount_unit : row?.total_amount_unit * taxRate
                        return <>{utils.formatNumber(totalAmount, 0, ".", "đ")}</>;
                    }
                },
                {
                    title: "GPKD",
                    width: 100,
                    cell: row => {
                        return <>
                            <SpanCommon
                                idKey={Constant.COMMON_DATA_KEY_employer_business_license_status}
                                value={row?.employer_info?.business_license_status}
                            />
                            {!Constant.RIVAL_TYPE_DONT_SHOW_WARNING.includes(row?.employer_info?.rival_type) && row?.employer_info?.rival_type &&
                                <PopOver
                                    renderTitle={<i className='glyphicon glyphicon-warning-sign text-danger' style={{
                                        fontSize: "15px",
                                        marginLeft: "5px"
                                    }}/>}>
                                    {<CommonText
                                        idKey={Constant.COMMON_DATA_KEY_employer_rival_type}
                                        value={row?.employer_info?.rival_type}
                                        notStyle
                                    /> || "Chưa duyệt"}
                                </PopOver>
                            }
                        </>
                    }
                },
                {
                    title: "CSKH",
                    width: 160,
                    cell: row => {
                        const {employer_info} = row;
                        return <>{employer_info?.assigned_staff_username}</>
                    }
                },
            ],
            loading: false,
            flagQrCode: false,
            isLoadData: false,
        };
    }

    async _getConfig() {
        const res = await getListConfig({code: Constant.CONFIG_FLAG_QRCODE_CODE});
        if (res && res?.items?.length > 0) {
            const [config] = res?.items;
            this.setState({
                flagQrCode: Number(config?.value) === Constant.CONFIG_FLAG_QRCODE_LOAD,
            });
        }
        this.setState({isLoadData: true});
    }

    componentDidMount() {
        this._getConfig();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location && prevProps.location && window) {
            if(this.props.location?.pathname !== prevProps.location?.pathname){
                window.location.reload()
            }
        }
     }

    render() {
        const {columns, idKey, flagQrCode, isLoadData} = this.state;
        const {query, defaultQuery, history} = this.props;
        const  pathname = window.location.pathname;
        const queryMerge = flagQrCode ? {
            ...query,
            ...(query.page ? {} : {
                request_approve_status: Constant.REQUEST_APPROVE_STATUS_YES,
                "created_at[from]": moment().startOf('year').unix(),
                "created_at[to]": moment().unix(),
                sales_ops_approve_status: pathname === Constant.BASE_URL_SALES_OPS_APPROVE_SALES_ORDER
                  ? Constant.SALES_OPS_APPROVE_STATUS_WAITING
                  : Constant.SALES_OPS_APPROVE_STATUS_YES,
            })
        } : query;
        const null_filter = Object.keys(query).filter(_ => !['page', 'per_page'].includes(_)).length === 0;
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
            >
                {null_filter && (
                    <div className="text-center font-bold text-italic mb10">
                        Do lượng dữ liệu lớn, vui lòng chọn ít nhất 1 bộ lọc để tiếp tục tra cứu!
                    </div>
                )}
                {isLoadData && (
                    <Gird idKey={idKey}
                          fetchApi={getListSalesOrderRegistration}
                          query={queryMerge}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                    />
                )}
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
