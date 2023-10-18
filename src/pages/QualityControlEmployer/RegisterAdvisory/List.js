import React, { Component } from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import { getListAdvisoryRegister } from "api/mix";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import moment from "moment";
import queryString from "query-string";
import ComponentFilter from "pages/QualityControlEmployer/RegisterAdvisory/ComponentFilter";
import PopupContent from "pages/QualityControlEmployer/RegisterAdvisory/PopupContent";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { createPopup } from "actions/uiAction";

import {
  hideSmartMessageBox,
  SmartMessageBox,
} from "actions/uiAction";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const idKey = "RegisterAdvisory";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Thông tin user đăng ký",
          width: 100,
          cell: (row) =>
            !!row?.user_id && (
              <React.Fragment>
                <span className="cursor-pointer" style={{ color: "#3276b1" }}>
                  {row?.user_id
                    ? row?.user_id +
                      " - " +
                      (row.employer_name || row.seeker_name || row.name)
                    : row.employer_name || row.seeker_name || row.name}
                </span>
              </React.Fragment>
            ),
          onClick: (row) => {
            if (!row?.user_id) {
              return null;
            }
            const params = {
              action: "detail",
              id: row.user_id,
            };
            window.open(
              Number(row?.type) === 1
                ? Constant.BASE_URL_EMPLOYER +
                    "?" +
                    queryString.stringify(params)
                : Number(row?.type) === 2
                ? Constant.BASE_URL_SEEKER_CARE_SEEKER +
                  "?" +
                  queryString.stringify(params)
                : ""
            );
          },
        },
        {
          title: "Loại user",
          width: 50,
          cell: (row) => (
            <SpanCommon
              idKey={Constant.COMMON_DATA_KEY_advisory_register_type}
              value={row?.type}
            />
          ),
        },
        {
          title: "Ngày đăng ký",
          width: 60,
          cell: (row) => {
            return (
              <>{moment.unix(row?.created_at).format("DD-MM-YYYY HH:mm:ss")}</>
            );
          },
        },
        {
          title: "CSKH",
          width: 60,
          accessor: "employer_cskh",
        },
        {
          title: "Hành động",
          width: 40,
          cell: (row) => (
            <span
              className="text-link text-warning font-bold"
              onClick={() => this.onShowDetail(row)}
            >
              Xem chi tiết
            </span>
          ),
        },
      ],
    };
    this.onShowDetail = this._onShowDetail.bind(this);
  }

  _onShowDetail(row) {
    const { history } = this.props;
    this.props.actions.createPopup(
      PopupContent,
      "Thông tin chi tiết đăng ký tư vấn",
      {
        object: row,
        history,
      }
    );
  }


  render() {
    const { columns } = this.state;
    const { query, history, defaultQuery } = this.props;
    // const {type} = query;
    return (
      <Default
        title="Quản lý đăng ký tư vấn"
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
        <ComponentFilter idKey={idKey} query={query} />
        <Gird
          idKey={idKey}
          fetchApi={getListAdvisoryRegister}
          //   query={query}
          columns={columns}
          defaultQuery={defaultQuery}
          history={history}
          isPushRoute={true}
        />
      </Default>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        SmartMessageBox,
        hideSmartMessageBox,
        createPopup,
      },
      dispatch
    ),
  };
}

export default connect(null, mapDispatchToProps)(List);
