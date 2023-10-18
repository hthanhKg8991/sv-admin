import React from "react";
import _ from "lodash";

import Gird from "components/Common/Ui/Table/Gird";
import {getHistoryActived} from "api/saleOrder";
import SpanCommon from "components/Common/Ui/SpanCommon";
import SpanService from "components/Common/Ui/SpanService";
import * as Constant from "utils/Constant";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";

class ServiceActivated extends React.Component {
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
                    title: "Tên Box Phí",
                    width: 400,
                    cell: row => <>
                        {row?.id}
                        <span className={"ml5 mr5"}>-</span>
                        <SpanService value={row.service_code} notStyle/>
                        {
                            (
                                Number(row?.type_campaign) === Constant.CAMPAIGN_TYPE_GIFT ||
                                Number(row?.fee_type) === Constant.FREE_TYPE_BONUS
                            ) &&
                            <span className="text-red ml5">(Tặng)</span>
                        }
                        {row?.sales_order_id === null &&
                        row?.sales_order_items_id === null &&
                            !Constant.SERVICES_GUARANTEE.includes(row?.service_type) &&
                            <span className="text-blue ml5">(Tin chọn lọc)</span>
                        }
                    </>

                },
                {
                    title: "Thời gian đăng ký",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.start_date).format("DD/MM/YYYY")} - {moment.unix(row.end_date).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Thời gian chạy thực tế",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.start_date).format("DD/MM/YYYY")} - {moment.unix(row.expired_at).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 200,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_sales_order_regis_status}
                                    value={row.status}/>
                    )
                },
            ]
        };
    }

    render() {
        const {job, history} = this.props;
        const {columns} = this.state;

        return (
            <React.Fragment>
                {/*<ComponentFilter idKey={"ServiceActivated"}/>*/}
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"ServiceActivated"} fetchApi={getHistoryActived}
                              defaultQuery={{job_id: _.get(job, 'id'), employer_id:_.get(job, 'employer_id')}}
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

export default ServiceActivated
