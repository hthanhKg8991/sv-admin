import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Detail from "./Detail";
import * as Constant from "utils/Constant";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

class DetailContainer extends Component {
  constructor(props) {
    super(props);

    const searchParam = _.get(props, ["location", "search"]);
    const queryParsed = queryString.parse(searchParam);

    this.state = {
      id: _.get(queryParsed, "id"),
      tabActive: _.get(queryParsed, "tabActive"),
    };
    this.goBack = this._goBack.bind(this);
    this.onAdd = this._onAdd.bind(this);
  }

  _onAdd() {
    const { history } = this.props;
    history.push({
      pathname: Constant.BASE_URL_HOTLINE_LIST_CONTACT_HOTLINE,
      search: "?action=add&id=" + this.state.id,
    });
  }

  _goBack() {
    const { history } = this.props;
    history.push({
      pathname: Constant.BASE_URL_HOTLINE_LIST_CONTACT_HOTLINE,
    });
  }
  render() {
    const { history } = this.props;
    const { id, tabActive } = this.state;
    const idKey = "HotlineContactDetail";

    return (
      <Default
        title={"Chi Tiết Nhà Tuyển Dụng"}
        titleActions={
          <button
            type="button"
            className="bt-refresh el-button "
            onClick={() => {
              publish(".refresh", {}, idKey);
            }}
          >
            <i className="fa fa-refresh" />
          </button>
        }
      >
        <Detail idKey={idKey} id={id} history={history} tabActive={tabActive} />
        <div className="mt30 p10 flex-row-end-class ">
          <button type="button" className="el-button el-button-default el-button-small mr10" onClick={this.goBack}>
            <span>Quay lại</span>
          </button>
          <CanRender actionCode={ROLES.hotline_edit_recruiter}>
            <button type="button" className="el-button el-button-success el-button-small " onClick={this.onAdd}>
              <span>Thêm thông tin cuộc gọi</span>
            </button>
          </CanRender>
        </div>
      </Default>
    );
  }
}

export default connect(null, null)(DetailContainer);
