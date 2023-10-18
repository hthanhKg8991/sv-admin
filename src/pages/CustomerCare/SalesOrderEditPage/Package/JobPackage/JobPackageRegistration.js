import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupJobPackageRegistration from "../../Popup/PopupJobPackageRegistration";
import PopupRegisCancel from "../../Popup/PopupRegisCancel";
import PopupChangeArea from "../../Popup/PopupChangeArea";
import PopupDeleteRegisCancel from "pages/CustomerCare/SalesOrderRequestPage/Popup/PopupDeleteRegisCancel";
import config from 'config';
import LoadingSmall from "components/Common/Ui/LoadingSmall";
import * as apiFn from 'api';
import * as ConstantURL from "utils/ConstantURL";
import * as Constant from "utils/Constant";
import * as uiAction from "actions/uiAction";
import * as apiAction from "actions/apiAction";
import * as utils from "utils/utils";
import {accountRegisCancelJobBox, accountRegisJobBoxApprove} from "api/saleOrder";
import {publish} from "utils/event";
import ROLES from "utils/ConstantActionCode";
import CanRender from "components/Common/Ui/CanRender";
import SpanCommon from "components/Common/Ui/SpanCommon";
import PopupChangeStaffRevenue from "pages/CustomerCare/SalesOrderEditPage/Popup/PopupChangeStaffRevenue";

class JobPackageRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnRegisCancel = this._btnRegisCancel.bind(this);
        this.btnDeleteRegisCancel = this._btnDeleteRegisCancel.bind(this);
        this.btnApprove = this._btnApproveRegistration.bind(this);
        this.btnApproveCancel = this._btnApproveCancel.bind(this);
        this.onUpdateStaff = this._onUpdateStaff.bind(this);
        this.btnChangeArea = this._btnChangeArea.bind(this);
    }

    _btnEdit(object){
        this.props.uiAction.createPopup(PopupJobPackageRegistration, "Chỉnh Sửa Đăng Ký Tin Tính Phí", {
            sales_order: this.props.sales_order,
            sales_order_item: this.props.sales_order_item,
            object: object
        });
    }
    _btnApproveRegistration(id){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt gói phí?",
            content: "",
            buttons: ['No','Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const response = await accountRegisJobBoxApprove({registration_job_box_id: id});
                if (response?.code === Constant.CODE_RES_CONFIRM) {
					this.props.uiAction.SmartMessageBox(
						{
							title: response.msg,
							content: "",
							buttons: ["No", "Yes"]
						},
						async (ButtonPressed) => {
							if (ButtonPressed === "Yes") {
								const res_continue = await accountRegisJobBoxApprove({
									registration_job_box_id: id,
									allowed_continue: true
								});
								if (res_continue?.code === Constant.CODE_SUCCESS) {
									this.props.uiAction.putToastSuccess("Thao tác thành công!");
									publish(".refresh", {}, this.props.idKey);
									this.props.uiAction.hideSmartMessageBox();
								} else if (res_continue?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE) {
									this.props.uiAction.SmartMessageBox(
										{
											title: res_continue.msg,
											content: "",
											buttons: ["No", "Yes"]
										},
										async (ButtonPressed) => {
											if (ButtonPressed === "Yes") {
												const res_continue = await accountRegisJobBoxApprove({
													registration_job_box_id: id,
													allowed_update_end_date: true,
													allowed_continue: true
												});
												if (res_continue?.code === Constant.CODE_SUCCESS) {
													this.props.uiAction.putToastSuccess("Thao tác thành công!");
													publish(".refresh", {}, this.props.idKey);
												} else {
													this.props.uiAction.putToastError(res_continue?.msg);
												}
												this.props.uiAction.hideSmartMessageBox();
											}
										}
									);
								} else {
									this.props.uiAction.putToastError(res_continue?.msg);
									this.props.uiAction.hideSmartMessageBox();
								}
							}
						}
					);
				} else if (response?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE) {
					this.props.uiAction.SmartMessageBox(
						{
							title: response.msg,
							content: "",
							buttons: ["No", "Yes"]
						},
						async (ButtonPressed) => {
							if (ButtonPressed === "Yes") {
								const res_continue = await accountRegisJobBoxApprove({
									registration_job_box_id: id,
									allowed_update_end_date: true
								});
								if (res_continue?.code === Constant.CODE_SUCCESS) {
									this.props.uiAction.putToastSuccess("Thao tác thành công!");
									publish(".refresh", {}, this.props.idKey);
								} else {
									this.props.uiAction.putToastError(res_continue?.msg);
								}
								this.props.uiAction.hideSmartMessageBox();
							}
						}
					);
				} else if (response.code === Constant.CODE_SUCCESS) {
					this.props.uiAction.hideSmartMessageBox();
					this.props.uiAction.putToastSuccess("Thao tác thành công!");
					publish(".refresh", {}, this.props.idKey);
				} else {
					this.props.uiAction.hideSmartMessageBox();
					this.props.uiAction.putToastError(response?.msg);
				}
            }
        });
    }
    _btnDelete(object){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa đăng ký gói phí ?",
            content: "",
            buttons: ['No','Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_REGIS_JOB_PACKAGE_ITEMS_DELETE, {
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
            refresh_page: 'JobPackageRegistration',
            url_reject: ConstantURL.API_URL_POST_SALES_ORDER_REGIS_CANCEL_JOB,
            idKey: Constant.IDKEY_JOB_PACKAGE
        });
    }
    _btnDeleteRegisCancel(id){
        this.props.uiAction.createPopup(PopupDeleteRegisCancel, "Hủy Đăng Ký Hạ Dịch Vụ", {
            object:{
                id:  id,
                sales_order_id: this.props.sales_order.id,
                sales_order_items_id: this.props.sales_order_item.id
            },
            refresh_page: 'JobPackageRegistration',
            url_reject: ConstantURL.API_URL_POST_REGIS_CANCEL_DELETE,
            idKey: Constant.IDKEY_JOB_PACKAGE
        });
    }
    _btnApproveCancel(item){
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt hạ gói tin phí ?",
            content: "",
            buttons: ['No','Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.showLoading();
                const params = {drop_registration_id: item.request_drop_id};
                const res = await accountRegisCancelJobBox(params);
                if(res?.code === Constant.CODE_SUCCESS) {
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, this.props.idKey);
                } else if(res?.code === Constant.CODE_RES_CONFIRM) {
                    const confirm = window.confirm(res?.msg);
                    if(confirm) {
                        const resConfirm = await accountRegisCancelJobBox({...params, allowed_continue: true});
                        if(resConfirm?.code === Constant.CODE_SUCCESS) {
                            this.props.uiAction.putToastSuccess("Thao tác thành công!");
                            publish(".refresh", {}, this.props.idKey);
                        } else {
                            this.props.uiAction.putToastError(resConfirm?.msg);
                        }
                    }
                } else if(res?.code !== Constant.CODE_SUCCESS) {
                    this.props.uiAction.putToastError(res?.msg);
                }
                this.props.uiAction.hideLoading();
            }
        });
    }

    _onUpdateStaff(item) {
        this.props.uiAction.createPopup(PopupChangeStaffRevenue, "Thay đổi CSKH nhận revenue", {
            item: item,
            idKey: Constant.IDKEY_JOB_PACKAGE
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_REGIS_JOB_PACKAGE_ITEMS_DELETE]){
            let response = newProps.api[ConstantURL.API_URL_POST_REGIS_JOB_PACKAGE_ITEMS_DELETE];
            let id = response.info?.args?.sales_order_items_id;
            if (id === this.props.sales_order_item.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.props.uiAction.hideSmartMessageBox();
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, this.props.idKey);
                }
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_REGIS_JOB_PACKAGE_ITEMS_DELETE);
            }
        }
        if (newProps.refresh['JobPackageRegistration']){
            let refresh = newProps.refresh['JobPackageRegistration'];
            if (refresh.sales_order_items_id === this.props.sales_order_item.id) {
                this.props.uiAction.deleteRefreshList('JobPackageRegistration');
            }
        }
    }

    _btnChangeArea(object){
        this.props.uiAction.createPopup(PopupChangeArea, "Chọn Miền Hiển Thị", {
            object:{
                id:  object.id,
                sales_order_id: this.props.sales_order.id,
                sales_order_items_id: this.props.sales_order_item.id
            },
            refresh_page: 'JobPackageRegistration',
            idKey: Constant.IDKEY_JOB_PACKAGE
        });
    }

    render () {
        const {data_list, branch, isChangeArea} = this.props;
        const {loading} = this.state;
        const sales_order_regis_status = utils.convertObjectValueCommonData(this.props.sys.common.items,Constant.COMMON_DATA_KEY_sales_order_regis_status);
        const job_occupation_list = utils.convertArrayToObject(this.props.sys.occupations.items, 'id');
        const {channel_code} = branch.currentBranch;
        const isRegisCancel = channel_code !== Constant.CHANNEL_CODE_MW;
        return (
            <div className="card-body children-table">
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
                            <TableHeader tableType="TableHeader" width={400}>
                                Hiệu ứng
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Thao tác
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Lịch sử ghi nhận
                            </TableHeader>
                            <TableBody tableType="TableBody">
                                {Array.isArray(data_list) && data_list.map((item,key)=> {
                                    let status = parseInt(item.status)
                                    let registration_job_field;
                                    /*MW nhiều ngành, các kênh lại 1 ngành*/

                                    if(Array.isArray(item.job_occupation_id)) {
                                        registration_job_field = item.job_occupation_id.map(job => job_occupation_list[job] ? job_occupation_list[job].name : null)
                                    } else {
                                        registration_job_field = job_occupation_list[item.job_occupation_id] ? job_occupation_list[item.job_occupation_id].name : null;
                                    }
                                    return(
                                        <tr key={key} className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                            <td>
                                                <div className="cell-custom">
                                                    <div>Mã đăng ký: <span className="text-bold">{item.id}</span></div>
                                                    <div>Tin tuyển dụng: <span className="text-bold">{item.job_id} - {item.cache_job_title}</span></div>
                                                    <div>Khu vực hiển thị: <b><SpanCommon idKey={Constant.COMMON_DATA_KEY_area} value={item?.displayed_area} notStyle /></b></div>
                                                    <div>Loại gói: <span className="text-bold text-red">
                                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_fee_type} value={Number(item?.fee_type)} notStyle />
                                                         </span>
                                                    </div>
                                                    <div>Đăng ký:  <span className="text-bold">{utils.convertNumberToWeekDay(item.total_day_quantity)} ({moment.unix(item.start_date).format("DD/MM/YYYY")} - {item?.end_date ? moment.unix(item.end_date).format("DD/MM/YYYY") : "" })</span></div>
                                                    <div>Ngày chạy thực tế: (<span className="text-bold">{moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item?.expired_at).format("DD/MM/YYYY")})</span></div>
                                                    {item.booking_code && (
                                                        <div>Mã đặt chổ: <span className="text-bold">{item.booking_code}</span></div>
                                                    )}
                                                    {registration_job_field && (
                                                        <div>Ngành nghề:
                                                            <span className="text-bold ml5">
                                                                {Array.isArray(registration_job_field) ?
                                                                    registration_job_field?.join(", ") :
                                                                    registration_job_field
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
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
                                                    {item.effects_info && item.effects_info.map((item_effect,key_effect) => {
                                                        let effect_list = this.props.sys.effect.items.filter(c => c.code === item_effect.effect_code);
                                                        let start_date = moment.unix(item_effect.start_date);
                                                        let end_date = moment.unix(item_effect.end_date);
                                                        const expiredAt  = item?.effect_expired ? moment.unix(item?.effect_expired[item_effect?.effect_code]).format("DD/MM/YYYY") : null;
                                                        let dangky = end_date.diff(start_date, "days") + 1;
                                                        return(
                                                            <React.Fragment key={key_effect}>
                                                                <div>Gói hiệu ứng: <span className="text-bold">{effect_list.length ? effect_list[0].name : item_effect.effect_code}</span></div>
                                                                <div>Đăng ký: <span className="text-bold">{utils.convertNumberToWeekDay(dangky)} ({start_date.format("DD/MM/YYYY")} - {end_date.format("DD/MM/YYYY")})</span></div>
                                                                <div>Ngày chạy thực tế: (<span className="text-bold">{start_date.format("DD/MM/YYYY")} - {expiredAt})</span></div>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    {[Constant.STATUS_INACTIVED,Constant.STATUS_DISABLED].includes(status) &&
                                                    (
                                                        <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                            {/*<div className="text-underline pointer">
                                                                <span className="text-bold text-primary" onClick={()=>{this.btnEdit(item)}}>Chỉnh sửa</span>
                                                            </div>*/}
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
                                                        <>
                                                            <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                                {!item.request_drop_id && isRegisCancel && (
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
                                                        </>
                                                    )}
                                                    {
                                                        [Constant.STATUS_ACTIVED].includes(status) && isChangeArea && <CanRender actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                            <div className="text-underline pointer">
                                                                    <span className="text-bold text-danger" onClick={()=>{this.btnChangeArea(item)}}>Đổi miền hiển thị</span>
                                                                </div>
                                                        </CanRender>
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    <div>CSKH nhận revenue: <span className="text-bold margin-bottom-5">{item.revenue_by_staff_code}</span></div>
                                                    <div>Người hạ: <span className="text-bold margin-bottom-5">{item.request_drop_approved_by}</span></div>
                                                    <div>Lý do hạ: <span className="text-bold margin-bottom-5">{item.request_drop_rejected}</span></div>
                                                    <CanRender actionCode={ROLES.customer_care_sales_order_change_staff_revenue}>
                                                        <div className="mt-5">
                                                            <span className="text-link text-red pointer" onClick={() => this.onUpdateStaff(item)}>Thay đổi CSKH nhận revenue</span>
                                                        </div>
                                                    </CanRender>
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
        branch: state.branch,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        uiAction: bindActionCreators(uiAction, dispatch),
        apiAction: bindActionCreators(apiAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(JobPackageRegistration);
