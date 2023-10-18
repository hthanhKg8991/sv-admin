import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupMinisitePackageRegistration from "../../Popup/PopupMinisitePackageRegistration";
import PopupRegisCancel from "../../Popup/PopupRegisCancel";
import PopupDeleteRegisCancel from "pages/CustomerCare/SalesOrderRequestPage/Popup/PopupDeleteRegisCancel";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import {publish} from "utils/event";
import {accountRegisMinisiteApprove} from "api/saleOrder";

class MinisitePackageRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data_list:[]
        };
        this.btnAdd = this._btnAdd.bind(this);
        this.refreshList = this._refreshList.bind(this);
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnRegisCancel = this._btnRegisCancel.bind(this);
        this.btnDeleteRegisCancel = this._btnDeleteRegisCancel.bind(this);

        //approve registration
        this.btnApprove = this._btnApproveRegistration.bind(this);

        //approve cancel
        this.btnApproveCancel = this._btnApproveCancel.bind(this);
    }

    _refreshList(delay = 0){
        let args = {
            sales_order_id: this.props.sales_order.id,
            sales_order_items_id: this.props.sales_order_item.id,
            execute: true
        };
        this.setState({loading: true});
        this.props.apiAction.requestApi(apiFn.fnGet, config.apiSalesOrderDomain, ConstantURL.API_URL_GET_REGIS_MINISITE_LIST, args, delay);
    }
    _btnAdd(){
        this.props.uiAction.createPopup(PopupMinisitePackageRegistration, "Đăng Ký Minisite", {
            sales_order: this.props.sales_order,
            sales_order_item: this.props.sales_order_item
        });
    }
    _btnEdit(object){
        this.props.uiAction.createPopup(PopupMinisitePackageRegistration, "Chỉnh Sửa Đăng Ký Minisite", {
            sales_order: this.props.sales_order,
            sales_order_item: this.props.sales_order_item,
            object: object
        });
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa đăng ký minisite ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_MINISITE_DELETE, {
                    id: object.id,
                    sales_order_id: this.props.sales_order.id,
                    sales_order_items_id: this.props.sales_order_item.id
                });
            }
        });
    }
    _btnRegisCancel(object){
        this.props.uiAction.createPopup(PopupRegisCancel, "Đăng Ký Hạ Dịch Vụ", {
            object:{
                registration_id:  object.id,
                sales_order_id: this.props.sales_order.id,
                sales_order_items_id: this.props.sales_order_item.id
            },
            refresh_page: 'MinisitePackageRegistration',
            url_reject: ConstantURL.API_URL_POST_SALES_ORDER_REGIS_CANCEL_MINISITE,
            idKey: Constant.IDKEY_MINISITE_PACKAGE
        });
    }
    _btnDeleteRegisCancel(id){
        this.props.uiAction.createPopup(PopupDeleteRegisCancel, "Hủy Đăng Ký Hạ Dịch Vụ", {
            object:{
                id:  id,
                sales_order_id: this.props.sales_order.id,
                sales_order_items_id: this.props.sales_order_item.id
            },
            refresh_page: 'MinisitePackageRegistration',
            url_reject: ConstantURL.API_URL_POST_REGIS_CANCEL_DELETE,
            idKey: Constant.IDKEY_MINISITE_PACKAGE
        });
    }

    _btnApproveRegistration(id){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt gói Minisite?",
            content: "",
            buttons: ['No','Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
					this.props.uiAction.hideSmartMessageBox();
					this.props.uiAction.showLoading();
					const params = {registration_minisite_id: id};
					const res = await accountRegisMinisiteApprove(params);
					if (res?.code === Constant.CODE_SUCCESS) {
						 this.props.uiAction.putToastSuccess("Thao tác thành công!");
						 this.refreshList();
					} else if (res?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE) {
						 const confirm = window.confirm(res?.msg);
						 if (confirm) {
							  const resConfirm = await accountRegisMinisiteApprove({...params, allowed_update_end_date: true});
							  if (resConfirm?.code === Constant.CODE_SUCCESS) {
									this.props.uiAction.putToastSuccess("Thao tác thành công!");
									this.refreshList();
							  } else {
									this.props.uiAction.putToastError(resConfirm?.msg);
							  }
						 }
					} else if (res?.code !== Constant.CODE_SUCCESS) {
						 this.props.uiAction.putToastError(res?.msg);
					}
				}
        });
    }

    _btnApproveCancel(item){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt hạ Minisite ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_ACCOUNT_REGIS_CANCEL_MINISITE_APPROVE, {
                    drop_registration_id: item.request_drop_id
                });
            }
        });
    }

    componentWillMount(){
        this.refreshList();
    }
    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_GET_REGIS_MINISITE_LIST]){
            let response = newProps.api[ConstantURL.API_URL_GET_REGIS_MINISITE_LIST];
            let id = response.info?.args?.sales_order_items_id;
            if (id === this.props.sales_order_item.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.setState({data_list: response.data});
                    this.props.setTotal(response.data.length, id);
                }
                this.setState({loading: false});
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_GET_REGIS_MINISITE_LIST);
            }
        }
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_MINISITE_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_MINISITE_DELETE];
            let id = response.info?.args?.sales_order_items_id;
            if (id === this.props.sales_order_item.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.props.uiAction.hideSmartMessageBox();
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    this.refreshList();
                }
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_MINISITE_DELETE);
            }
        }
        if (newProps.refresh['MinisitePackageRegistration']){
            let refresh = newProps.refresh['MinisitePackageRegistration'];
            if (refresh.sales_order_items_id === this.props.sales_order_item.id) {
                let delay = refresh.delay ? refresh.delay : 0;
                this.refreshList(delay);
                this.props.uiAction.deleteRefreshList('MinisitePackageRegistration');
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return  utils.compare(nextState, this.state) || utils.compare(this.props.sys, nextProps.sys);
    }
    render () {
        let {data_list, loading} = this.state;
        let sales_order_regis_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_regis_status);
        return (
            <div className="card-body children-table">
                <div>
                    {parseInt(this.props.sales_order.status) === Constant.STATUS_ACTIVED &&
                    (
                        <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                            <button type="button" className="el-button el-button-primary el-button-small" onClick={this.btnAdd}>
                                <span>Đăng ký minisite <i className="glyphicon glyphicon-plus"/></span>
                            </button>
                        </CanRender>
                    )}
                </div>
                {loading ? (
                    <div className="text-center">
                        <LoadingSmall />
                    </div>
                ) : (
                    <div className="body-table el-table table-child">
                        <TableComponent>
                            <TableHeader tableType="TableHeader" width={400}>
                                Thông tin đăng ký
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Thao tác
                            </TableHeader>
                            <TableBody tableType="TableBody">
                                {data_list.map((item,key)=> {
                                    let status = parseInt(item.status);
                                    return(
                                        <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                            <td>
                                                <div className="cell-custom">
                                                    <div>Mã đăng ký: <span className="text-bold">{item.id}</span></div>
                                                    <div>Đăng ký:  <span className="text-bold">{utils.convertNumberToWeekDay(item.total_day_quantity)} ({moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item.end_date).format("DD/MM/YYYY")})</span></div>
                                                    <div>Trạng thái đăng ký: <span className="text-bold textBlue">{sales_order_regis_status[item.status]}</span></div>
                                                    {[Constant.STATUS_DISABLED].includes(status) && (
                                                        <div>Lý do: {item.rejected_note}</div>
                                                    )}
                                                    {item.request_drop_status && (
                                                        <div>Trạng thái hạ dịch vụ: <span className="text-bold textBlue">{sales_order_regis_status[item.request_drop_status]}</span></div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    {[Constant.STATUS_INACTIVED,Constant.STATUS_DISABLED].includes(status) &&
                                                    (
                                                        <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                                                            </div>
                                                            <React.Fragment>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-success" onClick={()=>{this.btnApprove(item.id)}}>
                                                                        Duyệt
                                                                    </span>
                                                                </div>
                                                            </React.Fragment>
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-danger" onClick={()=>{this.btnDelete(item)}}>Xóa đăng ký</span>
                                                            </div>
                                                        </CanRender>
                                                    )}
                                                    {[Constant.STATUS_ACTIVED].includes(status)&& (
                                                        <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                            {!item.request_drop_id && (
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger" onClick={()=>{this.btnRegisCancel(item)}}>Đăng ký hạ dịch vụ</span>
                                                                </div>
                                                            )}
                                                            {item.request_drop_id !== null && (
                                                                <div>
                                                                    <div className="text-underline pointer">
                                                                            <span className="text-bold text-success" onClick={()=>{this.btnApproveCancel(item)}}>
                                                                                Duyệt hạ
                                                                            </span>
                                                                    </div>
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-danger" onClick={()=>{this.btnDeleteRegisCancel(item.request_drop_id)}}>Xóa đăng ký hạ dịch vụ</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </CanRender>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </TableBody>
                        </TableComponent>
                    </div>
                )}
            </div>
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

export default connect(mapStateToProps,mapDispatchToProps)(MinisitePackageRegistration);
