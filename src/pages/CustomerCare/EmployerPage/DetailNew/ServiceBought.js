import React from "react";
import _ from "lodash";
import {connect} from "react-redux";
import ComponentFilter from "./ServiceBought/ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import {getHistoryBought, getHistoryBoughtDetail} from "api/saleOrder";
import moment from "moment";
import SpanServiceAll from "components/Common/Ui/SpanServiceAll";
import SpanServiceUnitAll from "components/Common/Ui/SpanServiceUnitAll";
import {formatNumber} from 'utils/utils';
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";

class ServiceBought extends React.Component {
    constructor(props) {
        super(props);
        const channel_code = props.branch.currentBranch.channel_code;
        this.state = {
            columns: [
                {
                    title: "Mã phiếu",
                    width: 400,
                    cell: row => <>
                        {row?.sales_order_code}
                        {Number(row?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT &&
                            <span className="text-red ml5">(Tặng)</span>}
                        {row.old_channel_code === Constant.CHANNEL_CODE_MW && <span className="ml5 label" style={{
                            background: "rgb(50, 118, 177)",
                            color: "rgb(255, 255, 255)"
                        }}>MW</span>}
                        {row.old_channel_code === Constant.CHANNEL_CODE_TVN && <span className="ml5 label" style={{
                            background: "#E41E26",
                            color: "rgb(255, 255, 255)"
                        }}>TVN</span>}
                    </>
                },
                {
                    title: "Ngày ghi nhận",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {row.approved_at && moment.unix(row.approved_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hạn dùng",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {row.expired_at && moment.unix(row.expired_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Doanh thu phiếu",
                    width: 80,
                    cell: row => {
                        const taxRate = (100 + Number(row?.vat_percent)) / 100;
                        return <span>{formatNumber(row?.is_include_tax === true ? row?.total_amount : row?.total_amount * taxRate)}</span>
                    }
                },
            ],
            columnsExpand: [
                {
                    title: "Gói",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {row.service_type === "effect" &&
                                ![`${channel_code}.refresh_hour`, `${channel_code}.refresh_day`].includes(row?.service_code) &&
                                <>
                                    {`${row?.service_items_info?.cache_parent_service_name ?
                                        `${row?.service_items_info?.cache_parent_service_name} - ` : ""
                                    }`}
                                </>
                            }
                            <SpanServiceAll value={row.service_code} notStyle/>
                            {_.get(row, 'cache_job_title') && ` - ${_.get(row, 'cache_job_title')}`}
                            {Number(row?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT &&
                                <span className="text-red ml5">(Tặng)</span>}
                            {row?.combo_name &&
                                <span className="text-red ml5">({row?.combo_id} - {row?.combo_name})</span>}
                        </React.Fragment>
                    )
                },
                {
                    title: "Số lượng",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {_.get(row, 'quantity_buy') < 0 ? "Không giới hạn" : _.get(row, 'quantity_buy')}
                            {
                                _.get(row, 'quantity_buy') >= 0 &&
                                Constant.Service_Code_Account_Service_Filter_Resume === row.service_code ? " CV" :
                                    <SpanServiceUnitAll value={row.service_code} notStyle/>
                            }
                        </React.Fragment>
                    )
                },
                {
                    title: "Miền dịch vụ",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_area}
                                             value={row?.service_items_info?.displayed_area}/>
                },
                {
                    title: "Thời gian",
                    width: 100,
                    cell: row => (
                        <React.Fragment>
                            {row.week_quantity} Tuần
                            {row.day_quantity > 0 && row.day_quantity + ' ngày'}
                        </React.Fragment>
                    )
                },
                {
                    title: "Đã dùng",
                    width: 80,
                    accessor: "quantity_used"
                },
                {
                    title: "Chưa dùng",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {row.quantity_buy >= 0 ? row.quantity_remain : "Không giới hạn"}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hạn gói",
                    width: 80,
                    cell: row => (
                        <div>
                            {row.quantity_remain !== 0 && (
                                <span>
                                    {moment.unix(row.combo_group_id && row.combo_expired_at ? row.combo_expired_at : row.sub_item_expired_at).format(
                                        "DD/MM/YYYY")}
                                </span>
                            )}
                        </div>
                    )
                },
                {
                    title: "Mã dịch vụ",
                    width: 80,
                    accessor: "id"
                },
                {
                    title: "Hạn bảo lưu",
                    width: 120,
                    cell: row => (
                        <React.Fragment>
                            {row?.reserve_expired_at && moment.unix(row.reserve_expired_at).format(
                                "DD/MM/YYYY HH:mm:ss")}
                            {parseInt(row?.remaining_point) >= 0 &&
                                <span className="ml5">(Điểm: {row?.remaining_point})</span>}
                        </React.Fragment>
                    )
                },
            ]
        };
        this.expandRow = this._expandRow.bind(this);
    }

    _expandRow(row) {
        const {history} = this.props;
        const {columnsExpand} = this.state;

        return (
            <div style={{maxHeight: "30vh", overflowY: "scroll",}}>
                <Gird idKey={"ServiceBoughtDetail"} fetchApi={getHistoryBoughtDetail}
                      defaultQuery={{
                          sales_order_id: _.get(row, 'id'),
                          employer_id: _.get(row, 'employer_id'),
                      }}
                      columns={columnsExpand}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                      isPagination={false}/>
            </div>
        )
    };

    render() {
        const {employer, history} = this.props;
        const {columns} = this.state;

        return (
            <React.Fragment>
                <ComponentFilter idKey={"ServiceBought"}/>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"ServiceBought"} fetchApi={getHistoryBought}
                              defaultQuery={{employer_id: _.get(employer, 'id')}}
                              columns={columns}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                              expandRow={row => this.expandRow(row)}/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    };
}

export default connect(mapStateToProps)(ServiceBought);

