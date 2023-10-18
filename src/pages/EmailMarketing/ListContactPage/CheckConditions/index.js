import React from "react";
import { connect } from "react-redux";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { putToastError, putToastSuccess, deletePopup } from "actions/uiAction";
import { bindActionCreators } from "redux";
import { createSegment } from "api/emailMarketing";
import moment from "moment";

class CheckConditions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.object,
      loading: false,
      initialForm: {
        name: "name",
        campaign_group_id: "campaign_group_id",
      },
    };

    this.submitData = this._submitData.bind(this);
    this.goBack = this._goBack.bind(this);
  }

  _goBack() {
    const { actions } = this.props;
    actions.deletePopup();
    return true;
  }

  async _submitData() {
    const { actions, data, history } = this.props;

    this.setState({ loading: true });

    let sendData = { ...data };

    delete sendData.total_items;
    delete sendData.campaign_group_name;

    let res = await createSegment(sendData);

    if (res) {
      const { code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        actions.putToastSuccess("Thao tác thành công!");
        history.push({
          pathname: Constant.BASE_URL_EMAIL_MARKETING_LIST_CONTACT,
        });

        actions.deletePopup();
      } else {
        actions.putToastError(msg);
      }
    }
    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;
    const { data, sys } = this.props;

    const conditionItems = _.get(sys.common.items, Constant.COMMON_DATA_KEY_audience_condition_items);
    return (
      <>
        <div className="form-container">
          <div className="row">
            <div className="col-sm-10 col-xs-10">
              <div className="mt10 flex-col-class">
                <div className="col-sm-12 sub-title-form pb10 pt10 pl5">Thông tin chung</div>
                <div className="flex-row-between-class">
                  <div className="flex-row-class">
                    <div className="pl5">Tên:</div>
                    <div className="pl5">{data.name}</div>
                  </div>
                  <div className="flex-row-class">
                    <div className="pl5">Group campaign:</div>
                    <div className="pl5">{data.campaign_group_name}</div>
                  </div>
                </div>
                <div className="col-sm-12 sub-title-form pb10 pt10 pl5">Điều kiện</div>
                {data.conditions?.map((item, idx) => {
                  const leftValue = item.left;
                  const condition = conditionItems.find((c) => c.value === leftValue);
                  const type = condition?.from || Constant.PROMOTIONS_CONDITION_TYPE.input;

                  const valueRight = type == 5 ? moment.unix(item.right).format("YYYY-MM-DD") : item.right;

                  return (
                    <div className="flex-row-class " key={idx}>
                      <div className="pl5">{item.left}</div>
                      <div className="pl5">{item.operation}</div>
                      <div className="pl5">{valueRight}</div>
                    </div>
                  );
                })}

                <div className="col-sm-12 sub-title-form pb10 pt10 pl5">Tổng segment</div>
                <div className="flex-row-class">
                  <div className="pl5">{data.total_items} người nhận</div>
                </div>
              </div>
            </div>
          </div>
          <div className={"row mt15"}>
            <div className="col-sm-12 pt30 ">
              <button
                type="submit"
                className="el-button el-button-success el-button-small"
                onClick={() => this.submitData()}
                disabled={loading}
              >
                <span>Xác nhận</span>
              </button>
              <button type="button" className="el-button el-button-default el-button-small" onClick={() => this.goBack()}>
                <span>Đóng</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess, putToastError, deletePopup }, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    sys: state.sys,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckConditions);
