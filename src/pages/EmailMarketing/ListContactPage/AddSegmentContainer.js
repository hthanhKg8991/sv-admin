import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import Default from "components/Layout/Page/Default";
import AddSegment from "pages/EmailMarketing/ListContactPage/AddSegment";

class AddSegmentContainer extends Component {
  render() {
    const { history } = this.props;
    const searchParam = _.get(this.props, ["location", "search"]);
    const queryParsed = queryString.parse(searchParam);
    const list_contact_id = _.get(queryParsed, "list_contact_id");
    const idKey = "SegmentAdd";

    return (
      <>
        <Default
          title="Thêm Quản Lý Audience Segment"
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
          <AddSegment idKey={idKey} list_contact_id={list_contact_id} history={history} />
        </Default>
      </>
    );
  }
}

export default connect(null, null)(AddSegmentContainer);
