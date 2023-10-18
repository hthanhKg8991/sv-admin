import React, {Component} from "react";
import {connect} from "react-redux";
import PlanMonthWorkMember from './PlanMonthWorkMember'
import * as utils from "utils/utils";

class PlanMonthWorkTeam extends Component {
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
        let total = parseInt(item.result.total_call_quantity) + parseInt(item.result.total_customer_quantity) + parseInt(item.result.total_email_quantity);
        let data = {
            total: utils.formatNumber(total, 0, ".", ""),
            old_customer_quantity: utils.formatNumber(item.result.old_customer_quantity, 0, ".", ""),
            new_customer_quantity: utils.formatNumber(item.result.new_customer_quantity, 0, ".", ""),
            total_customer_quantity: utils.formatNumber(item.result.total_customer_quantity, 0, ".", ""),
            old_call_quantity: utils.formatNumber(item.result.old_call_quantity, 0, ".", ""),
            new_call_quantity: utils.formatNumber(item.result.new_call_quantity, 0, ".", ""),
            total_call_quantity: utils.formatNumber(item.result.total_call_quantity, 0, ".", ""),
            old_email_quantity: utils.formatNumber(item.result.old_email_quantity, 0, ".", ""),
            new_email_quantity: utils.formatNumber(item.result.new_email_quantity, 0, ".", ""),
            total_email_quantity: utils.formatNumber(item.result.total_email_quantity, 0, ".", ""),
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
                    <PlanMonthWorkMember colSpan={13} {...item}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(PlanMonthWorkTeam);
