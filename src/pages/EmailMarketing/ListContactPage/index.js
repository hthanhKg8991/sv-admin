import React, { Component } from "react";
import { withRouteAction } from "components/Layout/Action/RouteAction";
import List from "pages/EmailMarketing/ListContactPage/List";
import ListDetail from "pages/EmailMarketing/ListContactPage/ListDetail";
import AddSegment from "pages/EmailMarketing/ListContactPage/AddSegmentContainer";

class index extends Component {
  render() {
    const { ActiveAction } = this.props;

    return <ActiveAction {...this.props} />;
  }
}

export default withRouteAction(index, {
  defaultAction: "list",
  actions: [
    { action: "list", component: List },
    { action: "detail", component: ListDetail },
    { action: "addSegment", component: AddSegment },
  ],
});
