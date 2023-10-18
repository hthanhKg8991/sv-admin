import React, { Component } from "react";
import List from "pages/Revenue/RevenueReview/RevenueCompare/List";
import RevenueDetuctList from "pages/Revenue/RevenueReview/DetuctRevenue/RevenueDetuctList";
import Tab from "components/Common/Ui/Tab";

class index extends Component {
  render() {
    const { history, tabActive } = this.props;
    const items = [
      {
        title: "Đối soát",
        component: <List history={history} />,
      },
      {
        title: "Khấu trừ revenue",
        component: <RevenueDetuctList history={history} />,
      },
    ];
    return (
      <React.Fragment>
        <Tab items={items} tabActive={tabActive} />
      </React.Fragment>
    );
  }
}
export default index;
