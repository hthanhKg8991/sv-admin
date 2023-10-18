import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as uiAction from "actions/uiAction";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { getEmployerFreemiumHistory } from "api/employer";
class PopupDetailHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Người cập nhật",
          width: 150,
          accessor: "updated_by"
        },
        {
          title: "Thời gian",
          width: 100,
          accessor: "created_at",
          time: true,
        },
        {
          title: "Trạng thái freemium",
          width: 100,
          cell: row => (
            <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_freemium_status}
              value={row?.status} />
          )
        },
        {
          title: "Lý do",
          width: 200,
          accessor: "reason"
        },
      ]
    };
  }
  render() {
    const { nameEmployer, query, employer_id } = this.props;
    const { columns } = this.state;
    return (
      <div className="dialog-popup-body">
        <div className="popupContainer history-employer-freemium">
          <div className="row py-3 mb10 mt10">
            <div className="col-xs-4">Tên nhà tuyển dụng</div>
            <div className="col-xs-8 text-bold">{nameEmployer}</div>
          </div>

          <Gird idKey={"PopupDetailPro"}
            defaultQuery={{ employer_id }}
            fetchApi={getEmployerFreemiumHistory}
            query={query}
            columns={columns}
            isRedirectDetail={false}
            isPushRoute={false}
          />
        </div>
        <hr className="v-divider mb10" />

        <div className="v-card-action ">
          <button type="button" className="el-button el-button-primary el-button-small" onClick={() => this.props.uiAction.deletePopup()}>
            <span>Đóng</span>
          </button>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(PopupDetailHistory);

