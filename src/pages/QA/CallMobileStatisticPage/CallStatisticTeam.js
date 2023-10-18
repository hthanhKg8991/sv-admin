import React, {Component} from "react";
import {connect} from "react-redux";
import CallStatisticMember from './CallStatisticMember';
import * as utils from "utils/utils";

class CallStatisticTeam extends Component {
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
            line: item?.line,
            success_call_quantity: utils.formatNumber(item.success_call_quantity, 0, ".", ""),
            success_call_duration: item.success_call_duration,
            not_answered_call_quantity: utils.formatNumber(item.not_answered_call_quantity, 0, ".", ""),
            total_contract: utils.formatNumber(item.total_contract, 0, ".", ""),
            incoming_call_quantity: utils.formatNumber(item.incoming_call_quantity, 0, ".", ""),
            incoming_call_duration: item.incoming_call_duration,
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
                    <td/>
                </tr>
                {itemActive[item.team_id] && (
                    <CallStatisticMember colSpan={8} {...item} is_qa={this.props.is_qa}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(CallStatisticTeam);
