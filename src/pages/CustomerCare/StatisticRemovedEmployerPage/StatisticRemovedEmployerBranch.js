import React, {Component} from "react";
import {connect} from "react-redux";
import StatisticRemovedEmployerTeam from './StatisticRemovedEmployerTeam';
import * as utils from "utils/utils";

class StatisticRemovedEmployerBranch extends Component {
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
        this.setState({itemActive: newProps.itemActive});
        this.setState({item: newProps.item});
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {item, itemActive} = this.state;
        let branch_list = utils.convertArrayToObject(this.props.branch.branch_list, 'code');
        let total = parseInt(item.reason_inventory) + parseInt(item.reason_expired) + parseInt(item.reason_filter);
        let data = {
            total: utils.formatNumber(total, 0, ".", ""),
            reason_inventory: utils.formatNumber(item.reason_inventory, 0, ".", ""),
            reason_expired: utils.formatNumber(item.reason_expired, 0, ".", ""),
            reason_filter: utils.formatNumber(item.reason_filter, 0, ".", ""),
            total_vip: utils.formatNumber(item.total_vip, 0, ".", ""),
            total_expired_vip: utils.formatNumber(item.total_expired_vip, 0, ".", ""),
            total_never_vip: utils.formatNumber(item.total_never_vip, 0, ".", ""),
        };
        return(
            <React.Fragment>
                <tr className="tr-body el-table-row text-bold el-table-row-lv2 pointer" onClick={()=>{this.props.activeItem(item.branch_code)}}>
                    <td>
                        <div className="cell" title={item.branch_code}>{branch_list[item.branch_code].name}</div>
                    </td>
                    {Object.keys(data).map((name, key) => {
                        return(
                            <td key={key}>
                                <div className="cell text-right" title={data[name]}>{data[name]}</div>
                            </td>
                        )
                    })}
                </tr>
                {itemActive === item.branch_code && (
                    <StatisticRemovedEmployerTeam colSpan={8} {...item}/>
                )}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        branch: state.branch,

    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(StatisticRemovedEmployerBranch);
