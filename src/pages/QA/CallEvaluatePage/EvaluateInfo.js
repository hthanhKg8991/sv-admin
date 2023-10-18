import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import moment from "moment";
import classnames from 'classnames';
import {Collapse} from 'react-bootstrap';
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as apiFn from 'api';

class EvaluateInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            show_detail: true,
            detail_call: {},

        };
        this.refreshList = this._refreshList.bind(this);
        this.showDetail = this._showDetail.bind(this);
    }

    _showDetail(){
        this.setState({show_detail: !this.state.show_detail});
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_EVALUTION_SCORED, params, delay);
        });
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EVALUTION_SCORED];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({detail_call:response.data});
                this.props.changeInfo(response.data);
            }else{
                this.props.history.push(Constant.BASE_URL);
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EVALUTION_SCORED);
        }
        if (newProps.refresh['EvaluateInfo']){
            let delay = newProps.refresh['EvaluateInfo'].delay ? newProps.refresh['EvaluateInfo'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('EvaluateInfo');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div>
                    <div className="sub-title-form crm-section">
                        <div className={classnames('pointer', this.state.show_detail ? 'active' : '')} onClick={this.showDetail}>
                            Thông tin chấm điểm <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
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
        const {detail_call} = this.state;

        return (
            <div>
                <div className="sub-title-form crm-section display-inline">
                    <div className={this.state.show_detail ? "active pointer" : "pointer"} onClick={this.showDetail}>
                        Thông tin chấm điểm <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                </div>
                <Collapse in={this.state.show_detail}>
                    <div>
                        <div className="crm-section">
                            <div className="row margin0">
                                <div className="col-lg-4 col-sm-12 col-xs-12">
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-3 col-xs-3 padding0">Mã cuộc gọi</div>
                                        <div className="col-sm-9 col-xs-9 text-bold">{detail_call.source_number}</div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-3 col-xs-3 padding0">CSKH</div>
                                        <div className="col-sm-9 col-xs-9 text-bold">{detail_call.staff_name}</div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 col-xs-12">
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-3 col-xs-3 padding0">Ngày gọi</div>
                                        <div className="col-sm-9 col-xs-9 text-bold">{detail_call.called_at ? moment.unix(detail_call.called_at).format("DD/MM/YYYY HH:mm:ss") : ''}</div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-3 col-xs-3 padding0">Đến số</div>
                                        <div className="col-sm-9 col-xs-9 text-bold">{detail_call.destination_number}</div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-sm-3 col-xs-3 padding0">Thời lượng</div>
                                        <div className="col-sm-9 col-xs-9 text-bold">{detail_call.duration}</div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 col-xs-12">
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-lg-4 col-sm-3 col-xs-3 padding0">Điểm đạt được</div>
                                        <div className="col-lg-8 col-sm-9 col-xs-9 text-bold">{detail_call.real_scored + '/' + detail_call.total_scored}</div>
                                    </div>
                                    <div className="col-sm-12 col-xs-12 padding0">
                                        <div className="col-lg-4 col-sm-3 col-xs-3 padding0">Xếp loại</div>
                                        <div className="col-lg-8 col-sm-9 col-xs-9 text-bold">{detail_call.rate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="audio-view crm-section">
                            <audio style={{width:"100%"}} controls>
                                <source src={detail_call.audio_file_path} type="audio/wav"/>
                            </audio>
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

export default connect(mapStateToProps,mapDispatchToProps)(EvaluateInfo);
