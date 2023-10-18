import React, {Component} from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {getJobDaily, saveLogsDailyViewed} from "api/employer";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/JobDailyPage/ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import SpanCommon from 'components/Common/Ui/SpanCommon';
import SpanService from 'components/Common/Ui/SpanService';
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import queryString from "query-string";
import {Link} from "react-router-dom";
import _ from "lodash";

const idKey = "JobDailyPage";

class List extends Component {
    constructor(props) {
        super(props);
        const { channel_code } = props.currentBranch;
        const linkFe = Constant.URL_FE[channel_code];
        const isMW = channel_code === Constant.CHANNEL_CODE_MW;
        this.state = {
            columns: [
                {
                    title: "Tiêu đề TTD",
                    width: 160,
                    cell: (row) => (
                        <a className="cursor-pointer textBlue"
                           href={`${linkFe}/short/job/${row?.job_info?.id}`}
                           onClick={() => this.onViewed(row)}
                           target={"_blank"}
                           rel="noopener noreferrer"
                        >
                           {`${row?.job_info?.id} - ${row?.job_info?.title}`}
                       </a>
                    )
                },
                {
                    title: "Ngày cập nhật",
                    width: 100,
                    cell: row => moment.unix(row?.job_info?.updated_at).format("DD-MM-YYYY"),
                },
                {
                    title: "Ngày hết hạn",
                    width: 100,
                    cell: row => moment.unix(row?.job_info?.resume_apply_expired).format("DD-MM-YYYY"),
                },
                {
                    title: "Nhà tuyển dụng",
                    width: 160,
                    cell : (row) => (
                        <>
                            <Link to={`${Constant.BASE_URL_EMPLOYER}?${queryString.stringify({action: "detail", id: row?.employer_info?.id})}`}>
                                <span className="cursor-pointer">{row?.employer_info?.name}</span>
                            </Link><br/>
                            <p className="mb0">{row?.employer_info?.email}</p>
                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_status}
                                        value={row?.employer_info?.status}/>
                        </>
                    ),
                },
                {
                    title: "CSKH",
                    width: 200,
                    accessor: "employer_info.assigned_staff_username",
                },
                {
                    title: "Người view",
                    width: 200,
                    cell: row => (
                        row?.viewed_created_at &&
                        <CanRender actionCode={ROLES.customer_care_staff_job_viewed_daily_view_viewer}>
                            {row?.viewed_staff_username} <br/> {moment.unix(row?.viewed_created_at).format("DD-MM-YYYY HH:mm:ss")}
                        </CanRender>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_viewed_status}
                                    value={row?.viewed_staff}/>
                    )
                },
                {
                    title: "Gói phí",
                    width: 240,
                    cell: row => {
                        let services = row?.service_code;
                        if(services?.length > 2) {
                            services = _.uniq(services);
                        }
                        const isDuplicateJobBasic = row?.service_code
                            ?.filter(s => Constant.SERVICE_IGNORE_BY_CHANNEL[channel_code].includes(s.toString()))
                            ?.length === 2;
                        return services?.map((c, idx) => {
                            /*
                                - Khác kênh MW thì hiển thị tất cả các service_code trả về
                                - Đối với kênh MW
                                    + Nếu có 1 service_code thì hiển thị bình thường
                                    + Nếu có 2 service_code thì bỏ gói tin cơ bản
                                    + Trên 2 service_code thì lọc trùng chỉ giữ lại 1 tin cơ bản
                            */
                            const isOnlyJobBasic = row?.service_code?.length === 1;
                            const isIgnore = Constant.SERVICE_IGNORE_BY_CHANNEL[channel_code].includes(c.toString());
                            return (
                                <p className="mb0" key={idx.toString()}>
                                    {
                                        (
                                            !isMW ||
                                            isOnlyJobBasic ||
                                            !isIgnore ||
                                            isDuplicateJobBasic
                                        )
                                        &&
                                        <SpanService value={c} notStyle/>
                                    }
                                </p>
                            );
                        });
                    }
                },
            ],
            loading: false,
        };
        this.onViewed = this._onViewed.bind(this);
    }

    async _onViewed(row) {
        const { job_info } = row;
        const job_id = job_info?.id;
        const res = await saveLogsDailyViewed({ job_id });
        if(res) {
            publish(".refresh", {}, idKey);
        }
    }

    render() {
        const { columns } = this.state;
        const { query, defaultQuery, history } = this.props;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="DS tin trong ngày"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getJobDaily}
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
        actions: bindActionCreators({ putToastSuccess, SmartMessageBox, hideSmartMessageBox },
            dispatch),
        uiAction: bindActionCreators({ createPopup }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        currentBranch: state.branch.currentBranch,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
