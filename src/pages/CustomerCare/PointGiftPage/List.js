import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getPointGiftList} from "api/saleOrder";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox,} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import queryString from 'query-string';
import SpanCommon from "components/Common/Ui/SpanCommon";
import SpanService from "components/Common/Ui/SpanService";
import moment from "moment";

const idKey = "PointGiftManage";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Nhà tuyển dụng",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            <span  className="cursor-pointer"
                                style={{ color: '#3276b1' }}>{row?.employer_info?.id} - {row?.employer_info?.name}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.employer_id
                        };
                        window.open(Constant.BASE_URL_EMPLOYER + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Tin tuyển dụng",
                    width: 160,
                    cell: row => (
                        <>
                            {row?.registration_from_info &&
                                <React.Fragment>
                                    <span className="cursor-pointer" style={{color: '#3276b1'}}>
                                        {row?.registration_from_info?.job_id} - {row?.registration_from_info?.cache_job_title}
                                    </span>
                                </React.Fragment>
                            }
                        </>
                    ),
                    onClick: row => {
                        if(!row?.registration_from_info) {
                            return false;
                        }
                        const params = {
                            action: 'detail',
                            id: row?.registration_from_info?.job_id
                        };
                        window.open(Constant.BASE_URL_JOB + '?' + queryString.stringify(params));
                    }
                },
                {
                    title:"Gói phí",
                    width: 160,
                    cell: row => (
                        <>
                            <SpanService value={row?.registration_from_info?.service_code} notStyle/><br/>
                            {row?.registration_from_info && (
                                <>
                                    {row?.registration_from_info?.start_date &&
                                        moment.unix(row?.registration_from_info?.start_date).format("DD-MM-YYYY")}
                                    <span> - </span>
                                    {row?.registration_from_info?.expired_at &&
                                        moment.unix(row?.registration_from_info?.expired_at).format("DD-MM-YYYY")}
                                </>
                            )}
                        </>
                    )
                },
                {
                    title:"Gói điểm tặng",
                    width: 120,
                    cell: row => (
                        <>
                            Gói điểm dịch vụ: <b>{row?.point}</b> điểm <br/>
                            {row?.registration_to_info && (
                                <>
                                    {row?.registration_to_info?.start_date &&
                                        moment.unix(row?.registration_to_info?.start_date).format("DD-MM-YYYY")}
                                    <span> - </span>
                                    {row?.registration_to_info?.expired_at &&
                                        moment.unix(row?.registration_to_info?.expired_at).format("DD-MM-YYYY")}
                                </>
                            )}
                        </>
                    )
                },
                {
                    title:"Số điểm còn lại",
                    width: 120,
                    accessor: "registration_to_info.remaining_point"
                },
                {
                    title: "Trạng thái",
                    width: 70,
                    cell: row => (
                        <SpanCommon value={row?.status}
                                    idKey={Constant.COMMON_DATA_KEY_point_gift_status}/>
                    )
                },
            ]
        };
    }


    render() {
        const { columns } = this.state;
        const { query, history } = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Quản Lý Điểm Lọc Tặng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getPointGiftList}
                      query={query}
                      columns={columns}
                      defaultQuery={{}}
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
            SmartMessageBox,
            hideSmartMessageBox
        }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(List);
