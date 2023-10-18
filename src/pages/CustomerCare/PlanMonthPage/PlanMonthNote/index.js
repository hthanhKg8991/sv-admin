import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Collapse} from 'react-bootstrap';
import queryString from 'query-string';
import config from 'config';
import { CKEditor } from 'ckeditor4-react';
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';

class PlanMonthNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            show_detail: true,
            map: {
                explain_note: 'Lý giải doanh thu tháng sau',
                plan_note: 'Kế hoạch thực hiện của tháng sau',
            }
        };
        this.showDetail = this._showDetail.bind(this);
        this.onSave = this._onSave.bind(this);
    }

    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_COMMENT, params, delay);
    }

    _onSave(data){
        let params = queryString.parse(window.location.search);
        data.month_year = params['month_year'];
        data.plan_monthly_target_commnent_id = data.plan_monthly_target_commnent_id ? data.plan_monthly_target_commnent_id : 0;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_MONTH_COMMENT_SAVE, data, 0, false);
        this.props.uiAction.showLoading();
    }

    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_COMMENT]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_COMMENT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_COMMENT);
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_MONTH_COMMENT_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_MONTH_COMMENT_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }else{
                let msg = response.msg + "\n";
                Object.keys(response.data).forEach((name) => {
                    let error = response.data[name].replace(":attr_name", this.state.map[name]);
                    msg = msg + error + "\n";
                });
                this.props.uiAction.putToastError(msg);
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_MONTH_COMMENT_SAVE);
        }
        if (newProps.refresh['PlanMonthNote']){
            let refresh = newProps.refresh['PlanMonthNote'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('PlanMonthNote');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {show_detail, data} = this.state;
        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={show_detail ? "active pointer" : "pointer"} onClick={this.showDetail} >
                        Ghi chú <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={show_detail}>
                    <div>
                        <div className="body-table el-table">
                            <div className="crm-section">
                                <div className="mb5 text-bold">
                                    <span>Lý giải doanh thu tháng sau</span>
                                </div>
                                <CKEditor data={data.explain_note}
                                    config={{
                                        toolbar: [
                                            ['Bold', 'Italic', 'Strike'],
                                            ['NumberedList', 'BulletedList']
                                        ]
                                    }}
                                    onChange={(evt) => {
                                        data['explain_note'] = evt.editor.getData();
                                    }}
                                />
                            </div>
                            <div className="crm-section">
                                <div className="mb5 text-bold">
                                    <span>Kế hoạch thực hiện của tháng sau</span>
                                </div>
                                <CKEditor
                                    initData={data.plan_note}
                                    data={data.plan_note}
                                    config={{
                                        toolbar: [
                                            ['Bold', 'Italic', 'Strike'],
                                            ['NumberedList', 'BulletedList']
                                        ]
                                    }}
                                    onChange={(evt) => {
                                        data['plan_note'] = evt.editor.getData();
                                    }}
                                />
                            </div>
                            <div className="crm-section">
                                <button type="button" className="el-button el-button-success el-button-small" onClick={()=>{this.onSave(data)}}>
                                    <span>Lưu</span>
                                </button>
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
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(PlanMonthNote);
