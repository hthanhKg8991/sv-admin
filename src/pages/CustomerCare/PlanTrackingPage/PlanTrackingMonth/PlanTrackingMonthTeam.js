import React, {Component} from "react";
import {connect} from "react-redux";
import queryString from 'query-string';
import PlanTrackingMonthMember from "./PlanTrackingMonthMember"
import * as utils from "utils/utils";

class PlanTrackingMonthTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            itemActive: {}
        };
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        this.setState({item: newProps.item});
        this.setState({itemActive: newProps.itemActive});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let params = queryString.parse(window.location.search);
        let month = parseInt(params['month_year'].split("/")[0]);
        let weeks = utils.getListWeekInMonth(month - 1,false);
        let {item, itemActive} = this.state;
        let data = {
            team_name: "Nhóm " + item.name,
            target: utils.formatNumber(item.result.target, 0, ".", "đ"),
            percent_completed: utils.formatNumber(item.result.percent_completed, 0, ".", "đ"),
            total_progress: utils.formatNumber(item.result.total_progress, 0, ".", "đ"),
            weeks: item.result.weeks ? item.result.weeks : {}
        };
        return(
            <React.Fragment>
                <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.props.activeItem(item.id)}}>
                    <td>
                        <div className="cell" title={data.team_name}>{data.team_name}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.target}>{data.target}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.percent_completed}>{data.percent_completed}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.total_progress}>{data.total_progress}</div>
                    </td>
                    {Object.keys(data.weeks).map((name, key_td) => {
                        return(
                            <td key={key_td}>
                                <div className="cell text-right" title={utils.formatNumber(data.weeks[name], 0, ".", "đ")}>
                                    {utils.formatNumber(data.weeks[name], 0, ".", "đ")}
                                </div>
                            </td>
                        )
                    })}
                </tr>
                {itemActive[item.id] && (
                    <PlanTrackingMonthMember {...item} colSpan={4 + weeks.length}/>
                )}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanTrackingMonthTeam);
