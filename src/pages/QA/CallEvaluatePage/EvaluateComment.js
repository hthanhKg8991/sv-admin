import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Collapse} from 'react-bootstrap';
import queryString from 'query-string';
import moment from "moment";
import InputArea from "components/Common/InputValue/InputArea";
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import config from 'config';
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';

class EvaluateComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callingApi: false,
            show_detail: true,
            data_list: [],
            note: ""
        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
        this.onSaveComment = this._onSaveComment.bind(this);
    }


    _showDetail() {
        this.setState({show_detail: !this.state.show_detail});
    }
    _onSaveComment() {
        if (!this.state.note){
            this.props.uiAction.putToastError("Nội dung phản hồi là bắt buộc");
            return;
        }
        let params = queryString.parse(window.location.search);
        let data = {
            note: this.state.note,
            xlite_call_id: params.xlite_call_id
        };
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK_SAVE, data);
        });
    }

    _refreshList(delay = 0) {
        let params = queryString.parse(window.location.search);
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK, params, delay);
        });
    }

    componentWillMount() {
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK_SAVE]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK_SAVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({note: ""});
                this.refreshList();
            }else{
                this.setState({loading: false});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_FEEDBACK_SAVE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render() {
        const {data_list} = this.state;
        return (
            <div>
                <div className="sub-title-form crm-section display-inline">
                    <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Ý kiến phản hồi <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight: "15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div className="relative">
                        {this.state.loading && (
                            <div className="dialog-wrapper-loading2">
                                <LoadingSmall />
                            </div>
                        )}
                        <div className="body-table el-table crm-section">
                            <div className="row margin0">
                                <div className="col-sm-7 col-xs-12 paddingLeft0">
                                    <div className="padding10" style={{minHeight:"230px", backgroundColor: "aliceblue"}}>
                                    {data_list.map((value,key) => {
                                        return (
                                            <div key={key}>
                                                <span>{value.created_by} ({moment.unix(value.created_at).format("H:m DD/MM/Y")}) : </span>
                                                <span className="text-bold" dangerouslySetInnerHTML={{__html: value.note}}/>
                                            </div>
                                        );
                                    })}
                                    </div>
                                </div>
                                <div className="col-sm-5 col-xs-12 mt10">
                                    <InputArea name="comment" label="Nội dung phản hồi" style={{minHeight: "150px"}} required={true}
                                               value={this.state.note}
                                               onChange={(value) => {
                                                   this.setState({note: value});
                                               }}
                                    />
                                    <div className="mt10">
                                        <button type="button" onClick={this.onSaveComment} className="el-button el-button-success el-button-small">
                                            <span>Gửi phản hồi</span>
                                        </button>
                                    </div>
                                </div>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateComment);
