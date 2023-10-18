import React, { Component } from "react";
import { getListSentResumeAccountServiceSearchResumeFilter } from "api/mix"
import Gird from "components/Common/Ui/Table/Gird";
import TableDetailFilter from "./TableDetailFilter"

class FilterSaved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Tên bộ lọc",
          width: 40,
          accessor: "name"
        },
        {
          title: "Người tạo",
          width: 200,
          accessor: "created_by"
        },
        {
          title: "Ngày tạo",
          width: 100,
          accessor: "name"
        }
      ]
    }
  }
  render() {
    const { columns } = this.state;
    const { query, history, id } = this.props;

    return <div className="mt30">
      <Gird
        fetchApi={getListSentResumeAccountServiceSearchResumeFilter}
        columns={columns}
        query={query}
        history={history}
        isRedirectDetail={false}
        defaultQuery={{ campaign_id: id }}
        isPushRoute={false}
        isExpandRowChild={true}
        expandRow={row => <TableDetailFilter detail={row?.criteria} />}
        idKey=""
      />
    </div>
  }
}
export default FilterSaved;