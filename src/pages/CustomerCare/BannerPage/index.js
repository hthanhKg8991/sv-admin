import React, { Component } from "react";

import { withRouteAction } from "components/Layout/Action/RouteAction";

import EditContainer from "pages/CustomerCare/BannerPage/EditContainer";
import List from "pages/CustomerCare/BannerPage/List";

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
    { action: "edit", component: EditContainer },
  ],
});
