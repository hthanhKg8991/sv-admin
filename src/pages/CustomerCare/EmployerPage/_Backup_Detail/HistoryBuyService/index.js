import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from "moment";
import DateTimeRangePicker from 'components/Common/InputValue/DateTimeRangePicker';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import Input2 from "components/Common/InputValue/Input2";
import ServiceBySalesOrder from "./Detail/ServiceBySalesOrder";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callingApi: false,
            employer: {},
            data_list:[],
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
            pagination_data:{},
            params:{
                employer_id: props.id,
                sales_order_id: props.sales_order_id,
                service_type: [],
                status: String(Constant.STATUS_ACTIVED),
                //'created_at[from]': moment().unix(),
                'created_at[from]': null,
                //'created_at[to]': moment().unix()
                'created_at[to]': null
            },
            showDetail: 0,
            hideDetail:false
        };
        this.getEmployer = this._getEmployer.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
        this.showDetail = this._showDetail.bind(this);
    }
    _getEmployer(){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER, {id: this.props.id});
    }

    _showDetail(id, hideDetail) {
        if (hideDetail === true) {
            this.setState({showDetail: 0});
            this.setState({hideDetail: true});
        } else {
            this.setState({showDetail: id});
            this.setState({hideDetail: false});
        }

    }

    _refreshList(delay = 0){
        this.props.uiAction.showLoading();
        let params = Object.assign({}, this.state.params);
        params.page = this.state.page;
        params.per_page = this.state.per_page;
        if (params.service_type.length){
            params.service_type.forEach((value,key)=>{
                params[`service_type[${key}]`] = value;
            });
            delete params.service_type;
        }
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_HISTORY, params, delay);
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

    // _activeItem(key){
    //     let check = this.state.data_list.filter(c => String(c.id) === String(key));
    //
    //     let itemActive = this.state.itemActive;
    //     itemActive = String(itemActive) !== String(key) && check.length ? key : -1;
    //     this.setState({itemActive: itemActive});
    //
    //     let query = queryString.parse(window.location.search);
    //     if(itemActive !== -1){
    //         query.item_active = key;
    //     }else{
    //         delete query.item_active;
    //         delete query.action_active;
    //     }
    //     // this.props.history.push(`?${queryString.stringify(query)}`);
    // }

    componentWillMount() {
        this.getEmployer();
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER]) {
            let response = newProps.api[ConstantURL.API_URL_GET_DETAIL_EMPLOYER];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({employer: response.data});
            }
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_DETAIL_EMPLOYER);
        }
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_HISTORY]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_HISTORY];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_HISTORY);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {params, data_list, per_page, page, pagination_data} = this.state;
        return (
            <div className="row content-box">
                <div className="col-sm-12 col-xs-12 crm-section padding0">
                    <div className="col-sm-3 col-xs-3">
                        <Input2 name="sales_order_id" label="Nhập mã phiếu"
                                value={params.sales_order_id}
                                onChange={(value) => {
                                    params.sales_order_id = value;
                                    this.refreshList();
                                }}
                                onChangeTimeOut={(value) => {
                                    params.sales_order_id = value;
                                    this.refreshList();
                                }} timeOut={500}
                                onEnter={(value) => {
                                    params.sales_order_id = value;
                                    this.refreshList();
                                }}
                        />
                    </div>
                    {/*<div className="col-sm-3 col-xs-3">*/}
                    {/*    <DropboxMulti name="service_type" label="Gói dịch vụ" data={service_type} value={params.service_type}*/}
                    {/*                  onChange={(value) => {*/}
                    {/*                      params.service_type = value;*/}
                    {/*                      this.refreshList();*/}
                    {/*                  }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="col-sm-3 col-xs-3">
                        <DateTimeRangePicker name="created_at" label="Thời gian"
                                             value={[params['created_at[from]'],params['created_at[to]']]}
                                             onChange={(start,end)=>{
                                                 params['created_at[from]'] = start;
                                                 params['created_at[to]'] = end;
                                                 this.refreshList();
                                             }}
                        />
                    </div>
                    {/*<div className="col-sm-3 col-xs-3">*/}
                    {/*    <Dropbox name="status_sales_order" label="Trạng thái" data={sales_order_status_list}*/}
                    {/*             value={params.status} valueDefault={params.status}*/}
                    {/*             onChange={(value) => {*/}
                    {/*                 params.status = value;*/}
                    {/*                 this.refreshList();*/}
                    {/*             }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
                <div className="col-sm-12 col-xs-12">
                    <div className="body-table el-table crm-section">
                        <TableComponent >
                            <TableHeader tableType="TableHeader" width={100}>
                                Mã phiếu
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={100}>
                                Ngày ghi nhận
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={100}>
                                Hạn dùng
                            </TableHeader>
                            <TableBody tableType="TableBody" >
                                {data_list.map((item,key)=> {
                                    let approved_at = item.approved_at > 0 ? moment.unix(item.approved_at).format("DD/MM/YYYY HH:mm:ss") : null;
                                    let expired_at = item.expired_at > 0 ? moment.unix(item.expired_at).format("DD/MM/YYYY HH:mm:ss") : null;
                                    return (
                                        <React.Fragment key={key}>
                                            <tr onClick={()=>{this.showDetail(item.id, this.state.hideDetail)}}>
                                                <td>
                                                    <div className="cell" title={item.sales_order_code}>{item.sales_order_code}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title="">{approved_at}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title="">{expired_at}</div>
                                                </td>
                                            </tr>
                                            {this.state.showDetail === item.id && (
                                                <tr>
                                                    <td colSpan={3}>
                                                        <ServiceBySalesOrder {...item} colSpan={5}/>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </TableBody>
                        </TableComponent>
                    </div>
                    <div className="crm-section">
                        <Pagination per_page={per_page} page={page} data={pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false}/>
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
        service: state.service
    };
}
function mapDispatchToProps(dispatch) {
    return {
        apiAction: bindActionCreators(apiAction, dispatch),
        uiAction: bindActionCreators(uiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(index);
