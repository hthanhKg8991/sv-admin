import React, {Component} from "react";
import {connect} from "react-redux";
import PlanMonthMember from "./PlanMonthMember"
import * as utils from "utils/utils";

class PlanMonthTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            itemActive: props.itemActive
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
        let {item, itemActive} = this.state;
        let data = {
            total_revenue: utils.formatNumber(item.result.current.total_revenue, 0, ".", "đ"),
            total_old_revenue: utils.formatNumber(item.result.current.total_old_revenue, 0, ".", "đ"),
            total_new_revenue: utils.formatNumber(item.result.current.total_new_revenue, 0, ".", "đ"),
            back_1_total_revenue: utils.formatNumber(item.result.back_1.total_revenue, 0, ".", "đ"),
            back_4_total_revenue: utils.formatNumber(item.result.back_4.total_revenue, 0, ".", "đ"),
        };
        return(
            <React.Fragment>
                <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.props.activeItem(item.id)}}>
                    <td>
                        <div className="cell" title={"Nhóm " + item.name}>{"Nhóm " + item.name}</div>
                    </td>
                    {Object.keys(data).map((name, key) => {
                        return(
                            <td key={key}>
                                <div className="cell text-right" title={data[name]}>{data[name]}</div>
                            </td>
                        )
                    })}
                    <td>
                        <div className="cell"/>
                    </td>
                </tr>
                {itemActive[item.id] && (
                    <PlanMonthMember colSpan={7} {...item}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanMonthTeam);
