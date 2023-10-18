import React, {Component} from "react";
import {connect} from "react-redux";
import CallViolationMember from './CallViolationMember';
import * as utils from "utils/utils";

class CallViolationTeam extends Component {
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
            time_frame_count: utils.formatNumber(item.time_frame_count, 0, ".", ""),
            outbound_duration: utils.formatNumber(item.outbound_duration, 0, ".", ""),
            outbound_quantity: utils.formatNumber(item.outbound_quantity, 0, ".", ""),
            late_user_feedback_to_QA: utils.formatNumber(item.late_user_feedback_to_QA, 0, ".", ""),
        };
        return(
            <React.Fragment>
                <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.props.activeItem(item.team_id)}}>
                    <td>
                        <div className="cell" title={"Nhóm " + item.team_name}>{"Nhóm " + item.team_name}</div>
                    </td>
                    {Object.keys(data).map((name, key) => {
                        return(
                            <td key={key}>
                                <div className="cell text-right" title={data[name]}>{data[name]}</div>
                            </td>
                        )
                    })}
                </tr>
                {itemActive[item.team_id] && (
                    <CallViolationMember colSpan={5} {...item}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(CallViolationTeam);
