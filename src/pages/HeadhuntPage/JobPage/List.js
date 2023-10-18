import React, {Component} from "react";
import {connect} from "react-redux";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import moment from "moment";
import {Link} from "react-router-dom";
import queryString from "query-string";
import {getListJobHeadhunt} from "api/headhunt";
import SpanService from "components/Common/Ui/SpanService";
import Chart from "pages/HeadhuntPage/JobPage/Chart";
import Info from "pages/HeadhuntPage/JobPage/Info";

class List extends Component {
    constructor(props) {
        super(props);
        const paramsQuery = {...props.query, ...{action: 'detail'}};
        this.state = {
            columns: [
                {
                    title: "Vị trí ứng tuyển",
                    width: 120,
                    onClick: () => {
                    },
                    cell: row => (
                        <>
                            <Link
                                to={`${Constant.BASE_URL_JOB}?${queryString.stringify({...paramsQuery, ...{id: row.id}})}`}>
                                <div>{row.title}</div>
                            </Link>
                            <div>{`ID: ${row.id}`}</div>
                        </>

                    )
                },
                {
                    title: "Gói dịch vụ",
                    width: 140,
                    cell: row => (
                        <>
                            {row?.job_box.map(i => (
                                <div key={i}>
                                    <SpanService value={i.service_code || ""} notStyle/><span>{`
                                    (${moment.unix(i?.start_date).format("DD/MM/YYYY")} - 
                                    ${moment.unix(i?.end_date).format("DD/MM/YYYY")})
                                    `}</span>
                                </div>
                            ))}
                        </>
                    )
                },
                {
                    title: "Số ngày đăng tin",
                    width: 100,
                    cell: row => {
                        const total = row?.job_box.reduce((c, item) => {
                            if (item.service_code && item.service_code.split(".")[2] === "basic") {
                                return c + Math.floor((item.end_date - item.start_date) / (86000));
                            }
                            return c;
                        }, 0);
                        return <span>{total > 0 ? total : "-"}</span>
                    }
                },
                {
                    title: "Lượt ứng tuyển",
                    width: 140,
                    accessor: "total_resume_applied"
                },
                {
                    title: "Lượt view",
                    width: 140,
                    accessor: "total_views"
                },
            ]
        };
        this.onClickAdd = this._onClickAdd.bind(this);
    }

    _onClickAdd() {
        const {history, query} = this.props;
        const source = query?.employer_create ? `&employer_create=${query.employer_create}` : "";
        history.push({
            pathname: Constant.BASE_URL_JOB,
            search: `?action=edit&id=0` + source
        });
    }

    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history, is_archived} = this.props;
        const idKey = "JobList";

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}
                                is_archived={is_archived}/>
                )}
                title={`Danh Sách Tin Tuyển Dụng ${is_archived ? "Đã xóa" : ""}`}
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <>
                    <Chart idKey={idKey} fetchApi={getListJobHeadhunt} query={query}
                    />
                    <Gird idKey={idKey}
                          fetchApi={getListJobHeadhunt}
                          query={query}
                          columns={columns}
                          defaultQuery={defaultQuery}
                          history={history}
                          expandRow={row => <Info id={row.id}/>}
                          isRedirectDetail={false}
                          isReplaceRoute
                    />
                </>
            </Default>
        )
    }
}

export default connect(null, null)(List);
