import React, {Component} from "react";
import * as Constant from "utils/Constant";
import {getSystemStatistic} from "api/statistic";
import {publish} from "utils/event";
import Default from "components/Layout/Page/Default";
import {createPopup, putToastSuccess} from "actions/uiAction";
import { bindActionCreators } from 'redux';
import {connect} from "react-redux";
import moment from "moment";
import _ from "lodash";
import SpanText from "components/Common/Ui/CommonText";

const idKey = "SystemStatisticList";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading : true,
        };
    }

    async _asyncData() {
        const m = moment().utcOffset(0);
        m.set({hour:0,minute:0,second:0,millisecond:0});
        const today =  m.unix();

        const {query} = this.props;
        const res = await getSystemStatistic({...query, statistic_date: today});
        if(res) {
            this.setState({items: res});
        }
    }

    componentDidMount() {
        this.setState({loading: true}, () => {
            this._asyncData();
        });
    }

    render() {
        const {items} = this.state;
        const groups =_.chain(items).groupBy("meta_object").map(function(v, i) {
            return {
                type: i,
                data: v,
            }
        }).value();

        return (
            <Default
                title="Danh sách thống kê tồn hệ thống"
                titleActions={(
                    <button type="button" className="bt-refresh el-button" onClick={() => {
                        publish(".refresh", {}, idKey)
                    }}>
                        <i className="fa fa-refresh"/>
                    </button>
                )}
            >
                <div className="body-table el-table">
                    <table className="table-default">
                        <tbody>
                        <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                            <td/>
                            <td>
                                <div className="cell">Tiêu chí</div>
                            </td>
                            <td>
                                <div className="cell">Cập nhật gần nhất</div>
                            </td>
                            <td>
                                <div className="cell">Số tồn hôm nay</div>
                            </td>
                            <td>
                                <div className="cell">Tổng tồn</div>
                            </td>
                            <td>
                                <div className="cell">Ghi chú</div>
                            </td>
                        </tr>
                        {groups.map((_, idx) => (
                            <React.Fragment key={idx.toString()}>
                                {_?.data.map((v, vIdx) => (
                                    <tr key={vIdx.toString()}>
                                        {vIdx === 0 && <td rowSpan={Number(_?.data.length)} width={"25%"}>
                                            <div className="cell">
                                                <SpanText idKey={Constant.COMMON_DATA_KEY_statistic_system_meta_object} value={String(_?.type)}/>
                                            </div>
                                        </td>}
                                        <td width={"25%"}>
                                            <div className="cell">
                                                <SpanText idKey={Constant.COMMON_DATA_KEY_statistic_system_meta_key} value={v?.meta_key}/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="cell text-right">
                                                {moment.unix(v?.statistic_date).format("DD-MM-YYYY")}
                                            </div>
                                        </td>
                                        <td><div className="cell text-right">{v?.meta_value_in_day}</div></td>
                                        <td><div className="cell text-right">{v?.meta_value_total}</div></td>
                                        <td><div className="cell text-right">{v?.url}</div></td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>

            </Default>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({putToastSuccess}, dispatch),
        uiAction: bindActionCreators({createPopup}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(List);
