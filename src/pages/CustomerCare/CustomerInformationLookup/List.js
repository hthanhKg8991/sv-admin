import React, { Component } from "react";
import * as Constant from "utils/Constant";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "./GridCustomAPI";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/CustomerCare/CustomerInformationLookup/ComponentFilter";
import { bindActionCreators } from "redux";
import { getSearchJobList, exportSearchJobCsv } from "api/search";
import SpanCommon from "components/Common/Ui/SpanCommon";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import * as uiAction from "actions/uiAction";
import JobDetail from "./Popup/JobDetail";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "ID",
          width: 80,

          accessor: "id",
          cell: (row) => (
            <div className="text-center">
              <button
                className="btn btn-link"
                onClick={() => this.onOpenPopupJobDetail(row)}
              >
                {row.id}
              </button>
            </div>
          ),
        },
        {
          title: "Website",
          width: 120,
          cell: (row) => (
            <SpanCommon
              idKey={Constant.COMMON_DATA_KEY_websites_crawled}
              value={row?.web}
            />
          ),
        },
        {
          title: "Tin tuyển dụng",
          width: 180,
          cell: (row) => (
            <>
              <a title={row?.jobId} targer="_blank" href={row?.jobUrl}>
                {row?.jobId} - {row?.jobName}
              </a>
            </>
          ),
        },
        {
          title: "Công ty",
          width: 160,
          cell: (row) => (
            <a title={row?.jobId} targer="_blank" href={row?.companyUrl}>
              {row?.companyId} - {row?.companyName}
            </a>
          ),
        },
        {
          title: "Lương",
          width: 120,
          accessor: "salary",
        },
        {
          title: "Địa điểm",
          width: 120,
          accessor: "location",
        },
        {
          title: "Ngày cập nhật trên website",
          width: 120,
          accessor: "updatedAt",
        },
        {
          title: "Ngành",
          width: 120,
          accessor: "fieldName",
        },
      ],
      idKey: "CustomerInformationLookupList",
    };
    this.onExport = this._onExport.bind(this);
    this.onOpenPopupJobDetail = this._onOpenPopupJobDetail.bind(this);
  }

  _onOpenPopupJobDetail(jobDetail) {
    this.props.uiAction.createPopup(JobDetail, "Chi tiết tin", {
      jobDetail: jobDetail,
    });
  }

  async _onExport() {
    const { query } = this.props;
    this.props.uiAction.showLoading();
    const res = await exportSearchJobCsv(query);

    if (res) {
      this.props.uiAction.hideLoading();
      if (res.status === Constant.CODE_SUCCESS) {
        let filename = "";
        let newDate = new Date().getTime();
        if (res.headers.get("content-disposition")) {
          filename = res.headers
            .get("content-disposition")
            .split("filename=")[1];
        } else {
          filename = "jobs-export-" + String(newDate) + ".csv";
        }
        const blob = await res.blob();
        const newBlob = new Blob([blob]);
        const url = window.URL.createObjectURL(newBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        this.props.uiAction.putToastError(res.msg || "Có lỗi xảy ra!");
      }
    }
  }

  render() {
    const { columns, idKey } = this.state;
    const { query, defaultQuery, history } = this.props;
    return (
      <Default
        left={
          <WrapFilter
            idKey={idKey}
            query={query}
            ComponentFilter={ComponentFilter}
          />
        }
        title="Danh Sách thông tin khách hàng"
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
        <CanRender
          actionCode={ROLES.customer_care_customer_information_lookup_excel}
        >
          <button
            type="button"
            className="el-button el-button-primary el-button-small"
            onClick={this.onExport}
          >
            <span>Xuất Excel</span>
          </button>
        </CanRender>
        <Gird
          idKey={idKey}
          fetchApi={getSearchJobList}
          query={query}
          columns={columns}
          defaultQuery={defaultQuery}
          history={history}
          isRedirectDetail={false}
        />
      </Default>
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
