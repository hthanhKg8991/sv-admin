import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getResume} from "api/seeker";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SeekerCare/ResumeHistoryPage/ComponentFilter";
import moment from "moment";
import {putToastSuccess} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import _ from 'lodash';
import {Link} from 'react-router-dom';
import queryString from "query-string";

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = {...props.query, ...{action: 'detail'}};
        this.state = {
            columns: [
                {
                    title: "Tiêu đề hồ sơ",
                    width: 220,
                    onClick: () => {},
                    cell: row => (
                        <Link to={`${Constant.BASE_URL_SEEKER_RESUME_APPLIED_HISTORY}?${queryString.stringify({...paramsQuery, ...{id: row.id}})}`}>
                            <span>{row.id}</span> -
                            {parseInt(row.resume_type) === Constant.RESUME_NORMAL_FILE && (
                                <i className="fa mr-1 fa-paperclip text-info text-bold"/>)}
                            <span className="ml5">{row?.title}</span>
                            {row?.old_channel_code === Constant.CHANNEL_CODE_MW && row?.channel_code === Constant.CHANNEL_CODE_VL24H && (
                                <span className="ml5 label" style={{background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)"}}>MW</span>
                            )}
                            {row?.old_channel_code === Constant.CHANNEL_CODE_TVN && row?.channel_code === Constant.CHANNEL_CODE_VL24H && (
                                <span className="ml5 label" style={{background: "#E41E26", color: "rgb(255, 255, 255)"}}>TVN</span>
                            )}
                        </Link>
                    )
                },
                {
                    title: "Họ tên",
                    width: 140,
                    cell: row => (
                        <React.Fragment>
                            {row?.seeker_info?.name}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái NTV",
                    width: 140,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_status} value={row?.seeker_info?.status}
                        />
                    )
                },
                {
                    title: "Nguồn",
                    width: 80,
                    cell: row => <SpanCommon idKey={Constant.COMMON_DATA_KEY_created_source} value={row.created_source}
                                             notStyle/>,
                },
                {
                    title: "Trạng thái",
                    width: 120,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_history_status}
                                    value={_.get(row, 'status')}/>
                    )
                },
                {
                    title: "Ngày cập nhật ",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            {row.updated_at && moment.unix(row.updated_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Ngày tạo",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            {row.created_at && moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
            ],
            loading: false,
        };
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, user, is_archived} = this.props;
        const idKey = "ResumeAppliedHistoryList";

        // Nếu NTV là CSNTV trưởng nhóm hoặc nhóm viên thì tự động fill
        const staffFilter = [Constant.DIVISION_TYPE_seeker_care_leader, Constant.DIVISION_TYPE_seeker_care_member].includes(user?.data?.division_code) ?
            {staff_q: user?.data?.id} : {};
        const subQuery = {...query, ...staffFilter, "order_by[updated_at]": "desc", "includes": "job_info,employer_info,resume_info,seeker_info", "resume_type": Constant.RESUME_HISTORY_TYPE_QUICK_APPLIED, "status": Constant.RESUME_HISTORY_STATUS_INACTIVE, 'is_resume_quick_applied': 1}

        return (
            <Default
                left={(
                    <WrapFilter is_archived={is_archived} idKey={idKey} history={history} query={subQuery} ComponentFilter={ComponentFilter}/>
                )}
                title={`Danh Sách Hồ Sơ Nộp Nhanh ${is_archived ? "Đã Xóa" : ""}`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey} fetchApi={getResume}
                      query={subQuery}
                      columns={columns}
                      defaultQuery={{...defaultQuery, permission: "true"}}
                      history={history}/>
            </Default>
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
        actions: bindActionCreators({putToastSuccess}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
