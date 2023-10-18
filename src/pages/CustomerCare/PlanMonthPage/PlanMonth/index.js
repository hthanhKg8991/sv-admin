import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import classnames from 'classnames';
import DragScroll from 'components/Common/Ui/DragScroll';
import PlanMonthTeam from './PlanMonthTeam';
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
            total: 0
        };
        this.showDetail = this._showDetail.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.sendReport = this._sendReport.bind(this);
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_TEAM_LIST, params, delay);
    }

    _sendReport(){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_REPORT, params);
        this.props.uiAction.showLoading();
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_TEAM_LIST]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_TEAM_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let total = 0;
                response.data.forEach((item) => {
                    total = total + parseInt(item.result.current.total_revenue);
                });
                this.setState({total: total});
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_TEAM_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_REPORT]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_REPORT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_REPORT);
        }
        if (newProps.refresh['PlanMonth']){
            let refresh = newProps.refresh['PlanMonth'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay, refresh.update);
            this.props.uiAction.deleteRefreshList('PlanMonth');
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
                        <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                            Doanh thu dự kiến tháng {params['month_year']} <span className="textRed">({utils.formatNumber(this.state.total, 0, ".", "đ")})</span>
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
        let {data_list, itemActive} = this.state;
        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Doanh thu dự kiến tháng {params['month_year']} <span className="textRed">({utils.formatNumber(this.state.total, 0, ".", "đ")})</span>
                        <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="top-table">
                            <div className="left">
                                <button type="button" className={classnames("el-button el-button-primary el-button-small",this.state.callingApiSendMail ? "active" : "")} onClick={this.sendReport}>
                                    <span>Gửi báo cáo</span>
                                </button>
                            </div>
                        </div>
                        <div className="body-table el-table crm-section">
                            <DragScroll allowSelect={false}>
                                <table className="table-default">
                                    <tbody>
                                        <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                            <td style={{width:"300px"}}>
                                                <div className="cell">CSKH</div>
                                            </td>
                                            <td style={{width:"120px"}}>
                                                <div className="cell">Tổng</div>
                                            </td>
                                            <td style={{width:"120px"}}>
                                                <div className="cell">Tái ký</div>
                                            </td>
                                            <td style={{width:"120px"}}>
                                                <div className="cell">Ký mới</div>
                                            </td>
                                            <td style={{width:"120px"}}>
                                                <div className="cell-custom-big">Doanh thu tháng trước</div>
                                            </td>
                                            <td style={{width:"120px"}}>
                                                <div className="cell-custom-big">Doanh thu 4 tháng trước</div>
                                            </td>
                                            <td style={{width:"300px"}}>
                                                <div className="cell">Ghi chú</div>
                                            </td>
                                        </tr>
                                        {data_list.map((item, key)=> {
                                            return(
                                                <PlanMonthTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem}/>
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
