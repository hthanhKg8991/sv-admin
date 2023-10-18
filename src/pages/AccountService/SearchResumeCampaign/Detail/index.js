import React, { Component } from "react";
import { connect } from "react-redux";
import Default from "components/Layout/Page/Default";
import Tab from "components/Common/Ui/Tab";
import InfoCommon from "./InfoCommon"
import HistorySendCV from "./HistorySendCV";
import FilterSaved from "./FilterSaved";
import queryString from "query-string";
import { subscribe } from "utils/event";
class DetailContainer extends Component {
  constructor(props) {
    super(props);
    const searchParam = _.get(props, ['location', 'search']);
    const queryParsed = queryString.parse(searchParam);
    this.state = {
      loading: false,
      tabActive: _.get(queryParsed, 'tabActive'),
    };
    this.subscribers = [];
    this.subscribers.push(subscribe('.refresh', (msg) => {
      this.setState({ loading: true }, () => {
        this.asyncData();
      });
    }, props.idKey));
  }
  render() {
    let params = queryString.parse(window.location?.search);
    const { tabActive } = this.state;
    const items = [
      {
        title: "Thông tin chung",
        component: <InfoCommon {...this.props} id={params?.id} tabActive={tabActive} />
      },
      {
        title: "Lịch sử gửi CVs",
        component: <HistorySendCV {...this.props} id={params?.id} tabActive={tabActive} />
      },
      {
        title: "Bộ lọc đã lưu",
        component: <FilterSaved {...this.props} id={params?.id} tabActive={tabActive} />
      },
    ];
    return (
      <Default
        title={'Chi tiết campaign'}
      >
        <Tab items={items} />
      </Default>
    )
  }
}

export default connect(null, null)(DetailContainer);
