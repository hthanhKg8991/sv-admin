import React, {Component} from "react";
import {connect} from "react-redux";
import PlanWeekMember from "./PlanWeekMember"
import * as utils from "utils/utils";

class PlanWeekTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            itemActive: {},
            back_month_limit: props.back_month_limit ? props.back_month_limit : []
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
        let {item, itemActive, back_month_limit} = this.state;
        let data = {
            next_total_revenue_target: utils.formatNumber(item.result.next.total_revenue_target, 0, ".", "đ"),
            current_total_revenue_target: utils.formatNumber(item.result.current.total_revenue_target, 0, ".", "đ"),
            total_revenue_real: utils.formatNumber(item.result.current.total_revenue_real, 0, ".", "đ"),
            compare_target_current: utils.formatNumber(item.calc.compare_target_current, 0, ".", "%"),
            compare_target_back_1: utils.formatNumber(item.calc.compare_target_back_1, 0, ".", "%"),
            compare_target_4_week: utils.formatNumber(item.calc.compare_target_4_week, 0, ".", "%"),
            avarage_4_week: utils.formatNumber(item.calc.avarage_4_week, 0, ".", "đ")
        };
        return(
            <React.Fragment>
                <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.props.activeItem(item.id)}}>
                    <td colSpan={3}>
                        <div className="cell text-bold" title={"Nhóm " + item.name}>{"Nhóm " + item.name}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.next_total_revenue_target}>{data.next_total_revenue_target}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.current_total_revenue_target}>{data.current_total_revenue_target}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.total_revenue_real}>{data.total_revenue_real}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.compare_target_current}>{data.compare_target_current}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.compare_target_back_1}>{data.compare_target_back_1}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.compare_target_4_week}>{data.compare_target_4_week}</div>
                    </td>
                    <td>
                        <div className="cell text-right" title={data.avarage_4_week}>{data.avarage_4_week}</div>
                    </td>
                    {back_month_limit.map((value,key) => {
                        let total_revenue_real = utils.formatNumber(item.result['back_'+value].total_revenue_real, 0, ".", "đ");
                        return(
                            <td key={key}>
                                <div className="cell text-right" title={total_revenue_real}>{total_revenue_real}</div>
                            </td>
                        )
                    })}
                </tr>
                {itemActive[item.id] && (
                    <PlanWeekMember {...item} colSpan={10 + back_month_limit.length} back_month_limit={back_month_limit}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanWeekTeam);
