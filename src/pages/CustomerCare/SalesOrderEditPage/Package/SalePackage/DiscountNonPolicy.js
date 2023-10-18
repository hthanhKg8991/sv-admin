import React, {Component} from "react";
import {connect} from "react-redux";
import classnames from 'classnames';
import {bindActionCreators} from "redux";
import {Collapse} from 'react-bootstrap';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupSale from "../../Popup/PopupSale";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import moment from 'moment';
import CanRender from "components/Common/Ui/CanRender";
import ROLES from "utils/ConstantActionCode";
import {publish} from "utils/event";

class DiscountNonPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            data_list:[],
            show_detail: true,
            sales_order: props.sales_order
        };
        this.btnAdd = this._btnAdd.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.showHide = this._showHide.bind(this);
    }

    _btnAdd(){
        this.props.uiAction.createPopup(PopupSale, "Thêm Giảm Giá Ngoài Chính Sách",{sales_order: this.state.sales_order});
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupSale, "Chỉnh Sửa Giá Ngoài Chính Sách",{sales_order: this.state.sales_order, object: object});
    }
    _refreshList(delay = 0){
        let args = {
            sales_order_id: this.props.sales_order.id
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_SALE_LIST, args, delay);
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa giảm giá ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_SALE_DELETE, {id: object.id, sales_order_id: this.props.sales_order.id});
            }
        });
    }
    _showHide(){
        this.setState({show_detail: !this.state.show_detail});
    }

    componentWillMount(){
        if (this.props.sales_order.id){
            this.refreshList();
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_SALE_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_SALE_LIST];
            if (response.code === Constant.CODE_SUCCESS) {
                this.setState({data_list: response.data});
            }
            this.setState({loading: false});
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_SALE_LIST);
        }
        if (newProps.api[ConstantURL.API_URL_POST_SALE_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_SALE_DELETE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                this.refreshList();
                publish(".refresh", {}, 'SalesOrderEditPage');
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_SALE_DELETE);
        }
        if (newProps.refresh['DiscountNonPolicy']){
            let delay = newProps.refresh['DiscountNonPolicy'].delay ? newProps.refresh['DiscountNonPolicy'].delay : 0;
            this.refreshList(delay);
            this.props.uiAction.deleteRefreshList('DiscountNonPolicy');
        }
        this.setState({sales_order: newProps.sales_order})
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !(JSON.stringify(nextState) === JSON.stringify(this.state));
    }
    render () {
        let {sales_order, data_list, show_detail, loading} = this.state;
        let status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_job_status);
        let sale_amount = 0;
        if (sales_order.non_policy_discount_amount){
            sale_amount += parseInt(sales_order.non_policy_discount_amount);
        }
        if (sale_amount){
            sale_amount = utils.formatNumber(sale_amount,0,".","đ")
        }
        return (
            <React.Fragment>
                <div className="sub-title-form mb15">
                    <div className={classnames("pointer inline-block", show_detail?"active":"not-active")} onClick={this.showHide}>
                        <span>Giảm giá ngoài chính sách ({sale_amount ? sale_amount : <span className="textRed">Không</span>})</span>
                        <i aria-hidden="true" className="v-icon material-icons v-icon-append" style={{lineHeight:"15px"}}>arrow_drop_down</i>
                    </div>
                    <div className="inline-block">
                        <button type="button" className="bt-refresh el-button" onClick={()=>{this.refreshList()}}>
                            <i className="fa fa-refresh"/>
                        </button>
                    </div>
                </div>
                <Collapse in={show_detail}>
                    <div>
                        {loading ? (
                            <div className="text-center">
                                <LoadingSmall />
                            </div>
                        ) : (
                            <div className="card-body">
                                {![
                                    Constant.SALE_ORDER_DELETED,
                                    Constant.SALE_ORDER_ACTIVED,
                                    Constant.SALE_ORDER_INACTIVE,
                                    Constant.SALE_ORDER_EXPIRED,
                                    Constant.SALE_ORDER_EXPIRED_ACTIVE,
                                    Constant.SALE_ORDER_CANCEL,
                                ].includes(parseInt(sales_order.status)) &&
                                (
                                    <div className="left mb10">
                                        {/*{sales_order?.type_campaign === Constant.CAMPAIGN_TYPE_DEFAULT &&*/}
                                            <CanRender
                                                actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                <button type="button"
                                                        className="el-button el-button-primary el-button-small"
                                                        onClick={this.btnAdd}>
                                                    <span>Thêm mới <i className="glyphicon glyphicon-plus"/></span>
                                                </button>
                                            </CanRender>
                                        {/*}*/}
                                    </div>
                                )}
                                <div className="crm-section">
                                    <div className="body-table el-table">
                                        <TableComponent>
                                            <TableHeader tableType="TableHeader" width={200}>
                                                Mô tả
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Tỉ lệ %
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Tiền mặt
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Trạng thái
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Người tạo
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Thời gian tạo
                                            </TableHeader> <TableHeader tableType="TableHeader" width={100}>
                                                Người duyệt
                                            </TableHeader>
                                            <TableHeader tableType="TableHeader" width={100}>
                                                Thao tác
                                            </TableHeader>
                                            <TableBody tableType="TableBody">
                                                {data_list.map((item, key)=> {
                                                    return (
                                                        <tr key={key}>
                                                            <td>
                                                                <div className="cell">{item.description}</div>
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="cell">{utils.formatNumber(item.percent_rate,0,".",'%')}</div>
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="cell">{utils.formatNumber(item.cash_amount,0,".",'đ')}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">{status[item.status]}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">{item.created_by}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">{moment.unix(item.created_at).format("DD/MM/YYYY")}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">{item.approved_by}</div>
                                                            </td>
                                                            <td>
                                                                <div className="cell">
                                                                    {[Constant.STATUS_INACTIVED].includes(parseInt(item.status)) &&
                                                                    (
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                                                                        </div>
                                                                    )}
                                                                    {[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(parseInt(item.status)) && (
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa</span>
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
                            </div>
                        )}
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        sys: state.sys,
        refresh: state.refresh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(DiscountNonPolicy);
