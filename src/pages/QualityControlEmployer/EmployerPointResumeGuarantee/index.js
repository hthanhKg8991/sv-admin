import React, {Component} from "react";
import CustomFilter from "components/Common/Ui/CustomFilter";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import queryString from 'query-string';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import Detail from "./Detail";
import config from 'config';
import moment from "moment";
import classnames from 'classnames';
import ComponentFilter from "./ComponentFilter";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import SpanCommon from "components/Common/Ui/SpanCommon";
import {COMMON_DATA_KEY_employer_guarantee_resume_type} from "utils/Constant";

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
        this.activeItem = this._activeItem.bind(this);
    }

    _refreshList(delay = 0){
        let params = queryString.parse(window.location.search);
        params['page'] = params['page'] ? params['page'] : this.state.page;
        params['per_page'] = params['per_page'] ? params['per_page'] : this.state.per_page;

        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_POINT_GUARANTEE_LIST, params, delay);
        this.props.uiAction.showLoading();
        this.setState({itemActive: -1});
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
    _activeItem(key){
        let check = this.state.data_list.filter(c => String(c.id) === String(key));

        let itemActive = this.state.itemActive;
        itemActive = String(itemActive) !== String(key) && check.length ? key : -1;
        this.setState({itemActive: itemActive});

        let query = queryString.parse(window.location.search);
        if(itemActive !== -1){
            query.item_active = key;
        }else{
            delete query.item_active;
            delete query.action_active;
        }
        this.props.history.push(`?${queryString.stringify(query)}`);
    }
    componentWillMount(){

    }
    // componentDidMount(){
    //     let query = queryString.parse(window.location.search);
    //     // if (query.employer_id && query.show_popup){
    //     //     this.editEmployer(query.employer_id)
    //     // }
    // }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_LIST]){
            let response = newProps.api[ConstantURL.API_URL_POINT_GUARANTEE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                let data_list = response.data && response.data.items ? response.data.items : [];
                this.setState({data_list: data_list},()=>{
                    let query = queryString.parse(window.location.search);
                    if(query.item_active){
                        this.activeItem(query.item_active);
                    }
                });
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POINT_GUARANTEE_LIST);
        }

        if (newProps.refresh['EmployerPointResumeGuaranteePage']){
            let delay = newProps.refresh['EmployerPointResumeGuaranteePage'].delay ? newProps.refresh['EmployerPointResumeGuaranteePage'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('EmployerPointResumeGuaranteePage');
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
        let {data_list, itemActive, per_page, page, pagination_data} = this.state;

        return (
            <div className="row-body">
                <div className="col-search">
                    <CustomFilter name="EmployerPointResumeGuaranteePage"/>
                    <ComponentFilter history={this.props.history}/>
                </div>
                <div className="col-result">
                    <div className="box-card">
                        <div className="box-card-title">
                            <span className="title left">Danh Sách Bảo hành hồ sơ</span>
                            <div className="right">
                                <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                                    <i className="fa fa-refresh"/>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="crm-section">
                                <div className="top-table">
                                </div>
                                <div className="body-table el-table">
                                    <TableComponent>
                                        <TableHeader tableType="TableHeader"  width={140}>
                                            Nhà tuyển dụng
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Hồ sơ bảo hành
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Loại bảo hành
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader"  width={140}>
                                            Trạng thái
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Lý do bảo hành
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={130}>
                                            Ngày xem hồ sơ
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={160}>
                                            Ngày bảo hành
                                        </TableHeader>
                                        <TableHeader tableType="TableHeader" width={160}>
                                            Ngày duyệt
                                        </TableHeader>

                                        <TableBody tableType="TableBody">
                                            {data_list.map((item, key)=> {
                                                let data = {
                                                    ...item,
                                                    name: item.name,
                                                    created_at: moment.unix(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
                                                    end_at: item.end_at ? moment.unix(item.end_at).format("DD/MM/YYYY HH:mm:ss") : '',
                                                    approved_at: item.approved_at ? moment.unix(item.approved_at).format("DD/MM/YYYY HH:mm:ss") : '',
                                                };

                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr className={classnames("el-table-row pointer", (key % 2 !== 0 ? "tr-background" : ""), (String(itemActive) === String(item.id) ? "active" : ""))} onClick={()=>{this.activeItem(item.id)}}>
                                                            <td>
                                                                <span className="cell textBlue text-underline" title={data.employer_id} onClick={()=> {
                                                                    const params = {
                                                                        action: 'detail',
                                                                        id: data.employer_id
                                                                    };
                                                                    window.open(Constant.BASE_URL_EMPLOYER + '?' + queryString.stringify(params));
                                                                }}>{item.employer_id}</span>
                                                            </td>
                                                            <td>
                                                                <span className="cell textBlue text-underline" title={data.resume_id} onClick={()=> {
                                                                    const params = {
                                                                        action: 'detail',
                                                                        id: data.resume_id
                                                                    };
                                                                    window.open(Constant.BASE_URL_SEEKER_RESUME + '?' + queryString.stringify(params));
                                                                }}>{item.resume_id}</span>
                                                            </td>
                                                            <td>
                                                                <div className="cell">
                                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_guarantee_resume_type} value={item.guarantee_resume_type} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">
                                                                    <SpanCommon idKey={Constant.COMMON_DATA_KEY_employer_point_resume_guarantee_status} value={item.status} />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.reason}>
                                                                    {utils.textCommon(this.props.sys.common.items, Constant.COMMON_DATA_KEY_guarantee_reason, data.reason)}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.end_at}>{data.end_at}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.created_at}>{data.created_at}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell" title={data.approved_at}>{data.approved_at}</div>
                                                            </td>
                                                        </tr>
                                                        {String(itemActive) === String(item.id) && (
                                                            <tr className="el-table-item">
                                                                <td colSpan={7}>
                                                                    <Detail {...item} is_archived={this.props.is_archived} history={this.props.history} refreshListTable={this.refreshList}/>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </TableBody>
                                    </TableComponent>
                                </div>
                            </div>
                            <div className="crm-section">
                                <Pagination per_page={per_page} page={page} data={pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={true}/>
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
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
