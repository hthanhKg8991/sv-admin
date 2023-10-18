import React from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { bindActionCreators } from "redux";
import { hideLoading, putToastSuccess, showLoading } from "actions/uiAction";
import { connect } from "react-redux";
import * as uiAction from "actions/uiAction";

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async asyncData() {
    this.setState({
      loading: false,
    });
  }

  componentDidMount() {
    this.asyncData();
  }

  render() {
    const { contactHotLine } = this.props;
    return (
      <div className="row">
        <div className="col-sm-6 col-xs-6">
          <div className="mt30 ">
            <div className="row-content row-title ">ID Nhà tuyển dụng</div>
            <div className="">{contactHotLine.employer_id}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Tên Nhà tuyển dụng</div>
            <div className="">{contactHotLine.name}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Mã số thuế</div>
            <div className="">{contactHotLine.tax_code}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Địa chỉ</div>
            <div className="">{contactHotLine.address}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Tên Người liên hệ</div>
            <div className="">{contactHotLine.contact_name}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Miền</div>
            <SpanCommon idKey={Constant.COMMON_DATA_KEY_area} value={contactHotLine.area} notStyle />
          </div>
        </div>
        <div className="col-sm-6 col-xs-6">
          <div className="mt30 ">
            <div className="row-content row-title ">Số điện thoại</div>
            <div className="">{contactHotLine.phone.join(", ")}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Email</div>
            <div className="">{contactHotLine.email}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Nhu cầu của Khách hàng</div>
            <div className="">
              <SpanCommon idKey={Constant.COMMON_DATA_KEY_CUSTOMER_DEMAND} value={contactHotLine.customer_demand} notStyle />
            </div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Giỏ CSKH</div>
            <div className="">{contactHotLine.assigned_staff_username}</div>
          </div>
          <div className="mt30">
            <div className="row-content row-title ">Loại CSKH</div>
            <div className="">
              <SpanCommon idKey={Constant.COMMON_DATA_KEY_EMPLOYER_HOTLINE_TYPE} value={contactHotLine.assigned_type} />
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-12">
          <div className="mt30 ">
            <div className="row-content row-title ">Ghi chú</div>
            <div dangerouslySetInnerHTML={{ __html: contactHotLine.note }} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    common: _.get(state, ["sys", "common", "items"], null),
    branch: state.branch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        putToastSuccess,
        showLoading,
        hideLoading,
      },
      dispatch
    ),
    uiAction: bindActionCreators(uiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
