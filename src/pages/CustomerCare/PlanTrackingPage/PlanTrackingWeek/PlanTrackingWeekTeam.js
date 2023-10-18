import React, {Component} from "react";
import {connect} from "react-redux";
import PlanTrackingWeek from "./PlanTrackingWeek"
import * as utils from "utils/utils";

class PlanTrackingWeekTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            itemActive: {},
            weekActive: {}
        };
        this.activeItem = this._activeItem.bind(this);
    }
    _activeItem(key){
        let weekActive = Object.assign({},this.state.weekActive);
        weekActive[key] = !weekActive[key];
        this.setState({weekActive: weekActive});
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
        let {item, itemActive, weekActive} = this.state;
        let data = {
            total_target: utils.formatNumber(item.result.total_target, 0, ".", "đ"),
            total_progress: utils.formatNumber(item.result.total_progress, 0, ".", "đ"),
            percent_completed: utils.formatNumber(item.result.percent_completed, 0, ".", "%"),
            Mon: utils.formatNumber(item.result.days.Mon, 0, ".", "đ"),
            Tue: utils.formatNumber(item.result.days.Tue, 0, ".", "đ"),
            Wed: utils.formatNumber(item.result.days.Wed, 0, ".", "đ"),
            Thu: utils.formatNumber(item.result.days.Thu, 0, ".", "đ"),
            Fri: utils.formatNumber(item.result.days.Fri, 0, ".", "đ"),
            Sat: utils.formatNumber(item.result.days.Sat, 0, ".", "đ"),
            Sun: utils.formatNumber(item.result.days.Sun, 0, ".", "đ"),
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
                </tr>
                {itemActive[item.id] && (
                    <PlanTrackingWeek {...item} itemActive={weekActive} activeItem={this.activeItem} colSpan={11}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanTrackingWeekTeam);
