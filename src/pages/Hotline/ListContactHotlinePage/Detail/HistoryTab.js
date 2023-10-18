import React from "react";
import * as Constant from "utils/Constant";
import _ from "lodash";
import { bindActionCreators } from "redux";
import { hideLoading, putToastSuccess, showLoading } from "actions/uiAction";
import { connect } from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import { getListHistoryHotline, updateStatusHistoryHotline } from "api/hotline";
import moment from "moment";
import { publish } from "utils/event";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import * as uiAction from "actions/uiAction";
import Detail from "./HistoryDetail";

class HistoryTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      columns: [
        {
          title: "Ngày tạo",
          width: 80,
          cell: (row) => (
            <React.Fragment>{row.created_at && moment.unix(row.created_at).format("DD/MM/YYYY HH:mm:ss")}</React.Fragment>
          ),
        },
        {
          title: "Người tạo",
          width: 150,
          cell: (row) => <React.Fragment>{row.updated_by_username}</React.Fragment>,
        },
        {
          title: "Đã xử lý",
          width: 50,
          cell: (row) => (
            <div className="cell text-center">
              <Checkbox
                checked={row.status == Constant.STATUS_ACTIVED}
                color="primary"
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
                onChange={() => {
                  let status = row.status == Constant.STATUS_ACTIVED ? Constant.STATUS_INACTIVED : Constant.STATUS_ACTIVED;
                  this.onChangeStatus(row.id, status);
                }}
              />
            </div>
          ),
        },
        {
          title: "Ngày xử lý",
          width: 80,
          cell: (row) => (
            <React.Fragment>{row.handler_at && moment.unix(row.handler_at).format("DD/MM/YYYY HH:mm:ss")}</React.Fragment>
          ),
        },
        {
          title: "Người xử lý",
          width: 200,
          cell: (row) => <React.Fragment>{row.handler_by_username}</React.Fragment>,
        },
      ],
    };
    this.expandRow = this._expandRow.bind(this);
    this.onChangeStatus = this._onChangeStatus.bind(this);
  }

  _expandRow(row) {
    const { history } = this.props;
    const { id } = this.state;

    return <Detail detailId={row.id} employerId={id} history={history} />;
  }

  async _onChangeStatus(id, status) {
    uiAction.showLoading();

    const res = await updateStatusHistoryHotline({ id, status });

    if (res) {
      uiAction.hideLoading();

      const { code, msg } = res;
      if (code === Constant.CODE_SUCCESS) {
        publish(".refresh", {}, "ServiceHotlineContactHistory");
      } else {
        uiAction.putToastError(msg);
      }
    }
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
    const { contactHotLine, history } = this.props;

    const { columns } = this.state;
    return (
      <div>
        <div className="row mt30 ">
          <div className="col-sm-3">
            <div className="row-content row-title ">ID Nhà tuyển dụng</div>
            <div className="">{contactHotLine.employer_id}</div>
          </div>
          <div className=" col-sm-3">
            <div className="row-content row-title ">Tên Nhà tuyển dụng</div>
            <div className="">{contactHotLine.name}</div>
          </div>
          <div className="col-sm-3">
            <div className="row-content row-title ">Mã số thuế</div>
            <div className="">{contactHotLine.tax_code}</div>
          </div>
        </div>
        <div className="col-sm-12 mt30">
          <Gird
            idKey={"ServiceHotlineContactHistory"}
            fetchApi={getListHistoryHotline}
            defaultQuery={{
              employer_hotline_id: _.get(contactHotLine, "id"),
            }}
            columns={columns}
            history={history}
            isPushRoute={false}
            isRedirectDetail={false}
            expandRow={(row) => this.expandRow(row)}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryTab);
