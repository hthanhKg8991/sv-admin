import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import { bindActionCreators } from "redux";
import {
  putToastError,
  putToastSuccess,
  showLoading,
  hideLoading,
} from "actions/uiAction";
import { getDataAuditRevenueList, exportListDataAuditRevenue } from "api/saleOrder";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import moment from "moment";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import ComponentFilter from "pages/Revenue/RevenueDailyPage/RevenueDailyAudit/ComponentFilter";
import * as utils from "utils/utils";
import queryString from "query-string";

const idKey = "RevenueAuditList";

class RevenueAuditList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Mail sales",
          width: 300,
          accessor: "staff_email",
        },
        {
          title: "channel_code",
          width: 120,
          accessor: "channel_code",
        },
        {
          title: "sales_order_id",
          width: 120,
          accessor: "sales_order_id",
        },
        {
          title: "sales_order_items_id",
          width: 150,
          accessor: "sales_order_items_id",
        },
        {
          title: "VAT",
          width: 120,
          accessor: "vat",
        },
        {
          title: "uid_item",
          width: 120,
          accessor: "uid_sales_order_items",
        },
        {
          title: "uid_so",
          width: 120,
          accessor: "uid_sales_order",
        },
        {
          title: "service_type",
          width: 120,
          accessor: "service_type",
        },
        {
          title: "total_day_quantity",
          width: 120,
          accessor: "total_day_quantity",
        },
        {
          title: "quantity_buy",
          width: 120,
          accessor: "quantity_buy",
        },
        {
          title: "total_amount_due",
          width: 120,
          cell: row => utils.formatNumber(row?.total_amount_due, 0, ".", "đ"),
        },
        {
          title: "total_unit_bought",
          width: 120,
          accessor: "total_unit_bought",
        },
        {
          title: "corrected_line_amount",
          width: 150,
          cell: row => utils.formatNumber(row?.corrected_line_amount, 0, ".", "đ"),
        },
        {
          title: "price_per_unit",
          width: 120,
          cell: row => utils.formatNumber(row?.price_per_unit, 0, ".", "đ"),
        },
        {
          title: "total_units_used",
          width: 120,
          accessor: "total_units_used",
        },
        {
          title: "earrned_revenue trước thuế",
          width: 120,
          cell: row => utils.formatNumber(row?.earned_revenue_before_tax, 0, ".", "đ"),
        },
        {
          title: "total_earrned_revenue",
          width: 150,
          cell: row => utils.formatNumber(row?.total_earned_revenue, 0, ".", "đ"),
        },
        {
          title: "remaining_units",
          width: 120,
          accessor: "remaining_units",
        },
        {
          title: "unearned_revenue",
          width: 120,
          cell: row => utils.formatNumber(row?.unearned_revenue, 0, ".", "đ"),
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
  const resExportTrigger = await exportListDataAuditRevenue(queryParsed);
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
            "sales_order_approved_at[from]": startOfMonth,
            "sales_order_approved_at[to]": endOfMonth
        };

    return (
      <Default
        title="Kiểm toán"
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
        <div className={"text-red mb30"}>
        *** Lưu ý:
        <ul>
          <li>Kiểm tra 10 dữ liệu mẫu trước khi truy xuất. Không thể tải dữ liệu khi lớn hơn 50.000 dòng.</li>
          <li>Sau khi chọn bộ lọc, vui lòng chờ 5 - 10 phút để hệ thống hoàn tất dữ liệu.</li>
        </ul>
        </div>
        <div style={{position: "relative"}} className="mb20">
        <WrapFilter
          idKey={idKey}
          hideQuickFilter
          query={newQuery}
          ComponentFilter={ComponentFilter}
        />
        <div style={{position: "absolute", zIndex: 1000, top: "3px", left: "55%"}}>
          <CanRender actionCode={ROLES.revenue_revenue_daily_audit_export}>
          <button type="button"
            className="el-button el-button-primary el-button-small"
            onClick={() => this.onClickExport()}>
            <span>Xuất Excel  <i
            className="glyphicon glyphicon-file"/></span>
          </button>
          </CanRender>
          </div>
        </div>
               
        <Gird
          idKey={idKey}
          fetchApi={getDataAuditRevenueList}
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
        showLoading,
        hideLoading,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RevenueAuditList);
