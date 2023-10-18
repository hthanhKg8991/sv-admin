import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import { bindActionCreators } from "redux";
import { getResumeCvScannerList } from "api/seeker";
import * as uiAction from "actions/uiAction";
import moment from "moment";
import PopupDetail from "./Popup/Detail";
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "ID",
          width: 80,
          cell: (row) => <div className="text-center">{row?.id}</div>,
        },
        {
          title: "Seeker ID",
          width: 120,
          cell: (row) => <div className="text-center">{row?.seeker_id}</div>,
        },
        {
          title: "Hồ sơ ID",
          width: 180,
          cell: (row) => <div className="text-center">{row?.resume_id}</div>,
        },
        {
          title: "Nội Dung chỉnh sửa",
          width: 300,

          cell: (row) => (
            <div
              className="content-container"
              onClick={() => this.onOpenPopupDetail(row)}
            >
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: row?.content,
                }}
              />
            </div>
          ),
        },
        {
          title: "Ngày chỉnh sửa",
          width: 120,
          accessor: "updated_at",
          cell: (row) => {
            return (
              <>
                {row?.updated_at &&
                  moment.unix(row?.updated_at).format("DD-MM-YYYY hh:mm:ss")}
              </>
            );
          },
        },
      ],
      idKey: "CvScanList",
    };

    this.onOpenPopupDetail = this._onOpenPopupDetail.bind(this);
  }

  _onOpenPopupDetail(detail) {
    this.props.uiAction.createPopup(PopupDetail, "Nội dung chỉnh sửa", {
      detail: detail,
    });
  }

  render() {
    const { columns, idKey } = this.state;
    const { query, defaultQuery, history } = this.props;
    return (
      <>
        <Default
          title="Danh Sách CV đã scan"
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
            fetchApi={getResumeCvScannerList}
            query={query}
            columns={columns}
            defaultQuery={defaultQuery}
            history={history}
            isRedirectDetail={false}
          />
        </Default>
        <style jsx>{`
          .content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 300px;
            height: 25px;
          }
          .content-container {
            cursor: pointer;
            color: #3276b1;
            text-decoration: underline;
          }
        `}</style>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    branch: state.branch,
    sys: state.sys,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
