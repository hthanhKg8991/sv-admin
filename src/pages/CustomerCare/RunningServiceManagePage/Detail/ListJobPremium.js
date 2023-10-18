import React from "react";
import ComponentFilter from "../ComponentFilter";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import {getListPremiumJob} from 'api/saleOrder';
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastSuccess, SmartMessageBox} from 'actions/uiAction';
import {connect} from 'react-redux';
import SpanService from 'components/Common/Ui/SpanService';
import moment from "moment";
import SpanJobField from "components/Common/Ui/SpanJobField";

class ListJobPremium extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tin tuyển dụng",
                    width: 150,
                    cell: (row) => (
                        <a href={`${Constant.BASE_URL_JOB}?action=detail&id=${row?.job_info?.id}`}
                           target="_blank" rel="noopener noreferrer">{row?.job_info?.title}</a>
                    )
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 150,
                    cell: (row) => (
                        <a href={`${Constant.BASE_URL_EMPLOYER}?action=detail&id=${row?.employer_info?.id}`}
                           target="_blank" rel="noopener noreferrer">{row?.employer_info?.name}</a>
                    )
                },
                {
                    title: "Gói dịch vụ",
                    width: 170,
                    cell: (row) => (<>
                        <SpanService value={row.service_code} notStyle/>
                        {" "}
                        <SpanCommon
                            idKey={Constant.COMMON_DATA_KEY_display_method}
                            value={row.displayed_method}/>
                        {" "}
                        <SpanCommon
                            idKey={Constant.COMMON_DATA_KEY_area}
                            value={row.displayed_area}/>
                        <br/>
                        {   Array.isArray(row?.service_code) &&
                            row.service_code.indexOf("uutien_trangnganh") > 0 &&
                            row?.job_field_id &&
                            <>- <SpanJobField value={row?.job_field_id}/></>
                        }
                    </>)
                },
                {
                    title: "Hiệu ứng",
                    width: 90,
                    cell: row => {
                        return <React.Fragment>
                            {row?.effects_info && row?.effects_info.map((_, idx) => (
                                <div key={idx.toString()}>
                                    <SpanService value={_.effect_code} notStyle/>
                                </div>
                            ))}
                        </React.Fragment>
                    }
                },
                {
                    title: "Bắt đầu",
                    width: 80,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.start_date).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Hết hạn",
                    width: 80,
                    cell: row => {
                        const now = moment(new Date());
                        const end = moment(moment.unix(row?.end_date).format("YYYY-MM-DD"));
                        const duration = moment.duration(end.diff(now));
                        const days = Math.floor(duration.asDays());

                        return <React.Fragment>
                            <div>
                                {moment.unix(row.end_date).format("DD/MM/YYYY HH:mm:ss")}
                            </div>
                            {(days || days === 0) && (
                                <div className="textRed">
                                    {`(Còn ${(days + 1) < 0 ? 0 : days + 1 } ngày)`}
                                </div>
                            )}
                        </React.Fragment>
                    }
                },
                {
                    title: "Hết hạn thực tế",
                    width: 80,
                    cell: row => {
                        const now = moment(new Date());
                        const end = moment(moment.unix(row?.expired_at).format("YYYY-MM-DD"));
                        const duration = moment.duration(end.diff(now));
                        const days = Math.floor(duration.asDays());

                        return <React.Fragment>
                            <div>
                                {moment.unix(row?.expired_at).format("DD/MM/YYYY HH:mm:ss")}
                            </div>
                            {(days || days === 0) && (
                                <div className="textRed">
                                    {`(Còn ${(days + 1) < 0 ? 0 : days + 1 } ngày)`}
                                </div>
                            )}
                        </React.Fragment>
                    }
                },
                {
                    title: "Loại tin",
                    width: 100,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_fee_type} value={row?.fee_type} notStyle/>
                },
                {
                    title: "Nhãn gói",
                    width: 100,
                    cell: row => row?.combo_info?.name
                },
                {
                    title: "Ghi nhận",
                    width: 100,
                    cell: row => (
                        <>
                            <div>
                                {row.approved_by}
                            </div>
                            {row.approved_at && (
                                <div>
                                    {moment.unix(row.approved_at).format("DD/MM/YYYY HH:mm:ss")}
                                </div>
                            )}
                        </>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 90,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_status_registration}
                                    value={row.status}/>
                    )
                },
            ]
        };
    }

    render() {
        const {history, user} = this.props;
        const {columns} = this.state;
        // Nếu NTD là trường nhóm thì filter CSKH thuộc nhóm NTD đó
        const staffFilter = user?.data?.division_code === Constant.DIVISION_TYPE_customer_care_leader ?
            {assigned_staff_id: user?.data?.id} : {};
        const initFilter = {
            ...staffFilter,
            "end_date[from]": moment().unix(),
            "end_date[to]": moment().add(1,'y').unix(),
        }
        return (
            <React.Fragment>
                <ComponentFilter idKey={"CompanyHistoryJob"} type={2} initFilter={initFilter} />
                <div className={"row mt15"}>
                    <div className={"col-md-12"}>
                        <Gird idKey={"CompanyHistoryJob"} fetchApi={getListPremiumJob}
                              defaultQuery={{}}
                              query={initFilter}
                              columns={columns}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox},
            dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListJobPremium)

