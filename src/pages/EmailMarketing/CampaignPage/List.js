import React, { Component } from "react";
import { connect } from "react-redux";
import { publish } from "utils/event";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/EmailMarketing/CampaignPage/ComponentFilter";
import { bindActionCreators } from "redux";
import { hideSmartMessageBox, putToastSuccess, SmartMessageBox, createPopup } from "actions/uiAction";
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import PopupForm from "pages/EmailMarketing/CampaignPage/Popup/PopupForm";
import * as Constant from "utils/Constant";
import moment from "moment";
import { deleteCampaign, getListCampaign } from "api/emailMarketing";
import SpanCommon from "components/Common/Ui/SpanCommon";
import { Link } from "react-router-dom";
import queryString from "query-string";

const idKey = "EmailMarketingCampaignList";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "ID",
          width: 50,
          accessor: "id",
        },
        {
          title: "Loại Campaign",
          width: 80,
          cell: (row) => <SpanCommon idKey={Constant.COMMON_DATA_KEY_email_marketing_campaign_type} notStyle value={row?.type} />,
        },
        {
          title: "Tên",
          width: 200,
          accessor: "name",
        },
        {
          title: "Group Campaign",
          width: 140,
          accessor: "campaign_group_name",
        },
        {
          title: "Recipients",
          width: 55,
          accessor: "recipient",
          cell: (row) => (
            <Link
              to={`${Constant.BASE_URL_EMAIL_MARKETING_CAMPAIGN}?${queryString.stringify({
                campaign_id: row.id,
                action: "detail",
              })}`}
            >
              <span className={"text-link"}>{row.recipient}</span>
            </Link>
          ),
        },
        {
          title: "Send",
          width: 50,
          accessor: "sent",
        },
        {
          title: "Opened",
          width: 50,
          accessor: "opened",
        },
        {
          title: "Click",
          width: 50,
          accessor: "click",
        },
        {
          title: "Unsubscribe",
          width: 60,
          accessor: "unsubscribe",
        },
        {
          title: "Trạng thái",
          width: 60,
          cell: (row) => <SpanCommon idKey={Constant.COMMON_DATA_KEY_email_marketing_status} value={row?.status} />,
        },
        {
          title: "Thời gian gửi",
          width: 90,
          cell: (row) => (
            <span>{`${moment.unix(row.sending_schedule).format("HH")}h - ${moment
              .unix(row.sending_schedule)
              .format("DD/MM/YYYY")}`}</span>
          ),
        },
        {
          title: "Hành động",
          width: 120,
          onClick: () => {},
          cell: (row) => (
            <>
              <CanRender actionCode={ROLES.email_marketing_campaign_crud}>
                <span className="text-link text-blue font-bold ml5" onClick={() => this.onEdit(row)}>
                  Chỉnh sửa
                </span>
              </CanRender>
              <CanRender actionCode={ROLES.email_marketing_campaign_crud}>
                <span className="text-link text-red font-bold ml10" onClick={() => this.onDelete(row)}>
                  Xóa
                </span>
              </CanRender>
            </>
          ),
        },
      ],
      loading: false,
    };

    this.onClickAdd = this._onClickAdd.bind(this);
    this.onEdit = this._onEdit.bind(this);
    this.onDelete = this._onDelete.bind(this);
  }
  //to do
  _onClickAdd(type) {
    const { actions } = this.props;
    actions.createPopup(PopupForm, "Thêm mới", { idKey, type });
  }

  _onEdit(object) {
    const { actions } = this.props;
    const { type } = object;
    actions.createPopup(PopupForm, "Chỉnh sửa", { idKey, object, type });
  }

  _onDelete(row) {
    const { actions } = this.props;
    actions.SmartMessageBox(
      {
        title: "Bạn có chắc muốn xóa: ID " + row.id + " - " + row.name,
        content: "",
        buttons: ["No", "Yes"],
      },
      async (ButtonPressed) => {
        actions.hideSmartMessageBox();
        if (ButtonPressed === "Yes") {
          const res = await deleteCampaign({ id: row.id });

          if (res) {
            actions.putToastSuccess("Thao tác thành công");
          }
          publish(".refresh", {}, idKey);
        }
      }
    );
  }

  render() {
    const { columns } = this.state;
    const { query, defaultQuery, history } = this.props;
    return (
      <Default
        left={<WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter} />}
        title="Danh Sách Quản Lý Campaign"
        titleActions={
          <button
            type="button"
            className="bt-refresh el-button"
            onClick={() => {
              publish(".refresh", {}, idKey);
            }}
          >
            <i className="fa fa-refresh" />
          </button>
        }
        buttons={
          <div className="left btnCreateNTD">
            <CanRender actionCode={ROLES.email_marketing_campaign_crud}>
              <button
                type="button"
                className="el-button el-button-primary el-button-small"
                onClick={() => this.onClickAdd(Constant.EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_MARKETING)}
              >
                <span>
                  Thêm mới Campaign Email Marketing <i className="glyphicon glyphicon-plus" />
                </span>
              </button>
              {/* <button
                type="button"
                className="el-button el-button-primary el-button-small"
                onClick={() => this.onClickAdd(Constant.EMAIL_MARKETING_CAMPAIGN_TYPE_EMAIL_TRANSACTION)}
              >
                <span>
                  Thêm mới Campaign Email Transaction
                  <i className="glyphicon glyphicon-plus ml5" />
                </span>
              </button> */}
            </CanRender>
          </div>
        }
      >
        <Gird
          idKey={idKey}
          fetchApi={getListCampaign}
          query={query}
          columns={columns}
          defaultQuery={defaultQuery}
          history={history}
          isRedirectDetail={false}
        />
      </Default>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        putToastSuccess,
        SmartMessageBox,
        hideSmartMessageBox,
        createPopup,
      },
      dispatch
    ),
  };
}

export default connect(null, mapDispatchToProps)(List);
