import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import moment from "moment";
import DragScroll from 'components/Common/Ui/DragScroll';
import PlanTomorrowTeam from './PlanTomorrowTeam';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
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
            total: 0
        };
        this.showDetail = this._showDetail.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.refreshList = this._refreshList.bind(this);
    }
    _activeItem(key){
        let itemActive = Object.assign({},this.state.itemActive);
        itemActive[key] = !itemActive[key];
        this.setState({itemActive: itemActive});
    }
    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }
    _refreshList(delay = 0, update = false){
        let params = queryString.parse(window.location.search);
        if (!update){
            this.setState({loading: true});
            this.setState({itemActive: {}});
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_TOMORROW_LIST, params, delay);
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_TOMORROW_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_TOMORROW_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_TOMORROW_LIST);
        }
        if (newProps.refresh['PlanTomorrow']){
            let refresh = newProps.refresh['PlanTomorrow'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay, refresh.update);
            this.props.uiAction.deleteRefreshList('PlanTomorrow');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div>
                    <div className="sub-title-form crm-section inline-block">
                        <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                            Mục tiêu bán hàng ngày hôm sau ({moment().add(1, 'days').format("DD/MM/YYYY")}) <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
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
        let {data_list, itemActive} = this.state;
        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Mục tiêu bán hàng ngày hôm sau ({moment().add(1, 'days').format("DD/MM/YYYY")}) <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="body-table el-table crm-section">
                            <div className="body-table el-table">
                                <DragScroll allowSelect={false}>
                                    <table className="table-default">
                                        <tbody>
                                        <tr className="tr-center text-bold">
                                            <td colSpan={3} style={{width:"300px"}}/>
                                            <td colSpan={2} style={{width:"220px"}} className="bgColorBisque">
                                                <div className="cell">Tổng Cộng</div>
                                            </td>
                                            <td colSpan={2} style={{width:"220px"}} className="bgColorBisque">
                                                <div className="cell">Chắc Chắn Có</div>
                                            </td>
                                            <td colSpan={2} style={{width:"220px"}} className="bgColorBisque">
                                                <div className="cell">Tiềm Năng</div>
                                            </td>
                                            <td colSpan={2} style={{width:"220px"}} className="bgColorBisque">
                                                <div className="cell">Hoàn Toàn Nổ Lực</div>
                                            </td>
                                        </tr>
                                        <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                            <td colSpan={3}><div className="cell">CSKH</div></td>
                                            <td><div className="cell">Số lượng</div></td>
                                            <td><div className="cell">Giá trị</div></td>
                                            <td><div className="cell">Số lượng</div></td>
                                            <td><div className="cell">Giá trị</div></td>
                                            <td><div className="cell">Số lượng</div></td>
                                            <td><div className="cell">Giá trị</div></td>
                                            <td><div className="cell">Số lượng</div></td>
                                            <td><div className="cell">Giá trị</div></td>
                                        </tr>
                                        {data_list.map((item, key)=> {
                                            return(
                                                <PlanTomorrowTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem}/>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </DragScroll>
                            </div>
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
