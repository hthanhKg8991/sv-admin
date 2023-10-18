import React, { Component } from "react";
import { connect } from "react-redux";
import Default from "components/Layout/Page/Default";
import { publish, subscribe } from "utils/event";
import _ from "lodash";
import queryString from "query-string";
import {
  dailyReportContractRequestHeadhunt,
  listHierarchicalHeadhunt,
} from "api/headhunt";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import { compare } from "utils/utils";
import LoadingTable from "components/Common/Ui/LoadingTable";
import * as utils from "utils/utils";
import Pagination2 from "components/Common/Ui/Table/Pagination2";

const idKey = "ContractRequestDetailReport";

class List extends Component {
  constructor(props) {
    super(props);
    const searchParam = _.get(props, ["location", "search"]);
    const queryParsed = queryString.parse(searchParam);
    const id = _.get(queryParsed, "id");
    this.state = {
      id: id,
      data: [],
      columns_name: [],
      loading: true,
      perPage: props.perPage || 10,
      filter: null,
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
        idKey
      )
    );
    this.asyncData = this._asyncData.bind(this);
    this.initColumns = this._initColumns.bind(this);
    this.onChangePerPage = this._onChangePerPage.bind(this);
    this.onChangePage = this._onChangePage.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const filterIdKey = "Filter" + idKey;
    if (
      _.has(newProps, filterIdKey) &&
      compare(this.props[filterIdKey], newProps[filterIdKey])
    ) {
      let params = _.get(newProps, filterIdKey);
      this.setState({ loading: true }, () => {
        this.asyncData({filter: params, page: 1});
      });
    }
  }

  async _initColumns() {
    const columns_name = await listHierarchicalHeadhunt();
    if (columns_name) {
      this.setState({ columns_name });
    }
  }

  async _asyncData(params = {}) {
    const {history, query } = this.props;
    const perPage = _.get(params, 'perPage', this.state.perPage);
    const filter = _.get(params, 'filter', this.state.filter);
    const page = _.get(params, 'page', query?.page || 1);
    const paramFull = {
        ...filter,
        per_page: perPage,
        page: page,
    };
    history.replace(
      window.location.pathname + "?" + queryString.stringify(paramFull)
    );
    const data = await dailyReportContractRequestHeadhunt(paramFull);
    if (data) {
      this.setState({
        data,
        perPage: perPage,
        filter: filter,
        pagination: {
          pageCurrent: parseInt(_.get(data, ["current"], 0)),
          totalPage: _.get(data, ["total_pages"], 0),
          totalItem: _.get(data, ["total_items"], 0),
        },
        loading: false
      });
    }
  }

  _onChangePerPage(perPage) {
    this.setState({ loading: true }, () => {
      this.asyncData({ perPage: perPage, page: 1 });
    });
  }

  _onChangePage(page) {
    this.setState({ loading: true }, () => {
      this.asyncData({ page: page });
    });
  }

  componentDidMount() {
    const { query } = this.props;
    this.asyncData({filter: query});
    this.initColumns();
  }

  render() {
    const { data, columns_name, loading, perPage, pagination } = this.state;
    const { query } = this.props;
    const columns = columns_name.reduce((p, c) => {
      if (c.list_applicant_action_result) {
        c.list_applicant_action_result.forEach((v) => {
          p.push(`${c.code}.${v.code}`);
        });
        return p;
      } else {
        p.push(c.code);
        return p;
      }
    }, []);
    return (
      <Default
        left={
          <WrapFilter
            idKey={idKey}
            query={query}
            ComponentFilter={ComponentFilter}
          />
        }
        title="Hiệu quả tuyển dụng"
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
      >
        {loading ? (
          <LoadingTable />
        ) : (
          <>
            <div
              style={{
                width: "100%",
                overflowX: "scroll",
                textAlign: "center",
              }}
            >
              <table className="table table-bordered">
                <thead>
                  <tr style={{ background: "#deebff", fontWeight: "bold" }}>
                    <td className="middle" colSpan={5}>
                      THÔNG TIN CHUNG
                    </td>
                    <td className="middle" colSpan={columns.length}>
                      HIỆU QUẢ TUYỂN DỤNG
                    </td>
                  </tr>
                  <tr style={{ background: "#deebff", fontWeight: "bold" }}>
                    <td
                      className="middle"
                      rowSpan={2}
                      style={{ minWidth: "200px" }}
                    >
                      Vị trí tuyển dụng
                    </td>
                    <td
                      className="middle"
                      rowSpan={2}
                      style={{ minWidth: "200px" }}
                    >
                      Hợp đồng
                    </td>
                    <td className="middle" rowSpan={2}>
                      Contract Value
                    </td>
                    <td className="middle" rowSpan={2}>
                      Actual Revenue
                    </td>
                    <td className="middle" rowSpan={2}>
                      Candidate đề xuất nghiệm thu
                    </td>
                    {columns_name?.map((status, i) => (
                      <td
                        className="middle"
                        colSpan={
                          status.list_applicant_action_result?.length || 1
                        }
                        rowSpan={status.list_applicant_action_result ? 1 : 2}
                        key={i}
                      >
                        {status.name}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ background: "#deebff", fontWeight: "bold" }}>
                    {columns_name?.map((status) => {
                      return status.list_applicant_action_result?.map(
                        (child, j) => (
                          <td className="middle" key={j}>
                            {child.name}
                          </td>
                        )
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((item, j) => {
                    const rowData = item.list_applicant_status?.reduce(
                      (p, c) => {
                        if (c.list_applicant_action_result) {
                          c.list_applicant_action_result.forEach((v) => {
                            p.push({
                              code: `${c.code}.${v.code}`,
                              total: v.total,
                            });
                          });
                          return p;
                        } else {
                          p.push(c);
                          return p;
                        }
                      },
                      []
                    );
                    return (
                      <tr key={j}>
                        <td className={"text-left"}>
                          <div className="mb10">
                            {`${item.id} - ${item.title}`}
                          </div>
                          <div>{`(SL cần tuyển: ${item.quantity_needed})`}</div>
                        </td>
                        <td className={"text-left"}>
                          <div>
                            <div className="font-bold mr5">- Mã hợp đồng:</div>
                            <span>{item.contract_code}</span>
                          </div>
                          <div>
                            <span className="font-bold mr5">- Khách hàng:</span>
                            <span>{`${item.customer_id} - ${item.customer_company_name}`}</span>
                          </div>
                          <div>
                            <span className="font-bold mr5">- Sale:</span>
                            <div>
                              {item.list_sale?.map((v, i) => (
                                <div key={i}>{v}</div>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          {utils.formatNumber(item.amount_total, 0, ",", "")}
                        </td>
                        <td>
                          {utils.formatNumber(item.actual_revenue, 0, ",", "")}
                        </td>
                        <td>{item.total_applicant_acceptance}</td>
                        {columns.map((col, k) => (
                          <td key={k}>
                            {rowData?.find((v) => v.code === col)?.total || ""}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination2
              {...pagination}
              perPage={perPage}
              onChange={this.onChangePage}
              onChangePerPage={this.onChangePerPage}
            />
          </>
        )}
      </Default>
    );
  }
}

function mapStateToProps(state) {
  return {
    ["Filter" + idKey]: state.filter[idKey],
  };
}

export default connect(mapStateToProps, null)(List);
