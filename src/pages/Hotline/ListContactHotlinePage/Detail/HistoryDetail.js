import React from "react";
import _ from "lodash";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import Gird from "components/Common/Ui/Table/Gird";
import * as Constant from "utils/Constant";
import { asyncApi } from "api";
import { bindActionCreators } from "redux";
import { putToastSuccess } from "actions/uiAction";
import { connect } from "react-redux";
import { getHistoryHotlineDetail } from "api/hotline";
import SpanCommon from "components/Common/Ui/SpanCommon";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.detailId,
      employerId: props.employerId,
      data: null,
      loading: true,
      mappingField: {
        address: "Địa chỉ",
        contact_name: "Tên Người liên hệ",
        phone: "Số điện thoại",
        email: "Email",
        customer_demand: {
          label: "Nhu cầu của Khách hàng",
          render: (value) => value && <SpanCommon idKey={Constant.COMMON_DATA_KEY_CUSTOMER_DEMAND} value={value} notStyle />,
        },
        assigned_staff_username: "Giỏ CSKH",
        area: {
          label: "Miền",
          render: (value) => value && <SpanCommon idKey={Constant.COMMON_DATA_KEY_area} value={value} notStyle />,
        },
        note: "note",
      },
      columns: [
        {
          title: "Trường thay đổi",
          width: 1,
          accessor: "name",
        },

        {
          title: "Thông tin mới",
          width: 3,
          accessor: "new",
        },
      ],
    };
    this.convertData = this._convertData.bind(this);
  }

  async asyncData() {
    const { id } = this.state;
    const res = await asyncApi({
      data: getHistoryHotlineDetail({ id }),
    });

    const { data } = res;
    if (data) {
      this.setState({
        loading: false,
        data: data,
      });
    }
  }

  _convertData(data) {
    const { mappingField } = this.state;
    const listkey = Object.keys(mappingField);
    let dataList = [];

    _.forEach(listkey, (item) => {
      let value = _.get(data, item);
      let label = _.get(mappingField, item);
      let name, newData;

      if (_.isObject(label)) {
        const render = _.get(label, "render");
        name = _.get(label, "label");
        newData = render(value);
      } else {
        name = label;
        newData = value;
      }

      dataList.push({
        name: name,
        new: newData,
      });
    });

    return dataList;
  }

  componentDidMount() {
    this.asyncData();
  }

  render() {
    const { loading, data, columns } = this.state;
    const { history } = this.props;

    let dataChangedList = this.convertData(data);
    if (loading) {
      return <LoadingSmall style={{ textAlign: "center" }} />;
    }
    return (
      <React.Fragment>
        <Gird
          idKey={"HistoryChangedDetail"}
          data={dataChangedList}
          columns={columns}
          history={history}
          isPushRoute={false}
          isRedirectDetail={false}
        />
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(Detail);
