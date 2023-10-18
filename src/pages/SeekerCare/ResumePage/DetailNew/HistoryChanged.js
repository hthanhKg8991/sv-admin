import React from "react";
import _ from "lodash";
import queryString from "query-string";
import Gird from "components/Common/Ui/Table/Gird";
import moment from "moment";
import SpanCommon from "components/Common/Ui/SpanCommon";
import * as Constant from "utils/Constant";
import Default from "components/Layout/Page/Default";
import {publish} from "utils/event";
import Detail from "pages/SeekerCare/ResumePage/DetailNew/HistoryChanged/HistoryDetail";
import { resumeListRevision } from 'api/resume';

class HistoryChanged extends React.Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            columns: [
                {
                    title: "Người cập nhật",
                    width: 200,
                    accessor: "updated_by"
                },
                {
                    title: "Thời gian cập nhật",
                    width: 150,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row.updated_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Trạng thái",
                    width: 100,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_seeker_status} value={row.revision_status}/>
                    )
                },
                {
                    title: "Người duyệt",
                    width: 200,
                    accessor: "approved_by"
                },
                {
                    title: "Ngày duyệt",
                    width: 100,
                    cell: row => (
                        row.approved_at &&
                        <React.Fragment>
                            {row?.approved_at && moment.unix(row.approved_at).format("DD/MM/YYYY")}
                        </React.Fragment>
                    )
                },
                {
                    title: "Lý do",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {_.get(row, 'rejected_reason', null) && _.get(row, 'rejected_reason').map(reason => (
                                <React.Fragment key={reason}>
                                    - <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_rejected_reason}
                                                  value={reason}
                                                  notStyle/><br/>
                                </React.Fragment>
                            ))}
                            {row?.rejected_reason_note && <span>Lý do khác: {row?.rejected_reason_note}</span>}
                        </React.Fragment>
                    )
                }
            ]
        };
        this.goBack = this._goBack.bind(this);
        this.expandRow = this._expandRow.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        const {id} = this.state;
        if (_.get(history, 'action') === 'POP') {
            history.push({
                pathname: Constant.BASE_URL_SEEKER_RESUME,
                search: '?action=detail&id=' + id
            });

            return true;
        }

        if (_.get(history, 'action') === 'PUSH') {
            const search = queryString.parse(_.get(history, ['location', 'search']));
            history.push({
                pathname: Constant.BASE_URL_SEEKER_RESUME,
                search: '?' + queryString.stringify({
                    ...search,
                    action: 'detail',
                    id: id
                })
            });

            return true;
        }
    }

    _expandRow(row) {
        return (<Detail id={row.id} resume_id={this.state.id} object={row} goBack={this.goBack} />);
    }

    render() {
        const {id, columns} = this.state;
        const {history} = this.props;

        return (
            <Default title={'Lịch sử thay đổi Hồ sơ'}
                     titleActions={(
                         <button type="button" className="bt-refresh el-button" onClick={() => {
                             publish(".refresh", {}, "HistoryChanged")
                         }}>
                             <i className="fa fa-refresh"/>
                         </button>
                     )}>
                <div className={"row mt15"}>
                    <div className="col-sm-12">
                        <button type="button" className="el-button el-button-default el-button-small"
                                onClick={this.goBack}>
                            <span>Quay lại</span>
                        </button>
                    </div>
                    <div className={"col-md-12 mt10"}>
                        <Gird idKey={"HistoryChanged"}
                              fetchApi={resumeListRevision}
                              defaultQuery={{resume_id: id}}
                              columns={columns}
                              history={history}
                              isPushRoute={false}
                              isRedirectDetail={false}
                              expandRow={row => this.expandRow(row)}
                              indexExpandRow={0}/>
                    </div>
                </div>
            </Default>
        );
    }
}

export default HistoryChanged;
