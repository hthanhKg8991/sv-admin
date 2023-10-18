import React, {Component} from "react";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import queryString from 'query-string';
import {bindActionCreators} from "redux";
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import ComponentFilter from "./ComponentFilter";
import config from 'config';
import classnames from 'classnames';
import PopupQuestion from './Popup/PopupQuestion';
import moment from "moment";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
        };
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.btnAdd = this._btnAdd.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
    }
    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;
        params['order_by[id]'] = "DESC";
        this.props.uiAction.showLoading();
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiArticleDomain, ConstantURL.API_URL_GET_QUESTION_LIST, params, delay);
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
    _btnAdd(){
        this.props.uiAction.createPopup(PopupQuestion, "Thêm Câu Hỏi");
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupQuestion, "Chỉnh Sửa Câu Hỏi", {object: object});
    }
    componentWillMount(){

    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_QUESTION_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_QUESTION_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_QUESTION_LIST);
        }
        if (newProps.refresh['ArticleQuestionPage']){
            let delay = newProps.refresh['ArticleQuestionPage'].delay ? newProps.refresh['ArticleQuestionPage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('ArticleQuestionPage');
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
        let {data_list} = this.state;
        let channel_list = utils.convertArrayToObject(this.props.sys.channel.items, 'code');
        return (
                <div className="row-body">
                    <div className="col-search">
                        <CustomFilter name="ArticleQuestionPage"/>
                        <ComponentFilter history={this.props.history}/>
                    </div>
                    <div className="col-result">
                        <div className="box-card">
                            <div className="box-card-title">
                                <span className="title left">Danh Sách Câu Hỏi</span>
                                <div className="right">
                                    <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                        <i className="fa fa-refresh"/>
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="crm-section">
                                    <div className="top-table">
                                        <div className="left btnCreateNTD">
                                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                                <span>Thêm câu hỏi <i className="glyphicon glyphicon-plus"/></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="body-table el-table">
                                        <TableComponent>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Câu hỏi
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Trả lời
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Kênh
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Ngày đăng
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let data = {
                                                    question: item.question,
                                                    answer: item.answer,
                                                    channel_code: channel_list[item.channel_code] ? channel_list[item.channel_code].display_name : item.channel_code,
                                                    created_at: moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss")
                                                };
                                                return (
                                                    <tr key={key} className={classnames("el-table-row pointer", key % 2 !== 0 ? "tr-background" : "")}>
                                                        {Object.keys(data).map((name, key) => {
                                                            return(
                                                                <td key={key}>
                                                                    <div className="cell" title={data[name]}>{data[name]}</div>
                                                                </td>
                                                            )
                                                        })}
                                                        <td>
                                                            <div className="cell">
                                                                <div className="text-underline">
                                                                    <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>
                                                                       Chỉnh sửa
                                                                    </span>
                                                                </div>
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
        api: state.api,
        refresh: state.refresh,
        sys: state.sys,
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
