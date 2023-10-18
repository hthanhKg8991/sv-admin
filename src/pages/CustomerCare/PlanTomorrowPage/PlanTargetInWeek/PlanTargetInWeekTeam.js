import React, {Component} from "react";
import {connect} from "react-redux";
import PlanTargetInWeekMember from './PlanTargetInWeekMember'
import * as utils from "utils/utils";

class PlanTargetInWeekTeam extends Component {
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
        let {item, itemActive} = this.state;
        let data = {
            total_quantity: utils.formatNumber(item.target.total_quantity, 0, ".", ""),
            total_value: utils.formatNumber(item.target.total_value, 0, ".", "đ"),
            absolute_quantity: utils.formatNumber(item.target.absolute_quantity, 0, ".", ""),
            absolute_value: utils.formatNumber(item.target.absolute_value, 0, ".", "đ"),
            potential_quantity: utils.formatNumber(item.target.potential_quantity, 0, ".", ""),
            potential_value: utils.formatNumber(item.target.potential_value, 0, ".", "đ"),
            full_attempt_quantity: utils.formatNumber(item.target.full_attempt_quantity, 0, ".", ""),
            full_attempt_value: utils.formatNumber(item.target.full_attempt_value, 0, ".", "đ"),
        };
        return(
            <React.Fragment>
                <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.props.activeItem(item.id)}}>
                    <td colSpan={3}>
                        <div className="cell" title={"Nhóm " + item.name}>{"Nhóm " + item.name}</div>
                    </td>
                    {Object.keys(data).map((name, key) => {
                        return(
                            <td key={key}>
                                <div className="cell text-right" title={data[name]}>{data[name]}</div>
                            </td>
                        )
                    })}
                </tr>
                {itemActive[item.id] && (
                    <PlanTargetInWeekMember colSpan={9} {...item}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanTargetInWeekTeam);
