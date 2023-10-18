import React, {Component} from "react";
import {connect} from "react-redux";
import Default from "components/Layout/Page/Default";
import {publish, subscribe} from "utils/event";
import _ from "lodash";
import queryString from "query-string"
import {getRecruitmentRequestReportHeadhunt} from "api/headhunt";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
const idKey = "RecruitmentRequestDetailReport";

class index extends Component {
    constructor(props) {
        super(props);
        const searchParam = _.get(props, ['location', 'search']);
        const queryParsed = queryString.parse(searchParam);
        const id = _.get(queryParsed, 'id');
        this.state = {
            id: id,
            data: null,
            loading: true,
        }
        this.subscribers = [];
        this.subscribers.push(subscribe('.refresh', (msg) => {
            this.setState({loading: true}, () => {
                this.asyncData();
            });
        }, idKey));
        this.asyncData = this._asyncData.bind(this)
    }

    async _asyncData() {
        const {id} = this.state;
        const data = await getRecruitmentRequestReportHeadhunt({id});
        if (data) {
            this.setState({data})
        }
        this.setState({loading: false})
    }

    componentDidMount() {
        this.asyncData();
    }

    render() {
        const {data, loading} = this.state;
        const columns = data?.list_applicant_status?.reduce((p, c)=>{
            if (c.list_applicant_action_result){
                c.list_applicant_action_result.forEach(v=>{
                    p.push(`${c.code}.${v.code}`);
                });
                return p;
            }else {
                p.push(c.code);
                return p;
            }
        },[]);
        return (
            <Default
                title="Tình trạng tuyển dụng"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                {loading ? (
                    <div className="popupContainer text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    <>
                        {data && (
                            <div style={{width: "100%", overflowX: "scroll", textAlign: "center"}}>
                                <table className="table table-bordered">
                                    <thead>
                                    <tr style={{background: "#deebff", fontWeight: "bold"}}>
                                        <td className="middle" rowSpan={2} style={{minWidth: "200px"}}>Vị trí tuyển dụng</td>
                                        {data.list_applicant_status?.map((status, i) => (
                                            <td  className="middle" colSpan={status.list_applicant_action_result?.length || 1}
                                                rowSpan={status.list_applicant_action_result ? 1 : 2}
                                                key={i}>{status.name}</td>
                                        ))}
                                    </tr>
                                    <tr style={{background: "#deebff", fontWeight: "bold"}}>
                                        {data.list_applicant_status?.map(status => {
                                            return status.list_applicant_action_result?.map((child, j)=>(
                                                <td className="middle" key={j}>{child.name}</td>
                                            ))
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.list_recruitment_request_detail?.map((item, j) => {

                                        const rowData = item.list_applicant_status?.reduce((p, c)=>{
                                            if (c.list_applicant_action_result){
                                                c.list_applicant_action_result.forEach(v=>{
                                                    p.push({code: `${c.code}.${v.code}`, total: v.total});
                                                });
                                                return p;
                                            }else {
                                                p.push(c);
                                                return p;
                                            }
                                        },[]);
                                        return (
                                            <tr key={j}>
                                                <td className={"text-left"}>{item.title}</td>
                                                {columns.map((col,k)=> (
                                                    <td key={k}>{rowData?.find(v => v.code === col)?.total || ""}</td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </Default>
        )
    }
}


export default connect(null, null)(index);

