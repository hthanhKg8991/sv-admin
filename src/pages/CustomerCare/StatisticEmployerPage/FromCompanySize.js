import React, {Component} from "react";
import ComponentFilter from "./FromCompanySize/ComponentFilter";
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
import StatisticEmployerTeam from "pages/CustomerCare/StatisticEmployerPage/FromCompanySize/StatisticEmployerTeam";
import * as Constant from "utils/Constant";
import {updateListTeamByCompany} from "api/statistic";

class FromCompanySize extends Component {
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiStatisticDomain, ConstantURL.API_URL_STATISTIC_GET_EMPLOYER_TEAM_BY_COMPANY_KIND, params, delay);
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
        const res = await updateListTeamByCompany();
        if(res) {
            this.refreshList();
            putToastSuccess("Cập nhật thành công!");
            uiAction.hideLoading();
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_STATISTIC_GET_EMPLOYER_TEAM_BY_COMPANY_KIND]) {
            let response = newProps.api[ConstantURL.API_URL_STATISTIC_GET_EMPLOYER_TEAM_BY_COMPANY_KIND];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_STATISTIC_GET_EMPLOYER_TEAM_BY_COMPANY_KIND);
        }
        if (newProps.refresh['StatisticEmployerCompanySizePage']){
            let delay = newProps.refresh['StatisticEmployerCompanySizePage'].delay ? newProps.refresh['StatisticEmployerCompanySizePage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('StatisticEmployerCompanySizePage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }

    render() {
        let {data_list, itemActive} = this.state;
        const arrCol = [1,2,3,4];
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
                                                <td style={{width:"20%"}} rowSpan={2}>
                                                    <div className="cell">CSKH</div>
                                                </td>
                                                <td style={{width:"5%"}} rowSpan={2} className="bgColorBisque">
                                                    <div className="cell">Tổng NTD</div>
                                                </td>
                                                <td style={{width: "20%"}} colSpan={5}>
                                                    <div className="cell">NTD VIP</div>
                                                </td>
                                                <td style={{width: "20%"}} colSpan={5}>
                                                    <div className="cell">NTD bảo lưu</div>
                                                </td>
                                                <td style={{width: "20%"}} colSpan={5}>
                                                    <div className="cell">NTD từng VIP</div>
                                                </td>
                                                <td style={{width: "20%"}} colSpan={5}>
                                                    <div className="cell">NTD chưa từng VIP</div>
                                                </td>
                                            </tr>
                                            <tr className="tr-header tr-center text-bold bgColorHeadLV2">
                                                {arrCol.map(i => (
                                                    <>
                                                        <td>
                                                            <div className="cell">Tổng</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">Siêu <br/> nhỏ</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">Nhỏ</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">Vừa</div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">Lớn</div>
                                                        </td>
                                                    </>
                                                ))}
                                            </tr>
                                            {data_list?.map((item,key)=> {
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

export default connect(mapStateToProps,mapDispatchToProps)(FromCompanySize);
