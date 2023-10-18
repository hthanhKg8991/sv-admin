import React from "react";
import { contactHotlineDetail } from "api/hotline";
import Tab from "components/Common/Ui/Tab";
import Info from "./Info";
import HistoryTab from "./HistoryTab";

import { subscribe } from "utils/event";
import { LoadingSmall } from "components/Common/Ui";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contactHotLine: null,
      loading: true,
      id: props.id,
    };

    this.subscribers = [];
    this.subscribers.push(
      subscribe(
        ".refresh",
        (msg) => {
          this.setState({ loading: true }, () => {
            this.asyncData();
          });
        },
        props.idKey
      )
    );
  }

  componentDidMount() {
    this.asyncData();
  }

  async asyncData() {
    const { id } = this.state;
    const data = await contactHotlineDetail(id);
    if (data) {
      this.setState({
        contactHotLine: data,
        loading: false,
      });
    }
  }

  componentDidMount() {
    this.asyncData();
  }

  render() {
    const { history, idKey, tabActive } = this.props;
    const { loading, contactHotLine } = this.state;

    const items = [
      {
        title: "Thông tin mới nhất",
        component: (
          <Info
            contactHotLine={contactHotLine}
            history={history}
            idKey={idKey}
          />
        ),
      },
      {
        title: "Lịch sử thông tin",
        component: (
          <HistoryTab
            contactHotLine={contactHotLine}
            history={history}
            idKey={idKey}
          />
        ),
      },
    ];

    return (
      <React.Fragment>
        {loading ? (
          <LoadingSmall style={{ textAlign: "center" }} />
        ) : (
          <Tab items={items} tabActive={tabActive} />
        )}
      </React.Fragment>
    );
  }
}

export default Detail;
