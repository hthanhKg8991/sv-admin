import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import ComponentFilter from "./ComponentFilter";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import { bindActionCreators } from "redux";
import { putToastError, putToastSuccess } from "actions/uiAction";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import { getListContactHotline, exportListContactHotline } from "api/hotline";
import SpanCommon from "components/Common/Ui/SpanCommon";

const idKey = "Event";

class List extends Component {
  constructor(props) {
    super(props);
    this.onClickAdd = this._onClickAdd.bind(this);
    this.onClickExport = this._onClickExport.bind(this);

    this.state = {
      loading: false,

      columns: [
        {
          title: "ID Nhà tuyển dụng",
          width: 120,
          accessor: "employer_id",
        },
        {
          title: "Nhà tuyển dụng",
          width: 150,
          accessor: "name",
        },
        {
          title: "Mã số thuế",
          width: 120,
          accessor: "tax_code",
        },
        {
          title: "Địa chỉ",
          width: 150,
          accessor: "address",
        },
        {
          title: "Tên Người liên hệ",
          width: 150,
          accessor: "contact_name",
        },

        {
          title: "Số điện thoại",
          width: 150,
          cell: (row) => <div>{row?.phone?.toString()}</div>,
        },
        {
          title: "Email",
          width: 150,
          accessor: "email",
        },
        {
          title: "Nhu cầu của Khách hàng",
          width: 120,
          cell: (row) => (
            <SpanCommon
              idKey={Constant.COMMON_DATA_KEY_CUSTOMER_DEMAND}
              value={row?.customer_demand}
              notStyle
            />
          ),
        },
        {
          title: "Đã xử lý",
          width: 100,
          cell: (row) => <div className="text-center">{row?.processed}</div>,
        },
        {
          title: "QAM tạo thông tin",
          width: 150,
          accessor: "created_by",
        },
        {
          title: "Loại CSKH",
          width: 100,
          cell: (row) => (
            <SpanCommon
              idKey={Constant.COMMON_DATA_KEY_EMPLOYER_HOTLINE_TYPE}
              value={row?.assigned_type}
            />
          ),
        },

        {
          title: "Giỏ CSKH",
          width: 150,
          accessor: "assigned_staff_username",
        },

        {
          title: "Ghi chú",
          width: 200,
          accessor: "note",
        },
      ],
    };
  }

  async asyncExport() {
    const { actions, query } = this.props;
    const res = await exportListContactHotline(query);
    if (res) {
      this.setState({ loading: false });
      actions.putToastSuccess("Thao tác thành công");
      window.open(res);
    } else {
      actions.putToastError("Có lỗi xảy ra");
      this.setState({ loading: false });
    }
  }

  _onClickAdd() {
    const { history } = this.props;
    history.push({
      pathname: Constant.BASE_URL_HOTLINE_LIST_CONTACT_HOTLINE,
      search: "?action=add",
    });
  }

  _onClickExport() {
    if (this.state.loading == false) {
      this.setState({ loading: true }, () => {
        this.asyncExport();
      });
    }
  }

  render() {
    const { columns } = this.state;
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
        title="Danh sách Nhà tuyển dụng"
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
          <>
            <CanRender actionCode={ROLES.hotline_create_recruiter}>
              <div className="left">
                <button
                  type="button"
                  className="el-button el-button-primary el-button-small"
                  onClick={this.onClickAdd}
                >
                  <span>
                    Thêm mới <i className="glyphicon glyphicon-plus" />
                  </span>
                </button>
              </div>
            </CanRender>
          </>
        }
      >
        <Gird
          idKey={idKey}
          fetchApi={getListContactHotline}
          query={query}
          columns={columns}
          defaultQuery={defaultQuery}
          history={history}
          isReplaceRoute
        />
      </Default>
    );
  }
}

function mapStateToProps(state) {
  return {
    sys: state.sys,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        putToastSuccess,
        putToastError,
      },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
