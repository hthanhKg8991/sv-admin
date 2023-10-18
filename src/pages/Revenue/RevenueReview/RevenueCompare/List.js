import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import { bindActionCreators } from "redux";
import * as Constant from "utils/Constant";
import queryString from "query-string";
import {
  putToastError,
  putToastSuccess,
  showLoading,
  hideLoading,
  createPopup,
} from "actions/uiAction";
import {
  getRevenueList,
  runCronRevenue,
  exportExcelRevenue,
  syncFileImportToOdoo,
} from "api/saleOrder";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueReview/RevenueCompare/ComponentFilter";
import AdminStorage from "utils/storage";
import Tooltip from "@material-ui/core/Tooltip";
import RerunRevenuePopup from "./RerunRevenuePopup";
import _ from "lodash";

const idKey = "RevenueReview";

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          title: "ID phiếu",
          width: 100,
          accessor: "sales_order_id",
        },
        {
          title: "ID Item",
          width: 120,
          accessor: "item_id",
        },
        {
          title: "ID Sub",
          width: 100,
          accessor: "sub_id",
        },
        {
          title: "ID Regis",
          width: 80,
          accessor: "registration_id",
        },
        {
          title: "Giá trị theo revenue",
          width: 100,
          accessor: "value_1",
        },

        {
          title: "Giá trị theo regis",
          width: 100,
          accessor: "value_2",
        },

        {
          title: "Compare",
          width: 100,
          accessor: "compare",
        },
        {
          title: "Kết quả",
          width: 100,
          accessor: "result",
        },
      ],
      loading: false,
      isImport: true,
    };
    // create hidden input file
    this.textInput = React.createRef();

    this.runCron = this._runCron.bind(this);
    this.exportExcel = this._exportExcel.bind(this);
    this.onImportFile = this._onImportFile.bind(this);
    this.onChangeFileImport = this._onChangeFileImport.bind(this);
    this.onOpenRerunRevenue = this._onOpenRerunRevenue.bind(this);
    this.validRunCron = this._validRunCron.bind(this);
    this.invalidRunCron = this._invalidRunCron.bind(this);
    this.validImportFile = this._validImportFile.bind(this);
    this.invalidImportFile = this._invalidImportFile.bind(this);
  }

  _onImportFile() {
    this.textInput.current.click();
  }

  _onOpenRerunRevenue() {
    this.props.actions.createPopup(
      RerunRevenuePopup,
      "Chọn ngày chạy lại revenue",
      {
        // object: item,
        // idKey: idKey,
      },
      "revenue_rerun"
    );
  }

  async _validRunCron(cron) {
    const { actions } = this.props;
    const resRunCron = await runCronRevenue({
      task_name: "compare",
      function_name: "run",
      data: [cron, 1],
    });
    if (resRunCron) {
      actions.putToastSuccess("Chạy cron thành công");
      AdminStorage.setExpiresCron(
        "check_run_next_cron",
        new Date().getTime() + Constant.THE_NEXT_10_MINUTES
      );
    } else {
      actions.putToastError("Thao tác thất bại");
    }
  }

  _invalidRunCron(min, sec) {
    const { actions } = this.props;
    actions.putToastError(
      `Bạn cần chờ ${min} phút ${sec} giây để thực hiện cron tiếp theo`
    );
  }

  async _runCron(cron) {
    await AdminStorage.checkExpiresCron(
      "check_run_next_cron",
      this.invalidRunCron,
      this.validRunCron,
      cron
    );
  }

  async _exportExcel() {
    const { actions, history } = this.props;
    const searchParam = _.get(history, ["location", "search"]);
    const queryParsed = queryString.parse(searchParam);
    actions.showLoading();
    const resExportTrigger = await exportExcelRevenue(queryParsed);
    if (resExportTrigger) {
      actions.putToastSuccess("Tải về excel thành công");
      window.open(resExportTrigger?.url);
    } else {
      actions.putToastError("Thao tác thất bại");
    }
    actions.hideLoading();
  }

  _invalidImportFile(min, sec) {
    const { actions } = this.props;
    actions.putToastError(
      `Bạn cần chờ ${min} phút ${sec} giây để tiếp tục thực hiện gửi file.`
    );
  }

  async _validImportFile(event) {
    const { actions } = this.props;
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    this.setState({ isImport: false });
    const { name } = file;
    const ext = name?.split(".").pop();
    if (file?.size > Constant.EXTENSION_FILE_SIZE_LIMIT) {
      actions.putToastError(
        "File import quá lớn! \n Dung lượng tối đa là 10MB!"
      );
      event.target.value = "";
    } else if (Constant.EXTENSION_FILE_IMPORT.includes(ext)) {
      const dataFile = new FormData();
      dataFile.append("file", file);
      const body = { file: dataFile, up_file: true };

      actions.showLoading();
      const resImport = await syncFileImportToOdoo(body);
      actions.hideLoading();
      if (resImport) {
        this.setState({ loading: false });
        AdminStorage.setExpiresCron(
          "check_run_next_cron",
          new Date().getTime() + Constant.THE_NEXT_10_MINUTES
        );
        actions.putToastSuccess(`Gửi file qua Odoo thành công`);
        publish(".refresh", {}, idKey);
      } else if (resImport?.code === Constant.CODE_FILE_TOO_BIG) {
        actions.putToastError("File import quá lớn!");
      } else {
        actions.putToastError(resImport?.msg);
      }
    } else {
      actions.putToastError(
        "Định dạng file không hợp lệ!. Vui lòng chọn file có mở rộng là xls hoặc xlsx"
      );
    }
    this.setState({ isImport: true });
  }

  async _onChangeFileImport(event) {
    await AdminStorage.checkExpiresCron(
      "check_run_next_cron",
      this.invalidImportFile,
      this.validImportFile,
      event
    );
  }

  render() {
    const { columns, isImport } = this.state;
    const { query, defaultQuery, history } = this.props;
    return (
      <Default
        title="Đối soát Revenue"
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
        <WrapFilter
          idKey={idKey}
          hideQuickFilter
          query={query}
          ComponentFilter={ComponentFilter}
        />
        <div
          className="row mt15 mb15"
          style={{
            marginLeft: "0",
          }}
        >
          <div className="col-2">
            <button
              className="el-button el-button-primary el-button-small"
              onClick={() => this.runCron(1)}
            >
              Chạy cron 1
            </button>
            <button
              className="el-button el-button-primary el-button-small"
              onClick={() => this.runCron(2)}
            >
              Chạy cron 2
            </button>
            <button
              className="el-button el-button-primary el-button-small"
              onClick={() => this.runCron(3)}
            >
              Chạy cron 3
            </button>
            <button
              className="el-button el-button-warning el-button-small"
              onClick={() => this.exportExcel()}
            >
              Xuất excel
            </button>
            <button
              className="el-button el-button-info el-button-small"
              onClick={() => this.onOpenRerunRevenue()}
            >
              Chạy lại revenue thiếu
            </button>
            {isImport && (
              <input
                type="file"
                ref={this.textInput}
                className="form-control mb10 hidden"
                onChange={(e) => this.onChangeFileImport(e)}
              />
            )}
            <Tooltip
              title={
                <div style={{ fontSize: "12px" }}>
                  <p className="mt5 text-red font-bold">
                    [Lưu ý] File tải lên phải thỏa mãn:
                  </p>
                  <p>1. File upload phải là excel.</p>
                  <p>2. Cột đầu tiên (Cột A) phải là revenue id.</p>
                </div>
              }
            >
              <button
                className="el-button el-button-bricky el-button-small"
                onClick={() => this.onImportFile()}
              >
                Bắn revenue qua Odoo
              </button>
            </Tooltip>
          </div>
        </div>
        <Gird
          idKey={idKey}
          fetchApi={getRevenueList}
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        putToastSuccess,
        putToastError,
        showLoading,
        hideLoading,
        createPopup,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
