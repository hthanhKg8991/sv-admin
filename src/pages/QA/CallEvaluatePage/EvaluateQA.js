import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import { CKEditor } from 'ckeditor4-react';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as utils from "utils/utils";
import * as apiFn from 'api';

class EvaluateQA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            show_detail: true,
            comment_data: {}
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.onSaveComment = this._onSaveComment.bind(this);
        this.onReset = this._onReset.bind(this);
    }


    _showDetail() {
        this.setState({show_detail: !this.state.show_detail});
    }
    _onSaveComment(status) {
        let params = queryString.parse(window.location.search);
        let data = this.state.comment_data;
        data.xlite_call_id = params['xlite_call_id'];
        data['status'] = status;
        data['call_qa_evaluation_comment_id'] = data['call_qa_evaluation_comment_id'] ? data['call_qa_evaluation_comment_id'] : 0;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_COMMENT_SAVE, data);
        });
    }
    _onReset() {
        let params = queryString.parse(window.location.search);
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_COMMENT_REFRESH, params);
        });
    }
    _refreshList(delay = 0) {
        let params = queryString.parse(window.location.search);
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_COMMENT, params, delay);
        });
    }
    componentWillMount() {
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_COMMENT]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_COMMENT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({comment_data: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_COMMENT);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_COMMENT_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_COMMENT_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
                this.props.uiAction.refreshList('EvaluateInfo');
            }else{
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_COMMENT_SAVE);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_COMMENT_REFRESH]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_COMMENT_REFRESH];
            if (response.code === Constant.CODE_SUCCESS) {
                this.refreshList();
                this.props.uiAction.refreshList('EvaluateToMark');
                this.props.uiAction.refreshList('EvaluateToMarkGroup');
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_COMMENT_REFRESH);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }
    render() {
        const {comment_data} = this.state;
        let review_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_call_review_status);
        let is_qa = ['call_quality_assurance', 'admin'].includes(this.props.user.division_code);
        let is_staff = String(this.props.user.id) === String(this.props.info.staff_id);
        return (
        <div>
            <div className="sub-title-form crm-section display-inline">
                <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                    Đánh giá của <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight: "15px"}}>arrow_drop_down</i>
                </div>
            </div>
            <Collapse in={this.state.show_detail}>
                <div className="relative">
                    {this.state.loading && (
                        <div className="dialog-wrapper-loading2">
                            <LoadingSmall />
                        </div>
                    )}
                    <div className="crm-section">
                        <div className="body-table el-table">
                            <div className="crm-section">QA đánh giá</div>
                            <div className="crm-section">
                                Trạng thái: <span className="text-bold">{review_status[comment_data.qa_evaluation_status] ? review_status[comment_data.qa_evaluation_status] : 'Chưa chấm'}</span>
                            </div>
                            <div className="crm-section">
                                <CKEditor data={comment_data.qa_note} readOnly={!is_qa}
                                    config={{
                                        toolbar: [
                                            ['Bold', 'Italic', 'Strike'],
                                            ['NumberedList', 'BulletedList']
                                        ]
                                    }}
                                    onChange={(e) => {
                                        comment_data.qa_note = e.editor.getData();
                                        this.setState({comment_data: comment_data})
                                    }}
                                />
                            </div>
                            <div className="crm-section">CSKH tự đánh giá</div>
                            <div className="crm-section">
                                Trạng thái: <span className="text-bold">{review_status[comment_data.customer_care_evaluation_status] ? review_status[comment_data.customer_care_evaluation_status] : 'Chưa chấm'}</span>
                            </div>
                            <div className="crm-section">
                                <CKEditor
                                    initData={comment_data.customer_care_note}
                                    data={comment_data.customer_care_note} readOnly={!is_staff}
                                    config={{
                                        toolbar: [
                                            ['Bold', 'Italic', 'Strike'],
                                            ['NumberedList', 'BulletedList']
                                        ]
                                    }}
                                    onChange={(e) => {
                                        comment_data.customer_care_note = e.editor.getData();
                                        this.setState({comment_data: comment_data})
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <button type="button" onClick={() => this.onSaveComment('scored')} className="el-button el-button-success el-button-small">
                                <span>Lưu</span>
                            </button>
                            {is_qa && (
                                <button type="button" onClick={() => this.onSaveComment('submitted')} className="el-button el-button-success el-button-small">
                                    <span>Lưu và gửi đánh giá</span>
                                </button>
                            )}
                            <button type="button" onClick={this.onReset} className="el-button el-button-primary el-button-small">
                                <span>Khởi tạo lại</span>
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
        sys: state.sys,
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(EvaluateQA);
