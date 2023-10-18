import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import ComponentFilter from "./ServiceActivated/ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import {getHistoryActived, getListPoint} from "api/saleOrder";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";

class ServiceActivated extends React.Component {
    constructor(props) {
        super(props);
        const {services, effects} = props;

        this.state = {
            columns: [
                {
                    title: "Mã phiếu",
                    width: 80,
                    cell: row => (
                        <Link to={`${Constant.BASE_URL_SALES_ORDER}?${queryString.stringify({
                            action: "detail",
                            id: row.sales_order_id
                        })}`}>
                            <span className={"text-link"}>{row.sales_order_id}</span>
                        </Link>
                    )
                },
                {
                    title: "Gói dịch vụ",
                    width: 400,
                    cell: row => (
                        <React.Fragment>
                            <div>
                                {/* Registration ID */}
                                {row?.id}

                                {/* Service name */}
                                {services && services.find(s => s?.code === row?.service_code)?.name &&
                                    <>
                                        <span className={"ml5 mr5"}>-</span>
                                        {services.find(s => s?.code === row?.service_code)?.name }
                                    </>
                                }

                                {/* Effect */}
                                {row?.service_type === Constant.SERVICE_TYPE_EFFECT &&
                                effects.find(s => s?.code === row?.service_code)?.name &&
                                    <>{`- ${effects.find(s => s?.code === row?.service_code)?.name}`}</>
                                }

                                {/* Job name */}
                                {row?.cache_job_title && (
                                    <>
                                        <span className={"ml5 mr5"}>-</span>
                                        <Link to={`${Constant.BASE_URL_JOB}?${queryString.stringify({
                                            action: "detail",
                                            id: row?.job_id
                                        })}`}>
                                            <span className={"text-link"}>{row?.cache_job_title}</span>
                                        </Link>
                                    </>
                                )}

                                {/* Type campaign */}
                                {Number(row?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT &&
                                <span className="text-red ml5">(Tặng)</span>}

                                {/* Tin chọn lọc */}
                                {row?.sales_order_id === null && row?.sales_order_items_id === null &&
                                !Constant.SERVICES_GUARANTEE.includes(row?.service_type) &&
                                    <span className="text-blue ml5">(Tin chọn lọc)</span>
                                }
                                {row.old_channel_code === Constant.CHANNEL_CODE_MW && <span className="ml5 label" style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW</span>}
                                {row.old_channel_code === Constant.CHANNEL_CODE_TVN && <span className="ml5 label" style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN</span>}
                            </div>
                            <div>
                                {row?.total_point && row?.remaining_point && (
                                    <span
                                        className="textRed">{row?.remaining_point || 0} / {row?.total_point || 0}</span>
                                )}
                            </div>
                        </React.Fragment>
                    )
                },
                {
                    title: "Thời gian đăng ký",
                    width: 170,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.start_date).format("DD/MM/YYYY")} -
                            {moment.unix(row.end_date).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Thời gian thực tế",
                    width: 170,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.start_date).format("DD/MM/YYYY")} -
                            {moment.unix(row?.expired_at || row?.end_date).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hạn bảo lưu",
                    width: 120,
                    cell: row => {
                        const [item] = row?.items_sub || [];
                        return (
                            <React.Fragment>
                                {item?.reserve_expired_at || ""}
                            </React.Fragment>
                        )
                    }
                },
                {
                    title: "Nhãn gói",
                    width: 120,
                    cell: row => {
                        return (
                            <React.Fragment>
                                {row?.combo_name || ""}
                            </React.Fragment>
                        )
                    }
                },
                {
                    title: "Miền",
                    width: 120,
                    cell: row => {
                        return (
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_area}
                                    value={row.displayed_area}/>
                        )
                    }
                },
                {
                    title: "Trạng thái",
                    width: 140,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_regis_status_filter_actived}
                                    value={row.status}/>
                    )
                },
            ],
            point: null,
        };
    }

    async fetchData() {
        const {employer} = this.props;
        const res = await getListPoint({employer_id: employer.id});
        if (res) {
            this.setState({point: res.data});
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const {employer, history, branch} = this.props;
        const {columns, point} = this.state;
        const {channel_code} = branch.currentBranch;

        let remainingGuaranteePoint = 0;
        let totalGuaranteePoint = 0;

        switch (channel_code) {
            case Constant.CHANNEL_CODE_VL24H:
                remainingGuaranteePoint = Number(point?.guarantee_service?.remaining_point || 0);
                totalGuaranteePoint = Number(point?.guarantee_service?.total_point || 0);
                break;
            case Constant.CHANNEL_CODE_TVN:
                remainingGuaranteePoint = Number(point?.guarantee_service?.remaining_point || 0) +
                    Number(point?.guarantee_service_basic?.remaining_point || 0);
                totalGuaranteePoint = Number(point?.guarantee_service?.total_point || 0) +
                    Number(point?.guarantee_service_basic?.total_point || 0);
                break;
            default:
        }

        return (
            <React.Fragment>
                <ComponentFilter idKey={"ServiceActivated"}/>
                <div className={"row mt15"}>
                    <div className="col-md-12">

                        <span className="ml12">Điểm mua</span>
                        <span>{` ${point?.filter_resume_2018?.remaining_point || 0} / 
                        ${point?.filter_resume_2018?.total_point || 0}`}</span>

                        <span className="ml12 mr5">Điểm BH tin</span>
                        <span>{remainingGuaranteePoint} /{totalGuaranteePoint}</span>

                        <span className="ml12">Điểm BH Lọc</span>
                        <span>{` ${point?.guarantee_resume?.remaining_point || 0} / 
                        ${point?.guarantee_resume?.total_point || 0}`}</span>

                        <span className="ml12">Điểm tặng tin ghim</span>
                        <span>{` ${point?.point_gift?.remaining_point || 0} / 
                        ${point?.point_gift?.total_point || 0}`}</span>

                        <span className="ml12">CVs mua</span>
                        <span>{` ${point?.account_service_filter_resume?.remaining_point || 0} / 
                        ${point?.account_service_filter_resume?.total_point || 0}`}</span>

                        <span className="ml12">CVs bảo hành</span>
                        <span>{` ${point?.guarantee_as_resume?.remaining_point || 0} / 
                        ${point?.guarantee_as_resume?.total_point || 0}`}</span>

                    </div>
                </div>
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"ServiceActivated"} fetchApi={getHistoryActived}
                              defaultQuery={{employer_id: _.get(employer, 'id')}}
                              columns={columns}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProp(state) {
    return {
        branch: state.branch
    }
}

export default connect(mapStateToProp, null)(ServiceActivated);
