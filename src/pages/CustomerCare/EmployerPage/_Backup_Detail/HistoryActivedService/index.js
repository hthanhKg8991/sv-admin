import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import moment from "moment";
import DropboxMulti from 'components/Common/InputValue/DropboxMulti';
import DateTimeRangePicker from 'components/Common/InputValue/DateTimeRangePicker';
import Dropbox from 'components/Common/InputValue/Dropbox';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import Pagination from "components/Common/Ui/Pagination";
import * as apiAction from "actions/apiAction";
import * as uiAction from "actions/uiAction";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as utils from "utils/utils";

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callingApi: false,
            employer: props.employer,
            data_list:[],
            page:1,
            per_page:Constant.PER_PAGE_LIMIT,
            pagination_data:{},
            params:{
                employer_id: props.id,
                service_type: [],
                // status: String(Constant.STATUS_ACTIVED),
                status: null,
                'created_at[from]': moment().subtract(7, 'days').unix(),
                'created_at[to]': moment().unix()
            }
        };
        this.getEmployer = this._getEmployer.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.changePage = this._changePage.bind(this);
        this.changePerPage = this._changePerPage.bind(this);
    }
    _getEmployer(){
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiEmployerDomain, ConstantURL.API_URL_GET_DETAIL_EMPLOYER, {id: this.props.id});
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
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_ACTIVED_SERVICE, params, delay);
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
    componentDidMount() {
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
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_ACTIVED_SERVICE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_ACTIVED_SERVICE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data.items});
                this.setState({pagination_data: response.data});
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_ACTIVED_SERVICE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {employer, params, data_list, per_page, page, pagination_data} = this.state;
        let service_type = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_service_type);
        let effect_list = utils.convertArrayToObject(this.props.sys.effect.items, 'code');
        let sales_order_status_list = utils.convertArrayValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_regis_status_filter_actived);
        let sales_order_status = utils.convertObjectValueCommonDataFull(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_status);
        let service_list = utils.convertArrayToObject(this.props.sys.service.items, 'code');
        return (
            <div className="row content-box">
                <div className="col-sm-12 col-xs-12 crm-section padding0">
                    <div className="col-sm-3 col-xs-3">
                        <DropboxMulti name="service_type" label="Gói dịch vụ" data={service_type} value={params.service_type}
                                      onChange={(value) => {
                                          params.service_type = value;
                                          this.refreshList();
                                      }}
                        />
                    </div>
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
                    <div className="col-sm-3 col-xs-3">
                        <Dropbox name="status_sales_order" label="Trạng thái" data={sales_order_status_list}
                                 value={params.status} valueDefault={params.status}
                                 onChange={(value) => {
                                     params.status = value;
                                     this.refreshList();
                                 }}
                        />
                    </div>
                </div>
                <div className="col-sm-12 col-xs-12 crm-section">
                    <span className="mr30">Điểm lọc còn lại</span>
                    <span className="text-bold textBlue">Mua {employer.total_buy_point}</span> | <span className="text-bold textRed">Còn lại {employer.total_remaining_buy_point}</span>
                </div>
                <div className="col-sm-12 col-xs-12">
                    <div className="body-table el-table crm-section">
                        <TableComponent >
                            <TableHeader tableType="TableHeader" width={400}>
                                Gói dịch vụ
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Thời gian đăng ký
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Trạng thái
                            </TableHeader>
                            <TableBody tableType="TableBody" >
                                {data_list.map((item,key)=> {
                                    let color = sales_order_status[item.status] ? sales_order_status[item.status].text_color : "";
                                    let status = sales_order_status[item.status] ? sales_order_status[item.status].name : item.status;
                                    let service_code = service_list[item.service_code] ? service_list[item.service_code].name : item.service_code;
                                    let cache_job_title = item.cache_job_title ? " - " + item.cache_job_title : "";

                                    if (item.service_type === Constant.SERVICE_TYPE_EFFECT) {
                                        service_code = effect_list[item.service_code].name;
                                    }

                                    return (
                                        <tr key={key}>
                                            <td>
                                                <div className="cell" title={service_code + cache_job_title}>{service_code + cache_job_title}</div>
                                            </td>
                                            <td>
                                                <div className="cell" title="">
                                                    {moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item.end_date).format("DD/MM/YYYY")}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell" style={{color}}>{status}</div>
                                            </td>
                                        </tr>
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
