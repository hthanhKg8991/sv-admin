import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import classnames from 'classnames';
import TableComponent from "components/Common/Ui/Table";
import TableHeader from "components/Common/Ui/Table/TableHeader";
import TableBody from "components/Common/Ui/Table/TableBody";
import PopupFreemiumRegistration from "../../Popup/PopupFreemiumRegistration";
import PopupRegisCancel from "../../Popup/PopupRegisCancel";
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
import SpanCommon from "components/Common/Ui/SpanCommon";
import {publish} from "utils/event";
import {accountRegisFreemiumApprove} from "api/saleOrder";
import PopupDeleteRegisCancel from "pages/CustomerCare/SalesOrderRequestPage/Popup/PopupDeleteRegisCancel";

class FreemiumPackageRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data_list: []
        };
        this.btnEdit = this._btnEdit.bind(this);
        this.btnDelete = this._btnDelete.bind(this);
        this.btnRegisCancel = this._btnRegisCancel.bind(this);
        this.btnDeleteRegisCancel = this._btnDeleteRegisCancel.bind(this);
        this.btnApprove = this._btnApproveRegistration.bind(this);
        this.btnApproveCancel = this._btnApproveCancel.bind(this);
    }

    _btnEdit(object) {
        this.props.uiAction.createPopup(PopupFreemiumRegistration, "Chỉnh Sửa Đăng Ký Tin Freemium", {
            sales_order: this.props.sales_order,
            sales_order_item: this.props.sales_order_item,
            object: object
        });
    }

    _btnDelete(object) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn xóa đăng ký gói Freemium ?",
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_DROP_FREEMIUM_REGIS_APPROVE, {
                    id: object.id,
                    sales_order_id: this.props.sales_order.id,
                    sales_order_items_id: this.props.sales_order_item.id
                });
            }
        });
    }

    _btnRegisCancel(object) {
        this.props.uiAction.createPopup(PopupRegisCancel, "Đăng Ký Hạ Dịch Vụ", {
            object: {
                registration_id: object.id,
                sales_order_id: this.props.sales_order.id,
                sales_order_items_id: this.props.sales_order_item.id,
                service_type: "jobbox_freemium"
            },
            refresh_page: 'FreemiumPackageRegistration',
            url_reject: ConstantURL.API_URL_POST_DROP_FREEMIUM_CREATE,
            idKey: Constant.IDKEY_FREEMIUM_PACKAGE
        });
    }

    _btnDeleteRegisCancel(id) {
        this.props.uiAction.createPopup(PopupDeleteRegisCancel, "Hủy Đăng Ký Hạ Dịch Vụ", {
            object: {
                id: id,
                sales_order_id: this.props.sales_order.id,
                sales_order_items_id: this.props.sales_order_item.id
            },
            refresh_page: 'FreemiumPackageRegistration',
            url_reject: ConstantURL.API_URL_POST_REGIS_CANCEL_DELETE,
            idKey: Constant.IDKEY_FREEMIUM_PACKAGE
        });
    }

    _btnApproveRegistration(id) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt gói Freemium?",
            content: "",
            buttons: ['No', 'Yes']
        }, async (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                const response = await accountRegisFreemiumApprove({registration_job_box_id: id});
                if (response?.code === Constant.CODE_RES_CONFIRM) {
                    this.props.uiAction.SmartMessageBox({
                        title: response.msg,
                        content: "",
                        buttons: ['No', 'Yes']
                    }, async (ButtonPressed) => {
                        if (ButtonPressed === "Yes") {
                            const res_continue = await accountRegisFreemiumApprove({registration_job_box_id: id, allowed_continue: true});
                            if (res_continue?.code === Constant.CODE_SUCCESS) {
                                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                                publish(".refresh", {}, this.props.idKey);
                            } else if(res_continue?.code === Constant.CODE_RES_ALERT){
                                this.props.uiAction.SmartMessageBox({
                                    title: "Thông báo nhắc nhở",
                                    content: res_continue.msg,
                                    buttons: ['No', 'Yes']
                                }, async (ButtonPressed) => {
                                    if (ButtonPressed === "Yes") {
                                        const res_cont = await accountRegisFreemiumApprove({registration_job_box_id: id, run_continue: true, allowed_continue: true});
                                        if (res_cont?.code === Constant.CODE_SUCCESS) {
                                            this.props.uiAction.putToastSuccess("Thao tác thành công!");
                                            publish(".refresh", {}, this.props.idKey);
                                        }else if (res_cont?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE) {
														this.props.uiAction.SmartMessageBox(
															{
																title: "Thông báo nhắc nhở",
																content: res_cont.msg,
																buttons: ["No", "Yes"]
															},
															async (ButtonPressed) => {
																if (ButtonPressed === "Yes") {
																	const res_continue = await accountRegisFreemiumApprove({
																		registration_job_box_id: id,
																		allowed_update_end_date: true,
																		run_continue: true, 
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
                                            uiAction.SmartMessageBox({
                                                title: "Thông báo nhắc nhở",
                                                content: res_cont.msg,
                                                buttons: ['Xác nhận']
                                            }, () => {
                                                uiAction.hideSmartMessageBox();
                                            })
                                        }
                                        this.props.uiAction.hideSmartMessageBox();
                                    }
                                });
                            } else if(res_continue?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE) {
										this.props.uiAction.SmartMessageBox(
											{
												title: "Thông báo nhắc nhở",
												content: res_continue.msg,
												buttons: ["No", "Yes"]
											},
											async (ButtonPressed) => {
												if (ButtonPressed === "Yes") {
													const res_continue = await accountRegisFreemiumApprove({
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
									 } else{
                                this.props.uiAction.putToastError(res_continue?.msg);
                                this.props.uiAction.hideSmartMessageBox();
                            }
                        }
                    });
                } else if (response?.code === Constant.CODE_RES_ALERT){
                    this.props.uiAction.SmartMessageBox({
                        title: "Thông báo nhắc nhở",
                        content: response.msg,
                        buttons: ['No', 'Yes']
                    }, async (ButtonPressed) => {
                        if (ButtonPressed === "Yes") {
                            const res_continue = await accountRegisFreemiumApprove({registration_job_box_id: id, run_continue: true});
                            if (res_continue?.code === Constant.CODE_SUCCESS) {
                                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                                publish(".refresh", {}, this.props.idKey);
                            }else if (res_continue?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE) {
										this.props.uiAction.SmartMessageBox(
											{
												title: "Thông báo nhắc nhở",
												content: res_continue.msg,
												buttons: ["No", "Yes"]
											},
											async (ButtonPressed) => {
												if (ButtonPressed === "Yes") {
													const res_continue = await accountRegisFreemiumApprove({
														registration_job_box_id: id,
														run_continue: true,
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
									} else {
                                this.props.uiAction.putToastError(res_continue?.msg);
                            }
                            this.props.uiAction.hideSmartMessageBox();
                        }
                    });
                } else if (response?.code === Constant.CODE_RES_ALERT){
                    this.props.uiAction.SmartMessageBox({
                        title: "Thông báo nhắc nhở",
                        content: response.msg,
                        buttons: ['No', 'Yes']
                    }, async (ButtonPressed) => {
                        if (ButtonPressed === "Yes") {
                            const res_continue = await accountRegisFreemiumApprove({registration_job_box_id: id, run_continue: true});
                            if (res_continue?.code === Constant.CODE_SUCCESS) {
                                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                                publish(".refresh", {}, this.props.idKey);
                            }else if (res_continue?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE) {
										this.props.uiAction.SmartMessageBox(
											{
												title: "Thông báo nhắc nhở",
												content: res_continue.msg,
												buttons: ["No", "Yes"]
											},
											async (ButtonPressed) => {
												if (ButtonPressed === "Yes") {
													const res_continue = await accountRegisFreemiumApprove({
														registration_job_box_id: id,
														allowed_update_end_date: true,
														run_continue: true
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
                            }
                            this.props.uiAction.hideSmartMessageBox();
                        }
                    });
                } else if (response?.code === Constant.CODE_RES_CONFIRM_UPDATE_END_DATE){
						this.props.uiAction.SmartMessageBox(
							{
								title: "Thông báo nhắc nhở",
								content: response.msg,
								buttons: ["No", "Yes"]
							},
							async (ButtonPressed) => {
								if (ButtonPressed === "Yes") {
									const res_continue = await accountRegisFreemiumApprove({
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
					 } else if (response.code === Constant.CODE_SUCCESS){
                    this.props.uiAction.hideSmartMessageBox();

                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, this.props.idKey);

                }else {
                    this.props.uiAction.hideSmartMessageBox();
                    this.props.uiAction.putToastError(response?.msg);
                }
            }
        });
    }

    _btnApproveCancel(item) {
        this.props.uiAction.SmartMessageBox({
            title: "Bạn có chắc muốn duyệt hạ gói Freemium ?",
            content: "",
            buttons: ['No', 'Yes']
        }, (ButtonPressed) => {
            if (ButtonPressed === "Yes") {
                this.props.uiAction.showLoading();
                this.props.apiAction.requestApi(apiFn.fnPost, config.apiSalesOrderDomain, ConstantURL.API_URL_POST_DROP_FREEMIUM_APPROVE, {
                    drop_registration_id: item.request_drop_id
                });
            }
        });
    }

    async componentWillReceiveProps(newProps) {
        if (newProps.api[ConstantURL.API_URL_POST_DROP_FREEMIUM_REGIS_APPROVE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_DROP_FREEMIUM_REGIS_APPROVE];
            let id = response.info?.args?.sales_order_items_id;
            if (id === this.props.sales_order_item.id) {
                if (response.code === Constant.CODE_SUCCESS) {
                    this.props.uiAction.hideSmartMessageBox();
                    this.props.uiAction.putToastSuccess("Thao tác thành công!");
                    publish(".refresh", {}, this.props.idKey);
                }
                this.props.uiAction.hideLoading();
                this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DROP_FREEMIUM_REGIS_APPROVE);
            }
        }
        if (newProps.api[ConstantURL.API_URL_POST_DROP_FREEMIUM_APPROVE]) {
            let response = newProps.api[ConstantURL.API_URL_POST_DROP_FREEMIUM_APPROVE];
            if (response.code === Constant.CODE_SUCCESS) {
                this.props.uiAction.hideSmartMessageBox();
                this.props.uiAction.putToastSuccess("Thao tác thành công!");
                publish(".refresh", {}, this.props.idKey);
            }
            this.props.uiAction.hideLoading();
            this.props.apiAction.deleteRequestApi(ConstantURL.API_URL_POST_DROP_FREEMIUM_APPROVE);
        }
        if (newProps.refresh['FreemiumPackageRegistration']) {
            let refresh = newProps.refresh['FreemiumPackageRegistration'];
            if (refresh.sales_order_items_id === this.props.sales_order_item.id) {
                publish(".refresh", {}, this.props.idKey);
                this.props.uiAction.deleteRefreshList('FreemiumPackageRegistration');
            }
        }
    }

    render() {
        const {data_list, branch} = this.props;
        const {loading} = this.state;
        const sales_order_regis_status = utils.convertObjectValueCommonData(this.props.sys.common.items, Constant.COMMON_DATA_KEY_sales_order_regis_status);
        const {channel_code} = branch.currentBranch;
        const isRegisCancel = channel_code !== Constant.CHANNEL_CODE_MW;
        return (
            <div className="card-body paddingLeft30 paddingRight30">
                {loading ? (
                    <div className="text-center">
                        <LoadingSmall/>
                    </div>
                ) : (
                    data_list.length > 0 &&
                    <div className="body-table el-table table-child">
                        <TableComponent>
                            <TableHeader tableType="TableHeader" width={400}>
                                Thông tin đăng ký
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={400}>
                                Gói làm mới
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Thao tác
                            </TableHeader>
                            <TableHeader tableType="TableHeader" width={200}>
                                Lịch sử ghi nhận
                            </TableHeader>
                            <TableBody tableType="TableBody">
                                {Array.isArray(data_list) && data_list.map((item, key) => {
                                    let status = parseInt(item.status);

                                    return (
                                        <tr key={key}
                                            className={classnames("el-table-row", (key % 2 !== 0 ? "tr-background" : ""))}>
                                            <td>
                                                <div className="cell-custom">
                                                    <div>Mã đăng ký: <span className="text-bold">{item.id}</span></div>
                                                    <div>Tin tuyển dụng: <span
                                                        className="text-bold">{item.job_id} - {item.cache_job_title}</span>
                                                    </div>
                                                    <div>Loại gói: <span className="text-bold text-red">
                                                            <SpanCommon idKey={Constant.COMMON_DATA_KEY_fee_type}
                                                                        value={Number(item?.fee_type)} notStyle/>
                                                         </span>
                                                    </div>
                                                    <div>Đăng ký: <span
                                                        className="text-bold">{utils.convertNumberToWeekDay(item.total_day_quantity)} ({moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item?.end_date).format("DD/MM/YYYY")})</span>
                                                    </div>
                                                    <div>Ngày chạy thực tế: (<span className="text-bold">{moment.unix(item.start_date).format("DD/MM/YYYY")} - {moment.unix(item?.expired_at).format("DD/MM/YYYY")})</span></div>
                                                    <div>Trạng thái đăng ký: <span
                                                        className="text-bold textBlue">{sales_order_regis_status[item.status]}</span>
                                                    </div>
                                                    {[Constant.STATUS_DISABLED].includes(status) && (
                                                        <div>Lý do: {item.rejected_note}</div>
                                                    )}
                                                    {item.request_drop_status && (
                                                        <div>Trạng thái hạ dịch vụ: <span
                                                            className="text-bold textBlue">{sales_order_regis_status[item.request_drop_status]}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    {item.effects_info && item.effects_info.map((item_effect, key_effect) => {
                                                        let effect_list = this.props.sys.effect.items.filter(c => c.code === item_effect.effect_code);
                                                        let start_date = moment.unix(item_effect.start_date);
                                                        let end_date = moment.unix(item_effect.end_date);
                                                        const expiredAt  = item?.effect_expired ? moment.unix(item?.effect_expired[item_effect?.effect_code]).format("DD/MM/YYYY") : null;
                                                        let dangky = end_date.diff(start_date, "days") + 1;
                                                        return (
                                                            <React.Fragment key={key_effect}>
                                                                <div>Gói làm mới: <span
                                                                    className="text-bold">{effect_list.length ? effect_list[0].name : ''}</span>
                                                                </div>
                                                                <div>Đăng ký: <span
                                                                    className="text-bold">{utils.convertNumberToWeekDay(dangky)} ({start_date.format("DD/MM/YYYY")} - {end_date.format("DD/MM/YYYY")})</span>
                                                                </div>
                                                                <div>Ngày chạy thực tế: (<span className="text-bold">{start_date.format("DD/MM/YYYY")} - {expiredAt})</span></div>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    {[Constant.STATUS_INACTIVED, Constant.STATUS_DISABLED].includes(status) &&
                                                    (
                                                        <CanRender
                                                            actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                            {/*<div className="text-underline pointer">
                                                                <span className="text-bold text-primary"
                                                                      onClick={() => {
                                                                          this.btnEdit(item)
                                                                      }}>Chỉnh sửa</span>
                                                            </div>*/}
                                                            <React.Fragment>
                                                                <div className="text-underline pointer">
                                                                    <span className="text-bold text-success"
                                                                          onClick={() => {
                                                                              this.btnApprove(parseInt(item.id))
                                                                          }}>
                                                                        Duyệt
                                                                    </span>
                                                                </div>
                                                            </React.Fragment>
                                                            <div className="text-underline pointer">
                                                                <span className="text-bold text-danger" onClick={() => {
                                                                    this.btnDelete(item)
                                                                }}>Xóa đăng ký</span>
                                                            </div>
                                                        </CanRender>
                                                    )}
                                                    {[Constant.STATUS_ACTIVED].includes(status) && (
                                                        <>
                                                            <CanRender
                                                                actionCode={ROLES.customer_care_sales_order_registration_service_manage}>
                                                                {!item.request_drop_id && isRegisCancel && (
                                                                    <div className="text-underline pointer">
                                                                        <span className="text-bold text-danger"
                                                                              onClick={() => {
                                                                                  this.btnRegisCancel(item)
                                                                              }}>Đăng ký hạ dịch vụ</span>
                                                                    </div>
                                                                )}
                                                                {item.request_drop_id !== null && (
                                                                    <div>
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-success"
                                                                                  onClick={() => {
                                                                                      this.btnApproveCancel(item)
                                                                                  }}>
                                                                                Duyệt hạ
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-underline pointer">
                                                                            <span className="text-bold text-danger"
                                                                                  onClick={() => {
                                                                                      this.btnDeleteRegisCancel(item.request_drop_id)
                                                                                  }}>Xóa đăng ký hạ dịch vụ</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </CanRender>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cell-custom">
                                                    <div>CSKH nhận revenue: <span className="text-bold margin-bottom-5">{item.revenue_by_staff_code}</span></div>
                                                    <div>Người hạ: <span className="text-bold margin-bottom-5">{item.request_drop_approved_by}</span></div>
                                                    <div>Lý do hạ: <span className="text-bold margin-bottom-5">{item.request_drop_rejected}</span></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FreemiumPackageRegistration);
