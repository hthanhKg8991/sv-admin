import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { bindActionCreators } from "redux";

import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import { bannerList } from "api/system";

import {
  hideSmartMessageBox,
  putToastError,
  putToastSuccess,
  SmartMessageBox,
} from "actions/uiAction";
import * as Constant from "utils/Constant";
import ROLES from "utils/ConstantActionCode";
import { publish } from "utils/event";

import ComponentFilter from "pages/CustomerCare/BannerPage/ComponentFilter";

const idKey = "BannerPageList";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "ID",
          width: 60,
          accessor: "id",
        },

        {
          title: "Tên Banner",
          width: 100,
          accessor: "name",
        },
        {
          title: "Thứ tự hiển thị",
          width: 100,
          accessor: "ordering",
        },
        {
          title: "Banner PC",
          width: 100,
          cell: (row) => (
            <img
              src={row?.image_pc_url}
              className="img-responsive"
              style={{ maxHeight: "100px" }}
            />
          ),
        },
        {
          title: "Banner Mobile",
          width: 100,
          cell: (row) => (
            <img src={row?.image_mb_url} className="img-responsive" />
          ),
        },

        {
          title: "Vị trí trang đăng",
          width: 100,
          cell: (row) => (
            <SpanCommon
              idKey={Constant.COMMON_DATA_KEY_banner_type}
              value={row?.position_key}
            />
          ),
        },
        {
          title: "Thời gian bắt đầu Hiển thị",
          width: 100,
          cell: (row) =>
            row?.available_from_date
              ? moment
                  .unix(row?.available_from_date)
                  .format("DD-MM-YYYY HH:mm:ss")
              : "",
        },
        {
          title: "Thời gian hạ banner",
          width: 100,
          cell: (row) =>
            row?.available_to_date
              ? moment
                  .unix(row?.available_to_date)
                  .format("DD-MM-YYYY HH:mm:ss")
              : "",
        },
        {
          title: "Người cập nhật",
          width: 100,
          accessor: "updated_by",
        },
        {
          title: "Ngày cập nhật",
          width: 100,
          cell: (row) =>
            moment.unix(row?.updated_at).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
          title: "Trạng thái",
          width: 80,
          cell: (row) => (
            <SpanCommon
              idKey={Constant.COMMON_DATA_KEY_bundle_display}
              value={row?.is_display}
            />
          ),
        },
        {
          title: "Hành động",
          width: 80,
          cell: (row) => (
            // <CanRender actionCode={ROLES.customer_care_banner_update}>
              <span
                className="text-link text-blue font-bold"
                onClick={() => this.onEdit(row?.id)}
              >
                Chỉnh sửa
              </span>
            // </CanRender>
          ),
        },
      ],
      loading: false,
    };

    this.onClickAdd = this._onClickAdd.bind(this);
    this.onEdit = this._onEdit.bind(this);
    this.onDelete = this._onDelete.bind(this);
  }

  _onClickAdd() {
    const { history } = this.props;
    history.push({
      pathname: Constant.BASE_URL_BANNER_PAGE,
      search: "?action=edit&id=0",
    });
  }

  _onEdit(id) {
    const { history } = this.props;
    history.push({
      pathname: Constant.BASE_URL_BANNER_PAGE,
      search: "?action=edit&id=" + id,
    });
  }

  _onDelete(id) {
    const { actions } = this.props;
    actions.SmartMessageBox(
      {
        title: "Bạn có chắc muốn xóa ID: " + id,
        content: "",
        buttons: ["No", "Yes"],
      },
      async (ButtonPressed) => {
        if (ButtonPressed === "Yes") {
          const res = await bannerDelete({ id });
          if (res) {
            actions.putToastSuccess("Thao tác thành công");
            publish(".refresh", {}, idKey);
          }
          actions.hideSmartMessageBox();
          publish(".refresh", {}, idKey);
        }
      }
    );
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
        title="Danh Sách Banner"
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
          <div className="left btnCreateNTD">
            {/* <CanRender actionCode={ROLES.accountant_combo_post_store}> */}
              <button
                type="button"
                className="el-button el-button-primary el-button-small"
                onClick={this.onClickAdd}
              >
                <span>
                  Thêm mới <i className="glyphicon glyphicon-plus" />
                </span>
              </button>
            {/* </CanRender> */}
          </div>
        }
      >
        <Gird
          idKey={idKey}
          fetchApi={bannerList}
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
      { putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox },
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
