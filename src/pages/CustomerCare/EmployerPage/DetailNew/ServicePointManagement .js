import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import ComponentFilter from "./ServicePoint/ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import {getPointActive, getListPoint} from "api/saleOrder";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";

class ServicePointManagement extends React.Component {
    constructor(props) {
        super(props);

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
                    title: "Thời gian",
                    width: 170,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },

                {
                    title: "Trạng thái",
                    width: 140,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_service_point_history_fe}
                                    value={row.type}/>
                    )
                },
                {
                    title: "Số điểm",
                    width: 120,
                    cell: row => {
                        const STATUS_INCREMENTAL = [1, 5, 6]; // Kích hoạt điểm, Điểm bảo hành hồ sơ, Hoàn điểm từ cam kết CV
                        const isIncrementalPoint = STATUS_INCREMENTAL.includes(Number(row?.type));
                        return (
                            <React.Fragment>
                                {isIncrementalPoint ? `+${row?.total_point || ""}` : `-${row?.total_point || ""}`}
                            </React.Fragment>
                        )
                    }
                },
                // {
                //     title: "Miền",
                //     width: 120,
                //     cell: row => {
                //         return (
                //             <SpanCommon idKey={Constant.COMMON_DATA_KEY_area}
                //                     value={row.displayed_area}/>
                //         )
                //     }
                // },
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
                <ComponentFilter idKey={"ServicePoint"}/>
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
                        <Gird idKey={"ServicePoint"} fetchApi={getPointActive}
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

export default connect(mapStateToProp, null)(ServicePointManagement);
