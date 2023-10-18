import React, { Component } from "react";
import ComponentFilter from "./ComponentFilter";
import { getHistorySentResumeAccountServiceSearchResumeCampaign } from "api/mix"
import Gird from "components/Common/Ui/Table/Gird";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
const idKey = Constant.IDKEY_ACCOUNT_SERVICE_SEARCH_RESUME_CAMPAIGN_HISTORY_SEND_RESUME;
import { putToastSuccess } from "actions/uiAction";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
class HistorySendCV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Id",
          width: 40,
          accessor: "id"
        },
        {
          title: "Tiêu đề hồ sơ",
          width: 200,
          accessor: "resume_title"
        },
        {
          title: "Tên ứng viên",
          width: 100,
          accessor: "seeker_name"
        },
        {
          title: "Ngày gửi",
          width: 150,
          accessor: "created_at"
        },
        {
          title: "Trạng thái",
          width: 90,
          cell: row => {
            return (<SpanCommon idKey={Constant.COMMON_DATA_KEY_type_campaign_history} value={row?.status} />)
          }
        },
      ],
    };

    this.onClickExport = this._onClickExport.bind(this);
  }

  async _onClickExport() {
    const { actions, id } = this.props;
    const res = await getHistorySentResumeAccountServiceSearchResumeCampaign({ campaign_id: id, export: 1 });
    if (res) {
      actions.putToastSuccess('Thao tác thành công');
      window.open(res?.url);
    }
  }

  render() {

    const { columns } = this.state;
    const { query, history, id } = this.props;

    return (
      <div>
        <ComponentFilter idKey={idKey} />
        <button type="button"
          className="el-button el-button-primary el-button-small mb30 mt30"
          onClick={this.onClickExport}>
          <span>Xuất Excel  <i
            className="glyphicon glyphicon-file" /></span>
        </button>
        <Gird
          idKey={idKey}
          fetchApi={getHistorySentResumeAccountServiceSearchResumeCampaign}
          columns={columns}
          query={query}
          defaultQuery={{ campaign_id: id }}
          history={history}
          isRedirectDetail={false}
          isPushRoute={false}
        />
      </div>
    )

  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ putToastSuccess }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(HistorySendCV);