import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import Gird from "components/Common/Ui/Table/Gird";
import {getListHeadhuntApplicantLog} from "api/headhunt";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import moment from "moment";

const idKey = "ApplicantLogDetail";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Họ tên",
                    width: 100,
                    accessor: "applicant_info.seeker_name"
                },
                {
                    title: "Số điện thọai",
                    width: 100,
                    accessor: "applicant_info.seeker_phone"
                },
                {
                    title: "Email",
                    width: 100,
                    accessor: "applicant_info.seeker_email"
                },
                {
                    title: "Tiêu đề hồ sơ",
                    width: 100,
                    accessor: "applicant_info.resume_title"
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_status}
                                    value={row?.applicant_info.status}/>,
                },
                {
                    title: "Nguồn",
                    width: 100,
                    cell: row =>
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_headhunt_applicant_source}
                                    value={row?.applicant_info.data_source}/>,
                },
                {
                    title: "Ngày UV tham gia phỏng vấn",
                    width: 100,
                    cell: row => row.applicant_info.date_interview > 0 && moment.unix(row.applicant_info.date_interview).format('DD/MM/YYYY')
                },
                {
                    title: "Ngày dự tính nhận việc",
                    width: 100,
                    cell: row => row.applicant_info.date_join > 0 && moment.unix(row.applicant_info.date_join).format('DD/MM/YYYY')
                },
                {
                    title: "Thời gian đã đến nhận việc",
                    width: 100,
                    cell: row => row.applicant_info.date_actual_join > 0 && moment.unix(row.applicant_info.date_actual_join).format('DD/MM/YYYY')
                },
                {
                    title: "Tổng thời gian làm việc",
                    width: 100,
                    accessor: "row.applicant_info.total_date_work",
                },
                {
                    title: "Người cập nhật",
                    width: 100,
                    accessor: "applicant_info.created_by"
                },
                {
                    title: "Ghi chú",
                    width: 100,
                    accessor: "applicant_info.note"
                },
                {
                    title: "Ngày cập nhật",
                    width: 100,
                    time: true,
                    accessor: "applicant_info.created_at"
                },
            ]
        };
    }

    render() {
        const {query, defaultQuery, history, id} = this.props;
        const {columns} = this.state;

        return (
            <div className="padding-10">
                <Gird idKey={idKey}
                      fetchApi={getListHeadhuntApplicantLog}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, q: id}}
                      history={history}
                      isRedirectDetail={false}
                      isPagination={false}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
