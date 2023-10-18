import React, {Component} from "react";
import GirdCustomHeader from "pages/HeadhuntPage/SearchCandidatePage/GirdCustomHeader";
import {getListHistoryCandidateCvFileHeadhunt} from "api/headhunt";
import moment from "moment";

const idKey = "HistoryCandidateCvFileList"

class HistoryUploadFilePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Candidate ID",
                    width: 50,
                    accessor: "candidate_id"
                },
                {
                    title: "File",
                    width: 50,
                    cell: row => row.cv_file_url ? <a href={row.cv_file_url} target="_blank">File</a> : ""
                },
                {
                    title: "Ngày upload",
                    width: 50,
                    cell: row => <span>{moment.unix(row.created_at).format("DD-MM-YYYY")}</span>
                },
                {
                    title: "Người upload",
                    width: 50,
                    accessor: "created_by"
                },
            ]
        }
    }

    render() {
        const {history, candidate_id} = this.props;
        const {columns} = this.state;
        return (
            <div className="form-container">
                <GirdCustomHeader idKey={idKey} fetchApi={getListHistoryCandidateCvFileHeadhunt}
                                  query={{candidate_id: candidate_id}}
                                  columns={columns}
                                  isRedirectDetail={false}
                                  isPushRoute={false}
                                  history={history}/>
            </div>
        )
    }
}


export default HistoryUploadFilePopup;
