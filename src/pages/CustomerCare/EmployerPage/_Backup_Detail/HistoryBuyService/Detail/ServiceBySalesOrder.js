import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import * as ConstantURL from "utils/ConstantURL";
import * as apiFn from 'api';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";

class ServiceBySalesOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list:[],
        };
        this.refreshList = this._refreshList.bind(this);
    }

    _refreshList(delay = 0){
        let params = [];//queryString.parse(window.location.search);
        params['sales_order_id'] = this.props.id;
        params['employer_id'] = this.props.employer_id;
        this.setState({loading: true},()=>{
            this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_BUY_SERVICE, params, delay);
        });
    }

    componentDidMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_BUY_SERVICE]) {
            let response = newProps.api[ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_BUY_SERVICE];
            let data_list = response.data && response.data.items ? response.data.items : [];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: data_list});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALES_ORDER_HISTORY_BUY_SERVICE);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        if (this.state.loading){
            return(
                <div className="box-inf paddingTop5">
                    <div className="content-box">
                        <div className="row">
                            <div className="col-sm-12 col-xs-12 crm-section">
                                <LoadingSmall />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        let {data_list} = this.state;
        if (!data_list.length){
            return(
                <div className="box-inf paddingTop5">
                    <div className="content-box">
                        <div className="row">
                            <div className="col-sm-12 col-xs-12 crm-section">
                                <div className="cell"><span>Không có dữ liệu</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div className="box-inf paddingTop5">
                <div className="content-box">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12 crm-section">
                            <TableComponent DragScroll={false}>
                            <TableHeader tableType="TableHeader" width={200}>
                                Gói
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={80}>
                                Số lượng
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={100}>
                                Thời gian
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={80}>
                                Đã dùng
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={80}>
                                Chưa dùng
                            </TableHeader>
                            <TableBody tableType="TableBody" >
                                {data_list.map((item,key)=> {
                                    let service_list = utils.convertArrayToObject(this.props.sys.service.items, 'code');
                                    let effect_list = utils.convertArrayToObject(this.props.sys.effect.items, 'code');
                                    let service_code = service_list[item.service_code] ? service_list[item.service_code].name : item.service_code;
                                    let cache_job_title = item.cache_job_title ? " - " + item.cache_job_title : "";
                                    if (item.service_type === Constant.SERVICE_TYPE_EFFECT) {
                                        service_code = effect_list[item.service_code].name;
                                    }
                                    return (
                                        <React.Fragment key={key}>
                                            <tr>
                                                <td>
                                                    <div className="cell" title={service_code + cache_job_title}>{service_code + cache_job_title}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title="">{item.quantity_buy}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title="">{item.week_quantity} Tuần {item.day_quantity > 0 ? item.day_quantity + ' ngày' : null} </div>
                                                </td>
                                                <td>
                                                    <div className="cell" title="">{item.quantity_used}</div>
                                                </td>
                                                <td>
                                                    <div className="cell" title="">{item.quantity_remain}</div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })}
                            </TableBody>
                        </TableComponent>
                        </div>
                    {/*<div className="crm-section">*/}
                    {/*    <Pagination per_page={per_page} page={page} data={pagination_data} changePage={this.changePage} changePerPage={this.changePerPage} changeURL={false}/>*/}
                    {/*</div>*/}
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
        uiAction: bindActionCreators(uiAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ServiceBySalesOrder);
