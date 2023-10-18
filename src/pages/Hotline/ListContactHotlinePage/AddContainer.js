import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import Add from "./Add";

class FormContainer extends Component {
  constructor(props) {
    super(props);
    const searchParam = _.get(props, ["location", "search"]);
    const queryParsed = queryString.parse(searchParam);

    this.state = {
      id: _.get(queryParsed, "id"),
    };
  }

  render() {
    const { history } = this.props;
    const { id } = this.state;
    const idKey = "ContactHotlineAdd";

    return (
      <Default
        title={
          id > 0
            ? "Chỉnh sửa thông tin cuộc gọi"
            : "Thêm mới thông tin cuộc gọi"
        }
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
        <Add idKey={idKey} history={history} id={id} />
      </Default>
    );
  }
}

export default connect(null, null)(FormContainer);
