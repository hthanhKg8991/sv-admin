import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Collapse} from 'react-bootstrap';
import queryString from 'query-string';
import Input2 from 'components/Common/InputValue/Input2';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import classnames from 'classnames';
import config from 'config';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as utils from "utils/utils";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {},
            show_detail: true,
            month_rank_error:{}
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.onSave = this._onSave.bind(this);
    }

    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(delay = 0){
        this.setState({month_rank_error: {}});
        let params = queryString.parse(window.location.search);
        this.setState({team_id: params.team_id});
        if(params.team_id) {
            this.setState({loading: true},()=>{
                this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_RANK, params, delay);
            });
        }
    }

    _onSave(result){
        let rankTypeList = Constant.rankTypeList();
        let {data, month_rank_error} = this.state;
        month_rank_error = Object.assign({},month_rank_error);
        result.forEach((item)=>{
            let total = data.total[rankTypeList[item.rank_type].key_count];
            if (parseInt(item.rank) > parseInt(total) || parseInt(item.rank) <= 0){
                month_rank_error[item.rank_type] = 'Giá trị nhập vào không hợp lệ.';
            }else{
                delete month_rank_error[item.rank_type];
            }
        });
        this.setState({month_rank_error: month_rank_error});
        if (Object.entries(month_rank_error).length > 0){
            this.props.uiAction.putToastError("Thông tin nhập vào không hợp lệ!!!");
            return;
        }
        let params = queryString.parse(window.location.search);
        let plan = {
            month_year: params['month_year'],
            result: result
        };

        this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_RANK_SAVE, plan);
        this.props.uiAction.showLoading();
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_RANK]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_RANK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_RANK);
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_RANK_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_RANK_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }else{
                this.setState({month_rank_error: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_RANK_SAVE);
        }
        if (newProps.refresh['PlanMonthRank']){
            let refresh = newProps.refresh['PlanMonthRank'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('PlanMonthRank');
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
                            Thứ hạng dự kiến <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
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
        let rankTypeList = Constant.rankTypeList();
        let {data, month_rank_error} = this.state;
        let data_list = data.result ? data.result : [];
        let params = queryString.parse(window.location.search);
        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Thứ hạng dự kiến <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        {params.team_id ? (
                            <div className="body-table el-table crm-section">
                                {data_list.map((item,key)=>{
                                    let total = data.total[rankTypeList[item.rank_type].key_count];
                                    return (
                                        <div key={key} className={classnames(item.rank_type,"month_rank mb10")}>
                                            <div className="inline-block rank_title">
                                                <span>{rankTypeList[item.rank_type].title}: </span>
                                            </div>
                                            <div className="inline-block width80 rank_input">
                                                <Input2 type="text" numberOnly value={item.rank ? item.rank : "0"}
                                                        onChange={(value) => {
                                                            data_list[key].rank = value;
                                                        }}
                                                />
                                            </div>
                                            <div className="inline-block rank_total">
                                                <span>/{utils.formatNumber(total, 0, ".", "")}</span>
                                            </div>
                                            <div className="textRed">{month_rank_error[item.rank_type]}</div>
                                        </div>
                                    )})
                                }
                                {data_list.length > 0 && (
                                    <div className="crm-section mt20">
                                        <button type="button" className="el-button el-button-success el-button-small" onClick={()=>{this.onSave(data_list)}}>
                                            <span>Lưu</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="crm-section">
                                Vui lòng chọn nhóm để đánh giá thứ hạng
                            </div>
                        )}

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
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
