import React, {Component} from "react";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import classnames from 'classnames';
import config from 'config';
import queryString from 'query-string';
import moment from "moment";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import ComponentFilter from "./ComponentFilter";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as Constant from "utils/Constant";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import * as utils from "utils/utils";
import SpanCommon from "components/Common/Ui/SpanCommon";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            page:1,
            per_page: Constant.PER_PAGE_LIMIT,
        };
        this.exportReport = this._exportReport.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.onRequestEvaluate = this._onRequestEvaluate.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_HISTORY_LIST, params, delay);
        this.props.uiAction.showLoading();
        this.setState({cheat: true});
    }
    _changePage(newpage){
        this.setState({page: newpage},()=>{
            this.refreshList();
        });
    }
    _changePerPage(newperpage){
        this.setState({page: 1});
        this.setState({per_page: newperpage},()=>{
            this.refreshList();
        });
    }
    _exportReport(){
        let params = queryString.parse(window.location.search);
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiCallDomain, ConstantURL.API_URL_CALL_EXPORT, params);
        this.props.uiAction.showLoading();
    }
    _onRequestEvaluate(xlite_call_id, call_qa_self_evaluation_request_id){
        call_qa_self_evaluation_request_id = call_qa_self_evaluation_request_id ? call_qa_self_evaluation_request_id : 0;
        this.props.apiAction.requestApi(apiFn.fnPost, config.apiCallDomain, ConstantURL.API_URL_CALL_QA_REQUEST, {xlite_call_id, call_qa_self_evaluation_request_id});
        this.props.uiAction.showLoading();
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_CALL_HISTORY_LIST]){
            let response = newProps.api[ConstantURL.API_URL_CALL_HISTORY_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_HISTORY_LIST);
            this.setState({cheat: false});
        }
        if (newProps.api[ConstantURL.API_URL_CALL_EXPORT]){
            let response = newProps.api[ConstantURL.API_URL_CALL_EXPORT];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                window.open(response.data?.url);
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_EXPORT);
        }
        if (newProps.api[ConstantURL.API_URL_CALL_QA_REQUEST]){
            let response = newProps.api[ConstantURL.API_URL_CALL_QA_REQUEST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_CALL_QA_REQUEST);
        }
        if (newProps.refresh['CallHistoryPage']){
            let delay = newProps.refresh['CallHistoryPage'].delay ? newProps.refresh['CallHistoryPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('CallHistoryPage');
        }
        if (!(JSON.stringify(newProps.branch) === JSON.stringify(this.props.branch))){
            this.refreshList();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  JSON.stringify(nextState) !== JSON.stringify(this.state) ||
                JSON.stringify(this.props.sys) !== JSON.stringify(nextProps.sys);
    }

    render () {
        let call_type = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_call_type);
        let review_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_call_review_status);

        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="CallHistoryPage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Lịch Sử Cuộc Gọi</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="top-table">
                                    <div className="left">
                                        <button type="button" className={classnames("el-button el-button-primary el-button-small",this.state.callingApiExportMail ? "active" : "")} onClick={this.exportReport}>
                                            <span>Xuất excel</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent className="table-custom">
                                        <TableHeader tableType="TableHeader" width={230}>
                                            Thông tin cuộc gọi
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={230}>
                                            Thông tin chấm điểm
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={330}>
                                            Nội dung
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={200}>
                                            Thao tác
                                        </TableHeader>
                                        <TableBody tableType="TableBody">
                                            {this.state.data_list.map((item, key)=> {
                                                // let tl = moment.duration(parseInt(item.duration) * 1000);
                                                // let thoi_luong = Math.floor(tl.asHours()) + moment.utc(tl.asMilliseconds()).format(":mm:ss");
                                                let role = ['call_quality_assurance', 'admin'].includes(this.props.user.division_code) ? 'qa' : 'cskh';

                                                return (
                                                    <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                                        <td>
                                                            <div className="cell">
                                                                <div>Mã cuộc gọi: <span className="text-bold">{item.id}</span></div>
                                                                <div>Loại: <span className="text-bold">{call_type[item.call_type]}</span></div>
                                                                <div>Ngày gọi: <span className="text-bold">{item.called_at ? moment.unix(item.called_at).format("DD/MM/YYYY HH:mm:ss") : ''}</span></div>
                                                                <div>Số: <span className="text-bold">{item.source_number} <i className="fa fa-long-arrow-right"/> {item.destination_number}</span></div>
                                                                <div>Thời lượng: <span className="text-bold">{item?.duration}</span></div>
                                                                <div>Trạng thái: <b><SpanCommon idKey={Constant.COMMON_DATA_KEY_call_status} value={item?.call_status} notStyle/></b></div>
                                                                <div>CSKH: <span className="text-bold">{item.staff_name}</span></div>
                                                                <div>Nhãn cuộc gọi: {item?.labels?.map((label)=><><SpanCommon idKey={Constant.COMMON_DATA_KEY_call_center_label} value={label}/>&nbsp;</>)}</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div>Trạng thái chấm điểm: <span className={classnames("text-bold", item.qa_evaluation_status === 'submitted' ? 'text-primary' : '')}>{(review_status[item.qa_evaluation_status]) ? review_status[item.qa_evaluation_status] : 'Chưa chấm'}</span></div>
                                                                <div>Số điểm: <span className="text-bold">{utils.formatNumber(item.total_qa_score, 0, ".", "điểm")}</span></div>
                                                                <div>Xếp loại: <span className="text-bold">{item.rate}</span></div>
                                                                <div>QA: <span className="text-bold">{item.evaluated_by}</span></div>
                                                                <div>Ngày chấm: <span className="text-bold">{item.qa_evaluation_created_at ? moment.unix(item.qa_evaluation_created_at).format("DD/MM/YYYY") : ""}</span></div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div>CSKH phản hồi: <span className="text-bold">{(item.leader_feedback_status === null) ? 'Chưa phản hồi' : 'Đã phản hồi'} </span></div>
                                                                {/*<div>Trưởng nhóm phản hồi: <span className="text-bold">{item.member_feedback_status === null ? 'Chưa phản hồi' : 'Đã phản hồi'} </span></div>*/}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                {item?.audio_file_path_url && !this.state.cheat && (
                                                                    <audio className="mt10" controls>
                                                                        <source
                                                                            src={item.audio_file_path_url}
                                                                            type="audio/wav"/>
                                                                    </audio>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cell">
                                                                <div className="paddingTop5 paddingBottom5">
                                                                    <a href={Constant.BASE_URL_CALL_EVALUATE + "?xlite_call_id=" + item.xlite_call_id} target="_blank" rel="noopener noreferrer">
                                                                        <button type="button" className={classnames('el-button el-button-small', !item.qa_evaluation_status ? 'el-button-success' : 'el-button-default')}>
                                                                            <span>{!item.qa_evaluation_status ? 'Đánh giá cuộc gọi' : 'Xem đánh giá cuộc gọi'}</span>
                                                                        </button>
                                                                    </a>
                                                                </div>
                                                                {role === 'qa' && (
                                                                    <div className="paddingTop5 paddingBottom5">
                                                                        <button type="button" className={classnames('el-button el-button-small', !item.call_qa_self_evaluation_request_id ? 'el-button-primary' : 'el-button-bricky',)}
                                                                                onClick={() => this.onRequestEvaluate(item.xlite_call_id, item.call_qa_self_evaluation_request_id)}>
                                                                            <span>{!item.call_qa_self_evaluation_request_id ? 'Yêu cầu CSKH tự đánh giá' : 'Hủy yêu cầu CSKH tự đánh giá'}</span>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </TableBody>
                                    </TableComponent>
                                </div>
                            </div>
                            <div className="crm-section">
                                <Pagination per_page={this.state.per_page} page={this.state.page} data={this.state.pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={true}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sys: state.sys,
        api: state.api,
        refresh: state.refresh,
        user: state.user,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(index);
