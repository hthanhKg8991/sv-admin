import React, { Component } from "react";

import RevenueDailyCompare from "pages/Revenue/RevenueDailyPage/RevenueDailyCompare";
import RevenueAuditList from "pages/Revenue/RevenueDailyPage/RevenueDailyAudit";
import Tab from "components/Common/Ui/Tab";

class index extends Component {
  render() {
    const { history, tabActive } = this.props;
    const items = [
      {
        title: "Đối soát",
        component: <RevenueDailyCompare history={history}/>,
      },
      {
        title: "Kiểm toán",
        component: <RevenueAuditList history={history} />,
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
