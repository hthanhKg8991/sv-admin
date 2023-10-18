import React, { Component } from "react";
import { connect } from "react-redux";
import { Collapse } from "react-bootstrap";
import { bindActionCreators } from "redux";
import classnames from "classnames";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupEmployerPackage from "pages/Accountant/ComboPostingPackagePage/Edit/Package/Popup/PopupEmployerPackage";
import PopupUpdate from "pages/Accountant/ComboPostingPackagePage/Edit/Package/Popup/PopupUpdate";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import SpanService from "components/Common/Ui/SpanService";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import { subscribe } from "utils/event";
import { deleteComboItems, getListComboItems } from "api/saleOrder";
import SpanText from "components/Common/Ui/SpanText";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";

const idKey = Constant.IDKEY_EMPLOYER_PACKAGE;

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data_list: [],
      show_detail: false,
    };

    this.subscribers = [];
    this.subscribers.push(
        subscribe(
            ".refresh",
            () => {
              this.asyncData();
            },
            idKey
        )
    );

    this.btnBuy = this._btnBuy.bind(this);
    this.asyncData = this._asyncData.bind(this);
    this.btnDelete = this._btnDelete.bind(this);
    this.btnUpdate = this._btnUpdate.bind(this);
    this.toggleShow = this._toggleShow.bind(this);
  }

  _btnBuy(name) {
    this.props.uiAction.createPopup(PopupEmployerPackage, "Mua "+name, {
      id: this.props.id,
      type_campaign: Constant.SALES_ORDER_ITEM_TYPE_CAMPAIGN.default,
    });
  }

  _btnUpdate(item) {
    this.props.uiAction.createPopup(PopupUpdate, "Thay đổi", {
      object: item,
      idKey: idKey,
    });
  }

  _btnDelete(object,name) {
    const { uiAction } = this.props;
    uiAction.SmartMessageBox(
        {
          title: `Bạn có chắc muốn xóa gói ${name} ?`,
          content: "",
          buttons: ["No", "Yes"],
        },
        async (ButtonPressed) => {
          if (ButtonPressed === "Yes") {
            this.setState({ loading: true });
            const res = await deleteComboItems({ id: object.id });
            if (res) {
              uiAction.putToastSuccess("Thao tác thành công");
              uiAction.hideSmartMessageBox();
              this.asyncData();
            }
            this.setState({ loading: false });
          }
        }
    );
  }

  _toggleShow() {
    this.setState({ show_detail: !this.state.show_detail });
  }

  async _asyncData() {
    const args = {
      service_type: Constant.SERVICE_TYPE_FILTER_RESUME_2018,
      combo_id: this.props.id,
    };
    this.setState({ loading: true });
    const res = await getListComboItems(args);
    if (res) {
      this.setState({ data_list: res });
      if (Array.isArray(res) && res.length > 0) {
        this.setState({ show_detail: true });
      }
    }
    this.setState({ loading: false });
  }

  componentDidMount() {
    this.asyncData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
        !(JSON.stringify(nextState) === JSON.stringify(this.state)) ||
        !(JSON.stringify(nextProps) === JSON.stringify(this.props))
    );
  }

  render() {
    let { data_list, show_detail } = this.state;
    let {sys} = this.props;
    const listService = sys?.service?.items;
    const detailService = listService?.find(_=>_?.service_type === "filter_resume_2018");
    const bundles_type_campaign = utils.convertArrayValueCommonData(
        this.props.sys.common.items,
        Constant.COMMON_DATA_KEY_BUNDLES_TYPE_CAMPAIGN
    );

    return (
        <div className="col-result-full crm-section">
          <div className="box-card box-full">
            <div
                className="box-card-title pointer box-package"
                onClick={this.toggleShow}
            >
              <span className="title left">{detailService?.display_name_frontend || detailService?.display_name_contract}</span>
              <div className={classnames("right", show_detail ? "active" : "")}>
                <button type="button" className="bt-refresh el-button">
                  <i className="v-icon v-icon-append fa fa-chevron-down fs20" />
                </button>
              </div>
            </div>
            <Collapse in={show_detail}>
              <div>
                {this.state.loading ? (
                    <div className="text-center">
                      <LoadingSmall />
                    </div>
                ) : (
                    <div className="card-body">
                      <div className="left">
                        <CanRender
                            actionCode={ROLES.accountant_combo_package_create_package}
                        >
                          <button
                              type="button"
                              className="el-button el-button-primary el-button-small"
                              onClick={()=>this.btnBuy(detailService?.display_name_frontend || detailService?.display_name_contract)}
                          >
                        <span>
                          Mua {detailService?.display_name_frontend || detailService?.display_name_contract}{" "}
                          <i className="glyphicon glyphicon-plus" />
                        </span>
                          </button>
                        </CanRender>
                      </div>
                      <div className="right">
                        <button
                            type="button"
                            className="bt-refresh el-button"
                            onClick={() => {
                              this.asyncData();
                            }}
                        >
                          <i className="fa fa-refresh" />
                        </button>
                      </div>
                      <div className="crm-section">
                        <div className="body-table el-table">
                          <TableComponent className="table-custom">
                            <TableHeader tableType="TableHeader">
                              Thông tin
                            </TableHeader>
                            <TableHeader tableType="TableHeader">
                              Hiển thị
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={120}>
                              Thao tác
                            </TableHeader>
                            <TableBody tableType="TableBody">
                              {data_list.map((item) => (
                                  <tr
                                      className={classnames("el-table-row pointer")}
                                      key={String(item.id)}
                                  >
                                    <td>
                                      <div className="cell-custom mt5 mb5">
                                        <div>
                                          ID:{" "}
                                          <span className="text-bold">
                                      {item?.id}
                                    </span>
                                        </div>
                                        <div>
                                          Tên gói dịch vụ:{" "}
                                          <span className="text-bold">
                                      <SpanService
                                          value={item.service_code || ""}
                                          notStyle
                                      />
                                    </span>
                                        </div>
                                        <div>
                                          Mã SKU:{" "}
                                          <span className="text-bold">
                                      {item?.sku_code}
                                    </span>
                                        </div>
                                        {bundles_type_campaign
                                            ?.map((itemBundle) => itemBundle?.value)
                                            ?.includes(item?.type_campaign) && (
                                            <div>
                                              <span>Loại gói:</span>{" "}
                                              <SpanText
                                                  cls="text-bold"
                                                  idKey={
                                                    Constant.COMMON_DATA_KEY_BUNDLES_TYPE_CAMPAIGN
                                                  }
                                                  value={item?.type_campaign}
                                              />
                                            </div>
                                        )}
                                        <div>
                                          Điểm mua:{" "}
                                          <span className="text-bold">
                                      {utils.formatNumber(
                                          item?.quantity,
                                          0,
                                          ".",
                                          "điểm"
                                      )}
                                    </span>
                                        </div>
                                        <div>
                                          Thời gian hiệu lực:{" "}
                                          <span className="text-bold">
                                      {item?.week_quantity} tuần
                                    </span>
                                        </div>
                                        <div>
                                          Chiết khấu:{" "}
                                          <span className="text-bold">
                                      {utils.formatNumber(
                                          item.discount_rate,
                                          0,
                                          ".",
                                          " %"
                                      )}
                                    </span>
                                        </div>
                                        <div>
                                          Khuyến mãi:{" "}
                                          <span className="text-bold">
                                      {utils.formatNumber(
                                          item.promotion_rate,
                                          0,
                                          ".",
                                          " %"
                                      )}
                                    </span>
                                        </div>
                                        <div>
                                          {detailService?.display_name_frontend || detailService?.display_name_contract}:{" "}
                                          <span className="text-bold">
                                      {utils.formatNumber(
                                          item.point_convert,
                                          0
                                      )}
                                    </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="cell-custom mt5 mb5">
                                        <div>
                                          Tiêu đề:{" "}
                                          <span className="text-bold">
                                      {item.name}
                                    </span>
                                        </div>
                                        <div>
                                          Ordering:{" "}
                                          <span className="text-bold">
                                      {item.ordering}
                                    </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="cell-custom">
                                        <br />
                                        <CanRender
                                            actionCode={
                                              ROLES.accountant_combo_package_update_package
                                            }
                                        >
                                          <div className="text-underline pointer">
                                      <span
                                          className="text-bold text-info"
                                          onClick={() => this.btnUpdate(item,detailService?.display_name_frontend || detailService?.display_name_contract)}
                                      >
                                        Thay đổi
                                      </span>
                                          </div>
                                        </CanRender>
                                        <br />
                                        <CanRender
                                            actionCode={
                                              ROLES.accountant_combo_package_delete_package
                                            }
                                        >
                                          <div className="text-underline pointer">
                                      <span
                                          className="text-bold text-danger"
                                          onClick={() => this.btnDelete(item,detailService?.display_name_frontend || detailService?.display_name_contract)}
                                      >
                                        Xóa
                                      </span>
                                          </div>
                                        </CanRender>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                            </TableBody>
                          </TableComponent>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </Collapse>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    api: state.api,
    sys: state.sys,
    refresh: state.refresh,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiAction: bindActionCreators(uiAction, dispatch),
    apiAction: bindActionCreators(apiAction, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
