import React, {Component} from "react";
import {connect} from "react-redux";
import Default from "components/Layout/Page/Default";
import {publish} from "utils/event";
import _ from "lodash";
import queryString from "query-string"
import {getListCampaignDailyReportHeadhunt} from "api/headhunt";
import moment from "moment";
import {formatNumber} from "utils/utils";
const idKey = "CampaignReport";

class index extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        const id = _.get(queryParsed, 'id');
        this.state = {
            id: id,
            data: null,
        }
        this.asyncData = this._asyncData.bind(this)
    }

    async _asyncData() {
        const {id} = this.state;
        const data = await getListCampaignDailyReportHeadhunt({id});
        if (data) {
            this.setState({data})
        }
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {data} = this.state;
        return (
            <Default
                title="Báo cáo hiệu quả campaign"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                {data && (
                    <div style={{width: "100%", overflowX: "scroll", textAlign: "center"}}>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <td className={"font-bold"} colSpan={2} rowSpan={2}>DAILY UPDATE: Latest 9am next day</td>
                                <td rowSpan={2}>Daily Target</td>
                                {data.date.map((date, i) => (
                                    <td key={i}>{moment.unix(date).format("ddd")}</td>
                                ))}
                            </tr>
                            <tr>
                                {data.date.map((date, i) => (
                                    <td key={i}>{moment.unix(date).format("DD-MMM")}</td>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {data.list_campaign_applicant_status.map((item, j) => (
                                <tr key={j}>
                                    {j === 0 && (
                                        <td rowSpan={data.list_campaign_applicant_status.length} className={"middle text-center font-bold"}>DAILY</td>
                                    )}
                                    <td>{item.applicant_status_name}</td>
                                    <td>{formatNumber(item.target,0,".")}</td>
                                    {data.date.map((date, k) => (
                                        <td key={k}>{item.list_applicant_status_log?.find(l => l.date === date)?.total}</td>
                                    ))}
                                </tr>
                            ))}

                            </tbody>
                        </table>
                    </div>
                )}
            </Default>
        )
    }
}


export default connect(null, null)(index);

