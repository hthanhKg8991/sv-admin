import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";

import SpanCommon from "components/Common/Ui/SpanCommon";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import Default from "components/Layout/Page/Default";

import {langDelete, langList} from "api/system";

import {hideSmartMessageBox, putToastError, putToastSuccess, SmartMessageBox,} from "actions/uiAction";
import * as Constant from "utils/Constant";
import {publish} from "utils/event";

import ComponentFilter from "pages/CustomerCare/DataLangPage/ComponentFilter";

const idKey = "LangPageList";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "ID",
          width: 60,
          accessor: "id",
        },
        {
          title: "Tên tiếng việt",
          width: 100,
          cell: row => row?.key || row.common_data?.name,
        },
        {
          title: "Translate",
          width: 100,
          accessor: "name",
        },
        {
          title: "Ngôn ngữ",
          width: 120,
          cell: row => <SpanCommon  idKey={Constant.COMMON_DATA_KEY_SYSTEM_LANG_LIST}
                                    value={row.lang}/>,
        },
        {
          title: "Loại hiển thị",
          width: 120,
          cell: row => <SpanCommon  idKey={Constant.COMMON_DATA_KEY_system_lang_type}
                                    value={row.type}/>,
        },
        {
          title: "CommonKey",
          width: 100,
          accessor: "common_id",
        },
        {
          title: "Người cập nhật",
          width: 100,
          accessor: "updated_by",
        },
        {
          title: "Ngày cập nhật",
          width: 100,
          cell: (row) =>
              moment.unix(row?.updated_at).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
          title: "Hành động",
          width: 80,
          cell: (row) => (
              <>
                <span
                    className="text-link text-blue font-bold"
                    onClick={() => this.onEdit(row?.id)}
                >
                Chỉnh sửa
              </span>
                <span
                    className="text-link text-danger ml10 font-bold"
                    onClick={() => this.onDelete(row?.id)}
                >
                Xóa
              </span>
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

  _onClickAdd() {
    const { history } = this.props;
    history.push({
      pathname: Constant.BASE_URL_LANG_PAGE,
      search: "?action=edit&id=0",
    });
  }

  _onEdit(id) {
    const { history } = this.props;
    history.push({
      pathname: Constant.BASE_URL_LANG_PAGE,
      search: "?action=edit&id=" + id,
    });
  }

  _onDelete(id) {
    const { actions } = this.props;
    actions.SmartMessageBox(
        {
          title: "Bạn có chắc muốn xóa ID: " + id,
          content: "",
          buttons: ["No", "Yes"],
        },
        async (ButtonPressed) => {
          if (ButtonPressed === "Yes") {
            const res = await langDelete({ id });
            if (res) {
              actions.putToastSuccess("Thao tác thành công");
              publish(".refresh", {}, idKey);
            }
            actions.hideSmartMessageBox();
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
            left={
              <WrapFilter
                  idKey={idKey}
                  query={query}
                  ComponentFilter={ComponentFilter}
              />
            }
            title="Danh Sách Lang"
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
                {/* <CanRender actionCode={ROLES.accountant_combo_post_store}> */}
                <button
                    type="button"
                    className="el-button el-button-primary el-button-small"
                    onClick={this.onClickAdd}
                >
                <span>
                  Thêm mới <i className="glyphicon glyphicon-plus" />
                </span>
                </button>
              </div>
            }
        >
          <Gird
              idKey={idKey}
              fetchApi={langList}
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

function mapStateToProps(state) {
  return {
    branch: state.branch,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
        { putToastSuccess, putToastError, SmartMessageBox, hideSmartMessageBox },
        dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
