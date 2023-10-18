import React, {Component} from "react";
import ComponentFilter from "./FromCreated/ComponentFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import queryString from 'query-string';
import * as uiAction from "actions/uiAction";
import {putToastSuccess} from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as Constant from "utils/Constant";
import StatisticEmployerTeam from "pages/CustomerCare/StatisticEmployerPage/FromCreated/StatisticEmployerTeam";
import {updateListTeamByCreated} from "api/statistic";

class FromCreated extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            itemActive: {}
        };

        this.onRefresh = this._onRefresh.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.activeItem = this._activeItem.bind(this);
        this.btnUpdate = this._btnUpdate.bind(this);
    }
    _activeItem(key){
        let itemActive = this.state.itemActive;
        itemActive = itemActive === key ? -1 : key;
        this.setState({itemActive: itemActive});
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiStatisticDomain, ConstantURL.API_URL_STATISTIC_EMPLOYER_TEAM, params, delay);
        this.props.uiAction.showLoading();
        if (this.state.itemActive !== -1){
            this.props.uiAction.refreshList('StatisticEmployerMember');
        }
    }
    _onRefresh(){
        this.refreshList();
    }
    async _btnUpdate() {
        const {uiAction} = this.props;
        uiAction.showLoading();
        const res = await updateListTeamByCreated();
        if(res) {
            this.refreshList();
            putToastSuccess("Cập nhật thành công!");
            uiAction.hideLoading();
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_STATISTIC_EMPLOYER_TEAM]) {
            let response = newProps.api[ConstantURL.API_URL_STATISTIC_EMPLOYER_TEAM];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_STATISTIC_EMPLOYER_TEAM);
        }
        if (newProps.refresh['StatisticEmployerPage']){
            let delay = newProps.refresh['StatisticEmployerPage'].delay ? newProps.refresh['StatisticEmployerPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('StatisticEmployerPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {data_list, itemActive} = this.state;
        return (
            <div className="row-body mt20">
                <React.Fragment>
                    <div className="col-md-3">
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-md-9 text-right">
                        <button type="button" className="el-button el-button-primary el-button-small mt5 mb5"
                                onClick={this.btnUpdate}>
                            <span><i className="fa fa-refresh mr5"/> Cập nhật</span>
                        </button>
                    </div>
                    <div className="col-md-12">
                       <div className="full-width">
                           <div className="box-card">
                               <div className="card-body">
                                   <div className="body-table el-table">
                                       <table className={classnames("table-default")}>
                                           <tbody>
                                           <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                               <td style={{width:"20%"}} rowSpan={3}>
                                                   <div className="cell">CSKH</div>
                                               </td>
                                               <td style={{width:"5%"}} rowSpan={3} className="bgColorBisque">
                                                   <div className="cell">Tổng <br/> NTD</div>
                                               </td>
                                               <td style={{width:"5%"}} rowSpan={3}>
                                                   <div className="cell">NTD <br/> VIP</div>
                                               </td>
                                               <td style={{width:"5%"}} rowSpan={3}>
                                                   <div className="cell">NTD <br/> bảo lưu</div>
                                               </td>
                                               <td style={{width:"30%"}} colSpan={5}>
                                                   <div className="cell">NTD  từng VIP</div>
                                               </td>
                                               <td style={{width:"30%"}} colSpan={5}>
                                                   <div className="cell">NTD chưa từng VIP</div>
                                               </td>
                                           </tr>
                                           <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                               <td rowSpan={2}>
                                                   <div className="cell">Tổng</div>
                                               </td>
                                               <td colSpan={2}>
                                                   <div className="cell">Tạo từ admin</div>
                                               </td>
                                               <td colSpan={2}>
                                                   <div className="cell">Tạo từ web</div>
                                               </td>
                                               <td rowSpan={2}>
                                                   <div className="cell">Tổng</div>
                                               </td>
                                               <td colSpan={2}>
                                                   <div className="cell">Tạo từ admin</div>
                                               </td>
                                               <td colSpan={2}>
                                                   <div className="cell">Tạo từ web</div>
                                               </td>
                                           </tr>
                                           <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                               <td>
                                                   <div className="cell">Chưa xác <br/> thực</div>
                                               </td>
                                               <td>
                                                   <div className="cell">Đã xác <br/> thực</div>
                                               </td>
                                               <td>
                                                   <div className="cell">Chưa xác <br/> thực</div>
                                               </td>
                                               <td>
                                                   <div className="cell">Đã xác <br/> thực</div>
                                               </td>
                                               <td>
                                                   <div className="cell">Chưa xác <br/> thực</div>
                                               </td>
                                               <td>
                                                   <div className="cell">Đã xác <br/> thực</div>
                                               </td>
                                               <td>
                                                   <div className="cell">Chưa xác <br/> thực</div>
                                               </td>
                                               <td>
                                                   <div className="cell">Đã xác <br/> thực</div>
                                               </td>
                                           </tr>
                                           {data_list.map((item,key)=> {
                                               return(
                                                   <StatisticEmployerTeam key={key} item={item} itemActive={itemActive} activeItem={this.activeItem}/>
                                               )
                                           })}
                                           </tbody>
                                       </table>
                                   </div>
                               </div>
                           </div>
                       </div>
                    </div>
                </React.Fragment>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        refresh: state.refresh,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(FromCreated);
