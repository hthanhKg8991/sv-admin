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
        let data = {
            total: utils.formatNumber(item?.total, 0, ".", ""),
            total_vip: utils.formatNumber(item?.total_vip, 0, ".", ""),
            total_vip_tiny: utils.formatNumber(item?.total_vip_tiny, 0, ".", ""),
            total_vip_small: utils.formatNumber(item?.total_vip_small, 0, ".", ""),
            total_vip_medium: utils.formatNumber(item?.total_vip_medium, 0, ".", ""),
            total_vip_large: utils.formatNumber(item?.total_vip_large, 0, ".", ""),
            total_reserve: utils.formatNumber(item?.total_reserve, 0, ".", ""),
            total_reserve_tiny: utils.formatNumber(item?.total_reserve_tiny, 0, ".", ""),
            total_reserve_small: utils.formatNumber(item?.total_reserve_small, 0, ".", ""),
            total_reserve_medium: utils.formatNumber(item?.total_reserve_medium, 0, ".", ""),
            total_reserve_large: utils.formatNumber(item?.total_reserve_large, 0, ".", ""),
            total_expired_vip: utils.formatNumber(item?.total_expired_vip, 0, ".", ""),
            total_expired_vip_tiny: utils.formatNumber(item?.total_expired_vip_tiny, 0, ".", ""),
            total_expired_vip_small: utils.formatNumber(item?.total_expired_vip_small, 0, ".", ""),
            total_expired_vip_medium: utils.formatNumber(item?.total_expired_vip_medium, 0, ".", ""),
            total_expired_vip_large: utils.formatNumber(item?.total_expired_vip_large, 0, ".", ""),
            total_never_vip: utils.formatNumber(item?.total_never_vip, 0, ".", ""),
            total_never_vip_tiny: utils.formatNumber(item?.total_never_vip_tiny, 0, ".", ""),
            total_never_vip_small: utils.formatNumber(item?.total_never_vip_small, 0, ".", ""),
            total_never_vip_medium: utils.formatNumber(item?.total_never_vip_medium, 0, ".", ""),
            total_never_vip_large: utils.formatNumber(item?.total_never_vip_large, 0, ".", ""),
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
