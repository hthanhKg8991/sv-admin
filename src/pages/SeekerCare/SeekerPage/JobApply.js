import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilterJobApply from "pages/SeekerCare/SeekerPage/ComponentFilterJobApply";
import Gird from "components/Common/Ui/Table/Gird";
import {getResumeAppliedList} from "api/mix";
import * as Constant from "utils/Constant";
import _ from "lodash";
import SpanCommon from "components/Common/Ui/SpanCommon";
import queryString from "query-string";
import moment from "moment";

const idKey = "SeekerJobApplyList";

class JobApply extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            loading: false,
            columns: [
                {
                    title: "Tiêu đề hồ sơ",
                    width: 200,
                    cell: row => {
                        return row?.resume_info && parseInt(row?.resume_type) !== Constant.RESUME_ATTACH_FILE ?
                            <Link to={`${Constant.BASE_URL_SEEKER_RESUME}?${queryString.stringify({action:"detail", id: row?.resume_info?.id})}`}>
                                <span>{row?.resume_info?.id}</span> -
                                {parseInt(row?.resume_info?.resume_type) === Constant.RESUME_NORMAL_FILE && (
                                    <i className="fa mr-1 fa-paperclip text-info text-bold"/>)}
                                <span className="ml5">{row?.resume_info?.title}</span>
                            </Link> :
                            <a href={row?.file_name_url || "#"} rel="noopener noreferrer" target="_blank" download>Xem file</a>
                    }
                },
                {
                    title: "Trạng thái hồ sơ",
                    width: 200,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_status}
                                    value={row?.resume_info?.status_combine}/>
                    )
                },
                {
                    title: "Trạng thái ứng tuyển",
                    width: 200,
                    cell: row => (
                        <SpanCommon idKey={Constant.COMMON_DATA_KEY_resume_applied_status_V2}
                                    value={_.get(row, 'status')}/>
                    )
                },
                {
                    title: "Ngày ứng tuyển",
                    width: 200,
                    cell: row => (
                        <React.Fragment>
                            {moment.unix(row?.applied_at).format("DD/MM/YYYY HH:mm:ss")}
                        </React.Fragment>
                    )
                },

                {
                    title: "Vị trị ứng tuyển",
                    width: 200,
                    cell: row => (
                        <Link to={`${Constant.BASE_URL_JOB}?${queryString.stringify({action: "detail", id: row?.job_info?.id})}`} target="_blank">
                            <span className="text-link">{row?.job_info?.title}</span>
                        </Link>
                    )
                },
            ]
        };

        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        const {id} = this.state;
        history.push({
            pathname: Constant.BASE_URL_SEEKER,
            search: '?action=detail&id=' + id
        });
    }

    render() {
        const {query, defaultQuery, history} = this.props;
        const {columns, id} = this.state;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilterJobApply}/>
                )}
                title="Danh Sách Việc Làm Đã Ứng Tuyển"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
                buttons={
                    <button type="button" className="el-button el-button-default el-button-small"
                            onClick={() => this.goBack()}>
                        <span>Quay lại</span>
                    </button>
                }
            >
                <Gird idKey={idKey}
                      fetchApi={getResumeAppliedList}
                      query={query}
                      columns={columns}
                      defaultQuery={{...defaultQuery, seeker_id: id, includes:"job_info,resume_info"}}
                      history={history}
                      isRedirectDetail={false}
                      isPushRoute={false}
                />
            </Default>
        )
    }
}

export default connect(null, null)(JobApply);
