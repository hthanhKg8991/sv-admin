import React, {Component} from "react";
import {connect} from "react-redux";
import {Collapse} from 'react-bootstrap';
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import config from 'config';
import classnames from 'classnames';
import { CKEditor } from 'ckeditor4-react';
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
            note: "",
            show_detail: true,
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.onSave = this._onSave.bind(this);
    }

    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        let array = params['week_year'].split("/");
        params['week_year'] = parseInt(array[0]) + 1 + "/" + array[1];
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiPlanDomain, ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT, params, delay);

    }
    _onSave(){
        let params = queryString.parse(window.location.search);
        let array = params['week_year'].split("/");
        let args = {
            week_year: parseInt(array[0]) + 1 + "/" + array[1],
            comment: this.state.note
        };
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiPlanDomain, ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT_SAVE, args);
        this.props.uiAction.showLoading();
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({note: response.data.comment});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT);
        }
        if (newProps.api[ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_PLAN_WEEK_MEMBER_COMMENT_SAVE);
        }
        if (newProps.refresh['PlanWeekNote']){
            let refresh = newProps.refresh['PlanWeekNote'];
            let delay = refresh.delay ? refresh.delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('PlanWeekNote');
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
                        <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                            Nhật xét <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
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

        return (
            <div>
                <div className="sub-title-form crm-section inline-block">
                    <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                        Nhật xét <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="crm-section">
                            <button type="button" className="el-button el-button-success el-button-small" onClick={this.onSave}>
                                <span>Lưu</span>
                            </button>
                        </div>
                        <div className="crm-section">
                            <CKEditor
                                initData={this.state.note}
                                data={this.state.note}
                                config={{
                                    //[ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ]
                                    //chi dung duoc Bold, Italic, Strike
                                    //[ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ]
                                    //chi dung duoc NumberedList, BulletedList
                                    //[ 'Link', 'Unlink', 'Anchor' ]
                                    //dung duoc het
                                    //[ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ]
                                    //chi dung duoc Image, Table, HorizontalRule, SpecialChar
                                    //[ 'Styles', 'Format', 'Font', 'FontSize' ]
                                    //chi dung duoc Styles, Format
                                    //[ 'TextColor', 'BGColor' ]
                                    //khong dung duowc
                                    //[ 'Maximize', 'ShowBlocks' ]
                                    //chi dung duoc Maximize
                                    //[ 'About' ]
                                    //chi dung duoc About
                                    toolbar: [
                                        ['Bold', 'Italic', 'Strike'],
                                        ['NumberedList', 'BulletedList']
                                    ]
                                }}
                                onChange={(evt) => {
                                    this.setState({note: evt.editor.getData()});
                                }}
                            />
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
