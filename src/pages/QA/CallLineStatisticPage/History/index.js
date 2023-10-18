import React, {Component} from "react";
import {connect} from "react-redux";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import _ from "lodash";
import queryString from "query-string";
import {getHistoryCallLine} from "api/call";
import Gird from "components/Common/Ui/Table/Gird";
import WrapFilter from "components/Common/Ui/Table/WrapFilter";
import ComponentFilter from "pages/QA/CallLineStatisticPage/History/ComponentFilter";
import * as Constant from "utils/Constant";
import SpanCommon from "components/Common/Ui/SpanCommon";
import config from "config";
import moment from "moment";

const idKey = "HistoryCallLine";

class Index extends Component {
    constructor(props) {
        super(props);

        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);

        this.state = {
            id: _.get(queryParsed, 'id'),
            columns: [
                {
                    title: "Thông tin cuộc gọi",
                    width: 400,
                    cell: row => {
                        const tl = moment.duration(parseInt(row?.duration) * 1000);
                        const duration = Math.floor(tl.asHours()) + moment.utc(tl.asMilliseconds()).format(":mm:ss");

                        return <>
                            <div>Mã cuộc gọi: <span className="text-bold">{row?.id}</span></div>
                            <div>Loại:<b><SpanCommon idKey={Constant.COMMON_DATA_KEY_call_type} value={row?.call_type} notStyle/></b></div>
                            <div>Ngày gọi: <b>{row?.called_at ? moment.unix(row?.called_at).format("DD/MM/YYYY HH:mm:ss") : ''}</b></div>
                            <div>Số: <b>{row?.source_number} <i className="fa fa-long-arrow-right"/> {row?.destination_number}</b></div>
                            <div>Thời lượng: <b>{duration}</b></div>
                            <div>Trạng thái: <b><SpanCommon idKey={Constant.COMMON_DATA_KEY_call_status} value={row?.call_status} notStyle/></b></div>
                        </>
                    }
                },
                {
                    title: "Nội dung",
                    width: 400,
                    cell: row => (
                        row?.audio_file_path && (
                            <audio className="mt10" controls>
                                <source src={config.callCenterDomain + row?.audio_file_path} type="audio/wav"/>
                            </audio>
                       )
                    )
                },
            ]
        };

        this.goBack = this._goBack.bind(this);
    }

    _goBack() {
        const {history} = this.props;
        history.push({
            pathname: Constant.BASE_URL_QA_CALL_LINE_STATISTIC
        });
        return true;
    }

    render() {
        const {history, query, defaultQuery} = this.props;
        const {columns} = this.state;

        return (
            <Default
                left={(
                    <WrapFilter idKey={idKey} query={query} ComponentFilter={ComponentFilter}/>
                )}
                title="Lịch Sử Cuộc Gọi"
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
                      fetchApi={getHistoryCallLine}
                      query={query}
                      columns={columns}
                      defaultQuery={defaultQuery}
                      history={history}
                      isRedirectDetail={false}
                />
            </Default>
        )
    }
}

export default connect(null, null)(Index);
