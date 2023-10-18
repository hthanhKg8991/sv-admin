import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import { bindActionCreators } from "redux";
import * as Constant from "utils/Constant";
import {
  putToastError,
  putToastSuccess,
  showLoading,
  hideLoading,
} from "actions/uiAction";
import { getDetuctRevenueList, createDetuctRevenue } from "api/saleOrder";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueReview/DetuctRevenue/ComponentFilter";

const idKey = "RevenueDetuctList";

class RevenueDetuctList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "ID Lịch sử",
          width: 100,
          accessor: "id",
        },
        {
          title: "Người tạo",
          width: 120,
          accessor: "created_by",
        },
        {
          title: "Ngày tạo",
          width: 100,
          accessor: "created_at",
        },
        {
          title: "File kết quả",
          width: 80,
          cell: (row) =>
            row?.file && (
              <a
                href={row?.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-underline"
              >
                Tải xuống
              </a>
            ),
        },
      ],
      loading: false,
      isImport: true,
    };
    this.textInput = React.createRef();
    this.onImportFile = this._onImportFile.bind(this);
    this.onChangeFileImport = this._onChangeFileImport.bind(this);
  }

  _onImportFile() {
    this.textInput.current.click();
  }

  async _onChangeFileImport(event) {
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
      const resImport = await createDetuctRevenue(body);
      actions.hideLoading();
      if (resImport) {
        this.setState({ loading: false });
        actions.putToastSuccess(`Gửi file khấu trừ thành công`);
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
    // }
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
            {isImport && (
              <input
                type="file"
                ref={this.textInput}
                className="form-control mb10 hidden"
                onChange={(e) => this.onChangeFileImport(e)}
              />
            )}
            <button
              className="el-button el-button-primary el-button-small"
              onClick={() => this.onImportFile()}
            >
              Tạo khấu trừ revenue
              <i className="glyphicon glyphicon-plus pointer ml5" />
            </button>
          </div>
        </div>
        <p className="text-danger text-italic">
          Lưu ý: File upload phải là excel và cột đầu tiên (Cột A) phải là ID
          regis cần khấu trừ.
        </p>
        <Gird
          idKey={idKey}
          fetchApi={getDetuctRevenueList}
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
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RevenueDetuctList);
