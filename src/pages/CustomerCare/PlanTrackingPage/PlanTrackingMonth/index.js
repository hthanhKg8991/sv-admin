import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import classnames from 'classnames';
import DragScroll from 'components/Common/Ui/DragScroll';
import PlanTrackingMonthTeam from './PlanTrackingMonthTeam';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list: [],
            show_detail: true,
            itemActive: {},
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
    }

    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }

    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TRACKING_MONTH_TEAM_LIST, params, delay);
        });
        this.setState({itemActive: {}});
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_TRACKING_MONTH_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TRACKING_MONTH_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TRACKING_MONTH_TEAM_LIST);
        }
        if (newProps.refresh['PlanTrackingMonth']){
            let delay = newProps.refresh['PlanTrackingMonth'].delay ? newProps.refresh['PlanTrackingMonth'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('PlanTrackingMonth');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let params = queryString.parse(window.location.search);
        if (this.state.loading){
            return(
                <div>
                    <div className="sub-title-form crm-section inline-block">
                        <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                            Theo dõi tiến độ trong tháng {params['month_year']}
                            <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                        </div>
                    </div>
                    <Collapse in={this.state.show_detail}>
                        <div className="text-center">
                            <LoadingSmall />
                        </div>
                    </Collapse>
                </div>
            )
        }
        let month = parseInt(params['month_year'].split("/")[0]);
        let weeks = utils.getListWeekInMonth(month - 1,false);
        let {data_list, itemActive} = this.state;
        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                        Theo dõi tiến độ trong tháng {params['month_year']}
                        <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="body-table el-table crm-section">
                            <DragScroll allowSelect={false}>
                                <table className={classnames("table-default")}>
                                    <tbody>
                                    <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                        <td style={{width:"300px"}}>
                                            <div className="cell"><span>CSKH</span></div>
                                        </td>
                                        <td style={{width:"120px"}}>
                                            <div className="cell"><span>Mục tiêu</span></div>
                                        </td>
                                        <td style={{width:"120px"}}>
                                            <div className="cell"><span>Đã đạt</span></div>
                                        </td>
                                        <td style={{width:"120px"}}>
                                            <div className="cell"><span>% Hoàn thành</span></div>
                                        </td>
                                        {weeks.map((item,key)=>{
                                            return(
                                                <td style={{width:"120px"}} key={key}>
                                                    <div className="cell-custom-big">
                                                        <div>Tuần {item.value}</div>
                                                        <div>{item.title}</div>
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    {data_list.map((item,key)=> {
                                        return(
                                            <PlanTrackingMonthTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem}/>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </DragScroll>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
