import React, {Component} from "react";
import * as Constant from "utils/Constant";
import Gird from "components/Common/Ui/Table/Gird";
import {getJobRefresh} from "api/job";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "./ComponentFilter";
import {createPopup, hideSmartMessageBox, putToastSuccess, SmartMessageBox} from "actions/uiAction";
import {bindActionCreators} from 'redux';
import {connect} from "react-redux";
import queryString from 'query-string';
import moment from 'moment';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: "Tin tuyển dụng",
                    width: 140,
                    cell: row => (
                        <span>{row.id} - {row.title}</span>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.id,
                        };
                        window.open(Constant.BASE_URL_JOB + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Công ty",
                    width: 160,
                    cell: row => (
                        <React.Fragment>
                            <span
                                style={{color: '#3276b1'}}>{row.employer_info_basic.id} - {row.employer_info_basic.name}</span>
                        </React.Fragment>
                    ),
                    onClick: row => {
                        const params = {
                            action: 'detail',
                            id: row.employer_id
                        };
                        window.open(Constant.BASE_URL_EMPLOYER + '?' + queryString.stringify(params));
                    }
                },
                {
                    title: "Thời gian bắt đầu",
                    width: 100,
                    cell: row => {
                        const effectRefresh = row?.effect_info.filter(_ => _.service_code.indexOf(
                            "refresh") > 0);
                        return <React.Fragment>
                            {effectRefresh.map((_, idx) => (
                                <div key={idx.toString()}>{_.created_at ? moment.unix(_.created_at).format("DD/MM/YYYY") : "**/**/****"}</div>
                            ))}
                        </React.Fragment>
                    }
                },
                {
                    title: "Thời gian kết thúc",
                    width: 150,
                    cell: row => {
                        const effectRefresh = row?.effect_info.filter(_ => _.service_code.indexOf(
                            "refresh") > 0);
                        return <React.Fragment>
                            {effectRefresh.map((_, idx) => {
                                const oneDay = 60 * 60 * 24;
                                let date = (_.expired_at - moment()
                                    .unix()) > 0 ? Math.floor((_.expired_at - moment()
                                    .unix()) / oneDay) : false;
                                return <React.Fragment key={idx.toString()}>
                                    <div>
                                        <span>{moment.unix(_.expired_at).format(
                                            "DD/MM/YYYY")}</span>
                                        {date ? (
                                            <span className="textRed ml5">{`(Còn ${date + 1} ngày)`}</span>) : null}
                                    </div>
                                </React.Fragment>
                            })}
                        </React.Fragment>
                    }
                },
                {
                    title: "Gói dịch vụ",
                    width: 130,
                    cell: row => {
                        const effectRefresh = row?.effect_info.filter(_ => _.service_code.indexOf(
                            "refresh") > 0);
                        return <>
                            {effectRefresh.map((_, idx) => (
                                <div key={idx.toString()}>{_.service_code.indexOf("refresh_hour") > 0 ? "Làm mới mỗi giờ" : "Làm mới mỗi ngày"}</div>
                            ))}
                        </>
                    }
                },
                {
                    title: "Thời gian làm mới gần nhất",
                    width: 150,
                    time: true,
                    accessor: "refresh_at"
                },
            ],
            loading: false,
        };
    }


    render() {
        const {columns} = this.state;
        const {query, defaultQuery, history} = this.props;
        const idKey = "HistoryApproveAssignmentRequestList";

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="DS Lịch Sử Làm Mới Tin"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <Gird idKey={idKey}
                      fetchApi={getJobRefresh}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess, SmartMessageBox, hideSmartMessageBox},
            dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
