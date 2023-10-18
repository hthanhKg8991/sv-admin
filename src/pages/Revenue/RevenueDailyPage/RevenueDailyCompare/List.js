import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/Revenue/RevenueDailyPage/RevenueDailyCompare/ComponentFilter";
import { bindActionCreators } from "redux";
import {
  hideSmartMessageBox,
  putToastError,
  putToastSuccess,
  SmartMessageBox,
  showLoading,
  hideLoading,
} from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import { exportListRevenue, getListRevenue } from "api/saleOrder";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as utils from "utils/utils";
import moment from "moment";
import queryString from "query-string";

const idKey = "RevenueDaily";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Kênh",
          width: 100,
          accessor: "channel_code",
        },
        {
          title: "uid",
          width: 100,
          accessor: "uid",
        },
        {
          title: "ID SO",
          width: 100,
          accessor: "sales_order_id",
        },
        {
          title: "ID SO đổi điểm",
          width: 100,
          accessor: "point_convert_sales_order_id",
        },
        {
          title: "ID Item",
          width: 100,
          accessor: "sales_order_items_id",
        },
        {
          title: "ID Sub Item",
          width: 100,
          accessor: "sales_order_items_sub_id",
        },
        {
          title: "ID lệnh",
          width: 100,
          accessor: "registration_id",
        },
        {
          title: "SKU",
          width: 100,
          accessor: "sku",
        },
        {
          title: "Tên gói",
          width: 200,
          accessor: "sku_name",
        },
        {
          title: "Loại gói",
          width: 120,
          cell: (row) => (
            <SpanCommon
              idKey={Constant.COMMON_DATA_KEY_fee_type}
              value={row?.fee_type}
              notStyle
            />
          ),
        },
        {
          title: "Ghi chú",
          width: 120,
          accessor: "note",
        },
        {
          title: "Diễn giải",
          width: 140,
          accessor: "note_explain",
        },
        {
          title: "Ngày duyệt PDKD",
          width: 140,
          accessor: "sales_order_approved_at",
        },
        {
          title: "Revenue",
          width: 140,
          cell: (row) => utils.formatNumber(row?.revenue, 0, ".", "đ"),
        },
        {
          title: "Ngày ghi nhận",
          width: 140,
          cell: (row) =>
            moment.unix(row?.revenue_at).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
          title: "Mã NV ghi nhận Revenue",
          width: 100,
          accessor: "revenue_by_staff_code",
        },
        {
          title: "Tên NV ghi nhận Revenue",
          width: 120,
          accessor: "revenue_by_staff_name",
        },
        {
          title: "Mã NV kích hoạt lệnh",
          width: 100,
          accessor: "registration_approved_by_staff_code",
        },
        {
          title: "Tên NV kích hoạt lệnh",
          width: 100,
          accessor: "registration_approved_by_staff_name",
        },
        {
          title: "ID NTD",
          width: 100,
          accessor: "employer_id",
        },
        {
          title: "Tên công ty",
          width: 100,
          accessor: "employer_name",
        },
        {
          title: "Tên KH kế toán",
          width: 100,
          accessor: "accountant_customer_name",
        },
        {
          title: "ID Company",
          width: 100,
          accessor: "customer_id",
        },
      ],
      loading: false,
    };
    this.onClickExport = this._onClickExport.bind(this);
  }

  async _onClickExport() {
    const { actions, history } = this.props;
    const searchParam = _.get(history, ["location", "search"]);
    const queryParsed = queryString.parse(searchParam);
    actions.showLoading();
    const resExportTrigger = await exportListRevenue(queryParsed);
    if (resExportTrigger) {
      actions.putToastSuccess("Tải về excel thành công");
      window.open(resExportTrigger?.url);
    } else {
      actions.putToastError("Thao tác thất bại");
    }
    actions.hideLoading();
  }

  render() {
    const { columns } = this.state;
    const { query, defaultQuery, history } = this.props;
    const startOfMonth = moment().clone().startOf('month').unix();
    const endOfMonth = moment().clone().endOf('month').unix();
    const newQuery = {
        ...query,
        "revenue_at[from]": startOfMonth,
        "revenue_at[to]": endOfMonth
    };

    return (
      <Default
        left={
          <WrapFilter
            idKey={idKey}
            query={newQuery}
            ComponentFilter={ComponentFilter}
          />
        }
        title="Revenue theo ngày"
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
        buttons={
          <CanRender actionCode={ROLES.revenue_revenue_daily_export}>
            <div className="left btnExportNTD">
              <button
                type="button"
                className="el-button el-button-primary el-button-small"
                onClick={() => this.onClickExport()}
              >
                <span>
                  Xuất Excel <i className="glyphicon glyphicon-file" />
                </span>
              </button>
            </div>
          </CanRender>
        }
      >
        <div className={"text-red mb30"}>
          *** Lưu ý:
          <ul>
            <li>
              Kiểm tra 10 dữ liệu mẫu trước khi truy xuất. Không thể tải dữ liệu
              khi lớn hơn 50.000 dòng.
            </li>
            <li>
              Sau khi chọn bộ lọc, vui lòng chờ 5 - 10 phút để hệ thống hoàn tất
              dữ liệu.
            </li>
          </ul>
        </div>
        <Gird
          idKey={idKey}
          fetchApi={getListRevenue}
          query={newQuery}
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
        SmartMessageBox,
        hideSmartMessageBox,
        showLoading,
        hideLoading,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
