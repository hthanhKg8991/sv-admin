import React from "react";
import Gird from "components/Common/Ui/Table/Gird";
import {listCustomerHistoryLog} from "api/employer";
import Detail from "pages/CustomerCare/CustomerPage/Log/Detail";

const idKey = "HistoryLogList";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Người cập nhật",
                    cell: row => {
                        return <>{['fe_mb', "fe_pc"].includes(row.created_source) ? "Hệ thống" : row.updated_by }</>
                    }
                },

                {
                    title: "Thời gian cập nhật",
                    accessor: "updated_at",
                    time: true,
                },

            ],
            loading: false,
        };

    }

    render() {
        const {columns} = this.state;
        const {id, history} = this.props;
        return (
            <div className="form-container">
                <Gird idKey={idKey}
                      fetchApi={listCustomerHistoryLog}
                      query={{customer_id: id}}
                      columns={columns}
                      history={history}
                      isRedirectDetail={false}
                      isReplaceRoute
                      isPushRoute={false}
                      expandRow={row => <Detail object={row} vsics={this.props.vsics}/>}
                />
            </div>
        );
    }
}

export default List;
