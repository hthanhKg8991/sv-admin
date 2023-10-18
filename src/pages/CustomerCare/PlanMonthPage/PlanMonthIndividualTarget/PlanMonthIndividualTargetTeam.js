import React, {Component} from "react";
import {connect} from "react-redux";
import PlanMonthIndividualTargetMember from "./PlanMonthIndividualTargetMember"

class PlanMonthIndividualTargetTeam extends Component {
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
        return(
            <React.Fragment>
                <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.props.activeItem(item.id)}}>
                    <td colSpan={4}>
                        <div className="cell">
                            <span title={"Nhóm " + item.name}>{"Nhóm " + item.name}</span>
                        </div>
                    </td>
                </tr>
                {itemActive[item.id] && (
                    <PlanMonthIndividualTargetMember colSpan={4} {...item}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanMonthIndividualTargetTeam);
