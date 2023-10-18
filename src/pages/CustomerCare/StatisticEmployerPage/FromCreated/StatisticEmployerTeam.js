import React, {Component} from "react";
import {connect} from "react-redux";
import StatisticEmployerMember from './StatisticEmployerMember';
import * as utils from "utils/utils";

class StatisticEmployerTeam extends Component {
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
        let total_vip = parseInt(item.total_vip);
        let total_reserve = parseInt(item.total_reserve);
        let total_expired = parseInt(item.total_expired_vip);
        let total_available = parseInt(item.total_never_vip);
        let data = {
            total_emp: utils.formatNumber(total_vip + total_expired + total_reserve + total_available, 0, ".", ""),
            total_vip: utils.formatNumber(total_vip, 0, ".", ""),
            total_reserve: utils.formatNumber(total_reserve, 0, ".", ""),
            expired_total: utils.formatNumber(total_expired, 0, ".", ""),
            expired_total_admin_no_verify: utils.formatNumber(item.total_expired_vip_admin_no_verify, 0, ".", ""),
            expired_total_admin_verify: utils.formatNumber(item.total_expired_vip_admin_verify, 0, ".", ""),
            expired_total_web_no_verify: utils.formatNumber(item.total_expired_vip_web_no_verify, 0, ".", ""),
            expired_total_web_verify: utils.formatNumber(item.total_expired_vip_web_verify, 0, ".", ""),
            available_total: utils.formatNumber(total_available, 0, ".", ""),
            available_total_admin_no_verify: utils.formatNumber(item.total_never_vip_admin_no_verify, 0, ".", ""),
            available_total_admin_verify: utils.formatNumber(item.total_never_vip_admin_verify, 0, ".", ""),
            available_total_web_no_verify: utils.formatNumber(item.total_never_vip_web_no_verify, 0, ".", ""),
            available_total_web_verify: utils.formatNumber(item.total_never_vip_web_verify, 0, ".", ""),
        };
        return(
            <React.Fragment>
                <tr className="text-bold tr-body el-table-row pointer" onClick={()=>{this.props.activeItem(item.team_id)}}>
                    <td>
                        <div className="cell" title={item.team_name}>{item.team_name}</div>
                    </td>
                    {Object.keys(data).map((name, key) => {
                        return(
                            <td key={key}>
                                <div className="cell text-right" title={data[name]}>{data[name]}</div>
                            </td>
                        )
                    })}
                </tr>
                {itemActive === item.team_id && (
                    <StatisticEmployerMember colSpan={13} {...item}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(StatisticEmployerTeam);
