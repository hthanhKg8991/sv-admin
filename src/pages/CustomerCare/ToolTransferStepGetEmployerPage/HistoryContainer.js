import React, {Component} from "react";
import {connect} from "react-redux";
import Gird from "components/Common/Ui/Table/Gird";
import Default from "components/Layout/Page/Default";
import {publish} from "utils/event";
import {getHistoryRequestEmployer} from "api/employer";
import * as Constant from "utils/Constant";

class HistoryContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Ngày yêu cầu",
                    width: 200,
                    time: true,
                    accessor: "created_at",
                },
                {
                    title: "Người yêu cầu",
                    width: 200,
                    accessor: "created_by",
                },
                {
                    title: "File",
                    width: 200,
                    cell: row => row?.status === Constant.STATUS_ACTIVED ?
                        <a href={row?.url_file || ""} className="text-link">Tải xuống</a> :
                        <span>Đang xử lý</span>
                },
            ]
        };
    }

    render() {
        const {columns} = this.state;
        const {idKey, history, id} = this.props;

        return (
            <Default
                title="Lịch sử xuất file"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}>
                <Gird idKey={idKey}
                      fetchApi={getHistoryRequestEmployer}
                      query={{}}
                      columns={columns}
                      defaultQuery={{request_id: id}}
                      history={history}
                      isPushRoute={false}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

export default connect(null, null)(HistoryContainer);
