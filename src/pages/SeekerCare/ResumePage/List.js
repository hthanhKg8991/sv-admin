import React, { Component } from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import { getResume } from "api/resume";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/SeekerCare/ResumePage/ComponentFilter";
import moment from "moment";
import { putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { CHANNEL_CODE_VL24H } from "utils/Constant";

class List extends Component {
  constructor(props) {
    super(props);
    const paramsQuery = { ...props.query, ...{ action: "detail" } };
    this.state = {
      columns: [
        {
          title: "Tiêu đề hồ sơ",
          width: 220,
          onClick: () => {},
          cell: (row) => (
            <Link to={`${Constant.BASE_URL_SEEKER_RESUME}?${queryString.stringify({ ...paramsQuery, ...{ id: row.id } })}`}>
              <span>{row.id}</span> -
              {parseInt(row.resume_type) === Constant.RESUME_NORMAL_FILE && (
                <i className="fa mr-1 fa-paperclip text-info text-bold" />
              )}
              <span className="ml5">{row.title}</span>
              {row?.old_channel_code === Constant.CHANNEL_CODE_MW && row?.channel_code === Constant.CHANNEL_CODE_VL24H && (
                <span className="ml5 label" style={{ background: "rgb(50, 118, 177)", color: "rgb(255, 255, 255)" }}>
                  MW
                </span>
              )}
              {row?.old_channel_code === Constant.CHANNEL_CODE_TVN && row?.channel_code === Constant.CHANNEL_CODE_VL24H && (
                <span className="ml5 label" style={{ background: "#E41E26", color: "rgb(255, 255, 255)" }}>
                  TVN
                </span>
              )}
            </Link>
          ),
        },
        {
          title: "Họ tên",
          width: 140,
          cell: (row) => <React.Fragment>{row?.seeker_info?.name}</React.Fragment>,
        },
        {
          title: "Trạng thái hiển thị",
          width: 120,
          cell: (row) => <SpanCommon idKey={Constant.COMMON_DATA_KEY_is_search_allowed} value={row?.is_search_allowed} />,
        },
        {
          title: "Trạng thái ứng tuyển",
          width: 120,
          cell: (row) => <SpanCommon idKey={Constant.COMMON_DATA_KEY_is_applied_status_new} value={row?.is_applied_status_new} />,
        },
        {
          title: "Nguồn",
          width: 80,
          accessor: "created_source",
        },
        {
          title: "CSKH",
          width: 160,
          cell: (row) => <React.Fragment>{row?.seeker_info?.assigned_staff_login_name}</React.Fragment>,
        },
        {
          title: "Trạng thái",
          width: 120,
          cell: (row) => <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_status} value={_.get(row, "status_combine")} />,
        },
        {
          title: "Ngày cập nhật",
          width: 160,
          cell: (row) => <React.Fragment>{moment.unix(row.updated_at).format("DD/MM/YYYY HH:mm:ss")}</React.Fragment>,
        },
        {
          title: "Ngày tạo",
          width: 160,
          cell: (row) => (
            <React.Fragment>{row.created_at && moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}</React.Fragment>
          ),
        },
      ],
      loading: false,
    };
  }

  render() {
    const { columns } = this.state;
    const { query, defaultQuery, history, user, is_archived } = this.props;
    const idKey = "ResumeList";

    // Nếu NTV là CSNTV trưởng nhóm hoặc nhóm viên thì tự động fill
    const staffFilter = [Constant.DIVISION_TYPE_seeker_care_leader, Constant.DIVISION_TYPE_seeker_care_member].includes(
      user?.data?.division_code
    )
      ? { staff_q: user?.data?.id }
      : {};

    return (
      <Default
        left={
          <WrapFilter is_archived={is_archived} idKey={idKey} history={history} query={query} ComponentFilter={ComponentFilter} />
        }
        title={`Danh Sách Hồ Sơ ${is_archived ? "Đã Xóa" : ""}`}
        titleActions={
          <button
            type="button"
            className="bt-refresh el-button"
            onClick={() => {
              publish(".refresh", {}, idKey);
            }}
          >
            <i className="fa fa-refresh" />
          </button>
        }
      >
        <Gird
          idKey={idKey}
          fetchApi={getResume}
          query={{ ...query, ...staffFilter, "order_by[updated_at]": "desc" }}
          columns={columns}
          defaultQuery={defaultQuery}
          history={history}
        />
      </Default>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
